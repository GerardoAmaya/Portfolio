import { describe, expect, it } from "vitest";
import { clampSize, fitText } from "./params";

describe("fitText", () => {
  it("usa el valor por defecto si falta o está vacío", () => {
    expect(fitText(null, "Gerardo", 20)).toBe("Gerardo");
    expect(fitText("   ", "Gerardo", 20)).toBe("Gerardo");
  });

  it("deja el texto corto tal cual", () => {
    expect(fitText("Proyectos", "x", 20)).toBe("Proyectos");
  });

  it("corta en el último espacio y agrega puntos suspensivos", () => {
    const result = fitText("Reportes ciudadanos de la vía pública", "x", 20);
    expect(result).toBe("Reportes ciudadanos…");
    expect(result.length).toBeLessThanOrEqual(20);
  });

  it("corta a mitad de palabra si no hay un espacio razonable", () => {
    expect(fitText("abcdefghijklmnopqrstuvwxyz", "x", 10)).toBe("abcdefghi…");
  });
});

describe("clampSize", () => {
  it("usa el valor por defecto si falta o no es un número", () => {
    expect(clampSize(null, 1200, 600, 2400)).toBe(1200);
    expect(clampSize("", 1200, 600, 2400)).toBe(1200);
    expect(clampSize("abc", 1200, 600, 2400)).toBe(1200);
    expect(clampSize("Infinity", 1200, 600, 2400)).toBe(1200);
  });

  it("acota al rango permitido y redondea", () => {
    expect(clampSize("20000", 1200, 600, 2400)).toBe(2400);
    expect(clampSize("10", 1200, 600, 2400)).toBe(600);
    expect(clampSize("800.6", 1200, 600, 2400)).toBe(801);
  });
});
