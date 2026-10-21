import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { InteractiveCV } from '@/components/cv/InteractiveCV';
import { languageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('cvTitle'),
    description: t('cvDescription'),
    alternates: { ...languageAlternates('/cv'), canonical: `/${locale}/cv` },
  };
}

export default async function CVPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <InteractiveCV />;
}
