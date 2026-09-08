import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing, type Locale } from "@/i18n/routing";

// Open Graph exige language_TERRITORY, no solo el código de idioma
const OG_LOCALES: Record<Locale, string> = {
  es: "es_SV",
  en: "en_US",
};

/** Locale en el formato language_TERRITORY que exige Open Graph. */
export function ogLocale(locale: Locale) {
  return OG_LOCALES[locale];
}

/** Canonical + hreflang de una ruta, dado el path sin prefijo de locale ("" = home). */
export function localeAlternates(
  locale: Locale,
  path: string
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    languages[l] = `/${l}${path}`;
  }
  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  return { canonical: `/${locale}${path}`, languages };
}

/** URL de la imagen OG generada en /og para una página concreta. */
export function ogImageUrl({
  title,
  subtitle,
  eyebrow,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  if (eyebrow) params.set("eyebrow", eyebrow);
  return `/og?${params.toString()}`;
}

type PageMetadataArgs = {
  locale: Locale;
  /** Ruta sin prefijo de locale: "/about", "/projects/mi-proyecto" */
  path: string;
  title: string;
  description: string;
  /** Etiqueta superior de la imagen OG generada */
  eyebrow?: string;
  type?: "website" | "article";
};

/**
 * Metadata de una subpágina: canonical y hreflang propios más un bloque Open
 * Graph coherente. Next reemplaza `alternates` y `openGraph` enteros al
 * heredarlos del layout, así que cada página debe declararlos completos o
 * termina apuntando a la home.
 */
export async function pageMetadata({
  locale,
  path,
  title,
  description,
  eyebrow,
  type = "website",
}: PageMetadataArgs): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const fullTitle = t("titleTemplate").replace("%s", title);
  const image = ogImageUrl({ title, subtitle: description, eyebrow });

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: {
      type,
      locale: OG_LOCALES[locale],
      siteName: t("siteName"),
      title: fullTitle,
      description,
      url: `/${locale}${path}`,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
