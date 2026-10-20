/**
 * URL pública del sitio. Configúrala en Vercel con NEXT_PUBLIC_SITE_URL cuando
 * tengas el dominio definitivo (se usa en metadatos, sitemap y Open Graph).
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://portafolio2-alfonso.vercel.app').replace(/\/$/, '');

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** Alternativas hreflang para una ruta sin prefijo de idioma (p. ej. "/cv"). */
export function languageAlternates(path: string) {
  const p = path === '/' ? '' : path;
  return {
    canonical: undefined as string | undefined,
    languages: {
      es: `/es${p}`,
      en: `/en${p}`,
      'x-default': `/es${p}`,
    },
  };
}
