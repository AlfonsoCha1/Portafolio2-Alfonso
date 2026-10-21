import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { projects } from './src/data/projects';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';
// En Vercel (HTTPS) se fuerzan las subidas a HTTPS; en local (http://localhost) no.
const onHttps = process.env.VERCEL === '1';
// Vistas previas (por ejemplo en Render): NOINDEX=1 evita que los buscadores las indexen.
const noIndex = process.env.NOINDEX === '1';

/**
 * Content-Security-Policy.
 * - No se cargan scripts, fuentes ni imágenes de terceros: todo se sirve desde el propio dominio.
 * - 'unsafe-inline' en scripts es necesario para el script de tema (evita parpadeo) y la
 *   hidratación de Next.js sin nonces. 'unsafe-eval' solo en desarrollo.
 */
// Páginas de los proyectos que se pueden ver en vivo dentro del portafolio (solo bajo demanda).
const frameOrigins = [...new Set(projects.filter((p) => p.demo && p.livePreview !== false).map((p) => new URL(p.demo as string).origin))];

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  `frame-src 'self' ${frameOrigins.join(' ')}`,
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(onHttps ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), serial=(), hid=(), browsing-topics=()',
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-site' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
  { key: 'Origin-Agent-Cluster', value: '?1' },
  ...(onHttps ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }] : []),
  ...(noIndex ? [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] : []),
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        source: '/cv/:file*',
        // Sin caché larga: al actualizar el CV, los visitantes descargan siempre la versión nueva.
        headers: [{ key: 'Cache-Control', value: 'public, max-age=0, must-revalidate' }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
