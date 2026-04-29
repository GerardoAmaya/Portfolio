import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-24">
        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="rounded-xl border border-border/60 bg-card/40 p-6 backdrop-blur md:p-8">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t("directTitle")}
              </h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                  >
                    <Mail className="size-5 text-primary" />
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("emailLabel")}
                      </p>
                      <p className="truncate text-sm font-medium">
                        {site.email}
                      </p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                  >
                    <Linkedin className="size-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("linkedinLabel")}
                      </p>
                      <p className="text-sm font-medium">/in/gerardo-amaya</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.github}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 p-3 transition-colors hover:border-primary/40"
                  >
                    <Github className="size-5 text-primary" />
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">
                        {t("githubLabel")}
                      </p>
                      <p className="text-sm font-medium">@GerardoAmaya</p>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
