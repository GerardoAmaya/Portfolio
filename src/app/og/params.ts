/** Saneado de los query params de /og. Fuera de route.tsx para poder probarlo. */

/** Recorta el texto para que no desborde la tarjeta ni infle el render. */
export function fitText(value: string | null, fallback: string, max: number) {
  const raw = (value ?? fallback).trim() || fallback;
  if (raw.length <= max) return raw;
  // Se corta en el último espacio para no dejar palabras a medias
  const cut = raw.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:]+$/, "")}…`;
}

/**
 * Acota las dimensiones: un `?w=20000` no debe poder tumbar la función.
 * Sin parámetro se usa el valor por defecto (Number(null) es 0 y antes
 * acababa en el mínimo, 600×315, cortando la tarjeta).
 */
export function clampSize(value: string | null, fallback: number, min: number, max: number) {
  if (value === null || value.trim() === "") return fallback;
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(Math.round(n), min), max);
}
