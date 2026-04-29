import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/page-header";
import { skills, type SkillCategory } from "@/data/skills";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("title") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "About" });

  const paragraphs = t.raw("paragraphs") as string[];
  const categories: SkillCategory[] = ["frontend", "backend", "databases", "tools"];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("lead")} />

      <section className="container-app pb-12">
        <div className="prose prose-neutral dark:prose-invert max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {paragraphs.map((p, i) => (
            <p key={i} className="mb-4 last:mb-0">
              {p}
            </p>
          ))}
        </div>
      </section>

      <section className="container-app pb-24">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {t("skillsTitle")}
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {categories.map((cat) => {
            const items = skills.filter((s) => s.category === cat);
            return (
              <div
                key={cat}
                className="rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {t(`categories.${cat}`)}
                </h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {items.map((s) => (
                    <Badge key={s.name} variant="outline" className="text-sm">
                      {s.name}
                    </Badge>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
