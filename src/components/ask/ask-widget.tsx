"use client";

import * as React from "react";
import { ArrowUp, RotateCcw, Sparkles, X } from "lucide-react";
import { animate, motion, useMotionValue, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { cleanRefs, isValidRef, parseAnswerBlocks, REF_PATTERN } from "@/lib/ask/answer";
import { resumeUrl } from "@/lib/site";
import { cn } from "@/lib/utils";
import { AskMascot } from "./ask-mascot";
import { RobotIcon } from "./robot-icon";

type Message = { role: "user" | "assistant"; content: string; error?: boolean };

/** Lo único que el widget necesita de cada proyecto, ya en el idioma de la página. */
export type AskProject = { slug: string; title: string };

const TEASER_KEY = "ask-teaser-seen";
const FAB_KEY = "ask-fab-position";
const MESSAGE_SPRING = { type: "spring", stiffness: 380, damping: 26 } as const;

/**
 * Asistente "Pregúntale a mi IA": botón flotante con robot y panel de chat.
 * Las respuestas llegan en streaming desde /api/ask y las referencias
 * [[...]] se convierten en enlaces a las secciones del sitio.
 */
export function AskWidget({ projects }: { projects: AskProject[] }) {
  const t = useTranslations("Ask");
  const locale = useLocale();
  const [open, setOpen] = React.useState(false);
  const [teaser, setTeaser] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // Estado de la mascota del botón: feliz con el mouse encima, corazones al hacer clic
  const reduceMotion = useReducedMotion();
  const [fabHover, setFabHover] = React.useState(false);
  const [fabLove, setFabLove] = React.useState(false);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  // Solo se enfoca el campo con mouse/trackpad: en pantallas tactiles abriria
  // el teclado de golpe, tapando la animacion y las preguntas sugeridas
  const focusInput = React.useCallback(() => {
    if (window.matchMedia("(pointer: fine)").matches) inputRef.current?.focus();
  }, []);
  const abortRef = React.useRef<AbortController | null>(null);

  // Posición del botón flotante (arrastrable)
  const boundsRef = React.useRef<HTMLDivElement>(null);
  const draggedRef = React.useRef(false);
  const sideRef = React.useRef<"left" | "right">("right");
  const fabX = useMotionValue(0);
  const fabY = useMotionValue(0);
  const [fab, setFab] = React.useState<{ side: "left" | "right"; teaserBelow: boolean }>({
    side: "right",
    teaserBelow: false,
  });

  /** Lleva el botón al borde lateral más cercano y lo deja dentro de la pantalla. */
  const placeFab = React.useCallback(
    (side: "left" | "right", y: number, animated: boolean) => {
      const margin = window.innerWidth >= 640 ? 24 : 16;
      const size = 56;
      const x = side === "right" ? 0 : -(window.innerWidth - margin * 2 - size);
      // y es negativo hacia arriba desde la esquina inferior; tope bajo el header
      const minY = -(window.innerHeight - margin - size - 72);
      const clampedY = Math.min(0, Math.max(minY, y));
      if (animated) {
        const spring = { type: "spring", stiffness: 420, damping: 32 } as const;
        animate(fabX, x, spring);
        animate(fabY, clampedY, spring);
      } else {
        fabX.set(x);
        fabY.set(clampedY);
      }
      sideRef.current = side;
      // Burbuja debajo del robot si está en la mitad superior
      const top = window.innerHeight - margin - size + clampedY;
      setFab({ side, teaserBelow: top < window.innerHeight / 2 });
      return clampedY;
    },
    [fabX, fabY]
  );

  function snapToEdge() {
    const button = boundsRef.current?.parentElement?.querySelector<HTMLElement>(".ask-fab");
    if (!button) return;
    const rect = button.getBoundingClientRect();
    const side = rect.left + rect.width / 2 < window.innerWidth / 2 ? "left" : "right";
    const y = placeFab(side, fabY.get(), true);
    try {
      localStorage.setItem(FAB_KEY, JSON.stringify({ side, y }));
    } catch {}
    // Si el arrastre fue mínimo y no hubo clic, que no bloquee el siguiente
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 50);
  }

  // Recupera la posición guardada y la reajusta si cambia el tamaño de pantalla
  React.useEffect(() => {
    let saved: { side: "left" | "right"; y: number } = { side: "right", y: 0 };
    try {
      const raw = localStorage.getItem(FAB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { side?: string; y?: number };
        saved = {
          side: parsed.side === "left" ? "left" : "right",
          y: typeof parsed.y === "number" ? parsed.y : 0,
        };
      }
    } catch {}
    const frame = requestAnimationFrame(() => placeFab(saved.side, saved.y, false));
    const onResize = () => placeFab(sideRef.current, fabY.get(), false);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [placeFab, fabY]);

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
      {/* Límites del arrastre: la pantalla menos el header y un margen */}
      <div
        ref={boundsRef}
        aria-hidden
        className="pointer-events-none fixed inset-x-4 top-[72px] bottom-4 -z-50 sm:inset-x-6 sm:bottom-6"
      />

      {/* Botón flotante: se puede arrastrar y al soltarlo se pega al borde */}
      <motion.div
        drag
        dragConstraints={boundsRef}
        dragElastic={0.12}
        dragMomentum={false}
        onDragStart={() => {
          draggedRef.current = true;
        }}
        onDragEnd={snapToEdge}
        style={{ x: fabX, y: fabY }}
        data-side={fab.side}
        className="ask-fab-wrap fixed right-4 bottom-4 z-40 touch-none sm:right-6 sm:bottom-6"
      >
        {teaser && !open ? (
          <div
            role="status"
            className={cn(
              "ask-teaser border-border/60 bg-card text-card-foreground absolute w-60 rounded-2xl border p-3 pr-8 text-sm shadow-lg",
              fab.side === "right" ? "right-0" : "left-0",
              fab.teaserBelow ? "top-full mt-3" : "bottom-full mb-3",
              fab.side === "right"
                ? fab.teaserBelow
                  ? "rounded-tr-sm"
                  : "rounded-br-sm"
                : fab.teaserBelow
                  ? "rounded-tl-sm"
                  : "rounded-bl-sm"
            )}
          >
            {t("teaser")}
            <button
              type="button"
              onClick={dismissTeaser}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label={t("dismiss")}
              className="text-muted-foreground hover:text-foreground absolute top-2 right-2 rounded p-0.5"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : null}

        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          onClick={() => {
            // Soltar después de arrastrar no cuenta como clic
            if (draggedRef.current) {
              draggedRef.current = false;
              return;
            }
            dismissTeaser();
            // Un instante de ojos de corazón antes de abrir; sin animaciones, abre ya
            if (reduceMotion) {
              setOpen(true);
              return;
            }
            if (fabLove) return;
            setFabLove(true);
            window.setTimeout(() => {
              setOpen(true);
              setFabLove(false);
            }, 380);
          }}
          // Solo con mouse: en pantallas táctiles el "hover" queda pegado tras tocar
          onPointerEnter={(e) => setFabHover(e.pointerType === "mouse")}
          onPointerLeave={() => setFabHover(false)}
          aria-label={t("button")}
          className="ask-fab group relative flex cursor-grab rounded-full active:cursor-grabbing"
        >
          <span
            className={cn(
              "ask-fab-label bg-card text-foreground border-border/60 pointer-events-none absolute top-1/2 hidden -translate-y-1/2 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium whitespace-nowrap shadow-md sm:flex",
              fab.side === "right" ? "right-full mr-2" : "left-full ml-2"
            )}
          >
            <Sparkles className="text-primary size-3.5" />
            {t("button")}
          </span>
          <span className="relative">
            <span
              aria-hidden
              className="ask-fab-ring bg-primary/40 absolute inset-0 rounded-full"
            />
            <span className="from-primary shadow-primary/30 relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br to-fuchsia-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
              <AskMascot happy={fabHover} love={fabLove} className="size-8" />
            </span>
            <span className="bg-background text-primary border-primary/40 absolute -top-1 -right-1 rounded-full border px-1.5 text-[0.6rem] leading-4 font-bold">
              {t("badge")}
            </span>
          </span>
        </motion.button>
      </motion.div>

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
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={MESSAGE_SPRING}
                  style={{ transformOrigin: "100% 100%" }}
                  className="flex justify-end"
                >
                  <p className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-sm px-3.5 py-2 text-sm">
                    {m.content}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={MESSAGE_SPRING}
                  style={{ transformOrigin: "0% 0%" }}
                  className="flex items-start gap-2.5"
                >
                  <span className="bg-primary/10 text-primary mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full">
                    <RobotIcon className="size-4.5" />
                  </span>
                  <div
                    className={cn(
                      "bg-muted/60 min-w-0 flex-1 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm leading-relaxed",
                      m.error && "border-destructive/40 border"
                    )}
                  >
                    <Answer
                      text={m.content}
                      locale={locale}
                      projects={projects}
                      onNavigate={() => setOpen(false)}
                    />
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
                </motion.div>
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
function Answer({ text, ...rest }: { text: string } & InlineProps) {
  return (
    <div className="space-y-2">
      {parseAnswerBlocks(text).map((b, i) =>
        b.type === "ul" ? (
          <ul key={i} className="list-disc space-y-1 pl-4">
            {b.lines.map((l, j) => (
              <li key={j}>
                <Inline text={l} {...rest} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inline text={b.lines.join(" ")} {...rest} />
          </p>
        )
      )}
    </div>
  );
}

type InlineProps = { locale: string; projects: AskProject[]; onNavigate: () => void };

function Inline({ text, locale, projects, onNavigate }: { text: string } & InlineProps) {
  const t = useTranslations("Ask");
  const slugs = projects.map((p) => p.slug);
  const clean = cleanRefs(text, (id) => isValidRef(id, slugs));
  const parts = clean.split(REF_PATTERN);

  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 1)
          return (
            <RefChip
              key={i}
              id={part}
              locale={locale}
              projects={projects}
              onNavigate={onNavigate}
              t={t}
            />
          );
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

function RefChip({
  id,
  locale,
  projects,
  onNavigate,
  t,
}: {
  id: string;
  t: ReturnType<typeof useTranslations<"Ask">>;
} & InlineProps) {
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
    const project = projects.find((p) => p.slug === id.slice("project:".length));
    if (!project) return null;
    return (
      <Link href={`/projects/${project.slug}`} onClick={onNavigate} className={chip}>
        {project.title}
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
