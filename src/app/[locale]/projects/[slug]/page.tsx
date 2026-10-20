import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { ProjectDetail } from '@/components/projects/ProjectDetail';
import { getProject, projects } from '@/data/projects';
import { routing } from '@/i18n/routing';
import { tx } from '@/lib/i18n';
import { languageAlternates } from '@/lib/site';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: project.name,
    description: `${tx(project.summary, locale)} — ${t('projectSuffix')}`,
    alternates: { ...languageAlternates(`/projects/${slug}`), canonical: `/${locale}/projects/${slug}` },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = getProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
