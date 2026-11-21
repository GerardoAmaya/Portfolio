import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, KeyRound, Play } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CaseStudy } from "@/components/case-study";
import { ProjectCarousel } from "@/components/project-carousel";
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
          <span className="font-mono">{project.year}</span>
          <span aria-hidden>·</span>
          <span>{i18n.role}</span>
        </div>
        <h1
          className="mt-3 text-4xl font-bold tracking-tight text-balance sm:text-5xl"
          style={{ viewTransitionName: "project-title" }}
        >
          {i18n.title}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-lg text-pretty">{i18n.tagline}</p>
        <div className="mt-6 flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <Badge key={s} variant="outline" className="font-mono text-[11px] font-normal">
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
          {project.extraLinks?.map((link) => (
            <Button key={link.href} asChild size="sm" variant="outline">
              <a href={link.href} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" /> {link.label[locale]}
              </a>
            </Button>
          ))}
        </div>
        {project.demoLogin ? (
          <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm">
            <KeyRound className="size-4 shrink-0" aria-hidden />
            {project.demoLogin.hint[locale]}
            {/* select-all: un clic selecciona la contraseña entera para copiarla */}
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs select-all">
              {project.demoLogin.password}
            </code>
          </p>
        ) : null}
      </header>

      <div className="container-app pb-12">
        {project.gallery?.length ? (
          <ProjectCarousel
            title={i18n.title}
            slides={project.gallery.map((shot) => ({ src: shot.src, alt: shot.alt[locale] }))}
          />
        ) : (
          <div
            className="border-border/60 bg-muted relative aspect-video w-full overflow-hidden rounded-2xl border"
            style={{ viewTransitionName: "project-cover" }}
          >
            <Image
              src={project.cover}
              alt={i18n.title}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-contain"
              priority
            />
          </div>
        )}
      </div>

      <section className="container-app pb-24">
        <CaseStudy full={i18n} brief={project.brief?.[locale]} />
      </section>
    </article>
  );
}
