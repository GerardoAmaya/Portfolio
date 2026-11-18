import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Las fuentes Geist de la imagen OG se leen del disco en tiempo de ejecución:
  // hay que incluirlas en el bundle de la función para que existan en Netlify
  outputFileTracingIncludes: {
    "/og": ["./src/app/og/fonts/**/*"],
  },
  // El CV vivía en /resume.pdf: los enlaces ya compartidos llevan al CV en inglés
  async redirects() {
    return [{ source: "/resume.pdf", destination: "/cv/gerardo-amaya-en.pdf", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
