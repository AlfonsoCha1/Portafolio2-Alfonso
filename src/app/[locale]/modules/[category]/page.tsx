import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { categories, categoryMap } from '@/data/categories';
import type { CategoryId } from '@/data/types';
import { routing } from '@/i18n/routing';
import { tx } from '@/lib/i18n';
import { languageAlternates } from '@/lib/site';
import { ModuleContent } from '@/components/universe/ModuleContent';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => categories.map((c) => ({ locale, category: c.id })));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; category: string }> }): Promise<Metadata> {
  const { locale, category } = await params;
  const c = categoryMap[category as CategoryId];
  if (!c) return {};
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: tx(c.name, locale),
    description: `${tx(c.description, locale)} — ${t('moduleSuffix')}`,
    alternates: { ...languageAlternates(`/modules/${category}`), canonical: `/${locale}/modules/${category}` },
  };
}

export default async function ModulePage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params;
  setRequestLocale(locale);
  const c = categoryMap[category as CategoryId];
  if (!c) notFound();
  const t = await getTranslations('universe');
  const tm = await getTranslations('modules');
  return (
    <div className="container-x pb-24 pt-28">
      <Link href="/" className="btn btn-ghost mb-8 h-10 min-h-0 px-3 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('back')}
      </Link>
      <div className="glass-strong rounded-3xl p-6 md:p-10" style={{ borderColor: `${c.color}55`, boxShadow: `0 0 80px -40px ${c.color}` }}>
        <ModuleContent category={c} headingLevel={1} />
      </div>
      <nav aria-label={tm('otherModules')} className="mt-10">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-dim">{tm('otherModules')}</h2>
        <ul className="flex flex-wrap gap-2">
          {categories
            .filter((x) => x.id !== c.id)
            .map((x) => (
              <li key={x.id}>
                <Link href={`/modules/${x.id}`} className="glass inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3 text-sm font-semibold" style={{ '--accent': x.color } as React.CSSProperties}>
                  <CategoryIcon id={x.id} className="h-4 w-4 text-accent" />
                  {tx(x.name, locale)}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}
