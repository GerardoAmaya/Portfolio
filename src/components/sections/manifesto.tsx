"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Frase grande que se "enciende" palabra por palabra al hacer scroll
 * (GSAP ScrollTrigger con scrub). La sección es alta y el texto va en un
 * contenedor sticky, así queda fijo mientras se completa sin usar el pin de
 * GSAP (que se rompe dentro de contenedores con transform).
 *
 * El texto marca las palabras clave entre *asteriscos*. Sin JS o con
 * movimiento reducido, la frase se ve completa desde el inicio.
 */
export function Manifesto() {
  const t = useTranslations("Home.manifesto");
  const section = React.useRef<HTMLElement>(null);

  const words = React.useMemo(() => {
    // "a *b c*, d" → a, b(hl), c(hl) + "," pegada, d. `attach` = sin espacio
    // antes, para que la puntuación no quede separada de la palabra resaltada
    const tokens: { word: string; highlight: boolean; attach: boolean }[] = [];
    let previousEndsWithSpace = true;
    for (const chunk of t("text")
      .split(/(\*[^*]+\*)/)
      .filter(Boolean)) {
      const highlight = chunk.startsWith("*");
      const plain = chunk.replace(/\*/g, "");
      plain.split(" ").forEach((word, j) => {
        if (!word) return;
        const attach = j === 0 && !previousEndsWithSpace && !plain.startsWith(" ");
        tokens.push({ word, highlight, attach });
      });
      previousEndsWithSpace = plain.endsWith(" ");
    }
    return tokens;
  }, [t]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Solo opacidad: es lo único que el navegador anima sin redibujar el
        // texto. Blur o text-shadow por palabra en cada cuadro del scroll
        // obligan a repintar y traban el scroll.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: section.current,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          })
          .fromTo(".mf-word", { opacity: 0.12 }, { opacity: 1, stagger: 0.12, ease: "none" })
          .fromTo(".mf-progress", { scaleX: 0 }, { scaleX: 1, ease: "none" }, 0)
          // Pausa: la frase completa queda un momento antes de soltar la sección
          .to({}, { duration: 0.8 });
      });
    },
    { scope: section }
  );

  return (
    <section
      ref={section}
      aria-labelledby="manifesto-eyebrow"
      className="border-border/60 relative h-[170svh] border-t md:h-[230svh]"
    >
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[60vh] w-[80vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.706 0.213 293.756 / 0.25), transparent)",
          }}
        />
        <div className="container-app">
          <p
            id="manifesto-eyebrow"
            className="text-primary text-xs font-semibold tracking-[0.2em] uppercase"
          >
            {t("eyebrow")}
          </p>
          <p className="mt-6 max-w-5xl text-3xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {words.map(({ word, highlight, attach }, i) => (
              <React.Fragment key={i}>
                {i > 0 && !attach ? " " : null}
                <span
                  className={highlight ? "mf-word text-primary" : "mf-word"}
                  data-hl={highlight ? "" : undefined}
                >
                  {word}
                </span>
              </React.Fragment>
            ))}
          </p>
          <div className="bg-border/60 mt-10 h-px max-w-xs overflow-hidden">
            <div className="mf-progress bg-primary h-full origin-left" />
          </div>
        </div>
      </div>
    </section>
  );
}
