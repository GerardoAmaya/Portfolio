import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Play } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getProject, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/metadata";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const i18n = project.i18n[locale];
  return pageMetadata({
    locale,
    path: `/projects/${project.slug}`,
    title: i18n.title,
    description: i18n.tagline,
    eyebrow: locale === "es" ? "PROYECTO" : "PROJECT",
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const project = getProject(slug);
  if (!project) notFound();

  const t = await getTranslations({ locale, namespace: "Projects" });
  const i18n = project.i18n[locale];

  return (
    <article>
      <div className="container-app pt-12 md:pt-16">
        <Button asChild variant="ghost" size="sm" className="-ml-3">
          <Link href="/projects">
            <ArrowLeft className="size-4" />
            {t("backToProjects")}
          </Link>
        </Button>
      </div>

      <header className="container-app pt-6 pb-8 md:pb-10">
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <span>{project.year}</span>
          <span aria-hidden>·</span>
          <span>{i18n.role}</span>
        </div>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
          {i18n.title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg text-pretty">{i18n.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="outline">
              {s}
            </Badge>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.videoUrl ? (
            <Button asChild size="sm">
              <a href={project.videoUrl} target="_blank" rel="noreferrer">
                <Play className="size-4" /> {t("viewVideo")}
              </a>
            </Button>
          ) : null}
          {project.repoUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={project.repoUrl} target="_blank" rel="noreferrer">
                <Github className="size-4" /> {t("viewCode")}
              </a>
            </Button>
          ) : null}
          {project.liveUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={project.liveUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" /> Live
              </a>
            </Button>
          ) : null}
        </div>
      </header>

      <div className="container-app pb-12">
        <div className="border-border/60 bg-muted relative aspect-video w-full overflow-hidden rounded-2xl border">
          <Image
            src={project.cover}
            alt={i18n.title}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>

      <section className="container-app pb-24">
        <div className="reveal-children grid gap-10 md:grid-cols-3">
          <CaseBlock title={locale === "es" ? "Problema" : "Problem"}>{i18n.problem}</CaseBlock>
          <CaseBlock title={locale === "es" ? "Solución" : "Solution"}>{i18n.solution}</CaseBlock>
          <CaseBlock title={locale === "es" ? "Resultado" : "Outcome"}>{i18n.outcome}</CaseBlock>
        </div>
      </section>
    </article>
  );
}

function CaseBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-border/60 bg-card/40 rounded-xl border p-6 backdrop-blur">
      <h2 className="text-primary text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <p className="text-muted-foreground mt-3 text-base leading-relaxed">{children}</p>
    </div>
  );
}
