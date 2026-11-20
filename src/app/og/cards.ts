/**
 * Qué tarjeta dibuja /og. La URL solo trae un identificador (página o
 * proyecto, más el idioma) y los textos salen de messages/ y src/data: así
 * nadie puede generar en este dominio una imagen con un texto arbitrario.
 */
import { routing, type Locale } from "@/i18n/routing";
import { getProject } from "@/data/projects";
import es from "../../../messages/es.json";
import en from "../../../messages/en.json";

const MESSAGES = { es, en } satisfies Record<Locale, typeof es>;

export const OG_PAGES = ["about", "experience", "projects", "contact"] as const;
type OgPage = (typeof OG_PAGES)[number];

export type OgCard = {
  /** Tarjeta de la portada: nombre, rol y ventana de código */
  home: boolean;
  title: string | null;
  subtitle: string | null;
  eyebrow: string | null;
  /** Etiquetas de tecnología; null usa el stack general del perfil */
  stack: string[] | null;
};

// La fila de etiquetas comparte el ancho con la dirección del sitio: el stack
// general (Node, NestJS, Next.js, PostgreSQL, GCP, Claude API) suma 40 letras
const STACK_MAX_CHARS = 40;
const STACK_MAX_ITEMS = 6;

/** Las primeras tecnologías del proyecto que caben en la fila, sin cortar ninguna. */
export function fitStack(stack: readonly string[]) {
  const fitted: string[] = [];
  let chars = 0;
  for (const item of stack) {
    if (fitted.length === STACK_MAX_ITEMS || chars + item.length > STACK_MAX_CHARS) break;
    fitted.push(item);
    chars += item.length;
  }
  return fitted;
}

/** Query string de /og para una ruta sin prefijo de idioma ("" = portada). */
export function ogQuery(locale: Locale, path: string) {
  const params = new URLSearchParams({ locale });
  const project = path.match(/^\/projects\/([^/]+)$/)?.[1];
  const page = path.slice(1);
  if (project) params.set("project", project);
  else if ((OG_PAGES as readonly string[]).includes(page)) params.set("page", page);
  return params.toString();
}

function pageCard(locale: Locale, page: OgPage): OgCard {
  const m = MESSAGES[locale];
  const { title, subtitle } =
    page === "about"
      ? { title: m.About.title, subtitle: m.About.lead }
      : page === "experience"
        ? { title: m.Experience.title, subtitle: m.Experience.subtitle }
        : page === "projects"
          ? { title: m.Projects.title, subtitle: m.Projects.subtitle }
          : { title: m.Contact.title, subtitle: m.Contact.subtitle };
  return { home: false, title, subtitle, eyebrow: title.toUpperCase(), stack: null };
}

/** Resuelve la tarjeta; lo que no se reconoce cae en la de la portada. */
export function resolveOgCard(params: URLSearchParams): OgCard {
  const requested = params.get("locale");
  const locale: Locale = routing.locales.includes(requested as Locale)
    ? (requested as Locale)
    : routing.defaultLocale;

  const slug = params.get("project");
  const project = slug ? getProject(slug) : undefined;
  if (project) {
    const i18n = project.i18n[locale];
    return {
      home: false,
      title: i18n.title,
      subtitle: i18n.tagline,
      eyebrow: locale === "es" ? "PROYECTO" : "PROJECT",
      stack: fitStack(project.stack),
    };
  }

  const page = params.get("page");
  if ((OG_PAGES as readonly string[]).includes(page ?? "")) {
    return pageCard(locale, page as OgPage);
  }

  return {
    home: true,
    title: null,
    subtitle: MESSAGES[locale].Metadata.ogTagline,
    eyebrow: "EL SALVADOR",
    stack: null,
  };
}
