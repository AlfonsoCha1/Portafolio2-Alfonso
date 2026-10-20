'use client';

import { Award, BadgeCheck, Clock, ExternalLink } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { certGroups, sortedCertifications } from '@/data/certifications';
import type { CertGroup } from '@/data/types';
import { tx } from '@/lib/i18n';
import { SectionHeading } from '@/components/ui/SectionHeading';

const INITIAL = 9;

/**
 * Certificaciones como texto (nombre, emisor, fecha, horas, competencias y verificación).
 * Por privacidad no se muestran imágenes de los documentos.
 */
export function CertificationGallery() {
  const t = useTranslations('certifications');
  const tc = useTranslations('common');
  const locale = useLocale();
  const [group, setGroup] = useState<'all' | CertGroup>('all');
  const [expanded, setExpanded] = useState(false);

  const list = useMemo(() => {
    const filtered = sortedCertifications.filter((c) => group === 'all' || c.group === group);
    return [...filtered].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [group]);
  const shown = expanded ? list : list.slice(0, INITIAL);
  const colorOf = (g: CertGroup) => certGroups.find((x) => x.id === g)?.color ?? '#9D35FF';

  return (
    <section id="certificaciones" aria-labelledby="certs-title" className="section">
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#19E3B1" id="certs-title" />

        <div role="group" aria-label={t('kicker')} className="scroll-thin -mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-wrap">
          {[{ id: 'all' as const, name: { es: t('all'), en: t('all') }, color: '#19E3B1' }, ...certGroups].map((g) => {
            const active = group === g.id;
            return (
              <button
                key={g.id}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setGroup(g.id);
                  setExpanded(false);
                }}
                className={`min-h-[42px] shrink-0 rounded-xl border px-3 text-xs font-bold transition-all ${active ? 'text-fg' : 'border-line text-muted hover:text-fg'}`}
                style={active ? { borderColor: g.color, background: `color-mix(in srgb, ${g.color} 16%, transparent)`, boxShadow: `0 0 22px -8px ${g.color}` } : undefined}
              >
                {tx(g.name, locale)}
              </button>
            );
          })}
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((c) => {
            const color = colorOf(c.group);
            return (
              <li key={c.id}>
                <article className="neon-card flex h-full flex-col gap-3 p-5" style={{ '--accent': color } as React.CSSProperties} data-testid="cert-card">
                  <div className="flex items-start gap-3">
                    <span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border"
                      style={{ borderColor: `${color}88`, background: `${color}14`, boxShadow: `0 0 22px -8px ${color}` }}
                    >
                      <Award className="h-5 w-5 text-accent" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-accent">{c.issuer}</p>
                      <h3 className="font-display text-base font-semibold leading-snug">{tx(c.name, locale)}</h3>
                    </div>
                  </div>
                  <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{tx(c.date, locale)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{tx(c.kind, locale)}</span>
                    {c.hours ? (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {t('hours', { hours: c.hours })}
                      </span>
                    ) : null}
                  </p>
                  {c.note ? <p className="text-[11px] italic leading-snug text-dim">{tx(c.note, locale)}</p> : null}
                  <ul className="flex flex-wrap gap-1.5" aria-label={t('skills')}>
                    {c.skills.map((s) => (
                      <li key={s} className="chip">
                        {s}
                      </li>
                    ))}
                  </ul>
                  {c.verifyUrl ? (
                    <a
                      href={c.verifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-accent mt-auto h-10 min-h-0 self-start px-3 text-xs"
                      aria-label={`${t('verify')}: ${tx(c.name, locale)} ${tc('newTab')}`}
                    >
                      <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                      {t('verify')}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>

        {list.length > INITIAL ? (
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={() => setExpanded((v) => !v)} className="btn btn-ghost" aria-expanded={expanded}>
              {expanded ? t('showLess') : t('showAll', { count: list.length })}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
