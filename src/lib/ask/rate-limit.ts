/**
 * Límite de preguntas por IP y tope diario global, para acotar el gasto.
 *
 * En Netlify se guarda en Netlify Blobs (persiste entre instancias). En local
 * o si Blobs no está disponible, cae a memoria del proceso: suficiente para
 * desarrollo, y el tope de gasto de la consola de Anthropic sigue siendo la
 * red de seguridad final.
 *
 * Cada incremento es atómico: se lee con consistencia fuerte y se escribe solo
 * si el ETag no cambió (`onlyIfMatch`); si otra petición escribió antes, se
 * vuelve a leer y se reintenta. Así dos peticiones simultáneas no pueden leer
 * el mismo valor y pasarse del límite.
 */
import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const PER_IP_LIMIT = 10; // preguntas por hora y por IP
export const DAILY_LIMIT = 300; // preguntas por día en todo el sitio

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const MAX_ATTEMPTS = 4;

type Bucket = { count: number; resetAt: number };
type Entry = { bucket: Bucket | null; etag: string | undefined };

/** Lectura con su ETag y escritura condicional: `false` si otro escribió antes. */
interface Backend {
  read(key: string): Promise<Entry>;
  write(key: string, bucket: Bucket, etag: string | undefined): Promise<boolean>;
}

/* ------------------------------- Memoria ------------------------------- */

const memory = new Map<string, { bucket: Bucket; version: number }>();

const memoryBackend: Backend = {
  async read(key) {
    const entry = memory.get(key);
    return { bucket: entry?.bucket ?? null, etag: entry ? String(entry.version) : undefined };
  },
  async write(key, bucket, etag) {
    const entry = memory.get(key);
    if ((entry ? String(entry.version) : undefined) !== etag) return false;
    memory.set(key, { bucket, version: (entry?.version ?? 0) + 1 });
    return true;
  },
};

/* -------------------------------- Blobs -------------------------------- */

// Blobs nunca debe bloquear la respuesta: si tarda, se usa la memoria
const BLOBS_TIMEOUT_MS = 2000;
// Tras un fallo, esta instancia usa memoria un rato en vez de sumar esperas en
// cada petición, y luego vuelve a intentarlo
const BLOBS_COOLDOWN_MS = 5 * 60 * 1000;
let blobsRetryAt = 0;
// Si el entorno no ofrece lecturas fuertes, la escritura condicional fallaría
// en bucle contra la caché: se vuelve a la escritura simple (no atómica)
let strongReads = true;

function withTimeout<T>(promise: Promise<T>, ms = BLOBS_TIMEOUT_MS): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error("blobs timeout")), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

function blobsBackend(): Backend | null {
  if (Date.now() < blobsRetryAt) return null;
  let store: ReturnType<typeof getStore>;
  try {
    store = getStore("ask-rate-limit");
  } catch {
    // Fuera de Netlify no hay contexto de Blobs: no es un error, es local
    return null;
  }

  return {
    async read(key) {
      try {
        const result = await withTimeout(
          store.getWithMetadata(key, {
            type: "json",
            consistency: strongReads ? "strong" : "eventual",
          })
        );
        return { bucket: (result?.data as Bucket | undefined) ?? null, etag: result?.etag };
      } catch (error) {
        if (strongReads && error instanceof Error && error.name === "BlobsConsistencyError") {
          console.warn("[ask] blobs sin lectura fuerte: escrituras no atómicas");
          strongReads = false;
          return this.read(key);
        }
        throw error;
      }
    },
    async write(key, bucket, etag) {
      if (!strongReads) {
        await withTimeout(store.setJSON(key, bucket));
        return true;
      }
      const result = await withTimeout(
        store.setJSON(key, bucket, etag ? { onlyIfMatch: etag } : { onlyIfNew: true })
      );
      return result.modified;
    },
  };
}

/* ------------------------------- Límite -------------------------------- */

/** Suma 1 al contador si no llegó al límite. `false` si ya estaba lleno. */
async function increment(key: string, limit: number, windowMs: number): Promise<boolean> {
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const backend = blobsBackend() ?? memoryBackend;
    try {
      const { bucket, etag } = await backend.read(key);
      const now = Date.now();
      const current =
        !bucket || bucket.resetAt <= now ? { count: 0, resetAt: now + windowMs } : bucket;
      if (current.count >= limit) return false;
      if (await backend.write(key, { count: current.count + 1, resetAt: current.resetAt }, etag)) {
        return true;
      }
      // Otra petición escribió entre la lectura y la escritura: se reintenta
    } catch (error) {
      if (backend === memoryBackend) throw error;
      console.warn("[ask] blobs", error instanceof Error ? error.message : error);
      blobsRetryAt = Date.now() + BLOBS_COOLDOWN_MS;
    }
  }
  // Contención sostenida sobre la misma clave: se rechaza antes que gastar de más
  return false;
}

/** La IP no se guarda en claro: solo un hash truncado. */
function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

/**
 * Primero el límite por IP y solo después el global: una IP ya bloqueada no
 * debe consumir el cupo diario del sitio, o podría agotarlo ella sola.
 */
export async function checkRateLimit(ip: string) {
  if (!(await increment(`ip:${hashIp(ip)}`, PER_IP_LIMIT, HOUR_MS))) {
    return { ok: false as const, reason: "ip" as const };
  }
  const day = new Date().toISOString().slice(0, 10);
  if (!(await increment(`day:${day}`, DAILY_LIMIT, DAY_MS))) {
    return { ok: false as const, reason: "daily" as const };
  }
  return { ok: true as const };
}
