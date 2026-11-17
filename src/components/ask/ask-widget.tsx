"use client";

import * as React from "react";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { projects } from "@/data/projects";
import { resumeUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { RobotIcon } from "./robot-icon";

type Message = { role: "user" | "assistant"; content: string; error?: boolean };

const TEASER_KEY = "ask-teaser-seen";
const REF_PATTERN = /\[\[([a-z0-9:-]+)\]\]/gi;

/**
 * Asistente "Pregúntale a mi IA": botón flotante con robot y panel de chat.
 * Las respuestas llegan en streaming desde /api/ask y las referencias
 * [[...]] se convierten en enlaces a las secciones del sitio.
 */
export function AskWidget() {
  const t = useTranslations("Ask");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [teaser, setTeaser] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Solo se enfoca el campo con mouse/trackpad: en pantallas tactiles abriria
  // el teclado de golpe, tapando la animacion y las preguntas sugeridas
  const focusInput = React.useCallback(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, []);
  const abortRef = React.useRef<AbortController | null>(null);

  // Burbuja de bienvenida: una vez por sesión, a los 6 s, y se va sola
  React.useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(TEASER_KEY) === "1";
    } catch {}
    if (seen) return;
    const show = window.setTimeout(() => setTeaser(true), 6000);
    const hide = window.setTimeout(() => setTeaser(false), 16000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  const dismissTeaser = React.useCallback(() => {
    setTeaser(false);
    try {
      sessionStorage.setItem(TEASER_KEY, "1");
    } catch {}
  }, []);

  // Mantener visible el final de la conversación mientras llega el texto
  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, loading]);

  React.useEffect(() => () => abortRef.current?.abort(), []);

  async function ask(question: string) {
    const text = question.trim().slice(0, 500);
    if (!text || loading) return;

    const history = [...messages.filter((m) => !m.error), { role: "user" as const, content: text }];
    setMessages([...messages, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        const key = (["rate_limit", "daily_limit", "unavailable"] as const).find(
          (k) => k === data.error
        );
        throw new Error(key ?? "generic");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: answer }]);
      }
      if (!answer.trim()) throw new Error("generic");
    } catch (error) {
      if (controller.signal.aborted) return;
      // Solo claves conocidas: un error de red ("Failed to fetch") cae en genérico
      const known = ["rate_limit", "daily_limit", "unavailable"] as const;
      const message = error instanceof Error ? error.message : "";
      const key = known.find((k) => k === message) ?? "generic";
      setMessages((prev) => {
        const base =
          prev[prev.length - 1]?.role === "assistant" && !prev[prev.length - 1]?.content
            ? prev.slice(0, -1)
            : prev;
        return [
          ...base,
          { role: "assistant", content: t(`errors.${key}` as "errors.generic"), error: true },
        ];
      });
    } finally {
      setLoading(false);
      requestAnimationFrame(focusInput);
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setLoading(false);
    focusInput();
  }

  const waiting = loading && messages[messages.length - 1]?.role === "user";
  const suggestions = t.raw("suggestions") as string[];

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
        {teaser && !open ? (
          <div
            role="status"
            className="ask-teaser border-border/60 bg-card text-card-foreground relative max-w-[15rem] rounded-2xl rounded-br-sm border p-3 pr-8 text-sm shadow-lg"
          >
            {t("teaser")}
            <button
              type="button"
              onClick={dismissTeaser}
              aria-label={t("dismiss")}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2 rounded p-0.5"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            dismissTeaser();
            setOpen(true);
          }}
          aria-label={t("button")}
          className="ask-fab group relative flex items-center gap-2 rounded-full"
        >
          <span className="ask-fab-label bg-card text-foreground border-border/60 pointer-events-none hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium shadow-md sm:flex">
            <Sparkles className="text-primary size-3.5" />
            {t("button")}
          </span>
          <span className="relative">
            <span
              aria-hidden
              className="ask-fab-ring bg-primary/40 absolute inset-0 rounded-full"
            />
            <span className="from-primary shadow-primary/30 relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br to-fuchsia-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
              <RobotIcon className="ask-fab-robot size-8" />
            </span>
            <span className="bg-background text-primary border-primary/40 absolute -top-1 -right-1 rounded-full border px-1.5 text-[0.6rem] leading-4 font-bold">
              {t("badge")}
            </span>
          </span>
        </button>
      </div>

      {/* Panel */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex h-dvh w-full flex-col gap-0 p-0 sm:max-w-md"
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            focusInput();
          }}
        >
          <div className="border-border/60 flex items-start gap-3 border-b p-5 pr-12">
            <span className="from-primary flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-fuchsia-500 text-white">
              <RobotIcon className="size-6" thinking={loading} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <SheetTitle className="text-base">{t("title")}</SheetTitle>
                <span className="border-primary/30 bg-primary/10 text-primary rounded-full border px-2 py-0.5 text-[11px] leading-none font-medium">
                  {t("model")}
                </span>
              </div>
              <SheetDescription>{t("subtitle")}</SheetDescription>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
            {messages.length === 0 ? (
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  {t("suggestionsTitle")}
                </p>
                <div className="mt-3 flex flex-col gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            {messages.map((m, i) =>
              m.role === "user" ? (
                <div key={i} className="flex justify-end">
                  <p className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm">
                    {m.content}
                  </p>
                </div>
              ) : (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    <RobotIcon className="size-4.5" />
                  </span>
                  <div
                    className={cn(
                      "bg-muted/60 min-w-0 flex-1 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed",
                      m.error && "border-destructive/40 border"
                    )}
                  >
                    <Answer text={m.content} locale={locale} onNavigate={() => setOpen(false)} />
                    {m.error ? (
                      <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
                      >
                        {t("contactCta")} →
                      </Link>
                    ) : null}
                  </div>
                </div>
              )
            )}

            {waiting ? (
              <div className="text-muted-foreground flex items-center gap-2.5 text-sm">
                <span className="bg-primary/10 text-primary flex size-7 items-center justify-center rounded-full">
                  <RobotIcon className="size-4.5" thinking />
                </span>
                {t("thinking")}
              </div>
            ) : null}
          </div>

          <div className="border-border/60 border-t p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
              className="border-border/60 focus-within:border-primary/60 bg-card/40 flex items-end gap-2 rounded-2xl border p-2"
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void ask(input);
                  }
                }}
                rows={1}
                maxLength={500}
                placeholder={t("placeholder")}
                aria-label={t("placeholder")}
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none"
              />
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={reset}
                  aria-label={t("clear")}
                  title={t("clear")}
                  className="text-muted-foreground hover:text-foreground flex size-9 items-center justify-center rounded-xl"
                >
                  <RotateCcw className="size-4" />
                </button>
              ) : null}
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label={t("send")}
                className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-xl transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="size-4" />
              </button>
            </form>
            <p className="text-muted-foreground mt-2 text-center text-[0.7rem]">
              {t("disclaimer")}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

/* ------------------------------ Respuesta ------------------------------ */

/** Texto con **negritas**, viñetas "- " y referencias [[...]] como enlaces. */
function Answer({
  text,
  locale,
  onNavigate,
}: {
  text: string;
  locale: string;
  onNavigate: () => void;
}) {
  const lines = text.split("\n");
  const blocks: { type: "p" | "ul"; lines: string[] }[] = [];
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      blocks.push({ type: "p", lines: [] });
      continue;
    }
    const isItem = /^\s*[-*•]\s+/.test(line);
    const last = blocks[blocks.length - 1];
    if (isItem) {
      const item = line.replace(/^\s*[-*•]\s+/, "");
      if (last?.type === "ul") last.lines.push(item);
      else blocks.push({ type: "ul", lines: [item] });
    } else if (last?.type === "p" && last.lines.length) last.lines.push(line);
    else blocks.push({ type: "p", lines: [line] });
  }

  return (
    <div className="space-y-2">
      {blocks
        .filter((b) => b.lines.length)
        .map((b, i) =>
          b.type === "ul" ? (
            <ul key={i} className="list-disc space-y-1 pl-4">
              {b.lines.map((l, j) => (
                <li key={j}>
                  <Inline text={l} locale={locale} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          ) : (
            <p key={i}>
              <Inline text={b.lines.join(" ")} locale={locale} onNavigate={onNavigate} />
            </p>
          )
        )}
    </div>
  );
}

function Inline({
  text,
  locale,
  onNavigate,
}: {
  text: string;
  locale: string;
  onNavigate: () => void;
}) {
  const t = useTranslations("Ask");
  // Una etiqueta a medio llegar ("[[proj") no se muestra hasta completarse, y
  // las referencias inventadas se quitan junto con el espacio que las precede
  const clean = text
    .replace(/\[\[[a-z0-9:-]*$/i, "")
    .replace(/\s*\[\[([a-z0-9:-]+)\]\]/gi, (match, id: string) => (isValidRef(id) ? match : ""));
  const parts = clean.split(REF_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1)
          return <RefChip key={i} id={part} locale={locale} onNavigate={onNavigate} t={t} />;
        return part.split(/(\*\*[^*]+\*\*)/g).map((seg, j) =>
          seg.startsWith("**") && seg.endsWith("**") && seg.length > 4 ? (
            <strong key={`${i}-${j}`} className="font-semibold">
              {seg.slice(2, -2)}
            </strong>
          ) : (
            <React.Fragment key={`${i}-${j}`}>{seg}</React.Fragment>
          )
        );
      })}
    </>
  );
}

const SECTION_HREF: Record<string, string> = {
  about: "/about",
  experience: "/experience",
  projects: "/projects",
  contact: "/contact",
};

function isValidRef(id: string) {
  if (id === "cv" || id in SECTION_HREF) return true;
  return id.startsWith("project:") && projects.some((p) => p.slug === id.slice(8));
}

function RefChip({
  id,
  locale,
  onNavigate,
  t,
}: {
  id: string;
  locale: string;
  onNavigate: () => void;
  t: ReturnType<typeof useTranslations<"Ask">>;
}) {
  const chip =
    "bg-primary/10 text-primary hover:bg-primary/20 mx-0.5 inline-flex items-center rounded-md px-1.5 py-px align-baseline text-xs font-medium no-underline transition-colors";

  if (id === "cv") {
    return (
      <a href={resumeUrl(locale)} target="_blank" rel="noreferrer" className={chip}>
        {t("refs.cv")} ↗
      </a>
    );
  }
  if (id.startsWith("project:")) {
    const project = projects.find((p) => p.slug === id.slice(8));
    if (!project) return null;
    const title = project.i18n[locale === "en" ? "en" : "es"].title;
    return (
      <Link href={`/projects/${project.slug}`} onClick={onNavigate} className={chip}>
        {title}
      </Link>
    );
  }
  const href = SECTION_HREF[id];
  if (!href) return null; // referencia inventada: se descarta
  return (
    <Link href={href} onClick={onNavigate} className={chip}>
      {t(`refs.${id}` as "refs.about")}
    </Link>
  );
}
