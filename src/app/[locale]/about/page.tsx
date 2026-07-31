import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/page-header";
import { TechStackTabs } from "@/components/sections/tech-stack-tabs";
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

        <div className="mt-8">
          <TechStackTabs
            labels={{
              frontend: t("categories.frontend"),
              backend: t("categories.backend"),
              databases: t("categories.databases"),
              cloud: t("categories.cloud"),
              security: t("categories.security"),
              tools: t("categories.tools"),
            }}
          />
        </div>
      </section>
    </>
  );
}
