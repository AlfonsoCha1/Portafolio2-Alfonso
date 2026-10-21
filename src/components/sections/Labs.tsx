'use client';

import { CheckCircle2, Hourglass, SquareTerminal } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { labs } from '@/data/skills';
import { projectsInCategory } from '@/data/projects';
import { tx } from '@/lib/i18n';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CyberTerminal } from '@/components/terminal/CyberTerminal';
import { useUI } from '@/components/providers/AppProvider';

export function Labs() {
  const t = useTranslations('labs');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { setTerminalOpen } = useUI();
  const cyberProjects = projectsInCategory('cyber');

  return (
    <section id="laboratorios" aria-labelledby="labs-title" className="section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_30%,rgba(0,229,255,0.07),transparent_70%)]" />
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#00E5FF" id="labs-title" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col gap-3">
            {labs.map((l, i) => {
              const ok = l.status === 'available';
              const color = ok ? '#4DFFB5' : '#FFC46B';
              const body = (
                <>
                  {ok ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} aria-hidden="true" /> : <Hourglass className="mt-0.5 h-5 w-5 shrink-0" style={{ color }} aria-hidden="true" />}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-sm font-semibold">{tx(l.name, locale)}</h3>
                      <span className="rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase" style={{ color, background: `${color}1f` }}>
                        {ok ? t('available') : t('pending')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{tx(l.detail, locale)}</p>
                  </div>
                </>
              );
              return (
                <Reveal key={l.id} delay={i * 0.04}>
                  {l.link ? (
                    <a href={l.link} target="_blank" rel="noopener noreferrer" className="neon-card flex items-start gap-3 p-4" style={{ '--accent': '#00E5FF' } as React.CSSProperties} aria-label={`${tx(l.name, locale)} ${tc('newTab')}`}>
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 rounded-[1.25rem] border border-dashed border-line p-4">{body}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <div className="flex flex-col gap-5">
            <Reveal>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
                    <SquareTerminal className="h-5 w-5 text-cyan" aria-hidden="true" />
                    {t('terminal')}
                  </h3>
                  <p className="text-sm text-muted">{t('terminalIntro')}</p>
                </div>
                <button type="button" className="btn btn-ghost hidden h-10 min-h-0 px-3 text-xs sm:inline-flex" onClick={() => setTerminalOpen(true)}>
                  {t('openTerminal')} <kbd className="rounded border border-line px-1 font-mono text-[10px]">Ctrl K</kbd>
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <CyberTerminal />
            </Reveal>
            <Reveal delay={0.1}>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-dim">{t('related')}</h3>
              <ul className="flex flex-wrap gap-2">
                {cyberProjects.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="glass inline-flex min-h-[40px] items-center gap-2 rounded-xl px-3 text-xs font-semibold hover:text-cyan">
                      {p.name}
                      <StatusBadge status={p.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
