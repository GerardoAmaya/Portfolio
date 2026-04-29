import { Code2, Database, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      icon: Rocket,
      title: t("highlights.devopsTitle"),
      desc: t("highlights.devopsDesc"),
    },
  ];

  return (
    <section className="border-t border-border/60 bg-background py-20 md:py-28">
      <div className="container-app">
        <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("highlightsTitle")}
        </h2>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {items.map(({ icon: Icon, title, desc }) => (
            <Card
              key={title}
              className="group relative overflow-hidden border-border/60 bg-card/40 backdrop-blur transition-colors hover:border-primary/40"
            >
              <CardHeader>
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle className="mt-3 text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {desc}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
