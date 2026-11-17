"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { routing } from "@/i18n/routing";

/*
 * Next solo hace scroll al tope si el inicio de la página nueva no "se ve".
 * Con el header sticky encima, a veces se ve según Next pero queda tapado por
 * el menú. Esto lleva al tope en cada navegación nueva.
 *
 * - Primera carga: no se toca (el navegador restaura el scroll al recargar).
 * - Atrás / adelante (popstate): no se toca (Next restaura la posición).
 * - Cambio de idioma (misma página, otro locale): se queda donde estaba.
 */
let lastPage: string | null = null;
let cameFromHistory = false;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    cameFromHistory = true;
  });
}

const LOCALE_PREFIX = new RegExp(`^/(${routing.locales.join("|")})(?=/|$)`);

export function ScrollReset() {
  const pathname = usePathname();

  React.useEffect(() => {
    const page = pathname.replace(LOCALE_PREFIX, "") || "/";
    const previous = lastPage;
    lastPage = page;

    if (previous === null || previous === page) return;
    if (cameFromHistory) {
      cameFromHistory = false;
      return;
    }
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}
