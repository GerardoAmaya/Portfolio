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

/** Debe coincidir con la transición de `html.locale-fading` en globals.css */
const FADE_OUT_MS = 180;

/**
 * Resuelve cuando la página ya está en el otro idioma: `<html lang>` cambió y
 * el contenido nuevo (el `.page-enter` del template) ya está montado. Pasado
 * `timeout` resuelve igual, para no dejar la página oculta.
 */
function waitForLocaleSwap(next: string, timeout = 3000) {
  const root = document.documentElement;
  const previous = document.querySelector("main .page-enter");

  return new Promise<void>((resolve) => {
    const isReady = () => {
      const current = document.querySelector("main .page-enter");
      return (
        root.lang === next && !!current && current !== previous && current.childElementCount > 0
      );
    };
    const done = () => {
      observer.disconnect();
      window.clearTimeout(timer);
      requestAnimationFrame(() => resolve());
    };
    const observer = new MutationObserver(() => {
      if (isReady()) done();
    });
    const timer = window.setTimeout(done, timeout);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["lang"],
      childList: true,
      subtree: true,
    });
    if (isReady()) done();
  });
}

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
    const navigate = () =>
      startTransition(() => {
        router.replace(
          // @ts-expect-error pathname inferred from current route
          { pathname, params },
          { locale: next, scroll: false }
        );
      });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      navigate();
      return;
    }

    // Fundido: se oculta el contenido, cambia el idioma y, cuando la página
    // nueva ya está montada, aparece con su animación de entrada.
    const root = document.documentElement;
    root.classList.add("locale-fading");
    window.setTimeout(() => {
      navigate();
      waitForLocaleSwap(next).then(() => root.classList.remove("locale-fading"));
    }, FADE_OUT_MS);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t("switchLanguage")} disabled={isPending}>
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
