"use client";

import * as React from "react";
import Image from "next/image";
import { flushSync } from "react-dom";
import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { SpotlightGroup } from "@/components/spotlight";
import { ProjectCardLink } from "@/components/motion/project-morph";
import { PROJECT_CATEGORIES, projects, type ProjectCategory } from "@/data/projects";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

/**
 * Listado de /projects con filtros por tipo. Por defecto se ven todos. Al
 * cambiar de filtro, cada tarjeta se desliza a su nueva posición (View
 * Transitions: cada una tiene su view-transition-name). Sin soporte o con
 * movimiento reducido, filtra directo.
 */
export function ProjectsExplorer() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const [active, setActive] = React.useState<ProjectCategory | null>(null);

  const categories = PROJECT_CATEGORIES.filter((c) =>
    projects.some((p) => p.categories.includes(c))
  );
  const visible = active ? projects.filter((p) => p.categories.includes(active)) : projects;

  function select(value: ProjectCategory | null) {
    if (value === active) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) {
      setActive(value);
      return;
    }
    document.documentElement.classList.add("filter-transition");
    const transition = document.startViewTransition(() => flushSync(() => setActive(value)));
    transition.finished.finally(() =>
      document.documentElement.classList.remove("filter-transition")
    );
  }

  const chip = (value: ProjectCategory | null, label: string, count: number) => {
    const pressed = active === value;
    return (
      <button
        key={value ?? "all"}
        type="button"
        aria-pressed={pressed}
        onClick={() => select(value)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
          pressed
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border/60 bg-card/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
        )}
      >
        {label}
        <span
          className={cn(
            "rounded-full px-1.5 text-xs tabular-nums",
            pressed ? "bg-primary-foreground/20" : "bg-muted"
          )}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <>
      <div role="group" aria-label={t("filterLabel")} className="mb-8 flex flex-wrap gap-2">
        {chip(null, t("filterAll"), projects.length)}
        {categories.map((c) =>
          chip(c, t(`categories.${c}`), projects.filter((p) => p.categories.includes(c)).length)
        )}
      </div>

      <SpotlightGroup className="grid gap-6 md:grid-cols-2">
        {visible.map((p) => {
          const i18n = p.i18n[locale];
          return (
            <ProjectCardLink
              key={p.slug}
              href={`/projects/${p.slug}`}
              data-spotlight
              style={{ viewTransitionName: `project-${p.slug}` } as React.CSSProperties}
              className="spotlight tilt group border-border/60 bg-card/40 relative flex flex-col overflow-hidden rounded-xl border transition-shadow hover:shadow-lg"
            >
              <div
                data-morph="cover"
                className="bg-muted relative aspect-video w-full overflow-hidden"
              >
                <Image
                  src={p.cover}
                  alt={i18n.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex items-center justify-between gap-2">
                  <h3 data-morph="title" className="text-lg leading-tight font-semibold">
                    {i18n.title}
                  </h3>
                  <span className="text-muted-foreground text-xs">{p.year}</span>
                </div>
                <p className="text-muted-foreground text-sm">{i18n.tagline}</p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                  {p.stack.map((s) => (
                    <Badge key={s} variant="secondary">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            </ProjectCardLink>
          );
        })}
      </SpotlightGroup>
    </>
  );
}
