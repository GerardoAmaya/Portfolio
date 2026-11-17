"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

/**
 * Títulos que suben desde una máscara la primera vez que entran en pantalla.
 *
 * Solo se esconden los que al cargar están fuera de la vista: los visibles no
 * parpadean y, sin JS, todo se ve normal. Un único IntersectionObserver para
 * toda la página; cada título se anima una vez (transform) y se olvida.
 */
export function Rise({ children }: { children: React.ReactNode }) {
  return (
    <span data-rise className="rise">
      <span className="rise-inner">{children}</span>
    </span>
  );
}

/** Va en el layout: prepara los títulos de cada página nueva. */
export function RiseObserver() {
  const pathname = usePathname();

  React.useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove("rise-pending");
          entry.target.classList.add("rise-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" }
    );

    const frame = requestAnimationFrame(() => {
      for (const el of document.querySelectorAll<HTMLElement>("[data-rise]:not(.rise-in)")) {
        if (el.getBoundingClientRect().top < window.innerHeight) continue;
        el.classList.add("rise-pending");
        observer.observe(el);
      }
    });

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
