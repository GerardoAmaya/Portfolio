"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);
const DIRS = ["about", "projects", "experience", "contact"] as const;
const HREFS: Record<(typeof DIRS)[number], string> = {
  about: "/about",
  projects: "/projects",
  experience: "/experience",
  contact: "/contact",
};

/** "Sobre mí" → "sobre-mi" */
const toDir = (label: string) =>
  label.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/\s+/g, "-");

/**
 * 404 con forma de terminal: intenta entrar a la ruta pedida, falla como
 * fallaría `cd`, y lista las páginas que sí existen como enlaces.
 */
export function TerminalNotFound() {
  const t = useTranslations("NotFound");
  const nav = useTranslations("Nav");
  const path = (usePathname() ?? "/").replace(LOCALE_PREFIX, "") || "/";
  const prompt = (
    <>
      <span className="text-emerald-400">gerardo@dev</span>
      <span className="text-muted-foreground">:</span>
      <span className="text-sky-400">~</span>
      <span className="text-muted-foreground">$ </span>
    </>
  );

  return (
    <section className="container-app flex min-h-[70vh] flex-col items-center justify-center py-20">
      <h1 className="sr-only">404 · {t("title")}</h1>
      <div className="border-border/60 bg-card/60 w-full max-w-2xl overflow-hidden rounded-xl border font-mono text-sm shadow-xl">
        <div className="border-border/60 text-muted-foreground flex items-center gap-1.5 border-b px-4 py-2.5 text-xs">
          <span aria-hidden className="size-2.5 rounded-full bg-[#ff5f57]/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-[#febc2e]/80" />
          <span aria-hidden className="size-2.5 rounded-full bg-[#28c840]/80" />
          <span className="mx-auto pr-10">gerardo@dev: ~ (404)</span>
        </div>
        <div className="space-y-1 p-5 leading-relaxed sm:p-6">
          <p className="break-all">
            {prompt}cd {path}
          </p>
          <p className="break-words text-rose-400">
            bash: cd: {path}: {t("noSuchFile")}
          </p>
          <p className="pt-3">{prompt}ls</p>
          <p className="flex flex-wrap gap-x-6 gap-y-1">
            {DIRS.map((key) => (
              <Link
                key={key}
                href={HREFS[key]}
                className="text-sky-400 underline-offset-4 hover:underline"
              >
                {toDir(nav(key))}/
              </Link>
            ))}
          </p>
          <p className="pt-3">
            {prompt}
            <Link href="/" className="text-primary underline-offset-4 hover:underline">
              cd ~
            </Link>
            <span className="text-muted-foreground">
              {" "}
              {"# "}
              {t("backHome")}
            </span>
            <span
              aria-hidden
              className="hero-caret ml-1 !h-[1.1em] !w-[0.55em] align-text-bottom"
            />
          </p>
        </div>
      </div>
      <p className="text-muted-foreground mt-6 max-w-md text-center text-sm text-pretty">
        {t("description")}
      </p>
    </section>
  );
}
