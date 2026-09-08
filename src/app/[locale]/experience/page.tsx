import type { Metadata } from "next";
import { Briefcase, GraduationCap } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { education, experiences } from "@/data/experience";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Experience" });
  return pageMetadata({
    locale,
    path: "/experience",
    title: t("title"),
    description: t("subtitle"),
    eyebrow: t("title").toUpperCase(),
  });
}

export default async function ExperiencePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Experience" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-16">
        <div className="mb-6 flex items-center gap-2">
          <Briefcase className="text-primary size-5" />
          <h2 className="text-2xl font-semibold tracking-tight">{t("workTitle")}</h2>
        </div>

        <ol className="reveal-children border-border/60 relative space-y-6 border-l pl-6">
          {experiences.map((e) => {
            const i18n = e.i18n[locale];
            const range = `${e.startDate} — ${e.endDate ?? t("present")}`;
            return (
              <li key={e.id} className="relative">
                <span className="border-background bg-primary absolute top-1.5 -left-[31px] size-3 rounded-full border-2" />
                <div className="border-border/60 bg-card/40 rounded-xl border p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{i18n.role}</h3>
                    <span className="text-muted-foreground text-xs">{range}</span>
                  </div>
                  <p className="text-primary mt-1 text-sm font-medium">{e.company}</p>
                  <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                    {i18n.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="container-app pb-24">
        <div className="mb-6 flex items-center gap-2">
          <GraduationCap className="text-primary size-5" />
          <h2 className="text-2xl font-semibold tracking-tight">{t("educationTitle")}</h2>
        </div>

        <ol className="reveal-children border-border/60 relative space-y-6 border-l pl-6">
          {education.map((ed) => {
            const i18n = ed.i18n[locale];
            const range = `${ed.startDate} — ${ed.endDate}`;
            return (
              <li key={ed.id} className="relative">
                <span className="border-background bg-primary absolute top-1.5 -left-[31px] size-3 rounded-full border-2" />
                <div className="border-border/60 bg-card/40 rounded-xl border p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{i18n.degree}</h3>
                    <span className="text-muted-foreground text-xs">{range}</span>
                  </div>
                  <p className="text-primary mt-1 text-sm font-medium">{ed.institution}</p>
                  {i18n.description ? (
                    <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                      {i18n.description}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}
