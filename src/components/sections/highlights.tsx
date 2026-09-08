import { Brain, Code2, Database, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function Highlights() {
  const t = useTranslations("Home");

  const items = [
    {
      icon: Database,
      title: t("highlights.backendTitle"),
      desc: t("highlights.backendDesc"),
    },
    {
      icon: Code2,
      title: t("highlights.frontendTitle"),
      desc: t("highlights.frontendDesc"),
    },
    {
      icon: Brain,
      title: t("highlights.aiTitle"),
      desc: t("highlights.aiDesc"),
    },
    {
      icon: Rocket,
      title: t("highlights.devopsTitle"),
      desc: t("highlights.devopsDesc"),
    },
  ];

  return (
    <section className="border-border/60 bg-background border-t py-20 md:py-28">
      <div className="container-app">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("highlightsTitle")}
        </h2>

        <div className="reveal-children mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="group border-border/60 bg-card/40 hover:border-primary/40 relative overflow-hidden backdrop-blur transition-colors"
            >
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
        </div>
      </div>
    </section>
  );
}
