import { site } from "@/lib/site";
import { SITE_URL } from "@/lib/utils";

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: site.name,
    url: SITE_URL,
    email: `mailto:${site.email}`,
    jobTitle: site.role,
    address: { "@type": "PostalAddress", addressCountry: "SV" },
    sameAs: [site.social.github, site.social.linkedin],
    knowsAbout: [
      "PHP",
      "Laravel",
      "Node.js",
      "Nest.js",
      "Express",
      "React",
      "Next.js",
      "Vue.js",
      "TypeScript",
      "Tailwind CSS",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
      "Google Cloud",
      "Cybersecurity",
      "OWASP Top 10",
      "OWASP API Security",
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
