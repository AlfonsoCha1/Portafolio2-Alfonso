import { Download, FileText } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { tx } from '@/lib/i18n';
import { Link } from '@/i18n/navigation';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { Reveal } from '@/components/ui/Reveal';

export function CVTeaser() {
  const t = useTranslations('cvSection');
  const locale = useLocale();
  return (
    <section id="cv" aria-labelledby="cv-title" className="section">
      <div className="container-x">
        <Reveal>
          <div className="neon-card relative overflow-hidden p-8 md:p-12" style={{ '--accent': '#9D35FF', '--accent-2': '#00E5FF' } as React.CSSProperties}>
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(157,53,255,0.35),transparent_65%)]" />
            <div className="relative grid grid-cols-1 items-center gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="kicker">{t('kicker')}</p>
                <h2 id="cv-title" className="mt-2 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  {t('title')}
                </h2>
                <p className="mt-3 max-w-xl text-muted">{t('intro')}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/cv" className="btn btn-primary" data-testid="cv-view">
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    {t('view')}
                  </Link>
                  <a href={profile.cv.es} download className="btn btn-ghost" data-testid="cv-download-es">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {t('downloadEs')}
                  </a>
                  <a href={profile.cv.en} download className="btn btn-ghost" data-testid="cv-download-en">
                    <Download className="h-4 w-4" aria-hidden="true" />
                    {t('downloadEn')}
                  </a>
                </div>
              </div>
              <ol className="relative flex flex-col gap-3 border-l border-line pl-5">
                {experience.slice(0, 4).map((e) => (
                  <li key={e.id} className="relative">
                    <span aria-hidden="true" className="absolute -left-[26px] top-1.5 h-3 w-3 rounded-full" style={{ background: e.color, boxShadow: `0 0 10px ${e.color}` }} />
                    <p className="text-sm font-semibold">{e.company}</p>
                    <p className="text-xs text-muted">{tx(e.role, locale)} · {tx(e.period, locale)}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
