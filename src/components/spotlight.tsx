"use client";

import * as React from "react";

const MAX_TILT = 6; // grados

/**
 * Contenedor que hace que las tarjetas con `data-spotlight` sigan al cursor
 * con un brillo suave (ver .spotlight en globals.css) y, si además tienen la
 * clase .tilt, se inclinen un poco en 3D. Un solo listener para todo el grupo
 * y solo con mouse: en pantallas táctiles no hace nada.
 */
export function SpotlightGroup({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const current = React.useRef<HTMLElement | null>(null);

  function reset(card: HTMLElement | null) {
    card?.style.setProperty("--tilt-x", "0deg");
    card?.style.setProperty("--tilt-y", "0deg");
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (card !== current.current) {
      reset(current.current);
      current.current = card;
    }
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty("--spot-x", `${x}px`);
    card.style.setProperty("--spot-y", `${y}px`);
    // -0.5..0.5 desde el centro: el borde bajo el cursor "se hunde"
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    card.style.setProperty("--tilt-x", `${(-py * MAX_TILT * 2).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(px * MAX_TILT * 2).toFixed(2)}deg`);
  }

  function onPointerLeave() {
    reset(current.current);
    current.current = null;
  }

  return (
    <div className={className} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
      {children}
    </div>
  );
}
