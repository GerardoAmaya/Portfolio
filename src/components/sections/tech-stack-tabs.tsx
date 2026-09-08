"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { Database, ShieldCheck, Webhook } from "lucide-react";
import { FaAws } from "react-icons/fa6";
import {
  SiBootstrap,
  SiCss,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiGooglecloud,
  SiHtml5,
  SiJavascript,
  SiJsonwebtokens,
  SiLaravel,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNetlify,
  SiNextdotjs,
  SiNodedotjs,
  SiOwasp,
  SiPhp,
  SiPostgresql,
  SiPostman,
  SiPython,
  SiReact,
  SiSwagger,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs,
} from "react-icons/si";
import { skills, type SkillCategory } from "@/data/skills";
import { cn } from "@/lib/utils";

type TechIcon = ComponentType<{ className?: string; style?: React.CSSProperties }>;

type TechMeta = {
  icon: TechIcon;
  /** Color de marca; si se omite se usa el color del tema (útil para logos negros) */
  color?: string;
};

// Mapa de tecnología → logo y color de marca
const TECH_META: Record<string, TechMeta> = {
  React: { icon: SiReact, color: "#61DAFB" },
  "Next.js": { icon: SiNextdotjs },
  "Vue.js": { icon: SiVuedotjs, color: "#4FC08D" },
  TypeScript: { icon: SiTypescript, color: "#3178C6" },
  JavaScript: { icon: SiJavascript, color: "#F7DF1E" },
  HTML: { icon: SiHtml5, color: "#E34F26" },
  CSS: { icon: SiCss, color: "#663399" },
  "Tailwind CSS": { icon: SiTailwindcss, color: "#06B6D4" },
  Bootstrap: { icon: SiBootstrap, color: "#7952B3" },
  PHP: { icon: SiPhp, color: "#777BB4" },
  Laravel: { icon: SiLaravel, color: "#FF2D20" },
  "Node.js": { icon: SiNodedotjs, color: "#5FA04E" },
  "Nest.js": { icon: SiNestjs, color: "#E0234E" },
  Express: { icon: SiExpress },
  Python: { icon: SiPython, color: "#3776AB" },
  "REST APIs": { icon: Webhook },
  AWS: { icon: FaAws, color: "#FF9900" },
  "Google Cloud": { icon: SiGooglecloud, color: "#4285F4" },
  Netlify: { icon: SiNetlify, color: "#00C7B7" },
  Vercel: { icon: SiVercel },
  MySQL: { icon: SiMysql, color: "#4479A1" },
  PostgreSQL: { icon: SiPostgresql, color: "#4169E1" },
  Oracle: { icon: Database, color: "#F80000" },
  MongoDB: { icon: SiMongodb, color: "#47A248" },
  "OWASP Top 10": { icon: SiOwasp },
  "OWASP API Security": { icon: SiOwasp },
  "Security Testing": { icon: ShieldCheck, color: "#16A34A" },
  "JWT & Auth": { icon: SiJsonwebtokens, color: "#D63AFF" },
  Git: { icon: SiGit, color: "#F05032" },
  GitHub: { icon: SiGithub },
  Docker: { icon: SiDocker, color: "#2496ED" },
  Postman: { icon: SiPostman, color: "#FF6C37" },
  Swagger: { icon: SiSwagger, color: "#85EA2C" },
  "CI/CD": { icon: SiGithubactions, color: "#2088FF" },
};

// Orden de las pestañas
const CATEGORIES: SkillCategory[] = [
  "backend",
  "frontend",
  "databases",
  "cloud",
  "security",
  "tools",
];

type TechStackTabsProps = {
  labels: Record<SkillCategory, string>;
  /** Nombre accesible del grupo de pestañas */
  ariaLabel: string;
};

export function TechStackTabs({ labels, ariaLabel }: TechStackTabsProps) {
  const [active, setActive] = useState<SkillCategory>("backend");
  const tabRefs = useRef<Partial<Record<SkillCategory, HTMLButtonElement | null>>>({});
  const listRef = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const items = skills.filter((s) => s.category === active);

  // El indicador activo se posiciona midiendo la pestaña, para animarlo con
  // una transición CSS en vez de una librería de animación
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const update = () => {
      const el = tabRefs.current[active];
      if (!el) return;
      setPill({
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(list);
    return () => observer.disconnect();
  }, [active]);

  // Navegación con flechas dentro del tablist, como pide el patrón ARIA
  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const i = CATEGORIES.indexOf(active);
    const last = CATEGORIES.length - 1;
    let next: SkillCategory | undefined;

    if (e.key === "ArrowRight") next = CATEGORIES[i === last ? 0 : i + 1];
    else if (e.key === "ArrowLeft") next = CATEGORIES[i === 0 ? last : i - 1];
    else if (e.key === "Home") next = CATEGORIES[0];
    else if (e.key === "End") next = CATEGORIES[last];

    if (!next) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      {/* Barra de pestañas */}
      <div
        ref={listRef}
        role="tablist"
        aria-label={ariaLabel}
        className="border-border/60 bg-card/40 relative inline-flex max-w-full flex-wrap gap-1 rounded-full border p-1 backdrop-blur"
      >
        {pill ? (
          <span
            aria-hidden
            className="bg-primary absolute top-0 left-0 rounded-full transition-[transform,width,height] duration-300 ease-out"
            style={{
              transform: `translate(${pill.left}px, ${pill.top}px)`,
              width: pill.width,
              height: pill.height,
            }}
          />
        ) : null}
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              id={`tech-tab-${cat}`}
              ref={(el) => {
                tabRefs.current[cat] = el;
              }}
              role="tab"
              aria-selected={isActive}
              // Solo el panel activo existe en el DOM
              aria-controls={isActive ? `tech-panel-${cat}` : undefined}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(cat)}
              onKeyDown={onKeyDown}
              className={cn(
                "relative z-10 rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
                // Antes de hidratar no hay medida: el activo lleva su propio fondo
                isActive && !pill && "bg-primary"
              )}
            >
              {labels[cat]}
            </button>
          );
        })}
      </div>

      {/* Grid de cards */}
      <div
        key={active}
        id={`tech-panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tech-tab-${active}`}
        tabIndex={0}
        className="animate-enter-sm mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
      >
        {items.map((skill, i) => {
          const meta = TECH_META[skill.name];
          const Icon = meta?.icon;
          return (
            <div
              key={skill.name}
              style={{ "--enter-delay": `${i * 0.04}s` } as React.CSSProperties}
              className="animate-enter-sm group border-border/60 bg-card/40 hover:border-primary/40 hover:shadow-primary/5 flex flex-col items-center gap-3 rounded-xl border p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {Icon && (
                <Icon
                  aria-hidden
                  className="text-foreground size-8 transition-transform duration-300 group-hover:scale-110"
                  style={meta.color ? { color: meta.color } : undefined}
                />
              )}
              <span className="text-center text-sm font-medium">{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
