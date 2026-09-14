import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { projects } from "@/data/projects";
import { site } from "@/lib/site";
import { SITE_URL } from "@/lib/utils";

type StaticPath = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const STATIC_PATHS: StaticPath[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/experience", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
];

/** Una URL por locale más x-default, para declarar el hreflang en cada entrada. */
function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = `${SITE_URL}/${locale}${path}`;
  }
  languages["x-default"] = `${SITE_URL}/${routing.defaultLocale}${path}`;
  return { languages };
}

/**
 * Fecha del proyecto más reciente. Home y listado cambian cuando cambia el
 * portafolio, así que heredan esa fecha en vez de inventar "hoy": un
 * lastModified que se mueve en cada build no le dice nada a un crawler.
 */
function latestProjectDate() {
  const dates = projects.map((p) => p.updatedAt).sort();
  return dates[dates.length - 1] ?? site.contentUpdatedAt;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const latest = latestProjectDate();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of routing.locales) {
    for (const { path, changeFrequency, priority } of STATIC_PATHS) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: path === "" || path === "/projects" ? latest : site.contentUpdatedAt,
        changeFrequency,
        priority,
        alternates: alternates(path),
      });
    }

    for (const project of projects) {
      const path = `/projects/${project.slug}`;
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: project.updatedAt,
        changeFrequency: "monthly",
        priority: project.featured ? 0.8 : 0.6,
        alternates: alternates(path),
      });
    }
  }

  return entries;
}
