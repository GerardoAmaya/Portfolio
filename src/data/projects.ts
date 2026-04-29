import type { Locale } from "@/i18n/routing";

export type Project = {
  slug: string;
  year: string;
  cover: string;
  stack: string[];
  videoUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  i18n: Record<
    Locale,
    {
      title: string;
      tagline: string;
      role: string;
      problem: string;
      solution: string;
      outcome: string;
    }
  >;
};

export const projects: Project[] = [
  {
    slug: "nestjs-ai-pentest-skill",
    year: "2026",
    cover: "/projects/nestjs-ai-pentest-skill.png",
    stack: ["Claude AI", "NestJS", "Jest", "Node.js", "OWASP", "TypeScript"],
    repoUrl: "https://github.com/GerardoAmaya/nestjs-ai-pentest-skill",
    featured: true,
    i18n: {
      es: {
        title: "NestJS AI Pentest Skill",
        tagline:
          "Skill de Claude AI que lee proyectos NestJS y genera una suite Jest de pentest grado profesional, con reportes HTML/Excel auditables — Claude AI · NestJS · Jest · Node.js · OWASP.",
        role: "AI Skill Author · Security Engineering",
        problem:
          "Auditar la seguridad de una API NestJS suele requerir un especialista, varias herramientas y semanas de trabajo manual. No existía una forma rápida de mapear toda la superficie de seguridad de un proyecto y traducirla a evidencia accionable que un equipo de cumplimiento pueda revisar.",
        solution:
          "Construí una skill de Claude Code que mapea exhaustivamente controllers, DTOs, guards, pipes, interceptors, filters, middleware y entidades, y genera una suite Jest con tags OWASP Top 10 (2021), API Security Top 10 (2023) y un checklist propio de 60 ítems. Cada test guarda evidencia input/output en JSON, severidad, y N/A justificados con grep. El reporter empaqueta todo en un HTML auditable + Excel — sin servidor, sin dependencias externas.",
        outcome:
          "Cualquier equipo NestJS puede correr una auditoría de seguridad alineada con OWASP en minutos, no semanas. El reporte es un archivo único listo para enviarse por correo, adjuntarse a un ticket o anexarse a una entrega de cumplimiento.",
      },
      en: {
        title: "NestJS AI Pentest Skill",
        tagline:
          "Claude AI skill that reads NestJS projects and generates a pentest-grade Jest suite with auditable HTML/Excel reports — Claude AI · NestJS · Jest · Node.js · OWASP.",
        role: "AI Skill Author · Security Engineering",
        problem:
          "Auditing the security of a NestJS API typically requires a specialist, multiple tools and weeks of manual work. There was no quick way to map a project's full security surface and turn it into actionable evidence a compliance team can review.",
        solution:
          "Built a Claude Code skill that exhaustively maps controllers, DTOs, guards, pipes, interceptors, filters, middleware and entities, and generates a Jest suite tagged with OWASP Top 10 (2021), API Security Top 10 (2023) and a custom 60-item checklist. Each test captures input/output JSON evidence, severity, and grep-justified N/A items. The bundled reporter wraps everything into a single auditable HTML + Excel — no server, no external dependencies.",
        outcome:
          "Any NestJS team can run an OWASP-aligned security audit in minutes instead of weeks. The report is a single file ready to email, attach to a ticket or annex to a compliance delivery.",
      },
    },
  },
  {
    slug: "travel-quote-api",
    year: "2025",
    cover: "/projects/travel-quote-api.png",
    stack: ["Node.js", "Express", "Sequelize", "MySQL", "Docker", "REST API"],
    repoUrl: "https://github.com/GerardoAmaya/travel-quote-api",
    featured: true,
    i18n: {
      es: {
        title: "Travel Quote API",
        tagline:
          "API REST de cotizaciones para transporte turístico con arquitectura limpia y contenerizada — Node.js · Express · Sequelize · MySQL · Docker.",
        role: "Backend Developer",
        problem:
          "Una empresa de transporte turístico necesitaba un servicio robusto para gestionar cotizaciones que incluyera usuarios, lugares, vehículos, proveedores, coberturas, precios y categorías, con relaciones complejas entre entidades.",
        solution:
          "Diseñé una API REST en Node.js con Express y Sequelize ORM sobre MySQL. Modelado de datos relacional con migraciones y seeders, dockerización completa con docker-compose, documentación de endpoints en Postman y cobertura de pruebas.",
        outcome:
          "API lista para producción, fácil de levantar en cualquier entorno con un solo comando, con esquema documentado, datos semilla y pruebas automatizadas.",
      },
      en: {
        title: "Travel Quote API",
        tagline:
          "REST API for tourism transport quotations with a clean, containerized architecture — Node.js · Express · Sequelize · MySQL · Docker.",
        role: "Backend Developer",
        problem:
          "A tourism transport company needed a robust service to manage quotations involving users, places, vehicles, providers, coverages, prices and categories, with complex relationships between entities.",
        solution:
          "Designed a Node.js REST API with Express and Sequelize ORM on top of MySQL. Relational data modeling with migrations and seeders, full Dockerization via docker-compose, endpoint docs in Postman and automated test coverage.",
        outcome:
          "Production-ready API that spins up in any environment with a single command, with documented schema, seed data and automated tests.",
      },
    },
  },
  {
    slug: "safe-on-sivar",
    year: "2024",
    cover: "/projects/SafeOnSivar.jpg",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
    videoUrl: "https://youtu.be/OCd7V5g8RRU",
    featured: true,
    i18n: {
      es: {
        title: "Safe On Sivar",
        tagline:
          "Plataforma para reportar y consultar incidentes de seguridad en El Salvador — Laravel · PHP · MySQL · Bootstrap · JavaScript.",
        role: "Fullstack Developer",
        problem:
          "La información de seguridad ciudadana en El Salvador está dispersa y es difícil de consultar. Se necesitaba una herramienta que centralizara reportes y los hiciera accesibles.",
        solution:
          "Construí una aplicación Laravel + MySQL con autenticación, panel administrativo, geolocalización de reportes y dashboards. Frontend con Bootstrap y JS vanilla.",
        outcome:
          "Aplicación entregada con flujo completo de reporte, validación, visualización en mapa y métricas. Proyecto presentado como tesis universitaria.",
      },
      en: {
        title: "Safe On Sivar",
        tagline:
          "Platform to report and browse security incidents in El Salvador — Laravel · PHP · MySQL · Bootstrap · JavaScript.",
        role: "Fullstack Developer",
        problem:
          "Public-safety data in El Salvador is scattered and hard to query. A tool was needed to centralize reports and make them accessible.",
        solution:
          "Built a Laravel + MySQL application with authentication, admin panel, geolocated reports and dashboards. Frontend with Bootstrap and vanilla JS.",
        outcome:
          "Shipped a full reporting flow with validation, map visualization and metrics. Presented as a university thesis project.",
      },
    },
  },
  {
    slug: "flask-shop-api",
    year: "2024",
    cover: "/projects/flask-shop-api.png",
    stack: ["Python", "Flask", "SQLAlchemy", "REST API"],
    repoUrl: "https://github.com/GerardoAmaya/flask-shop-api",
    featured: true,
    i18n: {
      es: {
        title: "Flask Shop API",
        tagline:
          "API de e-commerce construida con Flask y SQLAlchemy ORM — Python · Flask · SQLAlchemy · REST.",
        role: "Backend Developer",
        problem:
          "Necesitaba ampliar mi caja de herramientas backend hacia Python con un caso de negocio realista: gestión de productos, órdenes y clientes para un comercio electrónico.",
        solution:
          "Implementé una API REST en Flask con SQLAlchemy ORM. Modelos para productos, categorías, órdenes y usuarios, validaciones, manejo de errores estructurado y endpoints documentados.",
        outcome:
          "API funcional con un stack Python idiomático, lista para integrarse con un frontend o consumirse desde apps móviles.",
      },
      en: {
        title: "Flask Shop API",
        tagline:
          "E-commerce API built with Flask and SQLAlchemy ORM — Python · Flask · SQLAlchemy · REST.",
        role: "Backend Developer",
        problem:
          "I wanted to expand my backend toolbox into Python with a realistic business case: managing products, orders and customers for an online store.",
        solution:
          "Built a Flask REST API with SQLAlchemy ORM. Models for products, categories, orders and users, validation, structured error handling and documented endpoints.",
        outcome:
          "Functional API with an idiomatic Python stack, ready to integrate with a frontend or be consumed by mobile apps.",
      },
    },
  },
  {
    slug: "pokeapi",
    year: "2023",
    cover: "/projects/PokeAPI.jpg",
    stack: ["React", "JavaScript", "REST API", "CSS"],
    videoUrl: "https://youtu.be/fHk05FWcLlQ",
    featured: true,
    i18n: {
      es: {
        title: "PokeAPI Explorer",
        tagline:
          "Catálogo interactivo consumiendo la PokeAPI pública — React · JavaScript · REST API · CSS.",
        role: "Frontend Developer",
        problem:
          "Necesitaba practicar consumo de APIs REST, paginación y búsqueda en una SPA con buen UX.",
        solution:
          "Construí un explorador en React con búsqueda, filtros, paginación y vista detalle. Manejo de estados de carga y error.",
        outcome:
          "Aplicación responsiva con UX cuidada, lista para escalar a más fuentes de datos.",
      },
      en: {
        title: "PokeAPI Explorer",
        tagline:
          "Interactive catalog consuming the public PokeAPI — React · JavaScript · REST API · CSS.",
        role: "Frontend Developer",
        problem:
          "I wanted to practice REST API consumption, pagination and search in a SPA with good UX.",
        solution:
          "Built a React explorer with search, filters, pagination and detail view. Loading and error states handled.",
        outcome:
          "Responsive app with thoughtful UX, ready to scale to additional data sources.",
      },
    },
  },
  {
    slug: "django-company-api",
    year: "2024",
    cover: "/projects/django-company-api.png",
    stack: ["Python", "Django", "MySQL", "Auth"],
    repoUrl: "https://github.com/GerardoAmaya/django-company-api",
    i18n: {
      es: {
        title: "Django Company API",
        tagline:
          "Aplicación Django con autenticación completa y persistencia en MySQL — Python · Django · MySQL · Auth.",
        role: "Backend Developer",
        problem:
          "Quería profundizar en Django como framework backend de Python, implementando flujos de autenticación reales: registro, login, logout y recuperación de contraseña.",
        solution:
          "Implementé el sistema usando el ORM y el sistema de auth de Django, integración con MySQL, panel administrativo y rutas protegidas con vistas y plantillas server-side.",
        outcome:
          "Base sólida y reutilizable para cualquier proyecto Django que requiera gestión de usuarios y administración fuera de la caja.",
      },
      en: {
        title: "Django Company API",
        tagline:
          "Django app with full authentication and MySQL persistence — Python · Django · MySQL · Auth.",
        role: "Backend Developer",
        problem:
          "I wanted to dive deeper into Django as a Python backend framework, implementing real auth flows: register, login, logout and password recovery.",
        solution:
          "Built the system using Django's ORM and auth system, MySQL integration, admin panel and protected routes with server-side views and templates.",
        outcome:
          "Solid, reusable foundation for any Django project that needs out-of-the-box user management and admin tooling.",
      },
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
