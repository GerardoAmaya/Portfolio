import { cn } from "@/lib/utils";

/**
 * Robot propio del asistente (SVG original). Los ojos parpadean y la antena
 * brilla con las clases .robot-eye y .robot-antenna (ver globals.css).
 * `thinking` cambia los ojos por tres puntos que rebotan.
 */
export function RobotIcon({
  className,
  thinking = false,
}: {
  className?: string;
  thinking?: boolean;
}) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden className={cn("robot", className)}>
      {/* antena */}
      <line
        x1="16"
        y1="3.5"
        x2="16"
        y2="8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle className="robot-antenna" cx="16" cy="3.2" r="2" fill="currentColor" />
      {/* cabeza */}
      <rect x="5" y="8" width="22" height="18" rx="6.5" stroke="currentColor" strokeWidth="2" />
      {/* orejas */}
      <rect x="2" y="14" width="2.5" height="6" rx="1.25" fill="currentColor" />
      <rect x="27.5" y="14" width="2.5" height="6" rx="1.25" fill="currentColor" />
      {thinking ? (
        <g fill="currentColor">
          <circle className="robot-dot" cx="11.5" cy="16" r="1.6" />
          <circle
            className="robot-dot"
            cx="16"
            cy="16"
            r="1.6"
            style={{ animationDelay: "0.15s" }}
          />
          <circle
            className="robot-dot"
            cx="20.5"
            cy="16"
            r="1.6"
            style={{ animationDelay: "0.3s" }}
          />
        </g>
      ) : (
        <g className="robot-eyes" fill="currentColor">
          <rect className="robot-eye" x="10.5" y="13" width="3.4" height="5" rx="1.7" />
          <rect className="robot-eye" x="18.1" y="13" width="3.4" height="5" rx="1.7" />
        </g>
      )}
      {/* sonrisa */}
      <path
        d="M12.5 21.5c1.9 1.4 5.1 1.4 7 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
