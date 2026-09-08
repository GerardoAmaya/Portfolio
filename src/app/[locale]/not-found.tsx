import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default async function LocaleNotFound() {
  const t = await getTranslations("NotFound");

  return (
    <section className="container-app flex min-h-[60vh] flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="font-mono text-sm font-medium text-primary">404</p>
      <h1 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl">
        {t("title")}
      </h1>
      <p className="max-w-md text-pretty text-muted-foreground">
        {t("description")}
      </p>
      <Button asChild className="mt-2">
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </section>
  );
}
