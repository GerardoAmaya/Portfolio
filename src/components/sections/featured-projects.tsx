import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/routing";

export function FeaturedProjects() {
  const t = useTranslations("Projects");
  const locale = useLocale() as Locale;
  const featured = projects.filter((p) => p.featured);

  return (
    <section className="border-t border-border/60 bg-background py-20 md:py-28">
      <div className="container-app">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              {t("subtitle")}
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex"
          >
            {t("viewCase")} <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {featured.map((p) => {
            const i18n = p.i18n[locale];
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card/40 transition-all hover:border-primary/40 hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <Image
                    src={p.cover}
                    alt={i18n.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold leading-tight">
                      {i18n.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {p.year}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {i18n.tagline}
                  </p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                    {p.stack.slice(0, 4).map((s) => (
                      <Badge key={s} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
