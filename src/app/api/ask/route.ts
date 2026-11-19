import Anthropic from "@anthropic-ai/sdk";
import type { RawMessageStreamEvent } from "@anthropic-ai/sdk/resources/messages";
import { ASK_CONTEXT, ASK_SYSTEM } from "@/lib/ask/context";
import { checkRateLimit } from "@/lib/ask/rate-limit";
import { isSameOrigin, parseAskRequest } from "@/lib/ask/request";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ASK_MODEL || "claude-haiku-5-5";
const MAX_OUTPUT_TOKENS = 450;

function json(status: number, body: Record<string, unknown>) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, { error: "unavailable" });

  // Solo desde el propio sitio (frena el uso del endpoint desde otros dominios)
  if (!isSameOrigin(request.headers.get("origin"), request.headers.get("host"))) {
    return json(403, { error: "forbidden" });
  }

  let parsed: ReturnType<typeof parseAskRequest>;
  try {
    parsed = parseAskRequest(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return json(400, { error: "bad_request" });

  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const started = Date.now();
  const limit = await checkRateLimit(ip);
  const limitMs = Date.now() - started;
  if (!limit.ok)
    return json(429, { error: limit.reason === "daily" ? "daily_limit" : "rate_limit" });

  // Sin esperas largas: Netlify corta la función a los ~30 s
  const client = new Anthropic({ apiKey, timeout: 15_000, maxRetries: 1 });
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
      // Respuestas cortas y factuales: sin razonamiento extendido, que gastaria
      // el presupuesto de tokens antes de escribir la respuesta
      thinking: { type: "disabled" },
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
    console.log("[ask] ok", { limitMs, anthropicMs: Date.now() - started - limitMs });
  } catch (error) {
    console.error("[ask] error", { limitMs }, error instanceof Error ? error.message : error);
    return json(502, { error: "unavailable" });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let wroteText = false;
        let stopReason: string | null = null;
        const seen = new Set<string>();
        for await (const event of events) {
          seen.add(event.type === "content_block_delta" ? `delta:${event.delta.type}` : event.type);
          if (event.type === "message_delta") stopReason = event.delta.stop_reason;
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            wroteText = true;
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        if (!wroteText) {
          console.error("[ask] respuesta vacia", { stopReason, events: [...seen] });
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
