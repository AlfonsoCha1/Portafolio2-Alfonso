import { z } from 'zod';

/**
 * Esquema compartido por el formulario (cliente) y la API (servidor).
 * Los mensajes son claves de traducción (contact.errors.*).
 */
/** Quita caracteres de control (evita inyección de encabezados y texto invisible). */
const oneLine = (s: string) => s.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028\u2029]+/g, ' ').trim();
const multiLine = (s: string) => s.replace(/[\u0000-\u0009\u000B-\u001F\u007F\u200B-\u200F]+/g, ' ').trim();

export const contactSchema = z.object({
  name: z.string().transform(oneLine).pipe(z.string().min(2, 'nameMin').max(80, 'nameMax')),
  email: z.string().trim().max(120, 'emailInvalid').pipe(z.email('emailInvalid')),
  subject: z.string().transform(oneLine).pipe(z.string().max(120, 'subjectMax')).optional().default(''),
  message: z.string().transform(multiLine).pipe(z.string().min(10, 'messageMin').max(2000, 'messageMax')),
  /** Campo trampa (honeypot): debe llegar vacío. */
  website: z.string().max(0, 'spam').optional().default(''),
  /** Momento en que se abrió el formulario (ms). Envíos en menos de 3 s se tratan como bots. */
  startedAt: z.number().int().positive(),
  locale: z.enum(['es', 'en']).default('es'),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export const MIN_FILL_MS = 3000;

export function looksLikeBot(data: Pick<ContactData, 'website' | 'startedAt'>, now = Date.now()): boolean {
  return Boolean(data.website) || now - data.startedAt < MIN_FILL_MS;
}

/** Escapa HTML para el correo enviado. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string);
}
