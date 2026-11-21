import { describe, expect, it } from "vitest";
import { countWords, readingMinutes, splitEmphasis } from "./case-brief";

describe("countWords", () => {
  it("cuenta palabras sin importar los espacios de sobra", () => {
    expect(countWords("  Dos   palabras\n")).toBe(2);
    expect(countWords("")).toBe(0);
  });

  it("no cuenta las marcas de negrita", () => {
    expect(countWords("**USD 0,0018** medidos por foto")).toBe(5);
    expect(countWords("** suelto")).toBe(1);
  });
});

describe("readingMinutes", () => {
  const words = (n: number) => "palabra ".repeat(n);

  it("suma todos los textos a 200 palabras por minuto, redondeando", () => {
    expect(readingMinutes([words(300), words(300)])).toBe(3);
    expect(readingMinutes([words(649)])).toBe(3);
    expect(readingMinutes([words(700)])).toBe(4);
  });

  it("nunca baja de un minuto", () => {
    expect(readingMinutes([words(20)])).toBe(1);
    expect(readingMinutes([])).toBe(1);
  });
});

describe("splitEmphasis", () => {
  it("deja igual un texto sin marcas", () => {
    expect(splitEmphasis("Sin cifras")).toEqual([{ text: "Sin cifras", strong: false }]);
  });

  it("separa las negritas del resto", () => {
    expect(splitEmphasis("Cuesta **USD 0** al mes")).toEqual([
      { text: "Cuesta ", strong: false },
      { text: "USD 0", strong: true },
      { text: " al mes", strong: false },
    ]);
    expect(splitEmphasis("**312 pruebas** y **nueve recorridos**")).toEqual([
      { text: "312 pruebas", strong: true },
      { text: " y ", strong: false },
      { text: "nueve recorridos", strong: true },
    ]);
  });

  it("deja como texto un ** sin pareja", () => {
    expect(splitEmphasis("Un ** suelto")).toEqual([{ text: "Un ** suelto", strong: false }]);
  });

  it("no genera tramos vacíos", () => {
    expect(splitEmphasis("")).toEqual([]);
  });
});
