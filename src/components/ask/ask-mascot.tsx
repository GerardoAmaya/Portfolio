"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Robot del botón flotante del asistente, con más vida que RobotIcon (que se
 * queda para el panel y los mensajes, donde no debe distraer):
 *
 * - Cara blanca con ojos oscuros y un reflejo, que siguen el cursor por toda
 *   la página y vuelven al centro cuando el mouse se queda quieto.
 * - Parpadeo a intervalos irregulares, a veces doble.
 * - `happy` (mouse encima): ojos ^ ^, un saltito y la antena destella y saluda.
 * - `love` (clic): ojos de corazón un instante, antes de abrir el panel.
 * - Sin actividad durante un minuto se duerme (ojos cerrados y una "z" que
 *   flota) y despierta con cualquier movimiento.
 *
 * Con "reducir movimiento" no sigue el cursor ni parpadea, y las caras
 * cambian sin animación.
 */

const EYES = [12.2, 19.8] as const; // centro x de cada ojo
const EYE_Y = 15.6;
const MAX_LOOK = 1.8; // desplazamiento máximo de los ojos, en unidades del viewBox
const LOOK_RESET_MS = 1500;
const SLEEP_AFTER_MS = 60_000;
const INK = "var(--mascot-ink)";

type Mood = "idle" | "happy" | "love" | "sleep";

/** Trazo SVG a partir de comandos y números, redondeados y separados por espacios. */
function path(...parts: (string | number)[]) {
  return parts.map((p) => (typeof p === "number" ? Number(p.toFixed(2)) : p)).join(" ");
}

const happyEye = (cx: number) =>
  path("M", cx - 2, EYE_Y + 1, "L", cx, EYE_Y - 1.4, "L", cx + 2, EYE_Y + 1);

const heartEye = (cx: number) =>
  path(
    "M",
    cx,
    EYE_Y + 2.3,
    "C",
    cx - 3.4,
    EYE_Y,
    cx - 2.2,
    EYE_Y - 3.3,
    cx,
    EYE_Y - 1.3,
    "C",
    cx + 2.2,
    EYE_Y - 3.3,
    cx + 3.4,
    EYE_Y,
    cx,
    EYE_Y + 2.3,
    "Z"
  );

const sleepyEye = (cx: number) =>
  path("M", cx - 2, EYE_Y + 0.4, "Q", cx, EYE_Y + 1.8, cx + 2, EYE_Y + 0.4);

export function AskMascot({
  happy = false,
  love = false,
  className,
}: {
  happy?: boolean;
  love?: boolean;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const svgRef = React.useRef<SVGSVGElement>(null);
  const lookRef = React.useRef<SVGGElement>(null);
  const [blinking, setBlinking] = React.useState(false);
  const [asleep, setAsleep] = React.useState(false);

  const mood: Mood = love ? "love" : happy ? "happy" : asleep ? "sleep" : "idle";

  // Los ojos siguen el cursor. Se escribe el transform directo en el DOM, una
  // vez por frame, para no volver a renderizar React en cada movimiento.
  React.useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let reset: number | undefined;
    let last: { x: number; y: number } | null = null;

    const apply = () => {
      frame = 0;
      const svg = svgRef.current;
      const look = lookRef.current;
      if (!svg || !look || !last) return;
      const rect = svg.getBoundingClientRect();
      const dx = last.x - (rect.left + rect.width / 2);
      const dy = last.y - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      // Cerca del robot los ojos se mueven menos, para que no bizquee
      const scale = (Math.min(1, distance / 160) * MAX_LOOK) / distance;
      look.style.transform = `translate(${(dx * scale).toFixed(2)}px, ${(dy * scale).toFixed(2)}px)`;
    };

    const onMove = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      if (!frame) frame = requestAnimationFrame(apply);
      window.clearTimeout(reset);
      reset = window.setTimeout(() => {
        if (lookRef.current) lookRef.current.style.transform = "";
      }, LOOK_RESET_MS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      window.clearTimeout(reset);
    };
  }, [reduced]);

  // Parpadeo a intervalos irregulares; uno de cada tres es doble
  React.useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));
    const blink = () => {
      setBlinking(true);
      later(() => setBlinking(false), 140);
    };
    const schedule = () =>
      later(
        () => {
          blink();
          if (Math.random() < 0.33) later(blink, 280);
          schedule();
        },
        2400 + Math.random() * 3600
      );
    schedule();
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [reduced]);

  // Se duerme tras un minuto sin actividad y despierta con cualquier gesto
  React.useEffect(() => {
    let timer: number | undefined;
    let sleeping = false;
    const wake = () => {
      if (sleeping) {
        sleeping = false;
        setAsleep(false);
      }
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        sleeping = true;
        setAsleep(true);
      }, SLEEP_AFTER_MS);
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll", "touchstart"] as const;
    for (const name of events) window.addEventListener(name, wake, { passive: true });
    wake();
    return () => {
      for (const name of events) window.removeEventListener(name, wake);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      data-mood={mood}
      className={cn("ask-mascot overflow-visible", className)}
    >
      {/* antena: destella y saluda al pasar el mouse */}
      <g className="mascot-antenna">
        <line
          x1="16"
          y1="3.5"
          x2="16"
          y2="8"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle className="mascot-bulb" cx="16" cy="3.2" r="2" fill="currentColor" />
      </g>
      {/* orejas y cara */}
      <rect x="2" y="14" width="2.5" height="6" rx="1.25" fill="currentColor" />
      <rect x="27.5" y="14" width="2.5" height="6" rx="1.25" fill="currentColor" />
      <rect x="5" y="8" width="22" height="18" rx="6.5" fill="currentColor" />

      {mood === "idle" ? (
        <g ref={lookRef} className="mascot-look">
          <g className={cn("mascot-eyes", blinking && "is-blinking")}>
            {EYES.map((cx) => (
              <g key={cx}>
                <rect x={cx - 2.2} y={EYE_Y - 2.9} width="4.4" height="5.8" rx="2.2" fill={INK} />
                {/* reflejo */}
                <circle cx={cx + 0.8} cy={EYE_Y - 1.4} r="0.9" fill="currentColor" />
              </g>
            ))}
          </g>
        </g>
      ) : null}

      {mood === "happy" ? (
        <g stroke={INK} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {EYES.map((cx) => (
            <path key={cx} d={happyEye(cx)} />
          ))}
        </g>
      ) : null}

      {mood === "love" ? (
        <g className="mascot-hearts" fill="var(--mascot-heart)">
          {EYES.map((cx) => (
            <path key={cx} d={heartEye(cx)} />
          ))}
        </g>
      ) : null}

      {mood === "sleep" ? (
        <>
          <g stroke={INK} strokeWidth="1.6" strokeLinecap="round">
            {EYES.map((cx) => (
              <path key={cx} d={sleepyEye(cx)} />
            ))}
          </g>
          <g className="mascot-z" fill="currentColor" fontWeight="700" fontFamily="inherit">
            {/* A la izquierda: arriba a la derecha está la insignia "IA" */}
            <text x="0.5" y="7.5" fontSize="8.5">
              z
            </text>
            <text x="-4" y="1" fontSize="6">
              z
            </text>
          </g>
        </>
      ) : null}

      {/* sonrisa: dormido se relaja */}
      <path
        d={mood === "sleep" ? "M14 21.6c1.2 0.6 2.8 0.6 4 0" : "M12.5 21.2c1.9 1.4 5.1 1.4 7 0"}
        stroke={INK}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
