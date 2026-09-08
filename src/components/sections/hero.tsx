import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("Home");

  return (
    <section className="relative overflow-hidden">
      <div className="grid-bg absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div
        className="absolute top-0 left-1/2 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.706 0.213 293.756 / 0.35), transparent)",
        }}
        aria-hidden
      />

      <div className="container-app relative pt-20 pb-20 sm:pt-28 md:pt-36 md:pb-28">
        <div className="animate-enter mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="border-border bg-background/60 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium backdrop-blur">
            <span className="relative flex size-2">
              <span className="bg-primary/60 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" />
              <span className="bg-primary relative inline-flex size-2 rounded-full" />
            </span>
            {t("eyebrow")}
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            {t("titleLead")} <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titleTail")}
          </h1>

          <p className="text-muted-foreground mt-6 max-w-2xl text-base text-pretty sm:text-lg">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/projects">
                {t("ctaProjects")} <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="/resume.pdf" target="_blank" rel="noreferrer">
                <Download /> {t("ctaResume")}
              </a>
            </Button>
          </div>
        </div>

        <div
          className="animate-enter mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3"
          style={{ "--enter-delay": "0.15s" } as React.CSSProperties}
        >
          <Stat label={t("stats.yearsLabel")} value={t("stats.yearsValue")} />
          <Stat label={t("stats.projectsLabel")} value={t("stats.projectsValue")} />
          <Stat label={t("stats.stackLabel")} value={t("stats.stackValue")} small />
        </div>

        <div className="text-muted-foreground/60 mt-12 flex justify-center">
          <Sparkles className="size-4" />
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="border-border/60 bg-card/40 rounded-xl border p-4 text-center backdrop-blur">
      <p
        className={
          small ? "text-foreground text-sm font-medium" : "text-foreground text-2xl font-semibold"
        }
      >
        {value}
      </p>
      <p className="text-muted-foreground mt-1 text-xs tracking-wide uppercase">{label}</p>
    </div>
  );
}
