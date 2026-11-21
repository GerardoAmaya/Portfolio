import { Fragment } from "react";
import { BookOpenText, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CaseBrief } from "@/data/projects";
import { readingMinutes, splitEmphasis } from "@/lib/case-brief";
import { cn } from "@/lib/utils";

type CaseTexts = { problem: string; solution: string; outcome: string };

/**
 * Problema, solución y resultado de un caso de estudio.
 *
 * Los casos cortos se ven en tres tarjetas con su texto completo. Los largos
 * muestran su resumen (`brief`): el problema a todo el ancho y solución y
 * resultado en dos columnas, con viñetas. El texto completo sigue en la
 * página dentro de un <details>: sin JS, con teclado y lector de pantalla
 * nativos, y lo cerrado no se lee.
 */
export function CaseStudy({ full, brief }: { full: CaseTexts; brief?: CaseBrief }) {
  const t = useTranslations("Projects.case");
  const titles: CaseTexts = {
    problem: t("problem"),
    solution: t("solution"),
    outcome: t("outcome"),
  };

  if (!brief) {
    return (
      <div className="reveal-children grid gap-10 md:grid-cols-3">
        <CaseBlock title={titles.problem} text={full.problem} />
        <CaseBlock title={titles.solution} text={full.solution} />
        <CaseBlock title={titles.outcome} text={full.outcome} />
      </div>
    );
  }

  const sections = (["problem", "solution", "outcome"] as const).map((key) => ({
    key,
    title: titles[key],
    text: full[key],
  }));
  const minutes = readingMinutes(sections.map((s) => s.text));

  return (
    <>
      <div className="reveal-children grid gap-6 md:grid-cols-2">
        <CaseBlock
          title={titles.problem}
          text={brief.problem}
          className="md:col-span-2"
          // Más grande solo cuando ocupa todo el ancho; apilado iguala a las otras
          textClassName="text-foreground/90 max-w-3xl text-pretty md:text-lg"
        />
        <CaseBlock
          title={titles.solution}
          text={brief.solution.lead}
          points={brief.solution.points}
          textClassName="text-foreground/90"
        />
        <CaseBlock
          title={titles.outcome}
          text={brief.outcome.lead}
          points={brief.outcome.points}
          textClassName="text-foreground/90"
        />
      </div>

      {/* Fuera de .reveal-children a propósito: esa animación depende del alto
          y al abrirse lo volvería a dejar a medio aparecer. El borde se
          ilumina solo con mouse: en pantallas táctiles el :hover se queda pegado */}
      <details className="case-story group border-border/60 bg-card/40 [@media(hover:hover)]:has-[>summary:hover]:border-primary/40 mt-6 rounded-xl border backdrop-blur transition-colors">
        <summary className="hover:text-primary flex cursor-pointer list-none items-center gap-3 rounded-xl px-6 py-4 transition-colors [&::-webkit-details-marker]:hidden">
          <BookOpenText aria-hidden className="text-primary size-4 shrink-0" />
          {/* El texto visible es el nombre accesible: cambia con el estado,
              y la otra variante queda con display:none, fuera del lector */}
          <span className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <span className="font-medium group-open:hidden">{t("showFull")}</span>
            <span className="hidden font-medium group-open:inline">{t("hideFull")}</span>
            <span className="text-muted-foreground font-mono text-xs group-open:hidden">
              {t("readingTime", { minutes })}
            </span>
          </span>
          <ChevronDown
            aria-hidden
            className="text-muted-foreground ml-auto size-4 shrink-0 transition-transform duration-300 group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>

        <dl className="border-border/60 grid gap-6 border-t px-6 py-6 sm:px-8 sm:py-8">
          {sections.map(({ key, title, text }) => (
            <div key={key} className="max-w-3xl">
              <dt className="text-primary text-sm font-semibold tracking-wide uppercase">
                {title}
              </dt>
              <dd className="text-muted-foreground mt-2 text-base leading-relaxed text-pretty">
                {text}
              </dd>
            </div>
          ))}
        </dl>
      </details>
    </>
  );
}

function CaseBlock({
  title,
  text,
  points,
  className,
  textClassName,
}: {
  title: string;
  /** Texto completo en los casos cortos; frase inicial en los resúmenes */
  text: string;
  points?: string[];
  className?: string;
  textClassName?: string;
}) {
  return (
    <div
      className={cn("border-border/60 bg-card/40 rounded-xl border p-6 backdrop-blur", className)}
    >
      <h2 className="text-primary text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <p className={cn("text-muted-foreground mt-3 text-base leading-relaxed", textClassName)}>
        <Emphasis text={text} />
      </p>
      {points?.length ? (
        // role="list": Safari quita la semántica de lista cuando no hay viñeta nativa
        <ul role="list" className="border-border/60 mt-4 space-y-2.5 border-t pt-4">
          {points.map((point) => (
            <li key={point} className="text-muted-foreground flex gap-3 text-sm leading-relaxed">
              <span aria-hidden className="bg-primary mt-[0.6em] size-1.5 shrink-0 rounded-full" />
              <span>
                <Emphasis text={point} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Texto con las **cifras** del resumen resaltadas */
function Emphasis({ text }: { text: string }) {
  return splitEmphasis(text).map((part, i) =>
    part.strong ? (
      <strong key={i} className="text-foreground font-semibold">
        {part.text}
      </strong>
    ) : (
      <Fragment key={i}>{part.text}</Fragment>
    )
  );
}
