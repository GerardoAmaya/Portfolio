"use client";

import * as motion from "motion/react-client";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export function Hero() {
  const t = useTranslations("Home");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]" />
      <div
        className="absolute left-1/2 top-0 -z-10 h-[420px] w-[820px] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, oklch(0.706 0.213 293.756 / 0.35), transparent)",
        }}
        aria-hidden
      />

      <div className="container-app relative pb-20 pt-20 sm:pt-28 md:pb-28 md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/60 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {t("eyebrow")}
          </span>

          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("titleLead")}{" "}
            <span className="gradient-text">{t("titleHighlight")}</span>{" "}
            {t("titleTail")}
          </h1>

          <p className="mt-6 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3"
        >
          <Stat label={t("stats.yearsLabel")} value={t("stats.yearsValue")} />
          <Stat
            label={t("stats.projectsLabel")}
            value={t("stats.projectsValue")}
          />
          <Stat
            label={t("stats.stackLabel")}
            value={t("stats.stackValue")}
            small
          />
        </motion.div>

        <div className="mt-12 flex justify-center text-muted-foreground/60">
          <Sparkles className="size-4" />
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string;
  small?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 text-center backdrop-blur">
      <p
        className={
          small
            ? "text-sm font-medium text-foreground"
            : "text-2xl font-semibold text-foreground"
        }
      >
        {value}
      </p>
      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
