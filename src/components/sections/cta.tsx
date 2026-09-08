import { ArrowRight, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

export function CtaSection() {
  const t = useTranslations("Contact");

  return (
    <section className="border-border/60 bg-background border-t py-20 md:py-28">
      <div className="container-app">
        <div className="reveal border-border/60 from-card via-card to-primary/10 relative overflow-hidden rounded-2xl border bg-gradient-to-br p-10 text-center md:p-16">
          <div
            className="absolute inset-0 -z-10 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 20%, oklch(0.706 0.213 293.756 / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.706 0.213 293.756 / 0.18), transparent 60%)",
            }}
            aria-hidden
          />
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">{t("subtitle")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                {t("send")} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`mailto:${site.email}`}>
                <Mail /> {site.email}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
