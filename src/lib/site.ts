export const site = {
  name: "Gerardo Amaya",
  fullName: "Gerardo Alberto Amaya Fuentes",
  role: "Fullstack Developer",
  email: "gerardoamayasv2000@gmail.com",
  location: "El Salvador",
  /**
   * CV por idioma (public/cv). Cambiar `v` al reemplazar un PDF para que los
   * navegadores no sirvan la copia en caché.
   */
  resume: {
    es: "/cv/gerardo-amaya-es.pdf?v=2026-11-17",
    en: "/cv/gerardo-amaya-en.pdf?v=2026-11-17",
  },
  /** Último cambio de contenido de las páginas estáticas (about, experience, contact) */
  contentUpdatedAt: "2026-09-08",
  social: {
    github: "https://github.com/GerardoAmaya",
    linkedin: "https://www.linkedin.com/in/gerardo-alberto-amaya-fuentes-20b292240",
  },
} as const;

/** CV en el idioma de la página; si el locale no tiene CV propio, el de inglés. */
export function resumeUrl(locale: string) {
  return locale in site.resume ? site.resume[locale as keyof typeof site.resume] : site.resume.en;
}
