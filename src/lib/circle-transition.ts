/**
 * Transición circular con la View Transitions API: la vista nueva se revela en
 * un círculo que crece desde `origin` (el botón que se tocó). La usa el cambio
 * de tema.
 *
 * Sin soporte del navegador o con movimiento reducido, solo ejecuta `update`.
 */
export function circleTransition(
  origin: HTMLElement | null,
  update: () => void | Promise<void>,
  { duration = 600 }: { duration?: number } = {}
) {
  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!document.startViewTransition || reduce) {
    void update();
    return;
  }

  const rect = origin?.getBoundingClientRect();
  const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 48;
  const y = rect ? rect.top + rect.height / 2 : 32;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y)
  );

  root.classList.add("circle-transition");
  const transition = document.startViewTransition(update);

  transition.ready
    .then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration,
          easing: "cubic-bezier(0.65, 0, 0.35, 1)",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    })
    .catch(() => {});
  transition.finished.finally(() => root.classList.remove("circle-transition"));
}
