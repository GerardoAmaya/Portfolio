import { ScrollReset } from "@/components/scroll-reset";

/**
 * Se vuelve a montar en cada navegación: su animación es la transición entre
 * páginas (ver .page-enter en globals.css) y ScrollReset deja la página nueva
 * arriba del todo.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollReset />
      <div className="page-enter">{children}</div>
    </>
  );
}
