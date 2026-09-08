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
    id: "GOES",
    startDate: "2023",
    endDate: null,
    company: "GOES",
    i18n: {
      es: {
        role: "Fullstack Developer",
        description:
          "Desarrollo y mantenimiento de aplicaciones web internas: diseño de APIs REST, integraciones entre sistemas y mejoras de UX sobre interfaces existentes. Trabajo con Claude Code y Spec-Driven Development asistido por IA.",
      },
      en: {
        role: "Fullstack Developer",
        description:
          "Build and maintain internal web applications: REST API design, system integrations and UX improvements on existing interfaces. Working with Claude Code and AI-assisted Spec-Driven Development.",
      },
    },
  },
];

export const education: Education[] = [
  {
    id: "ufg",
    startDate: "2021",
    endDate: "2026",
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
