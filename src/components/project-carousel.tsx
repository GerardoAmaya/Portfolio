"use client";

import * as React from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export type CarouselSlide = { src: string; alt: string };

const AUTOPLAY_MS = 5500;
const SWIPE_PX = 50;
const COVER_SIZES = "(min-width: 1024px) 1024px, 100vw";

/**
 * Carrusel de capturas de un caso de estudio, en el lugar de la portada.
 *
 * Avanza solo con una barra de progreso en la miniatura activa, y se detiene
 * con el mouse encima, con el foco dentro o con la pestaña en segundo plano.
 * Flechas, teclado (← →), deslizar y miniaturas. Con "reducir movimiento" no
 * avanza solo y las capturas cambian con un fundido, sin desplazarse.
 *
 * El marco conserva `project-cover` como view-transition-name: la portada de
 * la tarjeta sigue "volando" a su sitio al abrir el proyecto.
 */
export function ProjectCarousel({ slides, title }: { slides: CarouselSlide[]; title: string }) {
  const t = useTranslations("Projects.carousel");
  const reduced = useReducedMotion();
  const count = slides.length;

  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const indexRef = React.useRef(0);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  // Las demás capturas se precargan cuando la primera ya se mostró
  const [warm, setWarm] = React.useState(false);

  const autoplay = !reduced && count > 1;
  const paused = hovered || focused || hidden;

  const go = React.useCallback(
    (target: number, dir?: number) => {
      const next = (target + count) % count;
      if (next === indexRef.current) return;
      setDirection(dir ?? (next > indexRef.current ? 1 : -1));
      indexRef.current = next;
      setIndex(next);
    },
    [count]
  );
  const next = React.useCallback(() => go(indexRef.current + 1, 1), [go]);
  const prev = React.useCallback(() => go(indexRef.current - 1, -1), [go]);

  React.useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const variants: Variants = reduced
    ? { enter: { opacity: 0 }, center: { opacity: 1 }, exit: { opacity: 0 } }
    : {
        enter: (d: number) => ({ x: `${d * 8}%`, opacity: 0, scale: 0.98 }),
        center: { x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ x: `${d * -8}%`, opacity: 0, scale: 0.98 }),
      };

  const slide = slides[index]!;
  const arrow =
    "bg-background/80 text-foreground border-border/60 hover:bg-background absolute top-1/2 z-10 flex size-7 -translate-y-1/2 sm:size-9 items-center justify-center rounded-full border shadow-sm backdrop-blur transition-opacity focus-visible:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div
        role="region"
        aria-roledescription={t("roledescription")}
        aria-label={t("label", { title })}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          else if (e.key === "ArrowLeft") prev();
          else return;
          e.preventDefault();
        }}
        className="group border-border/60 bg-muted focus-visible:ring-ring relative aspect-video w-full overflow-hidden rounded-2xl border outline-none focus-visible:ring-2"
        style={{ viewTransitionName: "project-cover" }}
      >
        <motion.div
          className="absolute inset-0"
          style={{ touchAction: "pan-y" }}
          onPanEnd={(_, info) => {
            if (info.offset.x < -SWIPE_PX) next();
            else if (info.offset.x > SWIPE_PX) prev();
          }}
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={slide.src}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                reduced
                  ? { duration: 0.2 }
                  : { type: "spring", stiffness: 260, damping: 32, opacity: { duration: 0.3 } }
              }
              className="absolute inset-0"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes={COVER_SIZES}
                className="object-contain select-none"
                draggable={false}
                priority={index === 0}
                onLoad={() => setWarm(true)}
              />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={t("previous")}
              className={cn(arrow, "left-2 sm:left-3")}
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("next")}
              className={cn(arrow, "right-2 sm:right-3")}
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          </>
        ) : null}
      </div>

      {/* Precarga: mismas URL que el marco, así el cambio no espera a la red */}
      {warm ? (
        <div aria-hidden className="pointer-events-none fixed size-px overflow-hidden opacity-0">
          {slides.map((s) => (
            <div key={s.src} className="relative size-px">
              <Image src={s.src} alt="" fill sizes={COVER_SIZES} loading="eager" />
            </div>
          ))}
        </div>
      ) : null}

      {count > 1 ? (
        <>
          <div className="mt-3 flex items-start justify-between gap-4">
            <motion.p
              key={index}
              initial={reduced ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              aria-live="polite"
              className="text-muted-foreground text-sm text-pretty"
            >
              {slide.alt}
            </motion.p>
            <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
              {index + 1} / {count}
            </span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {slides.map((s, i) => {
              const active = i === index;
              return (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t("goTo", { n: i + 1, alt: s.alt })}
                  aria-current={active}
                  className={cn(
                    "bg-muted relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all",
                    active
                      ? "border-primary ring-primary/30 ring-2"
                      : "border-border/60 opacity-60 hover:opacity-100"
                  )}
                >
                  <Image src={s.src} alt="" fill sizes="96px" className="object-cover object-top" />
                  {active && autoplay ? (
                    // Al terminar la barra avanza: pausarla pausa también el avance
                    <span
                      key={index}
                      aria-hidden
                      onAnimationEnd={next}
                      className="carousel-progress bg-primary absolute inset-x-0 bottom-0 h-0.5"
                      style={{
                        animationDuration: `${AUTOPLAY_MS}ms`,
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
