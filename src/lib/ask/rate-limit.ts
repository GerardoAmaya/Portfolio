/**
 * Límite de preguntas por IP y tope diario global, para acotar el gasto.
 *
 * En Netlify se guarda en Netlify Blobs (persiste entre instancias). En local
 * o si Blobs no está disponible, cae a memoria del proceso: suficiente para
 * desarrollo, y el tope de gasto de la consola de Anthropic sigue siendo la
 * red de seguridad final.
 */
import { createHash } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const PER_IP_LIMIT = 10; // preguntas por hora y por IP
export const DAILY_LIMIT = 300; // preguntas por día en todo el sitio

type Bucket = { count: number; resetAt: number };

// Blobs nunca debe bloquear la respuesta: si tarda, se usa la memoria
const BLOBS_TIMEOUT_MS = 2000;
function withTimeout<T>(promise: Promise<T>, ms = BLOBS_TIMEOUT_MS): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("blobs timeout")), ms)),
  ]);
}
const memory = new Map<string, Bucket>();
// Si Blobs falla una vez, esta instancia deja de intentarlo (no suma esperas)
let blobsDisabled = false;

async function bump(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  let store: ReturnType<typeof getStore> | null = null;
  try {
    store = blobsDisabled ? null : getStore("ask-rate-limit");
  } catch {
    store = null;
  }

  let bucket: Bucket | null = null;
  if (store) {
    try {
      bucket = (await withTimeout(store.get(key, { type: "json" }))) as Bucket | null;
    } catch (error) {
      console.warn("[ask] blobs get", error instanceof Error ? error.message : error);
      blobsDisabled = true;
      store = null;
    }
  }
  if (!store) bucket = memory.get(key) ?? null;

  if (!bucket || bucket.resetAt <= now) bucket = { count: 0, resetAt: now + windowMs };
  if (bucket.count >= limit) return { ok: false, resetAt: bucket.resetAt };

  bucket.count += 1;
  if (store) {
    try {
      await withTimeout(store.setJSON(key, bucket));
    } catch (error) {
      console.warn("[ask] blobs set", error instanceof Error ? error.message : error);
      blobsDisabled = true;
      memory.set(key, bucket);
    }
  } else {
    memory.set(key, bucket);
  }
  return { ok: true, resetAt: bucket.resetAt };
}

/** La IP no se guarda en claro: solo un hash truncado. */
function hashIp(ip: string) {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export async function checkRateLimit(ip: string) {
  const day = new Date().toISOString().slice(0, 10);
  const global = await bump(`day:${day}`, DAILY_LIMIT, 24 * 60 * 60 * 1000);
  if (!global.ok) return { ok: false as const, reason: "daily" as const };
  const perIp = await bump(`ip:${hashIp(ip)}`, PER_IP_LIMIT, 60 * 60 * 1000);
  if (!perIp.ok) return { ok: false as const, reason: "ip" as const };
  return { ok: true as const };
}
