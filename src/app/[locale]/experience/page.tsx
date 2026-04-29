import type { Metadata } from "next";
import { Briefcase, GraduationCap } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { education, experiences } from "@/data/experience";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Experience" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Experience" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-16">
        <div className="mb-6 flex items-center gap-2">
          <Briefcase className="size-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("workTitle")}
          </h2>
        </div>

        <ol className="relative space-y-6 border-l border-border/60 pl-6">
          {experiences.map((e) => {
            const i18n = e.i18n[locale];
            const range = `${e.startDate} — ${e.endDate ?? t("present")}`;
            return (
              <li key={e.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-primary" />
                <div className="rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{i18n.role}</h3>
                    <span className="text-xs text-muted-foreground">
                      {range}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {e.company}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
          <GraduationCap className="size-5 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">
            {t("educationTitle")}
          </h2>
        </div>

        <ol className="relative space-y-6 border-l border-border/60 pl-6">
          {education.map((ed) => {
            const i18n = ed.i18n[locale];
            const range = `${ed.startDate} — ${ed.endDate}`;
            return (
              <li key={ed.id} className="relative">
                <span className="absolute -left-[31px] top-1.5 size-3 rounded-full border-2 border-background bg-primary" />
                <div className="rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold">{i18n.degree}</h3>
                    <span className="text-xs text-muted-foreground">
                      {range}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {ed.institution}
                  </p>
                  {i18n.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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
