import Anthropic from "@anthropic-ai/sdk";
import type { RawMessageStreamEvent } from "@anthropic-ai/sdk/resources/messages";
import { ASK_CONTEXT, ASK_SYSTEM } from "@/lib/ask/context";
import { checkRateLimit } from "@/lib/ask/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ASK_MODEL || "claude-haiku-5-5";
const MAX_QUESTION = 500;
const MAX_TURNS = 8; // 4 preguntas y 4 respuestas de historial
const MAX_OUTPUT_TOKENS = 450;

type Turn = { role: "user" | "assistant"; content: string };

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

/** Valida el cuerpo sin confiar en nada de lo que manda el navegador. */
function parse(body: unknown): { locale: "es" | "en"; turns: Turn[] } | null {
  if (!body || typeof body !== "object") return null;
  const { locale, messages } = body as { locale?: unknown; messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_QUESTION : 2000);
    if (!text) return null;
    turns.push({ role, content: text });
  }
  // La API exige empezar con "user" y alternar; la última debe ser la pregunta
  while (turns.length && turns[0]!.role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1]!.role !== "user") return null;
  for (let i = 1; i < turns.length; i++) if (turns[i]!.role === turns[i - 1]!.role) return null;

  return { locale: locale === "en" ? "en" : "es", turns };
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, { error: "unavailable" });

  // Solo desde el propio sitio (frena el uso del endpoint desde otros dominios)
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host && new URL(origin).host !== host) return json(403, { error: "forbidden" });

  let parsed: ReturnType<typeof parse>;
  try {
    parsed = parse(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return json(400, { error: "bad_request" });

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const limit = await checkRateLimit(ip);
  if (!limit.ok)
    return json(429, { error: limit.reason === "daily" ? "daily_limit" : "rate_limit" });

  const client = new Anthropic({ apiKey });
  const language = parsed.locale === "en" ? "English" : "Spanish";

  // Se espera la respuesta HTTP antes de devolver nada: si Anthropic rechaza la
  // petición (clave, parámetros, sobrecarga) el visitante recibe un error
  // limpio en vez de un stream cortado a la mitad
  let events: AsyncIterable<RawMessageStreamEvent>;
  try {
    events = await client.messages.create({
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      stream: true,
      system: [
        { type: "text", text: ASK_SYSTEM },
        // El conocimiento es igual en cada petición: se cachea y las
        // siguientes preguntas lo pagan a una fracción del precio
        {
          type: "text",
          text: `<knowledge>\n${ASK_CONTEXT}\n</knowledge>`,
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: `Reply in ${language}.` },
      ],
      messages: parsed.turns,
    });
  } catch (error) {
    console.error("[ask] error", error instanceof Error ? error.message : error);
    return json(502, { error: "unavailable" });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        console.error("[ask] stream error", error instanceof Error ? error.message : error);
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
