"use client";

import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const STRENGTH = 0.25; // fracción de la distancia al centro
const MAX_OFFSET = 10; // px

/**
 * Hace que su contenido se acerque un poco al cursor y vuelva con un resorte
 * al salir. Solo con mouse; en táctil o con movimiento reducido no hace nada.
 */
export function Magnetic({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAX_OFFSET, Math.min(MAX_OFFSET, v));
    x.set(clamp((e.clientX - rect.left - rect.width / 2) * STRENGTH));
    y.set(clamp((e.clientY - rect.top - rect.height / 2) * STRENGTH));
  }

  function onPointerLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      className="inline-flex"
      style={{ x: springX, y: springY }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </motion.div>
  );
}
