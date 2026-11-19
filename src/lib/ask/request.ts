/**
 * Validación de lo que llega a /api/ask. Vive fuera de route.ts porque Next
 * no permite exportar nada más que los handlers desde un archivo de ruta, y
 * estas funciones se prueban por separado.
 */

export const MAX_QUESTION = 500;
export const MAX_ANSWER = 2000;
export const MAX_TURNS = 8; // 4 preguntas y 4 respuestas de historial

export type Turn = { role: "user" | "assistant"; content: string };
export type AskRequest = { locale: "es" | "en"; turns: Turn[] };

/** Valida el cuerpo sin confiar en nada de lo que manda el navegador. */
export function parseAskRequest(body: unknown): AskRequest | null {
  if (!body || typeof body !== "object") return null;
  const { locale, messages } = body as { locale?: unknown; messages?: unknown };
  if (!Array.isArray(messages) || messages.length === 0) return null;

  const turns: Turn[] = [];
  for (const m of messages.slice(-MAX_TURNS)) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, role === "user" ? MAX_QUESTION : MAX_ANSWER);
    if (!text) return null;
    turns.push({ role, content: text });
  }
  // La API exige empezar con "user" y alternar; la última debe ser la pregunta
  while (turns.length && turns[0]!.role !== "user") turns.shift();
  if (!turns.length || turns[turns.length - 1]!.role !== "user") return null;
  for (let i = 1; i < turns.length; i++) if (turns[i]!.role === turns[i - 1]!.role) return null;

  return { locale: locale === "en" ? "en" : "es", turns };
}

/**
 * La petición viene del propio sitio. Sin cabecera Origin (curl, algunos
 * navegadores en GET) se deja pasar y decide el límite de uso; un Origin que
 * no es una URL (`null` en iframes sandbox o redirecciones) se rechaza.
 */
export function isSameOrigin(origin: string | null, host: string | null) {
  if (!origin || !host) return true;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
