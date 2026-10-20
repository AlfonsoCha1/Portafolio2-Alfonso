import { NextResponse, type NextRequest } from 'next/server';
import { contactSchema, escapeHtml, looksLikeBot } from '@/lib/contact-schema';
import { createRateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 10_000;
// 5 envíos cada 10 minutos por IP y un tope general para frenar abusos distribuidos
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });
const globalLimiter = createRateLimiter({ limit: 60, windowMs: 10 * 60 * 1000 });

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') ?? 'unknown';
}

function json(body: unknown, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store', ...headers } });
}

export async function POST(req: NextRequest) {
  // Solo solicitudes enviadas desde el propio sitio (el navegador siempre envía Origin en un POST)
  const origin = req.headers.get('origin');
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host');
  let sameOrigin = false;
  try {
    sameOrigin = Boolean(origin && host && new URL(origin).host === host);
  } catch {
    sameOrigin = false;
  }
  if (!sameOrigin) return json({ error: 'forbidden' }, 403);
  if (req.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'forbidden' }, 403);

  if (!req.headers.get('content-type')?.includes('application/json')) return json({ error: 'bad_request' }, 415);
  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);

  const rl = limiter(clientIp(req));
  if (!rl.allowed) return json({ error: 'rate_limited', retryAfter: rl.retryAfterSeconds }, 429, { 'Retry-After': String(rl.retryAfterSeconds) });
  const grl = globalLimiter('global');
  if (!grl.allowed) return json({ error: 'rate_limited', retryAfter: grl.retryAfterSeconds }, 429, { 'Retry-After': String(grl.retryAfterSeconds) });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413);

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return json({ error: 'bad_request' }, 400);
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    // Solo códigos propios (sin detalles internos del validador)
    const fields = Object.fromEntries(
      parsed.error.issues.map((i) => [String(i.path[0] ?? 'form'), /^[a-zA-Z]+$/.test(i.message) ? i.message : 'invalid']),
    );
    return json({ error: 'validation', fields }, 400);
  }
  const data = parsed.data;
  if (looksLikeBot(data)) return json({ error: 'spam' }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL;
  // Sin servicio de envío configurado NO se finge el envío.
  if (!apiKey || !from || !to) return json({ error: 'not_configured' }, 503);

  const subject = `[Portafolio] ${data.subject || (data.locale === 'en' ? 'New message' : 'Nuevo mensaje')} — ${data.name}`;
  const text = `Nombre: ${data.name}\nCorreo: ${data.email}\nIdioma: ${data.locale}\n\n${data.message}`;
  const html = `<p><strong>Nombre:</strong> ${escapeHtml(data.name)}<br><strong>Correo:</strong> ${escapeHtml(data.email)}<br><strong>Idioma:</strong> ${data.locale}</p><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: data.email, subject: subject.slice(0, 200), text, html }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return json({ error: 'send_failed' }, 502);
  } catch {
    return json({ error: 'send_failed' }, 502);
  }
  return json({ ok: true }, 200);
}

export function GET() {
  return json({ error: 'method_not_allowed' }, 405, { Allow: 'POST' });
}
