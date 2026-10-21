import type { MetadataRoute } from 'next';
import { categories } from '@/data/categories';
import { projects } from '@/data/projects';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', '/cv', '/privacy', ...projects.map((p) => `/projects/${p.slug}`), ...categories.map((c) => `/modules/${c.id}`)];
  const lastModified = new Date('2026-10-20');
  return paths.map((path) => ({
    url: `${SITE_URL}/es${path}`,
    lastModified,
    changeFrequency: path === '' ? 'monthly' : 'yearly',
    priority: path === '' ? 1 : path === '/cv' ? 0.9 : 0.6,
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  }));
}
