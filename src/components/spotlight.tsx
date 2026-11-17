"use client";

import * as React from "react";
import { animate } from "motion";

const MAX_TILT = 6; // grados
const TILT_SPRING = { type: "spring", stiffness: 260, damping: 22, mass: 0.6 } as const;

/**
 * Contenedor que hace que las tarjetas con `data-spotlight` sigan al cursor
 * con un brillo suave (ver .spotlight en globals.css) y, si además tienen la
 * clase .tilt, se inclinen en 3D con un resorte (Motion). Un solo listener
 * para todo el grupo y solo con mouse: en pantallas táctiles no hace nada.
 */
export function SpotlightGroup({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const current = React.useRef<HTMLElement | null>(null);

  function canTilt(card: HTMLElement) {
    return (
      card.classList.contains("tilt") &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function tilt(card: HTMLElement, rotateX: number, rotateY: number) {
    animate(card, { rotateX, rotateY, transformPerspective: 900 }, TILT_SPRING);
  }

  function release(card: HTMLElement | null) {
    if (card && canTilt(card)) tilt(card, 0, 0);
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (card !== current.current) {
      release(current.current);
      current.current = card;
    }
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
    if (canTilt(card)) {
      // -0.5..0.5 desde el centro: el borde bajo el cursor "se hunde"
      const px = x / rect.width - 0.5;
      const py = y / rect.height - 0.5;
      tilt(card, -py * MAX_TILT * 2, px * MAX_TILT * 2);
    }
  }

  function onPointerLeave() {
    release(current.current);
    current.current = null;
  }

  return (
    <div className={className} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {children}
    </div>
  );
}
