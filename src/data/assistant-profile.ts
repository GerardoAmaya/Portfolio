/**
 * Perfil extendido para el asistente "Pregúntale a mi IA" (src/lib/ask).
 *
 * El sitio muestra un resumen; esto es el detalle del CV (en inglés) para que
 * el asistente pueda responder preguntas concretas de reclutadores. Se omiten
 * a propósito el teléfono y las referencias: el contacto se dirige a /contact.
 * Mantener alineado con public/cv/gerardo-amaya-en.pdf.
 */
export const assistantProfile = `
PROFESSIONAL SUMMARY
Full Stack Developer with 4 years of professional experience and 6+ years of coding. Builds products end to end with TypeScript, Node.js, NestJS, Next.js and React, and develops AI applications with Python, FastAPI and the Claude API (Anthropic). At the Government of El Salvador he has built permit portals for the Ministry of National Defense, the Fire Department and municipal governments, integrating 3-D Secure payments, electronic signatures, Gemini-powered AI agents and OWASP-based security testing. Uses AI daily with a clear method: provide solid context, iterate with judgment and review every line before it reaches production.

PROFESSIONAL EXPERIENCE
Government of El Salvador (San Salvador), Full Stack Developer, Apr 2023 - Present
- Ministry of National Defense Permit Portal (MDN): online portal to apply for and track permits for hazardous materials such as explosives. NestJS and PostgreSQL microservices backend with JWT/JWKS authentication, per-case access control, online payments, Cloud Scheduler jobs for applicant notifications and Cloud Logging monitoring.
- Fire Department Permit Portal (CBES): portal for businesses to obtain fire-prevention inspection certificates online, including inspections of vehicles transporting hazardous materials. NestJS backend with a permit gateway and per-agency adapters, dynamic appointment scheduling for inspectors, document review with observations, automated deadlines and notifications, electronically signed PDF resolutions, and lookups against the national ID registry (RNPN) and tax authority (Hacienda). Includes a Gemini-powered AI agent that enforces document rules, classifies applicants and drafts user responses.
- Distrito Digital La Paz Este: full-stack development (Vue.js and Laravel) and Google App Engine deployment of a platform that digitizes six municipal procedures (tax clearance, signage, road works, minor and major construction, and antennas) across three municipalities. Citizen and role-based back-office portals, national ID validation, online payments via Serfinsa or in person, resolutions signed with Uanataca from a Compute Engine VM and archived in Cloud Storage, configurable per-district fee schedules and Cloud Scheduler tasks.
- School Escalation System (SECE): platform to survey and track around 1,400 public schools ahead of school supply package distribution. Route-assigned field monitors record classrooms, sections, shifts, teachers, infrastructure, connectivity and incidents, and a dashboard flags schools needing attention by department.
- Electronic signature: PBS signing system and integration with the Uanataca One-Shot API for digital document signing; the Optimizer is self-hosted in Docker so documents and personal data never leave the institutional network.
- Serfinsa payment gateway: centralized payment broker, built by him alone, consumed by multiple permit portals (Fire Department, MDN and Distrito Digital). 3-D Secure authentication with Cardinal (merchant JWT), asynchronous queued charges with status polling, payment attempt logging in Cloud SQL (MySQL), cardholder validation against RNPN and security headers; payment flow troubleshooting with Cloud Logging.
- Security and pentesting: automated Jest suites based on the OWASP Top 10 and OWASP API Security Top 10, covering BOLA/IDOR, BFLA, SQL and NoSQL injection, XSS, broken authentication and JWT tampering, mass assignment, brute force and rate limiting, SSRF, CORS and security headers; resolved JWT/JWKS authentication incidents in production.
- Chivo Pets: landing page for Chivo Pets Veterinary Hospital, El Salvador's first public veterinary hospital.
Asociación Conexión (San Salvador), Full Stack Developer Intern, Jan 2023 - Apr 2023
- Training and certification internship in Java, PHP, Laravel, NestJS and databases.

EDUCATION
- Universidad Francisco Gavidia: B.S. in Computer Science Engineering, coursework completed.
- Instituto Técnico Ricaldone: Technical High School Diploma, 2017 - 2019.

CERTIFICATIONS
- Associate Cloud Engineer, Google Cloud (Sep 2026, valid through Sep 2029).
- MTA: Database Fundamentals, Microsoft (Jan 2022).
- Scrum Fundamentals Certified, VMEdu.
- Mobile App Development, Google (Jul 2023), Android with Kotlin.
- PL/SQL Table Functions, Oracle.
- Google Cloud Skill Badges (8): Cloud Run, CI/CD, IAM, Vision API, load balancing, VPC and development environments.
Additional training: SQL Server Specialization (FORMAS BID); Oracle AWS basic to advanced (INSAFORP); Backend Developer Bootcamp and Advanced Web Programming (INSAFORP and Asociación Conexión); Java Fundamentals, Object-Oriented Programming with Python, and Data Structures and Functions in Python (INSAFORP); Python Programming (Presidential Secretariat for Innovation).

TECHNICAL SKILLS
- Artificial Intelligence: Claude API (Anthropic), Gemini, OpenAI-compatible APIs, AI agents, structured outputs, RAG and semantic search (pgvector), OCR and LLM-based extraction.
- Backend: Node.js, NestJS (TypeORM, Prisma), Express, Python (FastAPI, Django, Flask, Celery), PHP (Laravel), Java, C# .NET.
- Frontend: TypeScript, Next.js, React, Vue.js, Angular, Tailwind CSS.
- Mobile: Kotlin (Android).
- Databases: PostgreSQL (PostGIS, pgvector), MySQL, SQL Server (T-SQL), Oracle (PL/SQL), MongoDB.
- Cloud and DevOps: Google Cloud (GKE, App Engine, Cloud Run, Cloud Scheduler, Cloud SQL, Cloud Storage, Pub/Sub, Secret Manager, IAM, Cloud Logging), Docker, CI/CD.
- Security and QA: web and API pentesting (OWASP Top 10 and API Security Top 10), 3-D Secure, JWT/JWKS, Jest, Playwright, Swagger.
- Languages: Spanish (native), English (intermediate).
`.trim();
