import { useLocale, useTranslations } from 'next-intl';
import { skillGroups } from '@/data/skills';
import { tx } from '@/lib/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Skills() {
  const t = useTranslations('skills');
  const locale = useLocale();
  return (
    <section id="habilidades" aria-labelledby="skills-title" className="section">
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#D946EF" id="skills-title" />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {skillGroups.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.05} className={g.id === 'dev' ? 'md:col-span-2 xl:col-span-1 xl:row-span-2' : ''}>
              <article className="neon-card h-full p-6" style={{ '--accent': g.color } as React.CSSProperties}>
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                  <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: g.color, boxShadow: `0 0 12px ${g.color}` }} />
                  {tx(g.name, locale)}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((s) => (
                    <li key={tx(s.name, locale)} className="chip chip-accent text-[0.8rem]">
                      {tx(s.name, locale)}
                      {s.level ? <span className="rounded bg-[color-mix(in_srgb,var(--accent)_25%,transparent)] px-1 text-[10px] font-bold">{tx(s.level, locale)}</span> : null}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
