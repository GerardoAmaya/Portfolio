import { Brain, Code2, Database, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SpotlightGroup } from "@/components/spotlight";
import { Rise } from "@/components/motion/rise";

export function Highlights() {
  const t = useTranslations("Home");

  const items = [
    {
      icon: Database,
      file: "backend.ts",
      title: t("highlights.backendTitle"),
      desc: t("highlights.backendDesc"),
    },
    {
      icon: Code2,
      file: "frontend.tsx",
      title: t("highlights.frontendTitle"),
      desc: t("highlights.frontendDesc"),
    },
    {
      icon: Brain,
      file: "ai.py",
      title: t("highlights.aiTitle"),
      desc: t("highlights.aiDesc"),
    },
    {
      icon: Rocket,
      file: "deploy.yml",
      title: t("highlights.devopsTitle"),
      desc: t("highlights.devopsDesc"),
    },
  ];

  return (
    <section className="border-border/60 bg-background border-t py-20 md:py-28">
      <div className="container-app">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          <Rise>{t("highlightsTitle")}</Rise>
        </h2>

        <SpotlightGroup className="reveal-children mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, file, title, desc }) => (
            <Card
              key={title}
              data-spotlight
              className="spotlight tilt group border-border/60 bg-card/40 relative overflow-hidden backdrop-blur"
            >
              {/* Barra de ventana de editor */}
              <div className="border-border/60 text-muted-foreground flex items-center gap-1.5 border-b px-4 py-2.5 font-mono text-xs">
                <span aria-hidden className="size-2.5 rounded-full bg-[#ff5f57]/80" />
                <span aria-hidden className="size-2.5 rounded-full bg-[#febc2e]/80" />
                <span aria-hidden className="size-2.5 rounded-full bg-[#28c840]/80" />
                <span className="ml-2">{file}</span>
              </div>
              <CardHeader>
                <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-3 text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{desc}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
