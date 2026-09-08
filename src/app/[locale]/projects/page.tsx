import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return pageMetadata({
    locale,
    path: "/projects",
    title: t("title"),
    description: t("subtitle"),
    eyebrow: t("title").toUpperCase(),
  });
}

export default async function ProjectsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-24">
        <div className="reveal-children grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
            const i18n = p.i18n[locale];
            return (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="group border-border/60 bg-card/40 hover:border-primary/40 relative flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-lg"
              >
                <div className="bg-muted relative aspect-video w-full overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={i18n.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg leading-tight font-semibold">{i18n.title}</h3>
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
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
