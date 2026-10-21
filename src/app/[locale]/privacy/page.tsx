import type { Metadata } from 'next';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { privacySections, privacyUpdated } from '@/data/legal';
import { tx } from '@/lib/i18n';
import { languageAlternates } from '@/lib/site';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });
  return {
    title: t('privacyTitle'),
    description: t('privacyDescription'),
    alternates: { ...languageAlternates('/privacy'), canonical: `/${locale}/privacy` },
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('footer');
  const tu = await getTranslations('universe');
  return (
    <div className="container-x max-w-3xl pb-24 pt-28">
      <Link href="/" className="btn btn-ghost mb-8 h-10 min-h-0 px-3 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {tu('back')}
      </Link>
      <article className="glass-strong rounded-3xl p-6 md:p-10">
        <p className="kicker flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal" aria-hidden="true" />
          CHAVATRIX UNIVERSE
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">{t('privacy')}</h1>
        <p className="mt-2 text-sm text-muted">
          {locale === 'en' ? 'Last updated' : 'Última actualización'}: {tx(privacyUpdated, locale)}
        </p>
        <div className="mt-8 flex flex-col gap-8">
          {privacySections.map((s) => (
            <section key={s.title.es}>
              <h2 className="font-display text-lg font-semibold">{tx(s.title, locale)}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="mt-2 leading-relaxed text-fg/90">
                  {tx(p, locale)}
                </p>
              ))}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
