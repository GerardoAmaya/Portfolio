import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — ${site.role}`,
    short_name: site.name,
    description:
      "Portafolio de Gerardo Amaya, desarrollador fullstack: proyectos, experiencia y stack.",
    // El sitio no tiene ruta sin locale: entrar por "/" solo provoca un redirect extra
    start_url: `/${routing.defaultLocale}`,
    scope: "/",
    display: "standalone",
    lang: routing.defaultLocale,
    background_color: "#0b0a0f",
    theme_color: "#0b0a0f",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      // El glifo deja zona segura suficiente para el recorte de Android
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
