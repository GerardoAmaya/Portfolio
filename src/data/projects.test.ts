import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import { countWords } from "@/lib/case-brief";
import { projects, type BriefSection, type CaseBrief } from "./projects";

// Desde aquí una sección ya es un muro de texto en una columna de ~300 px
const LONG_SECTION_WORDS = 100;
const MAX_LEAD_WORDS = 30;
// "Unas 14 palabras": una de margen para no forzar frases torcidas
const MAX_POINT_WORDS = 15;

const NUMBER = /\d+(?:[.,]\d+)*/g;
const numbersIn = (text: string) => new Set(text.match(NUMBER) ?? []);

const sectionTexts = ({ lead, points }: BriefSection) => [lead, ...points];
const briefTexts = (brief: CaseBrief) => [
  brief.problem,
  ...sectionTexts(brief.solution),
  ...sectionTexts(brief.outcome),
];

const withBrief = projects.filter((p) => p.brief);

describe("resumen de los casos de estudio", () => {
  it("todo caso con una sección larga tiene resumen", () => {
    const long = projects.filter((p) =>
      routing.locales.some((locale) => {
        const { solution, outcome } = p.i18n[locale];
        return Math.max(countWords(solution), countWords(outcome)) > LONG_SECTION_WORDS;
      })
    );
    expect(long.length).toBeGreaterThan(0);
    for (const p of long) expect(p.brief, p.slug).toBeDefined();
  });

  describe.each(withBrief.map((p) => [p.slug, p] as const))("%s", (_slug, project) => {
    const brief = project.brief!;

    it.each(routing.locales)("es corto en %s", (locale) => {
      const { problem, solution, outcome } = brief[locale];
      for (const lead of [problem, solution.lead, outcome.lead]) {
        expect(countWords(lead), lead).toBeLessThanOrEqual(MAX_LEAD_WORDS);
      }
      for (const { points } of [solution, outcome]) {
        expect(points.length).toBeGreaterThanOrEqual(3);
        expect(points.length).toBeLessThanOrEqual(4);
        for (const point of points) {
          expect(countWords(point), point).toBeLessThanOrEqual(MAX_POINT_WORDS);
        }
      }
    });

    it("tiene las mismas viñetas en los dos idiomas", () => {
      const counts = routing.locales.map((locale) => [
        brief[locale].solution.points.length,
        brief[locale].outcome.points.length,
      ]);
      for (const count of counts) expect(count).toEqual(counts[0]);
    });

    // Las cifras del resumen tienen que estar, escritas igual, en el texto completo
    it.each(routing.locales)("no trae cifras nuevas en %s", (locale) => {
      const { problem, solution, outcome } = project.i18n[locale];
      const known = numbersIn(`${problem} ${solution} ${outcome}`);
      for (const text of briefTexts(brief[locale])) {
        for (const n of numbersIn(text)) expect(known, `«${n}» en «${text}»`).toContain(n);
      }
    });
  });
});
