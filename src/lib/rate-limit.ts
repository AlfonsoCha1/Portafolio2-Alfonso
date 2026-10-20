/**
 * Limitador de frecuencia en memoria (ventana deslizante) por clave (IP).
 * Nota: en serverless cada instancia tiene su propia memoria; para un límite global
 * estricto se puede sustituir por Redis/Upstash sin cambiar la interfaz.
 */
export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function createRateLimiter(opts: { limit: number; windowMs: number; maxKeys?: number }) {
  const hits = new Map<string, number[]>();
  const maxKeys = opts.maxKeys ?? 5000;

  return function check(key: string, now: number = Date.now()): RateLimitResult {
    const windowStart = now - opts.windowMs;
    const list = (hits.get(key) ?? []).filter((t) => t > windowStart);
    if (list.length >= opts.limit) {
      const oldest = list[0] ?? now;
      hits.set(key, list);
      return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, Math.ceil((oldest + opts.windowMs - now) / 1000)) };
    }
    list.push(now);
    hits.set(key, list);
    if (hits.size > maxKeys) {
      // Limpieza simple: elimina la clave más antigua.
      const first = hits.keys().next().value;
      if (first !== undefined) hits.delete(first);
    }
    return { allowed: true, remaining: opts.limit - list.length, retryAfterSeconds: 0 };
  };
}
