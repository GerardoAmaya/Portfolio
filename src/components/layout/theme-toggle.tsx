"use client";

import * as React from "react";
import { flushSync } from "react-dom";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { circleTransition } from "@/lib/circle-transition";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeName = "light" | "dark" | "system";

function resolve(theme: ThemeName) {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const t = useTranslations("Nav");
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  /** Cambia el tema con un círculo que se expande desde el botón. */
  function changeTheme(next: ThemeName) {
    const root = document.documentElement;
    const current = root.classList.contains("dark") ? "dark" : "light";
    if (resolve(next) === current) {
      setTheme(next);
      return;
    }
    circleTransition(buttonRef.current, () => {
      flushSync(() => setTheme(next));
      // next-themes aplica la clase en un efecto: la fijamos aquí para que la
      // captura "nueva" de la transición ya tenga el tema correcto.
      const resolved = resolve(next);
      root.classList.toggle("dark", resolved === "dark");
      root.classList.toggle("light", resolved === "light");
      root.style.colorScheme = resolved;
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button ref={buttonRef} variant="ghost" size="icon" aria-label={t("toggleTheme")}>
          <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">{t("toggleTheme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeTheme("light")}>
          <Sun className="size-4" />
          {t("themeLight")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("dark")}>
          <Moon className="size-4" />
          {t("themeDark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeTheme("system")}>
          <Monitor className="size-4" />
          {t("themeSystem")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
