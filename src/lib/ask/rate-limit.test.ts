import { beforeEach, describe, expect, it, vi } from "vitest";

// Fuera de Netlify no hay contexto de Blobs: el módulo usa su almacenamiento en
// memoria. Se recarga en cada test para empezar con los contadores en cero.
let mod: typeof import("./rate-limit");
beforeEach(async () => {
  vi.resetModules();
  mod = await import("./rate-limit");
});

async function ask(ip: string, times: number) {
  const results = [];
  for (let i = 0; i < times; i++) results.push(await mod.checkRateLimit(ip));
  return results;
}

describe("checkRateLimit", () => {
  it("deja pasar PER_IP_LIMIT preguntas por IP y luego bloquea", async () => {
    const results = await ask("1.1.1.1", mod.PER_IP_LIMIT + 1);
    expect(results.slice(0, -1).every((r) => r.ok)).toBe(true);
    expect(results.at(-1)).toEqual({ ok: false, reason: "ip" });
  });

  it("cuenta cada IP por separado", async () => {
    await ask("1.1.1.1", mod.PER_IP_LIMIT);
    expect((await mod.checkRateLimit("2.2.2.2")).ok).toBe(true);
  });

  it("una IP bloqueada no consume el tope diario del sitio", async () => {
    // La IP atacante agota su cupo y sigue insistiendo
    await ask("6.6.6.6", mod.PER_IP_LIMIT + 50);

    // El resto del cupo diario sigue disponible para otros visitantes
    const remaining = mod.DAILY_LIMIT - mod.PER_IP_LIMIT;
    let served = 0;
    for (let n = 0; served < remaining; n++) {
      const results = await ask(`10.0.${Math.floor(n / 256)}.${n % 256}`, mod.PER_IP_LIMIT);
      served += results.filter((r) => r.ok).length;
      expect(results.every((r) => r.ok)).toBe(true);
    }
    expect(served).toBe(remaining);

    // Con el tope alcanzado, una IP nueva recibe el aviso diario
    expect(await mod.checkRateLimit("9.9.9.9")).toEqual({ ok: false, reason: "daily" });
  });

  it("no se pasa del límite con peticiones simultáneas", async () => {
    const results = await Promise.all(
      Array.from({ length: 30 }, () => mod.checkRateLimit("3.3.3.3"))
    );
    const ok = results.filter((r) => r.ok).length;
    expect(ok).toBeGreaterThan(0);
    expect(ok).toBeLessThanOrEqual(mod.PER_IP_LIMIT);
  });
});
