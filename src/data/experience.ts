import type { Locale } from "@/i18n/routing";

export type Experience = {
  id: string;
  startDate: string;
  endDate: string | null;
  company: string;
  i18n: Record<
    Locale,
    {
      role: string;
      description: string;
    }
  >;
};

export type Education = {
  id: string;
  startDate: string;
  endDate: string;
  institution: string;
  i18n: Record<
    Locale,
    {
      degree: string;
      description?: string;
    }
  >;
};

export const experiences: Experience[] = [
  {
    id: "goes",
    startDate: "2023",
    endDate: null,
    company: "Gobierno de El Salvador (GOES)",
    i18n: {
      es: {
        role: "Fullstack Developer",
        description:
          "Desarrollo y mantenimiento de aplicaciones web. Diseño de APIs REST, integraciones y mejoras de UX en interfaces existentes.",
      },
      en: {
        role: "Fullstack Developer",
        description:
          "Build and maintain internal web applications. Design REST APIs, integrations and UX improvements on existing interfaces.",
      },
    },
  },
];

export const education: Education[] = [
  {
    id: "ufg",
    startDate: "2021",
    endDate: "2025",
    institution: "Universidad Francisco Gavidia (UFG)",
    i18n: {
      es: {
        degree: "Ingeniería en Sistemas Informáticos",
        description:
          "Formación integral en desarrollo de software, bases de datos, redes y arquitectura de sistemas.",
      },
      en: {
        degree: "Computer Systems Engineering",
        description:
          "Comprehensive training in software development, databases, networking and systems architecture.",
      },
    },
  },
];
