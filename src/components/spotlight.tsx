"use client";

import * as React from "react";

/**
 * Contenedor que hace que las tarjetas con `data-spotlight` sigan al cursor
 * con un brillo suave (ver .spotlight en globals.css). Un solo listener para
 * todo el grupo.
 */
export function SpotlightGroup({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-spotlight]");
    if (!card) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  }

  return (
    <div className={className} onPointerMove={onPointerMove}>
      {children}
    </div>
  );
}
