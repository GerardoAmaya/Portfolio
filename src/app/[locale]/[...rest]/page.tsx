import { notFound } from "next/navigation";

/**
 * Captura cualquier ruta desconocida bajo /[locale] para que el 404 se
 * renderice dentro del layout localizado (header, footer, tema e idioma) en
 * lugar de caer en el not-found global.
 */
export default function CatchAllPage() {
  notFound();
}
