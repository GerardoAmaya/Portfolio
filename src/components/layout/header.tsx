"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";

const NAV_KEYS = ["about", "projects", "experience", "contact"] as const;
const HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  about: "/about",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

export function Header() {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-mono text-base font-semibold tracking-tight"
        >
          <span className="text-primary">{">"}</span> gerardo<span className="text-muted-foreground">.dev</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={HREFS[key]}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(HREFS[key])
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          <Button asChild variant="default" size="sm" className="hidden md:inline-flex">
            <a href="/resume.pdf" target="_blank" rel="noreferrer">
              {t("resume")}
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label={t("openMenu")}
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-mono text-base">
                <span className="text-primary">{">"}</span> gerardo
              </SheetTitle>
              <nav className="mt-4 flex flex-col gap-1">
                {NAV_KEYS.map((key) => (
                  <SheetClose asChild key={key}>
                    <Link
                      href={HREFS[key]}
                      className={cn(
                        "rounded-md px-3 py-2.5 text-base font-medium transition-colors",
                        isActive(HREFS[key])
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {t(key)}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <Button asChild className="mt-2">
                <a href="/resume.pdf" target="_blank" rel="noreferrer">
                  {t("resume")}
                </a>
              </Button>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
