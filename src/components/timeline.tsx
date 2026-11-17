"use client";

import * as React from "react";

/**
 * Línea de tiempo vertical (experiencia y formación).
 *
 * Con JS y sin movimiento reducido, la línea dorada se dibuja según el scroll
 * y cada punto se enciende al alcanzarlo. Sin JS se ve completa y encendida.
 */
export function Timeline({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLOListElement>(null);

  React.useEffect(() => {
    const list = ref.current;
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = Array.from(list.querySelectorAll<HTMLElement>(":scope > li"));
    let frame = 0;

    const update = () => {
      frame = 0;
      // La "punta" de la línea va al 60% de la altura de la ventana
      const tip = window.innerHeight * 0.6;
      const rect = list.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (tip - rect.top) / rect.height));
      list.style.setProperty("--timeline-progress", progress.toFixed(4));
      for (const item of items) {
        item.toggleAttribute("data-reached", item.getBoundingClientRect().top + 12 <= tip);
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    list.dataset.animated = "";
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <ol ref={ref} className="timeline reveal-children relative space-y-6 pl-6">
      {children}
    </ol>
  );
}

export function TimelineItem({
  title,
  subtitle,
  period,
  children,
}: {
  title?: string;
  subtitle?: string;
  period?: string;
  children?: React.ReactNode;
}) {
  return (
    <li className="relative">
      <span className="timeline-dot border-background bg-primary absolute top-1.5 -left-[31px] size-3 rounded-full border-2" />
      <div className="border-border/60 bg-card/40 rounded-xl border p-5 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-semibold">{title}</h3>
          {period ? <span className="text-muted-foreground text-xs">{period}</span> : null}
        </div>
        {subtitle ? <p className="text-primary mt-1 text-sm font-medium">{subtitle}</p> : null}
        {children}
      </div>
    </li>
  );
}
