"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type CarouselSlide = { src: string; alt: string };

const AUTOPLAY_MS = 4000;
// Las capturas vecinas se asoman achicadas y tenues, y crecen al llegar al centro
const MIN_SCALE = 0.86;
const MIN_OPACITY = 0.4;

/**
 * Carrusel de capturas de un caso de estudio, en el lugar de la portada.
 * Sobre el Carousel de shadcn/ui (Embla) con su plugin de autoplay:
 *
 * - Avanza cada 4 s en bucle; se detiene con el mouse encima o el foco dentro
 *   y retoma al salir. La barra de la miniatura activa va atada al temporizador
 *   del plugin, así que pausa y reinicia con él.
 * - Las capturas vecinas se ven a los lados, más chicas y tenues; al arrastrar
 *   o avanzar crecen hacia el centro siguiendo el desplazamiento real.
 * - La captura activa se acerca muy despacio mientras está a la vista.
 * - Arrastre con inercia, flechas, teclado (← →) y miniaturas.
 *
 * Con "reducir movimiento" no avanza solo, no escala ni acerca.
 *
 * El marco conserva `project-cover` como view-transition-name: la portada de
 * la tarjeta sigue "volando" a su sitio al abrir el proyecto.
 */
export function ProjectCarousel({ slides, title }: { slides: CarouselSlide[]; title: string }) {
  const t = useTranslations("Projects.carousel");
  const reduced = !!useReducedMotion();
  const count = slides.length;
  const multiple = count > 1;

  const [api, setApi] = React.useState<CarouselApi>();
  const [selected, setSelected] = React.useState(0);
  // Cada vuelta del temporizador tiene su clave: así la barra arranca de cero
  const [timer, setTimer] = React.useState<{ key: number; ms: number; paused: boolean }>({
    key: 0,
    ms: AUTOPLAY_MS,
    paused: true,
  });
  const tweenNodes = React.useRef<(HTMLDivElement | null)[]>([]);

  const autoplay = React.useMemo(
    () =>
      Autoplay({
        delay: AUTOPLAY_MS,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    []
  );
  const plugins = React.useMemo(
    () => (multiple && !reduced ? [autoplay] : []),
    [autoplay, multiple, reduced]
  );

  // Escala y opacidad de cada captura según su distancia al centro, en cada
  // cuadro del desplazamiento (adaptado del ejemplo "tween scale" de Embla).
  const tween = React.useCallback(
    (embla: NonNullable<CarouselApi>, eventName?: string) => {
      const engine = embla.internalEngine();
      const progress = embla.scrollProgress();
      const inView = embla.slidesInView();
      const factor = 0.5 * embla.scrollSnapList().length;

      embla.scrollSnapList().forEach((snap, snapIndex) => {
        let diff = snap - progress;
        for (const slideIndex of engine.slideRegistry[snapIndex] ?? []) {
          if (eventName === "scroll" && !inView.includes(slideIndex)) continue;
          if (engine.options.loop) {
            for (const loopItem of engine.slideLooper.loopPoints) {
              const target = loopItem.target();
              if (slideIndex === loopItem.index && target !== 0) {
                diff = Math.sign(target) === -1 ? snap - (1 + progress) : snap + (1 - progress);
              }
            }
          }
          const closeness = Math.max(0, Math.min(1, 1 - Math.abs(diff * factor)));
          const node = tweenNodes.current[slideIndex];
          if (!node) continue;
          node.style.transform = reduced ? "" : `scale(${MIN_SCALE + (1 - MIN_SCALE) * closeness})`;
          node.style.opacity = String(MIN_OPACITY + (1 - MIN_OPACITY) * closeness);
        }
      });
    },
    [reduced]
  );

  React.useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    const onTimerSet = () =>
      setTimer((prev) => ({
        key: prev.key + 1,
        ms: api.plugins().autoplay?.timeUntilNext() ?? AUTOPLAY_MS,
        paused: false,
      }));
    const onTimerStopped = () => setTimer((prev) => ({ ...prev, paused: true }));
    const onTween = (embla: NonNullable<CarouselApi>, eventName: string) => tween(embla, eventName);

    tween(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    api.on("scroll", onTween);
    api.on("reInit", onTween);
    api.on("slideFocus", onTween);
    api.on("autoplay:timerset", onTimerSet);
    api.on("autoplay:timerstopped", onTimerStopped);
    // El primer temporizador arrancó antes de escuchar: reiniciarlo emite
    // "autoplay:timerset" y la barra se sincroniza desde el principio.
    if (api.plugins().autoplay?.isPlaying()) api.plugins().autoplay?.reset();

    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
      api.off("scroll", onTween);
      api.off("reInit", onTween);
      api.off("slideFocus", onTween);
      api.off("autoplay:timerset", onTimerSet);
      api.off("autoplay:timerstopped", onTimerStopped);
    };
  }, [api, tween]);

  // Navegar a mano reinicia el temporizador: si no, la captura elegida solo
  // duraba lo que le quedaba al ciclo anterior y saltaba enseguida a la siguiente
  const navigate = React.useCallback(
    (move: (embla: NonNullable<CarouselApi>) => void) => {
      if (!api) return;
      move(api);
      api.plugins().autoplay?.reset();
    },
    [api]
  );

  const slide = slides[selected]!;
  const arrow =
    "bg-background/80 text-foreground border-border/60 hover:bg-background absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border shadow-md backdrop-blur transition-all hover:scale-105 sm:size-10";

  return (
    <div>
      <Carousel
        setApi={setApi}
        plugins={plugins}
        opts={{ loop: multiple, align: "center", duration: 32, active: multiple }}
        aria-roledescription={t("roledescription")}
        aria-label={t("label", { title })}
        tabIndex={0}
        className="focus-visible:ring-ring rounded-2xl outline-none focus-visible:ring-2"
        style={{ viewTransitionName: "project-cover" }}
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {slides.map((s, i) => (
            <CarouselItem
              key={s.src}
              aria-label={`${i + 1} / ${count}`}
              className={cn("pl-3 sm:pl-4", multiple && "basis-[88%] sm:basis-[82%]")}
            >
              <div
                ref={(el) => {
                  tweenNodes.current[i] = el;
                }}
                className="border-border/60 bg-muted relative aspect-video w-full overflow-hidden rounded-2xl border shadow-sm will-change-transform"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  sizes="(min-width: 1024px) 860px, 88vw"
                  className={cn(
                    "object-contain select-none",
                    i === selected && multiple && !reduced && "carousel-kenburns"
                  )}
                  draggable={false}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {multiple ? (
          <>
            <button
              type="button"
              onClick={() => navigate((embla) => embla.scrollPrev())}
              aria-label={t("previous")}
              className={cn(arrow, "left-2 sm:left-4")}
            >
              <ChevronLeft className="size-4 sm:size-5" />
            </button>
            <button
              type="button"
              onClick={() => navigate((embla) => embla.scrollNext())}
              aria-label={t("next")}
              className={cn(arrow, "right-2 sm:right-4")}
            >
              <ChevronRight className="size-4 sm:size-5" />
            </button>
          </>
        ) : null}
      </Carousel>

      {multiple ? (
        <>
          <div className="mt-4 flex items-start justify-between gap-4">
            <motion.p
              key={selected}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              aria-live="polite"
              className="text-muted-foreground text-sm text-pretty"
            >
              {slide.alt}
            </motion.p>
            <span className="text-muted-foreground shrink-0 font-mono text-xs tabular-nums">
              {selected + 1} / {count}
            </span>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {slides.map((s, i) => {
              const active = i === selected;
              return (
                <button
                  key={s.src}
                  type="button"
                  onClick={() => navigate((embla) => embla.scrollTo(i))}
                  aria-label={t("goTo", { n: i + 1, alt: s.alt })}
                  aria-current={active}
                  className={cn(
                    "bg-muted relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border transition-all duration-300",
                    active
                      ? "border-primary ring-primary/30 -translate-y-0.5 ring-2"
                      : "border-border/60 opacity-55 hover:opacity-100"
                  )}
                >
                  <Image src={s.src} alt="" fill sizes="96px" className="object-cover object-top" />
                  {active && !reduced ? (
                    // Atada al temporizador del autoplay: pausa y reinicia con él
                    <span
                      key={timer.key}
                      aria-hidden
                      className="carousel-progress bg-primary absolute inset-x-0 bottom-0 h-0.5"
                      style={{
                        animationDuration: `${timer.ms}ms`,
                        animationPlayState: timer.paused ? "paused" : "running",
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
