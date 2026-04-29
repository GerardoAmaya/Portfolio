"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const labels: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export function LanguageSwitcher() {
  const t = useTranslations("Nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  const onSelect = (next: Locale) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error pathname inferred from current route
        { pathname, params },
        { locale: next }
      );
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("switchLanguage")}
          disabled={isPending}
        >
          <Languages className="size-5" />
          <span className="sr-only">{t("switchLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {routing.locales.map((l) => (
          <DropdownMenuCheckboxItem
            key={l}
            checked={l === locale}
            onCheckedChange={() => onSelect(l)}
          >
            {labels[l]}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
