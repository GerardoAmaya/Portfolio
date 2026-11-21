import type { Locale } from "@/i18n/routing";

/** Tipo de proyecto, para los filtros de /projects. Un proyecto puede tener varios. */
export type ProjectCategory = "ai" | "fullstack" | "backend" | "frontend";

export const PROJECT_CATEGORIES: ProjectCategory[] = ["ai", "fullstack", "backend", "frontend"];

/** Un tramo del resumen: una frase y de 3 a 4 viñetas cortas */
export type BriefSection = { lead: string; points: string[] };

/**
 * Resumen escaneable de un caso de estudio largo. Sale solo del texto completo
 * del mismo proyecto, con sus cifras tal cual; `**...**` las resalta.
 * src/data/projects.test.ts vigila los largos y que no aparezcan cifras nuevas.
 */
export type CaseBrief = {
  /** Una frase de 30 palabras como mucho */
  problem: string;
  solution: BriefSection;
  outcome: BriefSection;
};

export type Project = {
  slug: string;
  categories: ProjectCategory[];
  year: string;
  /** Fecha ISO del último cambio real al caso de estudio; alimenta el sitemap */
  updatedAt: string;
  cover: string;
  stack: string[];
  videoUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  /** Enlaces adicionales al repo y a la demo (por ejemplo, un bot), con su etiqueta por idioma */
  extraLinks?: { href: string; label: Record<Locale, string> }[];
  /**
   * Acceso de prueba a la demo, para que quien visita no se quede en el login.
   * Solo para cuentas de solo lectura cuya contraseña ya es pública.
   */
  demoLogin?: { hint: Record<Locale, string>; password: string };
  /**
   * Capturas del carrusel del caso de estudio, en orden. Si hay, ocupan el lugar
   * de la portada en esa página; la portada sigue en las tarjetas.
   */
  gallery?: { src: string; alt: Record<Locale, string> }[];
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
  /**
   * Resumen para los casos largos: las tarjetas muestran esto y el texto
   * completo de `i18n` queda detrás de «Leer el caso completo». `i18n` no se
   * recorta porque también es lo que sabe el asistente (lib/ask/context.ts).
   */
  brief?: Record<Locale, CaseBrief>;
};

export const projects: Project[] = [
  {
    slug: "smart-report-ia",
    categories: ["ai", "fullstack"],
    year: "2026",
    updatedAt: "2026-11-20",
    // Nombre nuevo en cada cambio: /projects/* se sirve con caché inmutable de un año
    cover: "/projects/smart-report-ia-entrada.jpg",
    gallery: [
      {
        src: "/projects/smart-report-ia-entrada.jpg",
        alt: {
          es: "La entrada: Google para quien trabaja y contraseña para quien viene a mirar",
          en: "The login: Google for staff and a password for visitors who just want to look",
        },
      },
      {
        src: "/projects/smart-report-ia-resumen.jpg",
        alt: {
          es: "El resumen, con «Lo que acaba de pasar»: un feed en vivo sobre los avisos de Postgres",
          en: "The summary with “What just happened”, a live feed on top of Postgres notifications",
        },
      },
      {
        src: "/projects/smart-report-ia-caso.jpg",
        alt: {
          es: "Un caso cerrado de punta a punta: la foto del reporte, el despacho y la foto del arreglo, obligatoria para cerrar",
          en: "A case closed end to end: the report photo, the dispatch and the repair photo, which is required to close it",
        },
      },
      {
        src: "/projects/smart-report-ia-mapa-3d.jpg",
        alt: {
          es: "Mapa 3D con MapLibre: edificios en relieve y los casos como columnas, rojas donde hay algo urgente",
          en: "3D map with MapLibre: buildings in relief and cases as columns, red where something is urgent",
        },
      },
      {
        src: "/projects/smart-report-ia-asistente.jpg",
        alt: {
          es: "«Pregúntale al tablero»: el asistente contesta con los datos del sistema y solo puede mirar",
          en: "“Ask the dashboard”: the assistant answers with the system's data and can only look",
        },
      },
      {
        src: "/projects/smart-report-ia-movil.jpg",
        alt: {
          es: "En el celular, el tablero cambia de forma para despachar desde la calle",
          en: "On phones the dashboard changes shape so crews can dispatch from the street",
        },
      },
    ],
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
      "Oracle Cloud",
      "Playwright",
    ],
    repoUrl: "https://github.com/GerardoAmaya/smart-report-ia",
    liveUrl: "https://smart-report-sv.duckdns.org",
    extraLinks: [
      {
        href: "https://t.me/smartreport_sv_bot",
        label: { es: "Probar el bot", en: "Try the bot" },
      },
    ],
    // Usuario de solo lectura; la contraseña es pública en el README del proyecto
    demoLogin: {
      hint: {
        es: "Tablero con usuario de prueba de solo lectura (incluye 10 preguntas al día al asistente): en «Usuario de prueba», contraseña",
        en: "Read-only demo access to the dashboard (includes 10 questions a day to the assistant): under “Usuario de prueba”, password",
      },
      password: "demo-Are2G6f1pOvg",
    },
    featured: true,
    i18n: {
      es: {
        title: "Smart Report IA",
        tagline:
          "Reportes ciudadanos de la vía pública en El Salvador: se reporta por Telegram en menos de un minuto y quien despacha ve los reportes repetidos agrupados, con la evidencia a la vista.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Hay dos personas con necesidades opuestas. Quien reporta está parado frente al hueco, con prisa, y no va a instalar una app. Quien despacha mira el sistema ocho horas y su problema no es recibir reportes, sino saber cuáles son el mismo: cuatro fotos del mismo hueco son cuatro órdenes de trabajo para una sola cuadrilla. Y casi nadie construye la parte que sostiene todo lo demás, el aviso de vuelta, sin el cual nadie reporta una segunda vez.",
        solution:
          "El principio es que el modelo propone, el código decide, y lo que no se puede sostener se informa. Claude Haiku 4.5 mira la foto y propone categoría y urgencia con salida por esquema, y el bot pide confirmación antes de aceptarla: clasificar en silencio y equivocarse manda una cuadrilla de agua a arreglar una luminaria. La agrupación no la decide el modelo sino código: se agrupa por la categoría que confirmó una persona y por la distancia medida con PostGIS, y la huella perceptual de la foto se anota como evidencia pero no fuerza la unión, porque una imagen idéntica a 60 m puede ser un reenvío. Hay tres salidas y no dos (agrupado, dudoso o solo), porque separar dos reportes del mismo caso es molesto, pero juntar dos problemas distintos esconde uno: lo que queda en el límite se marca como dudoso, con el motivo, esperando a una persona. La ubicación se pide con el botón nativo de Telegram porque la compresión de la plataforma borra los metadatos de la foto, y si el modelo falla o se queda sin saldo, el bot pide la categoría con botones y el reporte entra igual. En el tablero, «Pregúntale al tablero», que se abre desde un robot flotante, contesta preguntas como «¿qué quedó pendiente?» con los datos del sistema y enlaces a cada caso, pero solo puede mirar: el modelo elige entre consultas escritas en código, que corren en una transacción de solo lectura, y asignar o cerrar sigue siendo cosa de una persona. Donde el sistema duda, «Comparar las fotos» le pide al modelo una segunda mirada a las dos imágenes: sugiere, y decide la persona. El tablero suma un mapa 3D hecho con el mismo MapLibre, sin librerías de 3D, un feed de «lo que acaba de pasar» que se mueve con los mismos avisos de Postgres, y en el celular cambia de forma para que la cuadrilla despache desde la calle. Sin Redis y sin bus de mensajes: la cola es una tabla con FOR UPDATE SKIP LOCKED y el tablero se actualiza por SSE sobre LISTEN/NOTIFY de Postgres.",
        outcome:
          "Está en producción y se puede probar: el bot de Telegram y el tablero, con un usuario de prueba de solo lectura. Corre en una sola máquina ARM de Oracle Cloud Always Free con Docker Compose y Caddy, y todo lo que la rodea (Cloudflare R2, DuckDNS, OpenFreeMap, GitHub Actions) está en niveles gratuitos permanentes: la infraestructura cuesta USD 0 al mes y el único costo es el modelo, USD 0,0018 medidos por foto, porque se le manda la miniatura y no el original. El asistente del tablero tiene tope diario por persona, así que el acceso público no puede gastar más de unos USD 0,07 al día. El ciclo real está cerrado de punta a punta en producción: un reporte mandado desde un teléfono (calle anegada en Mejicanos) recorrió propuesta de categoría, confirmación, asignación, «en curso» y cierre con foto del arreglo, y los avisos llegaron de vuelta; comprobado en los datos y no solo en la pantalla. El cierre no se permite sin foto de evidencia, porque un cierre sin evidencia es una afirmación que nadie puede comprobar. 312 pruebas y nueve recorridos de Playwright corren en CI contra el sistema levantado. Las fases de clasificación y agrupación siguen abiertas a propósito: su verificación pide 200 fotos etiquetadas y 200 reportes agrupados a mano, y el código que las mide avisa cuando la muestra no alcanza en vez de dar un número.",
      },
      en: {
        title: "Smart Report IA",
        tagline:
          "Citizen reports of street hazards in El Salvador: reporting takes under a minute over Telegram, and dispatchers see duplicate reports already grouped, with the evidence in plain sight.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Two people with opposite needs. Whoever reports is standing in front of the pothole, in a hurry, and will not install an app. Whoever dispatches stares at the system eight hours a day, and their problem is not receiving reports but knowing which ones are the same: four photos of one pothole are four work orders for a single crew. And almost nobody builds the piece that holds the rest up (the notification back), without which no one ever reports twice.",
        solution:
          "The principle is that the model proposes, the code decides, and whatever cannot be supported is disclosed. Claude Haiku 4.5 looks at the photo and proposes category and urgency with schema-constrained output, and the bot asks for confirmation before accepting it: classifying silently and getting it wrong sends a water crew to fix a streetlight. Grouping is decided by code, not the model: reports are grouped by the category a person confirmed and by distance measured with PostGIS, and the photo's perceptual hash is recorded as evidence but never forces a merge, because an identical image 60 m away may be a resend. There are three outcomes rather than two (grouped, doubtful or alone), because splitting two reports of the same case is annoying but merging two distinct problems hides one: anything borderline is flagged as doubtful, with the reason, waiting on a human. Location is requested through Telegram's native button because the platform's compression strips the photo's metadata, and if the model fails or runs out of credit, the bot asks for the category with buttons and the report still gets in. On the dashboard, “Ask the dashboard”, opened from a floating robot, answers questions such as “what is still pending?” with the system's data and links to each case, but it can only look: the model picks among queries written in code that run in a read-only transaction, and assigning or closing stays with a person. Where the system is in doubt, “Compare the photos” asks the model for a second look at both images: it suggests, and the person decides. The dashboard adds a 3D map built with the same MapLibre and no 3D library, a “what just happened” feed driven by the same Postgres notifications, and on phones it changes shape so crews can dispatch from the street. No Redis and no message bus: the queue is a table with FOR UPDATE SKIP LOCKED, and the dashboard updates over SSE on top of Postgres LISTEN/NOTIFY.",
        outcome:
          'It is in production and can be tried: the Telegram bot and the dashboard, with a read-only demo user. It runs on a single Oracle Cloud Always Free ARM machine with Docker Compose and Caddy, and everything around it (Cloudflare R2, DuckDNS, OpenFreeMap, GitHub Actions) sits on permanent free tiers: infrastructure costs USD 0 a month and the only cost is the model, a measured USD 0.0018 per photo, because it receives the thumbnail rather than the original. The dashboard assistant has a daily cap per person, so public access cannot spend more than about USD 0.07 a day. The real cycle is closed end to end in production: a report sent from a phone (a flooded street in Mejicanos) went through category proposal, confirmation, assignment, "in progress" and closure with a photo of the repair, and the notifications came back; verified in the data, not just on screen. Closing is blocked without an evidence photo, because a closure with no evidence is a claim nobody can check. 312 tests and nine Playwright journeys run in CI against the running system. The classification and grouping phases stay open on purpose: their verification needs 200 hand-labeled photos and 200 hand-grouped reports, and the code that measures them reports an insufficient sample instead of producing a number.',
      },
    },
    brief: {
      es: {
        problem:
          "Quien reporta tiene prisa y no va a instalar una app; quien despacha necesita saber qué reportes son el mismo; y sin aviso de vuelta, nadie reporta una segunda vez.",
        solution: {
          lead: "El modelo propone y el código decide: Claude Haiku 4.5 mira la foto y sugiere categoría y urgencia, y el bot pide confirmación antes de aceptarla.",
          points: [
            "Agrupa el código, no el modelo: por categoría confirmada y distancia medida con PostGIS.",
            "Tres salidas, no dos: agrupado, dudoso o solo; lo dudoso espera a una persona.",
            "«Pregúntale al tablero» contesta con los datos del sistema, pero solo puede mirar.",
            "Sin Redis: la cola es una tabla de Postgres con FOR UPDATE SKIP LOCKED.",
          ],
        },
        outcome: {
          lead: "En producción y con el ciclo real cerrado de punta a punta: un reporte desde un teléfono llegó al cierre con foto del arreglo, y los avisos llegaron de vuelta.",
          points: [
            "La infraestructura cuesta **USD 0** al mes: todo está en niveles gratuitos permanentes.",
            "El único costo es el modelo: **USD 0,0018** medidos por foto.",
            "**312 pruebas** y **nueve recorridos** de Playwright corren en CI contra el sistema levantado.",
            "Clasificación y agrupación siguen abiertas a propósito: sin muestra suficiente, no hay número.",
          ],
        },
      },
      en: {
        problem:
          "Reporters are in a hurry and will not install an app; dispatchers need to know which reports are the same; and without a notification back, no one reports twice.",
        solution: {
          lead: "The model proposes and the code decides: Claude Haiku 4.5 looks at the photo and suggests category and urgency, and the bot asks for confirmation first.",
          points: [
            "Code, not the model, groups reports: by confirmed category and distance measured with PostGIS.",
            "Three outcomes, not two: grouped, doubtful or alone; doubtful cases wait on a human.",
            "“Ask the dashboard” answers with the system's data, but it can only look.",
            "No Redis: the queue is a Postgres table with FOR UPDATE SKIP LOCKED.",
          ],
        },
        outcome: {
          lead: "In production, with the real cycle closed end to end: a report sent from a phone reached closure with a repair photo, and the notifications came back.",
          points: [
            "Infrastructure costs **USD 0** a month: everything sits on permanent free tiers.",
            "The only cost is the model: a measured **USD 0.0018** per photo.",
            "**312 tests** and **nine Playwright journeys** run in CI against the running system.",
            "Classification and grouping stay open on purpose: no number without a large enough sample.",
          ],
        },
      },
    },
  },
  {
    slug: "waypoint",
    categories: ["ai", "fullstack"],
    year: "2026",
    updatedAt: "2026-09-15",
    cover: "/projects/waypoint-inicio.jpg",
    gallery: [
      {
        src: "/projects/waypoint-inicio.jpg",
        alt: {
          es: "La entrada: se describe el viaje en una frase y Waypoint arma el recorrido",
          en: "The start screen: describe the trip in one sentence and Waypoint builds the route",
        },
      },
      {
        src: "/projects/waypoint-cover.jpg",
        alt: {
          es: "Un itinerario de dos días: paradas, horarios y traslados, con la ruta en el mapa",
          en: "A two-day itinerary: stops, times and transfers, with the route on the map",
        },
      },
    ],
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
          "Planificador de viajes conversacional por El Salvador: el modelo traduce la frase del usuario a restricciones y un motor determinista las hace cumplir, sobre lugares y distancias reales.",
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
          "Conversational trip planner for El Salvador: the model turns the user's sentence into constraints and a deterministic engine enforces them, over real places and real distances.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Planning a multi-day trip means cross-referencing places, distances and opening hours by hand. Handing the job straight to a language model fails exactly where it matters: “I hate early mornings” becomes a suggestion it sometimes ignores, and the places it returns may not exist.",
        solution:
          "Split the problem in two: the model translates the natural-language request into constraints, and a deterministic engine enforces them. That makes it measurable: given a set of constraints you can check automatically whether the itinerary respects them, and whatever could not be satisfied travels back in the response as a violation with its magnitude instead of being hidden. The catalog comes from OpenStreetMap and is queried with PostGIS; distances come from a single OpenRouteService matrix call per itinerary, cached per pair, because the quota the response header reports is a tenth of the one the plan table advertises. A geometric invariant discards cells where the road route measures less than the straight line: three stops snapped to the same road node were returning zero kilometres flagged as a real measurement.",
        outcome:
          "Across a 26-case benchmark: 25 satisfy every hard constraint, zero invented places over 321 generated stops and zero out of 240 stops outside opening or daylight hours. The detour factor (1.45) and the speeds (35 to 62 km/h depending on leg length) were measured against 812 real pairs rather than picked by feel. Catalog of 5,786 active places, 743 backend tests and 55 on the frontend. Public demo live.",
      },
    },
    brief: {
      es: {
        problem:
          "Armar un viaje de varios días exige cruzar a mano lugares, distancias y horarios; un modelo de lenguaje a veces ignora «odio madrugar» y devuelve lugares que pueden no existir.",
        solution: {
          lead: "El problema se parte en dos: el modelo traduce la frase a restricciones y un motor determinista las hace cumplir.",
          points: [
            "Medible: se comprueba automáticamente si el itinerario respeta cada restricción.",
            "Lo incumplido viaja en la respuesta como violación, con su magnitud, sin esconderse.",
            "Catálogo de OpenStreetMap en PostGIS y una sola matriz de OpenRouteService por itinerario.",
            "Un invariante geométrico descarta celdas donde la carretera mide menos que la línea recta.",
          ],
        },
        outcome: {
          lead: "**25 de 26 casos** del banco cumplen todas las restricciones duras, y la demo pública está en línea.",
          points: [
            "**Cero** lugares inventados en 321 paradas generadas.",
            "**Cero** de 240 paradas fuera de horario.",
            "Factor de desvío y velocidades medidos contra **812 pares reales**, no elegidos a ojo.",
            "Catálogo de **5.786 lugares** activos; 743 tests en backend y 55 en frontend.",
          ],
        },
      },
      en: {
        problem:
          "Planning a multi-day trip means cross-referencing places, distances and opening hours by hand; a language model sometimes ignores “I hate early mornings” and returns places that may not exist.",
        solution: {
          lead: "The problem is split in two: the model translates the sentence into constraints and a deterministic engine enforces them.",
          points: [
            "Measurable: an automatic check tells whether the itinerary respects every constraint.",
            "Whatever could not be satisfied comes back as a violation with its magnitude.",
            "OpenStreetMap catalog in PostGIS and a single OpenRouteService matrix call per itinerary.",
            "A geometric invariant discards cells where the road is shorter than the straight line.",
          ],
        },
        outcome: {
          lead: "**25 of 26 benchmark cases** satisfy every hard constraint, and the public demo is live.",
          points: [
            "**Zero** invented places over 321 generated stops.",
            "**Zero** out of 240 stops outside opening or daylight hours.",
            "Detour factor and speeds measured against **812 real pairs**, not picked by feel.",
            "Catalog of **5,786 active places**; 743 backend tests and 55 on the frontend.",
          ],
        },
      },
    },
  },
  {
    slug: "docu-flow",
    categories: ["ai", "fullstack"],
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
    featured: true,
    i18n: {
      es: {
        title: "DocuFlow",
        tagline:
          "Convierte facturas escaneadas en datos contables verificables: OCR, extracción con LLM y revisión humana con la confianza de cada campo medida, no supuesta.",
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
          "Turns scanned invoices into verifiable accounting data: OCR, LLM extraction and human review with per-field confidence measured, not assumed.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "A small business receives invoices in three formats at once: e-invoicing PDFs, scanned PDFs and photos taken on a phone. Getting them into the accounting system means manual data entry. Automating it is easy to start and hard to finish, because both the OCR and the model make mistakes, and they make them silently.",
        solution:
          "Built an async pipeline on Celery and Redis where every extracted field carries its confidence score and provenance: anything below the threshold goes to a human review queue instead of polluting the database. Tesseract with OpenCV preprocessing for shadowed phone photos, Claude Haiku 4.5 for extraction and Claude Sonnet 5 for answers, and PostgreSQL 16 with pgvector to keep structured data and embeddings in a single engine. The chat splits semantic questions, answered through hybrid search and RAG with citations to the exact page, from aggregation questions, answered with SQL: a top-k retriever only ever sees a sample of the corpus and would answer confidently about a subset.",
        outcome:
          "Measured across 120 fields against ground-truth labels: 93.3% accuracy when the system answers and just 1.7% silent failures, at 0.0045 USD per document. Faced with illegible documents it abstains rather than inventing, and whatever it cannot resolve lands in the review queue. Public demo with 12 invoices already processed.",
      },
    },
    brief: {
      es: {
        problem:
          "Una PyME recibe facturas en tres formatos y las pasa a mano al sistema contable; automatizarlo cuesta terminarlo, porque el OCR y el modelo se equivocan sin avisar.",
        solution: {
          lead: "Un pipeline asíncrono con Celery y Redis en el que cada campo lleva su confianza y procedencia, y lo que no supera el umbral va a revisión humana.",
          points: [
            "Tesseract con preprocesamiento OpenCV para las fotos con sombra.",
            "Claude Haiku 4.5 para la extracción y Claude Sonnet 5 para las respuestas.",
            "PostgreSQL 16 con pgvector: datos estructurados y vectores en un solo motor.",
            "Preguntas semánticas por RAG, citando la página exacta; las de agregación, por SQL.",
          ],
        },
        outcome: {
          lead: "Medido sobre 120 campos con etiquetas de referencia.",
          points: [
            "**93.3%** de exactitud cuando el sistema responde.",
            "Apenas **1.7%** de fallos silenciosos.",
            "**0.0045 USD** por documento.",
            "Ante documentos ilegibles se abstiene en lugar de inventar.",
          ],
        },
      },
      en: {
        problem:
          "A small business receives invoices in three formats and keys them in by hand; automating it is hard to finish because both OCR and model make mistakes silently.",
        solution: {
          lead: "An async pipeline on Celery and Redis where every field carries its confidence and provenance, and anything below the threshold goes to human review.",
          points: [
            "Tesseract with OpenCV preprocessing for shadowed phone photos.",
            "Claude Haiku 4.5 for extraction and Claude Sonnet 5 for answers.",
            "PostgreSQL 16 with pgvector: structured data and embeddings in a single engine.",
            "Semantic questions go through RAG citing the exact page; aggregation questions, through SQL.",
          ],
        },
        outcome: {
          lead: "Measured across 120 fields against ground-truth labels.",
          points: [
            "**93.3%** accuracy when the system answers.",
            "Just **1.7%** silent failures.",
            "**0.0045 USD** per document.",
            "Faced with illegible documents it abstains rather than inventing.",
          ],
        },
      },
    },
  },
  {
    slug: "portfolio-ai-assistant",
    categories: ["ai", "fullstack"],
    year: "2026",
    updatedAt: "2026-11-17",
    cover: "/projects/portfolio-ai-assistant.jpg",
    stack: ["Next.js", "TypeScript", "Claude API", "Netlify Functions", "Netlify Blobs", "Motion"],
    repoUrl: "https://github.com/GerardoAmaya/Portfolio",
    liveUrl: "https://gerardoamayacv.netlify.app",
    featured: true,
    i18n: {
      es: {
        title: "Asistente IA del portafolio",
        tagline:
          "Un chat dentro de este mismo sitio que responde las preguntas de un reclutador sobre mi experiencia, usando solo el contenido de mi CV y del portafolio. Pruébalo con el robot de la esquina.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "Un reclutador tiene minutos, no horas: no va a leer un CV completo para saber si alguien ha trabajado con pagos o qué stack domina. Un chat genérico resolvería eso inventando, que es peor que no responder. Y un endpoint público que llama a un modelo es una invitación a abusar de él y a gastar dinero ajeno, así que el asistente tenía que ser útil, honesto sobre lo que no sabe y barato de mantener abierto.",
        solution:
          "El modelo solo puede responder desde un bloque de conocimiento armado con los mismos datos del sitio (proyectos, experiencia, certificaciones y un perfil extendido sin teléfono ni referencias), y cita de dónde sale cada dato con marcas como [[project:waypoint]] que el chat convierte en enlaces; las referencias que no existen se descartan en el cliente. Corre sobre Claude Haiku 5.5 con respuesta en streaming, y ese bloque de conocimiento va con prompt caching porque es idéntico en cada pregunta. El endpoint valida origen y forma del cuerpo, limita la pregunta a 500 caracteres y la conversación a 8 turnos, ignora instrucciones que intenten cambiar su papel, y aplica un límite de 10 preguntas por hora por IP (guardada solo como hash) y 300 al día para todo el sitio. Es bilingüe, el botón se puede arrastrar a cualquier borde y en el celular no abre el teclado de golpe.",
        outcome:
          "Funciona en producción y responde en unos 3 a 4 segundos, medidos desde el navegador. Llegar ahí fue depurar tres fallas que en local no aparecían: Haiku 5.5 rechaza el parámetro temperature; con el razonamiento extendido activo gastaba todos los tokens pensando y devolvía una respuesta vacía, así que se desactiva y se registra el motivo cuando una respuesta sale vacía; y en Netlify la función se quedaba colgada 30 segundos hasta que la plataforma la cortaba, por lo que cada paso externo (almacenamiento del límite y llamada al modelo) tiene ahora un tiempo máximo y un registro de cuánto tardó. El costo es menos de una milésima de dólar por pregunta, estimado con los precios publicados del modelo y aún no medido con el uso real.",
      },
      en: {
        title: "Portfolio AI Assistant",
        tagline:
          "A chat inside this very site that answers a recruiter's questions about my background, using only the content of my resume and portfolio. Try it with the robot in the corner.",
        role: "Fullstack Developer · AI Engineering",
        problem:
          "A recruiter has minutes, not hours: they will not read a full resume to find out whether someone has worked with payments or which stack they know. A generic chatbot would answer by making things up, which is worse than not answering. And a public endpoint that calls a model invites abuse and spending someone else's money, so the assistant had to be useful, honest about what it does not know, and cheap to keep open.",
        solution:
          "The model can only answer from a knowledge block built from the same data that powers the site (projects, experience, certifications and an extended profile with no phone number or references), and it cites where each fact comes from with markers like [[project:waypoint]] that the chat turns into links; references that do not exist are dropped on the client. It runs on Claude Haiku 5.5 with streamed responses, and that knowledge block uses prompt caching because it is identical on every question. The endpoint checks origin and body shape, caps questions at 500 characters and conversations at 8 turns, ignores instructions that try to change its role, and enforces 10 questions per hour per IP (stored only as a hash) and 300 per day site-wide. It is bilingual, the button can be dragged to either edge, and on phones it does not pop the keyboard open on entry.",
        outcome:
          "It runs in production and answers in about 3 to 4 seconds, measured from the browser. Getting there meant debugging three failures that never showed up locally: Haiku 5.5 rejects the temperature parameter; with extended thinking on it spent every token reasoning and returned an empty answer, so thinking is disabled and an empty answer now logs its reason; and on Netlify the function hung for 30 seconds until the platform killed it, so every external step (rate-limit storage and the model call) now has a timeout and logs how long it took. Cost is under a tenth of a cent per question, estimated from the model's published prices and not yet measured against real usage.",
      },
    },
    brief: {
      es: {
        problem:
          "Un reclutador tiene minutos, no horas, y un chat genérico inventaría: el asistente tenía que ser útil, honesto sobre lo que no sabe y barato de mantener abierto.",
        solution: {
          lead: "El modelo solo puede responder desde un bloque de conocimiento armado con los mismos datos del sitio: proyectos, experiencia, certificaciones y un perfil extendido.",
          points: [
            "Cita cada dato con un enlace a su fuente; las referencias inexistentes se descartan.",
            "Corre en Claude Haiku 5.5 con streaming y prompt caching del bloque de conocimiento.",
            "Valida origen y forma del cuerpo e ignora instrucciones que intenten cambiar su papel.",
            "10 preguntas por hora por IP y 300 al día para todo el sitio.",
          ],
        },
        outcome: {
          lead: "Funciona en producción y responde en unos **3 a 4 segundos**, medidos desde el navegador, tras depurar tres fallas que en local no aparecían.",
          points: [
            "Haiku 5.5 rechaza el parámetro temperature.",
            "El razonamiento extendido gastaba todos los tokens y devolvía una respuesta vacía: se desactiva.",
            "En Netlify se colgaba 30 segundos: cada paso externo tiene ahora un tiempo máximo.",
            "Menos de **una milésima de dólar** por pregunta: estimado, aún no medido.",
          ],
        },
      },
      en: {
        problem:
          "Recruiters have minutes, not hours, and a generic chatbot makes things up: the assistant had to be useful, honest about what it does not know and cheap to keep open.",
        solution: {
          lead: "The model can only answer from a knowledge block built from the same data as the site: projects, experience, certifications and an extended profile.",
          points: [
            "It cites each fact with a link to its source; nonexistent references are dropped.",
            "Runs on Claude Haiku 5.5 with streaming and prompt caching for the knowledge block.",
            "Checks origin and body shape, and ignores instructions that try to change its role.",
            "10 questions per hour per IP and 300 a day site-wide.",
          ],
        },
        outcome: {
          lead: "It runs in production and answers in about **3 to 4 seconds**, measured from the browser, after debugging three failures that never showed up locally.",
          points: [
            "Haiku 5.5 rejects the temperature parameter.",
            "Extended thinking spent every token and returned an empty answer, so it is disabled.",
            "On Netlify it hung for 30 seconds; every external step now has a timeout.",
            "Under **a tenth of a cent** per question: estimated, not yet measured.",
          ],
        },
      },
    },
  },
  {
    slug: "real-estate-lead-management",
    categories: ["fullstack"],
    updatedAt: "2026-09-08",
    year: "2026",
    cover: "/projects/real-estate-lead-management-login.jpg",
    gallery: [
      {
        src: "/projects/real-estate-lead-management-login.jpg",
        alt: {
          es: "El acceso, con las credenciales de demostración a la vista",
          en: "Sign-in, with the demo credentials in plain sight",
        },
      },
      {
        src: "/projects/real-estate-lead-management.jpg",
        alt: {
          es: "Seguimiento de leads: indicadores, filtros por estado, fuente y proyecto, y la tabla de prospectos",
          en: "Lead tracking: metrics, filters by status, source and project, and the prospects table",
        },
      },
      {
        src: "/projects/real-estate-lead-management-nuevo-lead.jpg",
        alt: {
          es: "Alta de un lead desde un formulario en diálogo, sin salir del tablero",
          en: "Adding a lead from a dialog form, without leaving the dashboard",
        },
      },
    ],
    stack: ["Angular", "TypeScript", "Node.js", "Express", "MongoDB", "Playwright", "Docker"],
    repoUrl: "https://github.com/GerardoAmaya/real-estate-lead-management",
    featured: true,
    i18n: {
      es: {
        title: "Real Estate Lead Management",
        tagline:
          "Módulo de seguimiento de leads inmobiliarios con un dashboard de métricas resuelto en una sola consulta de agregación.",
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
          "Real-estate lead tracking module with a metrics dashboard resolved in a single aggregation query.",
        role: "Fullstack Developer",
        problem:
          "The module needed a filtered, paginated list, status changes, lead creation and a metrics dashboard. The risk was in the dashboard: resolving total, average budget, reserved leads, conversion rate and three breakdowns with separate queries means six round trips to the database and, worse, six snapshots taken at different moments.",
        solution:
          "The dashboard resolves in a single $facet aggregation stage, and the groupings share a function-generated subpipeline, so adding a new breakdown is one line. Indexes live in migrations rather than the schema, with autoIndex off, following the ESR pattern so the screen's real query is served without an in-memory sort. Validation is layered: strict Zod at the API, which closes mass assignment and Mongo operator injection at once, plus $jsonSchema on the database itself, so a script or a direct connection cannot insert invalid data either.",
        outcome:
          "Delivered with Playwright E2E tests, a green SonarCloud quality gate and a written technical analysis covering the data model, an incident diagnosis, the AWS architecture and the migration plan.",
      },
    },
    brief: {
      es: {
        problem:
          "El riesgo estaba en el dashboard: resolver sus métricas con consultas separadas significa seis viajes a la base y, peor, seis fotos tomadas en momentos distintos.",
        solution: {
          lead: "El dashboard se resuelve con una única etapa de agregación $facet, y la validación es doble: en la API y en la propia base.",
          points: [
            "Los agrupamientos comparten un subpipeline generado por función: un desglose nuevo es una línea.",
            "Índices en migraciones, con autoIndex desactivado y patrón ESR: sin ordenamiento en memoria.",
            "Zod estricto en la API cierra mass assignment e inyección de operadores de Mongo.",
            "$jsonSchema en la base, para que un script tampoco pueda insertar datos inválidos.",
          ],
        },
        outcome: {
          lead: "Módulo entregado, probado y documentado.",
          points: [
            "Pruebas E2E en Playwright y quality gate de SonarCloud en verde.",
            "Análisis técnico escrito: modelo de datos y diagnóstico de un incidente.",
            "El mismo análisis cubre la arquitectura en AWS y el plan de migración.",
          ],
        },
      },
      en: {
        problem:
          "The risk was in the dashboard: resolving its metrics with separate queries means six round trips to the database and, worse, six snapshots taken at different moments.",
        solution: {
          lead: "The dashboard resolves in a single $facet aggregation stage, and validation is layered: at the API and on the database itself.",
          points: [
            "Groupings share a function-generated subpipeline, so adding a new breakdown is one line.",
            "Indexes live in migrations with autoIndex off, following ESR: no in-memory sort.",
            "Strict Zod at the API closes mass assignment and Mongo operator injection.",
            "$jsonSchema on the database, so a script cannot insert invalid data either.",
          ],
        },
        outcome: {
          lead: "Module delivered, tested and documented.",
          points: [
            "Playwright E2E tests and a green SonarCloud quality gate.",
            "Written technical analysis: data model and an incident diagnosis.",
            "The same analysis covers the AWS architecture and the migration plan.",
          ],
        },
      },
    },
  },
  {
    slug: "nestjs-ai-pentest-skill",
    categories: ["ai", "backend"],
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
          "Skill de Claude AI que lee proyectos NestJS y genera una suite Jest de pentest grado profesional, con reportes HTML/Excel auditables.",
        role: "AI Skill Author · Security Engineering",
        problem:
          "Auditar la seguridad de una API NestJS suele requerir un especialista, varias herramientas y semanas de trabajo manual. No existía una forma rápida de mapear toda la superficie de seguridad de un proyecto y traducirla a evidencia accionable que un equipo de cumplimiento pueda revisar.",
        solution:
          "Construí una skill de Claude Code que mapea exhaustivamente controllers, DTOs, guards, pipes, interceptors, filters, middleware y entidades, y genera una suite Jest con tags OWASP Top 10 (2021), API Security Top 10 (2023) y un checklist propio de 60 ítems. Cada test guarda evidencia input/output en JSON, severidad, y N/A justificados con grep. El reporter empaqueta todo en un HTML auditable + Excel: sin servidor, sin dependencias externas.",
        outcome:
          "Cualquier equipo NestJS puede correr una auditoría de seguridad alineada con OWASP en minutos, no semanas. El reporte es un archivo único listo para enviarse por correo, adjuntarse a un ticket o anexarse a una entrega de cumplimiento.",
      },
      en: {
        title: "NestJS AI Pentest Skill",
        tagline:
          "Claude AI skill that reads NestJS projects and generates a pentest-grade Jest suite with auditable HTML/Excel reports.",
        role: "AI Skill Author · Security Engineering",
        problem:
          "Auditing the security of a NestJS API typically requires a specialist, multiple tools and weeks of manual work. There was no quick way to map a project's full security surface and turn it into actionable evidence a compliance team can review.",
        solution:
          "Built a Claude Code skill that exhaustively maps controllers, DTOs, guards, pipes, interceptors, filters, middleware and entities, and generates a Jest suite tagged with OWASP Top 10 (2021), API Security Top 10 (2023) and a custom 60-item checklist. Each test captures input/output JSON evidence, severity, and grep-justified N/A items. The bundled reporter wraps everything into a single auditable HTML + Excel: no server, no external dependencies.",
        outcome:
          "Any NestJS team can run an OWASP-aligned security audit in minutes instead of weeks. The report is a single file ready to email, attach to a ticket or annex to a compliance delivery.",
      },
    },
  },
  {
    slug: "travel-quote-api",
    categories: ["backend"],
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
          "API REST de cotizaciones para transporte turístico con arquitectura limpia y contenerizada.",
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
          "REST API for tourism transport quotations with a clean, containerized architecture.",
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
    categories: ["fullstack"],
    updatedAt: "2026-04-29",
    year: "2024",
    cover: "/projects/SafeOnSivar.jpg",
    stack: ["Laravel", "PHP", "MySQL", "Bootstrap", "JavaScript"],
    videoUrl: "https://youtu.be/OCd7V5g8RRU",
    i18n: {
      es: {
        title: "Safe On Sivar",
        tagline: "Plataforma para reportar y consultar incidentes de seguridad en El Salvador.",
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
        tagline: "Platform to report and browse security incidents in El Salvador.",
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
    categories: ["backend"],
    updatedAt: "2026-04-29",
    year: "2024",
    cover: "/projects/flask-shop-api.png",
    stack: ["Python", "Flask", "SQLAlchemy", "REST API"],
    repoUrl: "https://github.com/GerardoAmaya/flask-shop-api",
    featured: true,
    i18n: {
      es: {
        title: "Flask Shop API",
        tagline: "API de e-commerce construida con Flask y SQLAlchemy ORM.",
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
        tagline: "E-commerce API built with Flask and SQLAlchemy ORM.",
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
    categories: ["frontend"],
    updatedAt: "2026-04-29",
    year: "2023",
    cover: "/projects/PokeAPI.jpg",
    stack: ["React", "JavaScript", "REST API", "CSS"],
    videoUrl: "https://youtu.be/fHk05FWcLlQ",
    i18n: {
      es: {
        title: "PokeAPI Explorer",
        tagline: "Catálogo interactivo consumiendo la PokeAPI pública.",
        role: "Frontend Developer",
        problem:
          "Necesitaba practicar consumo de APIs REST, paginación y búsqueda en una SPA con buen UX.",
        solution:
          "Construí un explorador en React con búsqueda, filtros, paginación y vista detalle. Manejo de estados de carga y error.",
        outcome: "Aplicación responsiva con UX cuidada, lista para escalar a más fuentes de datos.",
      },
      en: {
        title: "PokeAPI Explorer",
        tagline: "Interactive catalog consuming the public PokeAPI.",
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
    categories: ["backend"],
    updatedAt: "2026-04-29",
    year: "2024",
    cover: "/projects/django-company-api.png",
    stack: ["Python", "Django", "MySQL", "Auth"],
    repoUrl: "https://github.com/GerardoAmaya/django-company-api",
    featured: true,
    i18n: {
      es: {
        title: "Django Company API",
        tagline: "Aplicación Django con autenticación completa y persistencia en MySQL.",
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
        tagline: "Django app with full authentication and MySQL persistence.",
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
