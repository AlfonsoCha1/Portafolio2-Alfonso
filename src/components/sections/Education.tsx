import { GraduationCap } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { education } from '@/data/education';
import { tx } from '@/lib/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Education() {
  const t = useTranslations('education');
  const locale = useLocale();
  const colors = ['#FF943D', '#9D35FF'];
  return (
    <section id="educacion" aria-labelledby="education-title" className="section">
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} accent="#FF943D" id="education-title" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {education.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <article className="neon-card flex h-full flex-col gap-4 p-6" style={{ '--accent': colors[i % 2] } as React.CSSProperties}>
                <div className="flex-1">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border" style={{ borderColor: `${colors[i % 2]}66`, boxShadow: `0 0 24px -8px ${colors[i % 2]}` }}>
                    <GraduationCap className="h-6 w-6 text-accent" aria-hidden="true" />
                  </span>
                  <p className="mt-4 font-mono text-xs font-bold text-accent">{tx(e.period, locale)}</p>
                  <h3 className="mt-1 font-display text-xl font-semibold leading-snug">{tx(e.program, locale)}</h3>
                  <p className="mt-1 text-sm font-semibold">{e.institution}</p>
                  <p className="text-sm text-muted">{tx(e.mode, locale)}</p>
                  {e.detail ? <p className="mt-3 text-sm text-muted">{tx(e.detail, locale)}</p> : null}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
