import { describe, expect, it } from "vitest";
import { cleanRefs, isValidRef, parseAnswerBlocks } from "./answer";

describe("parseAnswerBlocks", () => {
  it("separa párrafos por líneas en blanco y une las líneas seguidas", () => {
    expect(parseAnswerBlocks("Uno\ndos\n\nTres")).toEqual([
      { type: "p", lines: ["Uno", "dos"] },
      { type: "p", lines: ["Tres"] },
    ]);
  });

  it("agrupa viñetas con -, * o •", () => {
    expect(parseAnswerBlocks("Stack:\n- Node\n* NestJS\n• Next.js")).toEqual([
      { type: "p", lines: ["Stack:"] },
      { type: "ul", lines: ["Node", "NestJS", "Next.js"] },
    ]);
  });

  it("no genera bloques vacíos", () => {
    expect(parseAnswerBlocks("\n\n")).toEqual([]);
    expect(parseAnswerBlocks("")).toEqual([]);
  });
});

describe("cleanRefs", () => {
  const valid = (id: string) => id === "cv" || id === "project:waypoint";

  it("conserva las referencias válidas", () => {
    expect(cleanRefs("Ver el CV [[cv]].", valid)).toBe("Ver el CV [[cv]].");
  });

  it("quita las referencias inventadas junto con su espacio", () => {
    expect(cleanRefs("Trabajó en X [[project:inventado]].", valid)).toBe("Trabajó en X.");
  });

  it("oculta una etiqueta a medio llegar durante el streaming", () => {
    expect(cleanRefs("Ver [[proj", valid)).toBe("Ver ");
    expect(cleanRefs("Ver [[", valid)).toBe("Ver ");
  });
});

describe("isValidRef", () => {
  const slugs = ["waypoint", "docu-flow"];

  it("acepta secciones, el CV y proyectos existentes", () => {
    for (const id of ["about", "experience", "projects", "contact", "cv", "project:docu-flow"]) {
      expect(isValidRef(id, slugs)).toBe(true);
    }
  });

  it("rechaza secciones o proyectos que no existen", () => {
    expect(isValidRef("blog", slugs)).toBe(false);
    expect(isValidRef("project:otro", slugs)).toBe(false);
    expect(isValidRef("project:", slugs)).toBe(false);
  });
});
