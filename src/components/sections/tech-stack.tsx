import { useTranslations } from "next-intl";
import { TechStackTabs } from "@/components/sections/tech-stack-tabs";

// Sección de stack técnico para la página de inicio
export function TechStack() {
  const t = useTranslations("Home");
  const tAbout = useTranslations("About");

  return (
    <section className="border-border/60 bg-background border-t py-20 md:py-28">
      <div className="container-app">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("stackTitle")}
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl">{t("stackSubtitle")}</p>

        <div className="mt-10">
          <TechStackTabs
            ariaLabel={tAbout("skillsTitle")}
            labels={{
              frontend: tAbout("categories.frontend"),
              backend: tAbout("categories.backend"),
              databases: tAbout("categories.databases"),
              cloud: tAbout("categories.cloud"),
              security: tAbout("categories.security"),
              tools: tAbout("categories.tools"),
            }}
          />
        </div>
      </div>
    </section>
  );
}
