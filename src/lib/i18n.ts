import type { L, Locale } from '@/data/types';

/** Devuelve el texto en el idioma activo. Acepta texto plano o bilingüe. */
export function tx(value: string | L | null | undefined, locale: string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[(locale as Locale) === 'en' ? 'en' : 'es'];
}

export function isLocale(value: string): value is Locale {
  return value === 'es' || value === 'en';
}
