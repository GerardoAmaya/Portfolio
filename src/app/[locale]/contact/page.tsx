import type { Metadata } from "next";
import { Github, Linkedin, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/sections/contact-form";
import { PageHeader } from "@/components/page-header";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return pageMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("subtitle"),
    eyebrow: t("title").toUpperCase(),
  });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      <section className="container-app pb-24">
        <div className="grid gap-10 md:grid-cols-[1fr_320px]">
          <div className="border-border/60 bg-card/40 rounded-xl border p-6 backdrop-blur md:p-8">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div>
              <h2 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
                {t("directTitle")}
              </h2>
              <ul className="mt-4 space-y-2">
                <li>
                  <a
                    href={`mailto:${site.email}`}
                    className="group border-border/60 bg-card/40 hover:border-primary/40 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <Mail className="text-primary size-5" />
                    <div className="min-w-0">
                      <p className="text-muted-foreground text-xs tracking-wide uppercase">
                        {t("emailLabel")}
                      </p>
                      <p className="truncate text-sm font-medium">{site.email}</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href={site.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="group border-border/60 bg-card/40 hover:border-primary/40 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <Linkedin className="text-primary size-5" />
                    <div>
                      <p className="text-muted-foreground text-xs tracking-wide uppercase">
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
                    className="group border-border/60 bg-card/40 hover:border-primary/40 flex items-center gap-3 rounded-lg border p-3 transition-colors"
                  >
                    <Github className="text-primary size-5" />
                    <div>
                      <p className="text-muted-foreground text-xs tracking-wide uppercase">
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
