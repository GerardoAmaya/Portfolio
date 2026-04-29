import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { projects } from "@/data/projects";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Projects" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Projects" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => {
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
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight">
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
