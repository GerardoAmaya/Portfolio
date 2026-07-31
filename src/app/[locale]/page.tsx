import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { TechStack } from "@/components/sections/tech-stack";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { CtaSection } from "@/components/sections/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Highlights />
      <TechStack />
      <FeaturedProjects />
      <CtaSection />
    </>
  );
}
