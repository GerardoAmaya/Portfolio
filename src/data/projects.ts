import type { Locale } from "@/i18n/routing";

export type Project = {
  slug: string;
  year: string;
  /** Fecha ISO del último cambio real al caso de estudio; alimenta el sitemap */
  updatedAt: string;
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
    slug: "smart-report-ia",
    year: "2026",
    updatedAt: "2026-09-15",
    cover: "/projects/smart-report-ia.jpg",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "PostGIS",
      "Claude AI",
      "Telegram Bot API",
      "Next.js",
      "MapLibre",
      "Cloudflare R2",
      "Docker",
    ],
    repoUrl: "https://github.com/GerardoAmaya/smart-report-ia",
    featured: true,
    i18n: {
      es: {
        title: "Smart Report IA",
        tagline:
          "Reportes ciudadanos de la vía pública en El Salvador: se reporta por Telegram en menos de un minuto y quien despacha ve los reportes repetidos agrupados, con la evidencia a la vista — Python · FastAPI · PostgreSQL + PostGIS · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Hay dos personas con necesidades opuestas. Quien reporta está parado frente al hueco, con prisa, y no va a instalar una app. Quien despacha mira el sistema ocho horas y su problema no es recibir reportes, sino saber cuáles son el mismo: cuatro fotos del mismo hueco son cuatro órdenes de trabajo para una sola cuadrilla. Y casi nadie construye la parte que sostiene todo lo demás, el aviso de vuelta, sin el cual nadie reporta una segunda vez.",
        solution:
          "El principio es que el modelo propone, el código decide, y lo que no se puede sostener se informa. Claude Haiku 4.5 mira la foto y propone categoría y urgencia con salida por esquema, y el bot pide confirmación antes de aceptarla: clasificar en silencio y equivocarse manda una cuadrilla de agua a arreglar una luminaria. La agrupación no la decide el modelo sino código con umbrales medidos —distancia con PostGIS, huella perceptual de la imagen y semejanza textual—, muestra su evidencia y se puede deshacer, y el umbral se calibra contra el error grave (juntar dos problemas distintos esconde uno) y no contra el promedio. Lo que queda en el límite se marca como dudoso, con el motivo, esperando a una persona. La ubicación se pide con el botón nativo de Telegram porque la compresión de la plataforma borra los metadatos de la foto. Sin Redis y sin bus de mensajes: la cola es una tabla con FOR UPDATE SKIP LOCKED y el tablero se actualiza por SSE sobre LISTEN/NOTIFY de Postgres.",
        outcome:
          "El ciclo real está cerrado de punta a punta: un reporte mandado desde un teléfono —calle anegada en Mejicanos— recorrió propuesta de categoría, confirmación, asignación, «en curso» y cierre con foto del arreglo, y los tres avisos llegaron de vuelta; comprobado en los datos y no solo en la pantalla. El cierre no se permite sin foto de evidencia, porque un cierre sin evidencia es una afirmación que nadie puede comprobar. Clasificar una foto cuesta USD 0,0018 medidos, y nueve recorridos de Playwright corren en CI contra el sistema levantado. Las fases de clasificación y agrupación siguen abiertas a propósito: su verificación pide 200 fotos etiquetadas y 200 reportes agrupados a mano, y el código que las mide avisa cuando la muestra no alcanza en vez de dar un número.",
      },
      en: {
        title: "Smart Report IA",
        tagline:
          "Citizen reports of street hazards in El Salvador: reporting takes under a minute over Telegram, and dispatchers see duplicate reports already grouped, with the evidence in plain sight — Python · FastAPI · PostgreSQL + PostGIS · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Two people with opposite needs. Whoever reports is standing in front of the pothole, in a hurry, and will not install an app. Whoever dispatches stares at the system eight hours a day, and their problem is not receiving reports but knowing which ones are the same: four photos of one pothole are four work orders for a single crew. And almost nobody builds the piece that holds the rest up — the notification back — without which no one ever reports twice.",
        solution:
          "The principle is that the model proposes, the code decides, and whatever cannot be supported is disclosed. Claude Haiku 4.5 looks at the photo and proposes category and urgency with schema-constrained output, and the bot asks for confirmation before accepting it: classifying silently and getting it wrong sends a water crew to fix a streetlight. Grouping is decided by code rather than the model, with measured thresholds —distance via PostGIS, a perceptual image hash and text similarity— shows its evidence and can be undone, and the threshold is calibrated against the severe error (merging two distinct problems hides one) rather than the average of both. Anything borderline is flagged as doubtful, with the reason, waiting on a human. Location is requested through Telegram's native button because the platform's compression strips the photo's metadata. No Redis and no message bus: the queue is a table with FOR UPDATE SKIP LOCKED, and the dashboard updates over SSE on top of Postgres LISTEN/NOTIFY.",
        outcome:
          'The real cycle is closed end to end: a report sent from a phone —a flooded street in Mejicanos— went through category proposal, confirmation, assignment, "in progress" and closure with a photo of the repair, and all three notifications came back; verified in the data, not just on screen. Closing is blocked without evidence photo, because a closure with no evidence is a claim nobody can check. Classifying a photo costs a measured USD 0.0018, and nine Playwright journeys run in CI against the running system. The classification and grouping phases stay open on purpose: their verification needs 200 hand-labeled photos and 200 hand-grouped reports, and the code that measures them reports an insufficient sample instead of producing a number.',
      },
    },
  },
  {
    slug: "waypoint",
    year: "2026",
    updatedAt: "2026-09-15",
    cover: "/projects/waypoint-cover.jpg",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "PostGIS",
      "Claude AI",
      "Next.js",
      "Leaflet",
      "Vercel",
      "Docker",
    ],
    repoUrl: "https://github.com/GerardoAmaya/waypoint",
    liveUrl: "https://frontend-weld-eta-54.vercel.app",
    featured: true,
    i18n: {
      es: {
        title: "Waypoint",
        tagline:
          "Planificador de viajes conversacional por El Salvador: el modelo traduce la frase del usuario a restricciones y un motor determinista las hace cumplir, sobre lugares y distancias reales — Python · FastAPI · PostgreSQL + PostGIS · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Armar un viaje de varios días exige cruzar a mano lugares, distancias y horarios. Pedírselo directo a un modelo de lenguaje falla justo en lo que importa: «odio madrugar» se vuelve una sugerencia que a veces ignora, y los lugares que devuelve pueden no existir.",
        solution:
          "Partí el problema en dos: el modelo traduce la frase en lenguaje natural a restricciones, y un motor determinista las hace cumplir. Eso lo vuelve medible: dado un conjunto de restricciones se comprueba automáticamente si el itinerario las respeta, y lo que no se pudo cumplir viaja en la respuesta como violación con su magnitud en vez de esconderse. El catálogo sale de OpenStreetMap y se consulta con PostGIS; las distancias vienen de una sola llamada a la matriz de OpenRouteService por itinerario, cacheadas por par, porque el cupo real que reporta la cabecera es la décima parte del que publica la tabla de planes. Un invariante geométrico descarta las celdas donde la ruta por carretera mide menos que la línea recta: tres paradas enganchadas al mismo nodo vial devolvían cero kilómetros marcados como medida real.",
        outcome:
          "Sobre un banco de 26 casos: 25 cumplen todas las restricciones duras, cero lugares inventados en 321 paradas generadas y cero de 240 paradas fuera de horario. El factor de desvío (1.45) y las velocidades (35 a 62 km/h según el tramo) se midieron contra 812 pares reales en lugar de elegirse a ojo. Catálogo de 5.786 lugares activos, 743 tests en el backend y 55 en el frontend. Demo pública en línea.",
      },
      en: {
        title: "Waypoint",
        tagline:
          "Conversational trip planner for El Salvador: the model turns the user's sentence into constraints and a deterministic engine enforces them, over real places and real distances — Python · FastAPI · PostgreSQL + PostGIS · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Planning a multi-day trip means cross-referencing places, distances and opening hours by hand. Handing the job straight to a language model fails exactly where it matters: “I hate early mornings” becomes a suggestion it sometimes ignores, and the places it returns may not exist.",
        solution:
          "Split the problem in two: the model translates the natural-language request into constraints, and a deterministic engine enforces them. That makes it measurable: given a set of constraints you can check automatically whether the itinerary respects them, and whatever could not be satisfied travels back in the response as a violation with its magnitude instead of being hidden. The catalog comes from OpenStreetMap and is queried with PostGIS; distances come from a single OpenRouteService matrix call per itinerary, cached per pair, because the quota the response header reports is a tenth of the one the plan table advertises. A geometric invariant discards cells where the road route measures less than the straight line: three stops snapped to the same road node were returning zero kilometres flagged as a real measurement.",
        outcome:
          "Across a 26-case benchmark: 25 satisfy every hard constraint, zero invented places over 321 generated stops and zero out of 240 stops outside opening or daylight hours. The detour factor (1.45) and the speeds (35 to 62 km/h depending on leg length) were measured against 812 real pairs rather than picked by feel. Catalog of 5,786 active places, 743 backend tests and 55 on the frontend. Public demo live.",
      },
    },
  },
  {
    slug: "docu-flow",
    updatedAt: "2026-09-08",
    year: "2026",
    cover: "/projects/docu-flow.jpg",
    stack: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "pgvector",
      "Celery",
      "Claude AI",
      "Next.js",
      "Docker",
    ],
    repoUrl: "https://github.com/GerardoAmaya/docu-flow",
    liveUrl: "https://docu-flow-nine-xi.vercel.app",
    featured: true,
    i18n: {
      es: {
        title: "DocuFlow",
        tagline:
          "Convierte facturas escaneadas en datos contables verificables: OCR, extracción con LLM y revisión humana con la confianza de cada campo medida, no supuesta — Python · FastAPI · PostgreSQL + pgvector · Celery · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Una PyME recibe facturas en tres formatos a la vez: PDFs de facturación electrónica, PDFs escaneados y fotos tomadas con el celular. Pasarlas al sistema contable es digitación manual. Automatizarla es fácil de empezar y difícil de terminar, porque tanto el OCR como el modelo se equivocan, y lo hacen sin avisar.",
        solution:
          "Construí un pipeline asíncrono con Celery y Redis en el que cada campo extraído lleva su score de confianza y su procedencia: los que no superan el umbral entran a una cola de revisión humana en lugar de contaminar la base. Tesseract con preprocesamiento OpenCV para las fotos con sombra, Claude Haiku 4.5 para la extracción y Claude Sonnet 5 para las respuestas, y PostgreSQL 16 con pgvector para guardar datos estructurados y vectores en un solo motor. El chat separa las preguntas semánticas, que van por búsqueda híbrida y RAG con citas a la página exacta, de las de agregación, que van por SQL: un recuperador top-k solo ve una muestra del corpus y respondería con seguridad sobre un subconjunto.",
        outcome:
          "Medido sobre 120 campos con etiquetas de referencia: 93.3% de exactitud cuando el sistema responde y apenas 1.7% de fallos silenciosos, a un costo de 0.0045 USD por documento. Ante documentos ilegibles se abstiene en lugar de inventar, y lo que no resuelve queda en la cola de revisión. Demo pública con 12 facturas ya procesadas.",
      },
      en: {
        title: "DocuFlow",
        tagline:
          "Turns scanned invoices into verifiable accounting data: OCR, LLM extraction and human review with per-field confidence measured, not assumed — Python · FastAPI · PostgreSQL + pgvector · Celery · Claude AI · Next.js.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "A small business receives invoices in three formats at once: e-invoicing PDFs, scanned PDFs and photos taken on a phone. Getting them into the accounting system means manual data entry. Automating it is easy to start and hard to finish, because both the OCR and the model make mistakes, and they make them silently.",
        solution:
          "Built an async pipeline on Celery and Redis where every extracted field carries its confidence score and provenance: anything below the threshold goes to a human review queue instead of polluting the database. Tesseract with OpenCV preprocessing for shadowed phone photos, Claude Haiku 4.5 for extraction and Claude Sonnet 5 for answers, and PostgreSQL 16 with pgvector to keep structured data and embeddings in a single engine. The chat splits semantic questions, answered through hybrid search and RAG with citations to the exact page, from aggregation questions, answered with SQL: a top-k retriever only ever sees a sample of the corpus and would answer confidently about a subset.",
        outcome:
          "Measured across 120 fields against ground-truth labels: 93.3% accuracy when the system answers and just 1.7% silent failures, at 0.0045 USD per document. Faced with illegible documents it abstains rather than inventing, and whatever it cannot resolve lands in the review queue. Public demo with 12 invoices already processed.",
      },
    },
  },
  {
    slug: "real-estate-lead-management",
    updatedAt: "2026-09-08",
    year: "2026",
    cover: "/projects/real-estate-lead-management.jpg",
    stack: ["Angular", "TypeScript", "Node.js", "Express", "MongoDB", "Playwright", "Docker"],
    repoUrl: "https://github.com/GerardoAmaya/real-estate-lead-management",
    featured: true,
    i18n: {
      es: {
        title: "Real Estate Lead Management",
        tagline:
          "Módulo de seguimiento de leads inmobiliarios con un dashboard de métricas resuelto en una sola consulta de agregación — Angular · TypeScript · Node.js · Express · MongoDB · Playwright.",
        role: "Fullstack Developer",
        problem:
          "El módulo necesitaba listado con filtros y paginación, cambio de estado, alta de leads y un dashboard de métricas. El riesgo estaba en el dashboard: resolver total, presupuesto promedio, leads reservados, tasa de conversión y tres desgloses con consultas separadas significa seis viajes a la base y, peor, seis fotos tomadas en momentos distintos.",
        solution:
          "El dashboard se resuelve con una única etapa de agregación $facet, y los agrupamientos comparten un subpipeline generado por función, así que añadir un desglose nuevo es una línea. Los índices viven en migraciones y no en el esquema, con autoIndex desactivado, siguiendo el patrón ESR para servir el caso real de la pantalla sin ordenamiento en memoria. La validación es doble: Zod estricto en la API, que cierra de una vez el mass assignment y la inyección de operadores de Mongo, y $jsonSchema en la propia base, para que un script o una conexión directa tampoco puedan insertar datos inválidos.",
        outcome:
          "Módulo entregado con pruebas E2E en Playwright, quality gate de SonarCloud en verde y un análisis técnico escrito que cubre el modelo de datos, el diagnóstico de un incidente, la arquitectura en AWS y el plan de migración.",
      },
      en: {
        title: "Real Estate Lead Management",
        tagline:
          "Real-estate lead tracking module with a metrics dashboard resolved in a single aggregation query — Angular · TypeScript · Node.js · Express · MongoDB · Playwright.",
        role: "Fullstack Developer",
        problem:
          "The module needed a filtered, paginated list, status changes, lead creation and a metrics dashboard. The risk was in the dashboard: resolving total, average budget, reserved leads, conversion rate and three breakdowns with separate queries means six round trips to the database and, worse, six snapshots taken at different moments.",
        solution:
          "The dashboard resolves in a single $facet aggregation stage, and the groupings share a function-generated subpipeline, so adding a new breakdown is one line. Indexes live in migrations rather than the schema, with autoIndex off, following the ESR pattern so the screen's real query is served without an in-memory sort. Validation is layered: strict Zod at the API, which closes mass assignment and Mongo operator injection at once, plus $jsonSchema on the database itself, so a script or a direct connection cannot insert invalid data either.",
        outcome:
          "Delivered with Playwright E2E tests, a green SonarCloud quality gate and a written technical analysis covering the data model, an incident diagnosis, the AWS architecture and the migration plan.",
      },
    },
  },
  {
    slug: "nestjs-ai-pentest-skill",
    updatedAt: "2026-04-29",
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
    updatedAt: "2026-04-29",
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
    updatedAt: "2026-04-29",
    year: "2024",
    cover: "/projects/SafeOnSivar.jpg",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
    videoUrl: "https://youtu.be/OCd7V5g8RRU",
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
    updatedAt: "2026-04-29",
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
    updatedAt: "2026-04-29",
    year: "2023",
    cover: "/projects/PokeAPI.jpg",
    stack: ["React", "JavaScript", "REST API", "CSS"],
    videoUrl: "https://youtu.be/fHk05FWcLlQ",
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
        outcome: "Aplicación responsiva con UX cuidada, lista para escalar a más fuentes de datos.",
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
        outcome: "Responsive app with thoughtful UX, ready to scale to additional data sources.",
      },
    },
  },
  {
    slug: "django-company-api",
    updatedAt: "2026-04-29",
    year: "2024",
    cover: "/projects/django-company-api.png",
    stack: ["Python", "Django", "MySQL", "Auth"],
    repoUrl: "https://github.com/GerardoAmaya/django-company-api",
    featured: true,
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
