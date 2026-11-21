/**
 * Utilidades del resumen de los casos de estudio (campo `brief` de
 * src/data/projects.ts). Funciones puras, sin React, para poder probarlas.
 */

/** Ritmo de lectura con el que se estima el caso completo */
const WORDS_PER_MINUTE = 200;

const EMPHASIS = /(\*\*[^*]+\*\*)/;
const STRONG = /^\*\*[^*]+\*\*$/;

/** Palabras de un texto; las marcas de **negrita** no cuentan. */
export function countWords(text: string) {
  return text.replaceAll("**", "").split(/\s+/).filter(Boolean).length;
}

/** Minutos de lectura de varios textos juntos, redondeados y nunca menos de 1. */
export function readingMinutes(texts: readonly string[]) {
  const words = texts.reduce((total, text) => total + countWords(text), 0);
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export type EmphasisPart = { text: string; strong: boolean };

/**
 * Separa los tramos en **negrita**, que resaltan las cifras del resumen. Un
 * `**` sin pareja se queda como texto: mejor ver el asterisco que perder la frase.
 */
export function splitEmphasis(text: string): EmphasisPart[] {
  return text
    .split(EMPHASIS)
    .filter(Boolean)
    .map((part) =>
      STRONG.test(part) ? { text: part.slice(2, -2), strong: true } : { text: part, strong: false }
    );
}
