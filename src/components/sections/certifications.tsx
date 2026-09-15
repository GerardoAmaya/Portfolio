import Image from "next/image";
import type { ComponentType } from "react";
import { ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { FaMicrosoft } from "react-icons/fa6";
import { SiCredly, SiGooglecloud } from "react-icons/si";
import { useFormatter, useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { certifications, credlyProfileUrl, type Certification } from "@/data/certifications";
import { cn } from "@/lib/utils";

/** Logo del emisor; los que no estén mapeados caen en un icono genérico */
const ISSUER_ICON: Record<
  string,
  { icon: ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }
> = {
  "Google Cloud": { icon: SiGooglecloud, color: "#4285F4" },
  Microsoft: { icon: FaMicrosoft, color: "#737373" },
};

/** Cuántas habilidades caben en una tarjeta destacada sin estorbar */
const MAX_SKILLS = 4;

function IssuerLine({ issuer, className }: { issuer: string; className?: string }) {
  const meta = ISSUER_ICON[issuer];
  const Icon = meta?.icon ?? ShieldCheck;

  return (
    <span className={cn("text-muted-foreground inline-flex items-center gap-1.5", className)}>
      <Icon className="size-3.5 shrink-0" style={meta ? { color: meta.color } : undefined} />
      {issuer}
    </span>
  );
}

/** La insignia con su resplandor; se enciende al pasar o enfocar la tarjeta */
function BadgeArt({ cert, className }: { cert: Certification; className?: string }) {
  return (
    <div className={cn("relative shrink-0", className)}>
      <span
        aria-hidden
        className="bg-primary/20 absolute inset-2 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <Image
        src={cert.image}
        alt=""
        width={128}
        height={128}
        sizes="128px"
        className="relative size-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

type CertificationsProps = {
  /**
   * `full` es la sección de la home, con jerarquía entre certificaciones e
   * insignias. `compact` es una sola rejilla para acompañar otra página.
   */
  variant?: "full" | "compact";
  className?: string;
};

export function Certifications({ variant = "full", className }: CertificationsProps) {
  const t = useTranslations("Certifications");
  const format = useFormatter();

  const issuers = new Set(certifications.map((c) => c.issuer));
  const formal = certifications.filter((c) => c.isCertification);
  const skillBadges = certifications.filter((c) => !c.isCertification);

  /** Las fechas vienen como día ISO; el mediodía evita saltos por zona horaria */
  const monthYear = (iso: string) =>
    format.dateTime(new Date(`${iso}T12:00:00`), { year: "numeric", month: "short" });

  const credlyLink = (
    <a
      href={credlyProfileUrl}
      target="_blank"
      rel="noreferrer"
      className="border-border/60 bg-card/60 hover:border-primary/40 hover:text-primary focus-visible:ring-ring inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium backdrop-blur transition-colors focus-visible:ring-2 focus-visible:outline-none"
    >
      <SiCredly className="size-4" aria-hidden />
      {t("viewProfile")}
      <ArrowUpRight className="size-4" aria-hidden />
    </a>
  );

  /** Tarjeta chica: la usan las insignias de habilidad y la variante compacta */
  const skillCard = (cert: Certification) => (
    <li key={cert.id}>
      <a
        href={cert.url}
        target="_blank"
        rel="noreferrer"
        className="group border-border/60 from-card/60 to-card/20 hover:border-primary/40 focus-visible:ring-ring relative flex h-full flex-col items-center rounded-xl border bg-gradient-to-b p-4 text-center backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowUpRight
          className="text-primary absolute top-3 right-3 size-3.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden
        />
        <BadgeArt cert={cert} className="size-24 sm:size-28" />
        <h4 className="mt-3 text-sm leading-snug font-semibold text-balance">{cert.name}</h4>
        <p className="text-muted-foreground/80 mt-auto pt-3 font-mono text-[11px] tracking-tight">
          {monthYear(cert.issuedAt)}
        </p>
      </a>
    </li>
  );

  if (variant === "compact") {
    return (
      <section className={className}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <BadgeCheck className="text-primary size-5" aria-hidden />
            <h2 className="text-2xl font-semibold tracking-tight">{t("title")}</h2>
          </div>
          {credlyLink}
        </div>

        <ul className="reveal-children grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {certifications.map(skillCard)}
        </ul>
      </section>
    );
  }

  return (
    <section
      id="certifications"
      className="border-border/60 bg-muted/20 relative overflow-hidden border-t py-20 md:py-28"
    >
      {/* Halo suave detrás del encabezado, del mismo acento del tema */}
      <div
        aria-hidden
        className="bg-primary/10 pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full blur-3xl"
      />

      <div className="container-app relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-primary flex items-center gap-2 text-sm font-medium">
              <BadgeCheck className="size-4" aria-hidden />
              {t("eyebrow")}
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {t("title")}
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              {t("subtitle", {
                total: certifications.length,
                issuers: issuers.size,
                certifications: formal.length,
              })}
            </p>
          </div>

          {credlyLink}
        </div>

        {/* Certificaciones formales: las que vencen o se llaman certificación */}
        <ul className="reveal-children mt-10 grid gap-4 lg:grid-cols-2">
          {formal.map((cert) => (
            <li key={cert.id}>
              <a
                href={cert.url}
                target="_blank"
                rel="noreferrer"
                className="group border-border/60 from-card/70 to-card/30 hover:border-primary/40 focus-visible:ring-ring relative flex h-full flex-col items-center gap-4 overflow-hidden rounded-2xl border bg-gradient-to-br p-5 text-center backdrop-blur transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:ring-2 focus-visible:outline-none sm:flex-row sm:items-start sm:gap-5 sm:p-6 sm:text-left"
              >
                {/* A 390 px la insignia va arriba: partir ese ancho en dos
                    columnas deja el nombre en tres líneas y las etiquetas de a una */}
                <ArrowUpRight
                  className="text-muted-foreground group-hover:text-primary absolute top-5 right-5 size-4 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />

                <BadgeArt cert={cert} className="size-24 sm:size-28" />

                <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
                  <h3 className="text-base leading-snug font-semibold text-balance sm:pr-6">
                    {cert.name}
                  </h3>

                  <IssuerLine issuer={cert.issuer} className="mt-1.5 text-sm" />

                  <p className="text-muted-foreground/80 mt-2 font-mono text-[11px] tracking-tight">
                    {t("issued", { date: monthYear(cert.issuedAt) })}
                    {cert.expiresAt
                      ? ` · ${t("expires", { date: monthYear(cert.expiresAt) })}`
                      : null}
                  </p>

                  {cert.skills.length > 0 ? (
                    <div className="mt-auto flex flex-wrap justify-center gap-1.5 pt-4 sm:justify-start">
                      {cert.skills.slice(0, MAX_SKILLS).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                      {cert.skills.length > MAX_SKILLS ? (
                        <Badge variant="outline">+{cert.skills.length - MAX_SKILLS}</Badge>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Insignias de habilidad: mismo origen, menos peso */}
        {skillBadges.length > 0 ? (
          <>
            <div className="mt-12 flex items-center gap-3">
              <h3 className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
                {t("skillBadgesLabel")}
              </h3>
              <span className="text-muted-foreground/70 font-mono text-xs">
                {skillBadges.length}
              </span>
              <span aria-hidden className="bg-border/60 h-px flex-1" />
            </div>

            <ul className="reveal-children mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {skillBadges.map(skillCard)}
            </ul>
          </>
        ) : null}
      </div>
    </section>
  );
}
