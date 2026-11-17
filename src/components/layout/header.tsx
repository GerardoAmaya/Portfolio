"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { cn } from "@/lib/utils";
import { resumeUrl } from "@/lib/site";

const NAV_KEYS = ["about", "projects", "experience", "contact"] as const;
const HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  about: "/about",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

export function Header() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  // Indicador del menú: una pastilla que se desliza al ítem bajo el mouse y
  // vuelve al de la página actual. Se mueve por DOM para no re-renderizar.
  const navRef = React.useRef<HTMLElement>(null);
  const pillRef = React.useRef<HTMLSpanElement>(null);
  const placed = React.useRef(false);

  const moveTo = React.useCallback((el: HTMLElement | null | undefined) => {
    const pill = pillRef.current;
    if (!pill) return;
    if (!el) {
      pill.style.opacity = "0";
      return;
    }
    // La primera vez aparece en su lugar, sin deslizarse desde la izquierda
    pill.style.transitionDuration = placed.current ? "" : "0s";
    pill.style.width = `${el.offsetWidth}px`;
    pill.style.transform = `translateX(${el.offsetLeft}px)`;
    pill.style.opacity = "1";
    placed.current = true;
  }, []);

  const activeLink = React.useCallback(
    () => navRef.current?.querySelector<HTMLElement>('a[aria-current="page"]'),
    []
  );

  React.useEffect(() => {
    moveTo(activeLink());
    const onResize = () => {
      placed.current = false;
      moveTo(activeLink());
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname, moveTo, activeLink]);

  return (
    <header
      className={cn(
        "relative sticky top-0 z-40 w-full transition-all",
        scrolled
          ? "border-border/60 bg-background/80 supports-[backdrop-filter]:bg-background/60 border-b backdrop-blur"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <span
        aria-hidden
        className="scroll-progress from-primary via-primary/70 to-primary/20 absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r"
      />
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link href="/" className="font-mono text-base font-semibold tracking-tight">
          <span className="text-primary">{">"}</span> gerardo
          <span className="text-muted-foreground">.dev</span>
        </Link>

        <nav
          ref={navRef}
          className="relative hidden items-center gap-1 md:flex"
          aria-label="Primary"
          onMouseLeave={() => moveTo(activeLink())}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) moveTo(activeLink());
          }}
        >
          <span
            ref={pillRef}
            aria-hidden
            className="nav-pill bg-accent pointer-events-none absolute inset-y-0 left-0 rounded-md opacity-0"
          />
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={HREFS[key]}
              aria-current={isActive(HREFS[key]) ? "page" : undefined}
              onMouseEnter={(e) => moveTo(e.currentTarget)}
              onFocus={(e) => moveTo(e.currentTarget)}
              className={cn(
                "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
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
            <a href={resumeUrl(locale)} target="_blank" rel="noreferrer">
              {t("resume")}
            </a>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label={t("openMenu")}>
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
                      aria-current={isActive(HREFS[key]) ? "page" : undefined}
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
                <a href={resumeUrl(locale)} target="_blank" rel="noreferrer">
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
