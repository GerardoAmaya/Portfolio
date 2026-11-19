/**
 * Formato de las respuestas del asistente: párrafos, viñetas "- " y
 * referencias [[...]] que el widget convierte en enlaces. Funciones puras,
 * sin React, para poder probarlas.
 */

export type AnswerBlock = { type: "p" | "ul"; lines: string[] };

export const REF_PATTERN = /\[\[([a-z0-9:-]+)\]\]/gi;

const BULLET = /^\s*[-*•]\s+/;

/** Agrupa las líneas en párrafos y listas. Los bloques vacíos se descartan. */
export function parseAnswerBlocks(text: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    const last = blocks[blocks.length - 1];
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, "");
      if (last?.type === "ul") last.lines.push(item);
      else blocks.push({ type: "ul", lines: [item] });
    } else if (last?.type === "p" && last.lines.length) last.lines.push(line);
    else blocks.push({ type: "p", lines: [line] });
  }
  return blocks.filter((b) => b.lines.length);
}

/**
 * Una etiqueta a medio llegar ("[[proj") no se muestra hasta completarse, y
 * las referencias que no existen se quitan junto con el espacio que las precede.
 */
export function cleanRefs(text: string, isValid: (id: string) => boolean) {
  return text
    .replace(/\[\[[a-z0-9:-]*$/i, "")
    .replace(/\s*\[\[([a-z0-9:-]+)\]\]/gi, (match, id: string) => (isValid(id) ? match : ""));
}

export const SECTION_REFS = ["about", "experience", "projects", "contact"] as const;

/** Referencias que el widget sabe enlazar: secciones, el CV y proyectos existentes. */
export function isValidRef(id: string, projectSlugs: readonly string[]) {
  if (id === "cv" || (SECTION_REFS as readonly string[]).includes(id)) return true;
  return id.startsWith("project:") && projectSlugs.includes(id.slice("project:".length));
}
