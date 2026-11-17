"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";

/**
 * Morph de tarjeta de proyecto a su página de detalle con la View Transitions
 * API: la portada y el título "vuelan" a su sitio en la página nueva.
 *
 * El navegador toma una foto del estado actual, se navega, y cuando la página
 * nueva ya está montada (NavigationWatcher detecta el cambio de ruta) anima
 * los elementos que comparten view-transition-name. Sin soporte, con
 * movimiento reducido o con Ctrl/Cmd+clic, es un enlace normal.
 */

let finishNavigation: (() => void) | null = null;

/** Va en el layout: avisa al morph de que la página nueva ya se montó. */
export function NavigationWatcher() {
  const pathname = usePathname();
  React.useEffect(() => {
    finishNavigation?.();
    finishNavigation = null;
  }, [pathname]);
  return null;
}

export function useProjectMorph(href: string) {
  const router = useRouter();

  return React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey ||
        !document.startViewTransition ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }
      e.preventDefault();

      const card = e.currentTarget;
      const cover = card.querySelector<HTMLElement>("[data-morph=cover]");
      const title = card.querySelector<HTMLElement>("[data-morph=title]");
      // El nombre propio de la tarjeta (filtro de /projects) se suelta para
      // que solo vuelen la portada y el título
      const ownName = card.style.viewTransitionName;
      card.style.viewTransitionName = "none";
      card.style.transform = "none";
      if (cover) cover.style.viewTransitionName = "project-cover";
      if (title) title.style.viewTransitionName = "project-title";

      const root = document.documentElement;
      root.classList.add("nav-morph");

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            finishNavigation = resolve;
            // Red de seguridad: si la ruta tarda, la transición no se queda colgada
            window.setTimeout(resolve, 2500);
            router.push(href);
          })
      );

      transition.finished.finally(() => {
        // La clase se quita cuando la animación de entrada de la página
        // (.page-enter) ya habría terminado, para que no se reinicie
        window.setTimeout(() => root.classList.remove("nav-morph"), 500);
        if (card.isConnected) {
          card.style.viewTransitionName = ownName;
          card.style.transform = "";
          if (cover) cover.style.viewTransitionName = "";
          if (title) title.style.viewTransitionName = "";
        }
      });
    },
    [href, router]
  );
}

/** Enlace de tarjeta de proyecto con morph, para usar desde componentes de servidor. */
export function ProjectCardLink({
  href,
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href" | "onClick"> & { href: string }) {
  const onClick = useProjectMorph(href);
  return <Link {...props} href={href} onClick={onClick} />;
}
