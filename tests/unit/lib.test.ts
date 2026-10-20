import { describe, expect, it } from 'vitest';
import { nextThemeMode, resolveTheme, themeForHour, THEME_MODES } from '@/lib/theme';
import { evaluateCapabilities } from '@/lib/capabilities';
import { createRateLimiter } from '@/lib/rate-limit';
import { contactSchema, escapeHtml, looksLikeBot, MIN_FILL_MS } from '@/lib/contact-schema';
import { tx } from '@/lib/i18n';

describe('tema (4 modos)', () => {
  it('el botón recorre Automático → Claro → Nocturno → Según la hora → Automático', () => {
    expect(THEME_MODES).toEqual(['system', 'light', 'dark', 'time']);
    expect(nextThemeMode('system')).toBe('light');
    expect(nextThemeMode('light')).toBe('dark');
    expect(nextThemeMode('dark')).toBe('time');
    expect(nextThemeMode('time')).toBe('system');
  });

  it('automático sigue al dispositivo', () => {
    expect(resolveTheme('system', true, 12)).toBe('dark');
    expect(resolveTheme('system', false, 23)).toBe('light');
  });

  it('según la hora: claro de 7:00 a 18:59', () => {
    expect(themeForHour(6)).toBe('dark');
    expect(themeForHour(7)).toBe('light');
    expect(themeForHour(18)).toBe('light');
    expect(themeForHour(19)).toBe('dark');
    expect(resolveTheme('time', true, 10)).toBe('light');
  });

  it('claro y nocturno ignoran al sistema', () => {
    expect(resolveTheme('light', true, 2)).toBe('light');
    expect(resolveTheme('dark', false, 12)).toBe('dark');
  });
});

describe('detección de capacidades', () => {
  it('sin WebGL siempre usa 2D', () => {
    expect(evaluateCapabilities({ webgl: false, cores: 16, memoryGB: 32 }).recommended).toBe('2d');
  });
  it('equipos potentes usan 3D en alta calidad', () => {
    expect(evaluateCapabilities({ webgl: true, cores: 8, memoryGB: 16 })).toMatchObject({ recommended: '3d', quality: 'high' });
  });
  it('equipos modestos usan 3D en calidad media', () => {
    expect(evaluateCapabilities({ webgl: true, cores: 4, memoryGB: 4 })).toMatchObject({ recommended: '3d', quality: 'medium' });
  });
  it('equipos débiles, ahorro de datos o movimiento reducido usan 2D', () => {
    expect(evaluateCapabilities({ webgl: true, cores: 2, memoryGB: 8 }).recommended).toBe('2d');
    expect(evaluateCapabilities({ webgl: true, cores: 8, saveData: true }).recommended).toBe('2d');
    expect(evaluateCapabilities({ webgl: true, cores: 8, reducedMotion: true }).recommended).toBe('2d');
  });
});

describe('limitador de frecuencia', () => {
  it('permite N envíos por ventana y luego bloquea con tiempo de espera', () => {
    const check = createRateLimiter({ limit: 3, windowMs: 60_000 });
    const t0 = 1_000_000;
    expect(check('ip', t0).allowed).toBe(true);
    expect(check('ip', t0 + 1).allowed).toBe(true);
    expect(check('ip', t0 + 2).allowed).toBe(true);
    const blocked = check('ip', t0 + 3);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSeconds).toBeGreaterThan(0);
    expect(check('otra-ip', t0 + 3).allowed).toBe(true);
    expect(check('ip', t0 + 60_001).allowed).toBe(true);
  });
});

describe('formulario de contacto', () => {
  const base = { name: 'Ana López', email: 'ana@example.com', message: 'Hola, me interesa tu perfil.', startedAt: 1000, locale: 'es' as const };

  it('acepta datos válidos y recorta espacios', () => {
    const r = contactSchema.safeParse({ ...base, name: '  Ana López  ' });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.name).toBe('Ana López');
  });

  it('rechaza correo inválido, mensaje corto y honeypot lleno', () => {
    expect(contactSchema.safeParse({ ...base, email: 'no-es-correo' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: 'corto' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, website: 'http://spam' }).success).toBe(false);
    expect(contactSchema.safeParse({ ...base, message: 'x'.repeat(2001) }).success).toBe(false);
  });

  it('detecta bots por velocidad de llenado', () => {
    expect(looksLikeBot({ website: '', startedAt: 10_000 }, 10_000 + MIN_FILL_MS - 1)).toBe(true);
    expect(looksLikeBot({ website: '', startedAt: 10_000 }, 10_000 + MIN_FILL_MS + 1)).toBe(false);
  });

  it('escapa HTML en el correo', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe('&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;');
  });
});

describe('i18n', () => {
  it('tx elige el idioma y acepta texto plano', () => {
    expect(tx({ es: 'Hola', en: 'Hi' }, 'en')).toBe('Hi');
    expect(tx({ es: 'Hola', en: 'Hi' }, 'es')).toBe('Hola');
    expect(tx('Python', 'en')).toBe('Python');
    expect(tx(null, 'es')).toBe('');
  });
});
