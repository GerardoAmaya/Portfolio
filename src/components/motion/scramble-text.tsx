"use client";

import * as React from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";
const DURATION = 450; // ms
const STEP = 30; // ms entre cuadros

/**
 * Texto que se "decodifica" al pasar el mouse por su enlace: las letras se
 * mezclan con símbolos de código y se acomodan de izquierda a derecha.
 * Solo cambia el texto unas 15 veces y termina: costo prácticamente nulo.
 */
export function ScrambleText({ text, className }: { text: string; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    const trigger = el?.closest("a");
    if (!el || !trigger) return;
    let timer: number | undefined;

    function run() {
      if (timer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const start = performance.now();
      timer = window.setInterval(() => {
        const progress = Math.min(1, (performance.now() - start) / DURATION);
        const settled = Math.floor(progress * text.length);
        el!.textContent = [...text]
          .map((char, i) =>
            i < settled || char === "." ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("");
        if (progress === 1) {
          window.clearInterval(timer);
          timer = undefined;
          el!.textContent = text;
        }
      }, STEP);
    }

    trigger.addEventListener("mouseenter", run);
    return () => {
      trigger.removeEventListener("mouseenter", run);
      window.clearInterval(timer);
    };
  }, [text]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
