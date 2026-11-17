import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // El CV vivía en /resume.pdf: los enlaces ya compartidos llevan al CV en inglés
  async redirects() {
    return [{ source: "/resume.pdf", destination: "/cv/gerardo-amaya-en.pdf", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withNextIntl(nextConfig);
