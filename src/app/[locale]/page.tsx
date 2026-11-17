import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/hero";
import { Highlights } from "@/components/sections/highlights";
import { Manifesto } from "@/components/sections/manifesto";
import { TechStack } from "@/components/sections/tech-stack";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { Certifications } from "@/components/sections/certifications";
import { CtaSection } from "@/components/sections/cta";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <Manifesto />
      <Highlights />
      <TechStack />
      <FeaturedProjects />
      <Certifications />
      <CtaSection />
    </>
  );
}
