import { defineRouting } from 'next-intl/routing';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  locales,
  defaultLocale: 'es',
  localePrefix: 'always',
  localeCookie: {
    // Cookie estrictamente funcional: recuerda el idioma elegido.
    name: 'CHAVATRIX_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  },
});
