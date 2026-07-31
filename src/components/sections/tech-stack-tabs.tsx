"use client";

import { useState, type ComponentType } from "react";
import { AnimatePresence, motion } from "motion/react";
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
};

export function TechStackTabs({ labels }: TechStackTabsProps) {
  const [active, setActive] = useState<SkillCategory>("backend");
  const items = skills.filter((s) => s.category === active);

  return (
    <div>
      {/* Barra de pestañas */}
      <div
        role="tablist"
        aria-label={labels[active]}
        className="inline-flex max-w-full flex-wrap gap-1 rounded-full border border-border/60 bg-card/40 p-1 backdrop-blur"
      >
        {CATEGORIES.map((cat) => {
          const isActive = cat === active;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${cat}`}
              onClick={() => setActive(cat)}
              className={cn(
                "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tech-tab-pill"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{labels[cat]}</span>
            </button>
          );
        })}
      </div>

      {/* Grid de cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        >
          {items.map((skill, i) => {
            const meta = TECH_META[skill.name];
            const Icon = meta?.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.25 }}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card/40 p-5 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
              >
                {Icon && (
                  <Icon
                    aria-hidden
                    className="size-8 text-foreground transition-transform duration-300 group-hover:scale-110"
                    style={meta.color ? { color: meta.color } : undefined}
                  />
                )}
                <span className="text-center text-sm font-medium">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
