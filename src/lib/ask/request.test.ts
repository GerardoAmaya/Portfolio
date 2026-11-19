import { describe, expect, it } from "vitest";
import { isSameOrigin, MAX_QUESTION, MAX_TURNS, parseAskRequest } from "./request";

const user = (content: string) => ({ role: "user", content });
const assistant = (content: string) => ({ role: "assistant", content });

describe("parseAskRequest", () => {
  it("acepta una pregunta simple y normaliza el locale", () => {
    expect(parseAskRequest({ locale: "en", messages: [user(" Hola ")] })).toEqual({
      locale: "en",
      turns: [{ role: "user", content: "Hola" }],
    });
    expect(parseAskRequest({ locale: "fr", messages: [user("Hola")] })?.locale).toBe("es");
  });

  it("rechaza cuerpos que no son un objeto con mensajes", () => {
    expect(parseAskRequest(null)).toBeNull();
    expect(parseAskRequest("hola")).toBeNull();
    expect(parseAskRequest({ messages: [] })).toBeNull();
    expect(parseAskRequest({ messages: "hola" })).toBeNull();
  });

  it("rechaza roles desconocidos, contenido no textual o vacío", () => {
    expect(parseAskRequest({ messages: [{ role: "system", content: "x" }] })).toBeNull();
    expect(parseAskRequest({ messages: [{ role: "user", content: 1 }] })).toBeNull();
    expect(parseAskRequest({ messages: [user("   ")] })).toBeNull();
  });

  it("exige que la última sea del usuario y que los turnos alternen", () => {
    expect(parseAskRequest({ messages: [user("a"), assistant("b")] })).toBeNull();
    expect(parseAskRequest({ messages: [user("a"), user("b")] })).toBeNull();
    expect(
      parseAskRequest({ messages: [user("a"), assistant("b"), user("c")] })?.turns
    ).toHaveLength(3);
  });

  it("descarta las respuestas del asistente al inicio del historial", () => {
    const parsed = parseAskRequest({ messages: [assistant("hola"), user("a")] });
    expect(parsed?.turns).toEqual([{ role: "user", content: "a" }]);
  });

  it("conserva solo los últimos turnos", () => {
    const messages = Array.from({ length: 21 }, (_, i) =>
      i % 2 === 0 ? user(`q${i}`) : assistant(`a${i}`)
    );
    const turns = parseAskRequest({ messages })!.turns;
    // MAX_TURNS es par: el recorte empieza en una respuesta, que se descarta
    expect(turns.length).toBeLessThanOrEqual(MAX_TURNS);
    expect(turns[0]!.role).toBe("user");
    expect(turns.at(-1)).toEqual({ role: "user", content: "q20" });
  });

  it("recorta las preguntas largas", () => {
    const parsed = parseAskRequest({ messages: [user("x".repeat(MAX_QUESTION + 100))] });
    expect(parsed?.turns[0]!.content).toHaveLength(MAX_QUESTION);
  });
});

describe("isSameOrigin", () => {
  it("acepta el mismo host y peticiones sin Origin", () => {
    expect(isSameOrigin("https://example.com", "example.com")).toBe(true);
    expect(isSameOrigin(null, "example.com")).toBe(true);
  });

  it("rechaza otro dominio", () => {
    expect(isSameOrigin("https://evil.test", "example.com")).toBe(false);
  });

  it("rechaza un Origin que no es una URL en vez de lanzar", () => {
    expect(isSameOrigin("null", "example.com")).toBe(false);
    expect(isSameOrigin("::::", "example.com")).toBe(false);
  });
});
