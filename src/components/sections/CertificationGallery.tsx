'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { CalendarDays, Clock } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';
import { certGroups, certifications, sortedCertifications } from '@/data/certifications';
import type { CertGroup } from '@/data/types';
import { tx } from '@/lib/i18n';
import { CertIcon } from '@/components/ui/CertIcon';
import { SectionHeading } from '@/components/ui/SectionHeading';

const INITIAL = 9;

/** Número que sube al entrar en pantalla. */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sin animación con movimiento reducido
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 1200);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);
  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

/**
 * Certificaciones: un cuadro por credencial con su ícono y color.
 * Solo texto: nombre, de qué trata, fecha y horas (sin imágenes ni enlaces a los documentos).
 */
export function CertificationGallery() {
  const t = useTranslations('certifications');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [group, setGroup] = useState<'all' | CertGroup>('all');
  const [expanded, setExpanded] = useState(false);

  const list = useMemo(() => {
    const filtered = sortedCertifications.filter((c) => group === 'all' || c.group === group);
    return [...filtered].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  }, [group]);
  const shown = expanded ? list : list.slice(0, INITIAL);
  const totalHours = certifications.reduce((sum, c) => sum + (c.hours ?? 0), 0);

  const stats = [
    { value: certifications.length, suffix: '', label: t('statCredentials'), color: '#19E3B1' },
    { value: totalHours, suffix: '+', label: t('statHours'), color: '#9D35FF' },
    { value: certGroups.length, suffix: '', label: t('statAreas'), color: '#00E5FF' },
  ];

  return (
    <section id="certificaciones" aria-labelledby="certs-title" className="section">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(50%_40%_at_80%_20%,rgba(25,227,177,0.08),transparent_70%),radial-gradient(40%_40%_at_10%_80%,rgba(157,53,255,0.08),transparent_70%)]" />
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#19E3B1" id="certs-title" />

        <dl className="mb-8 grid grid-cols-3 gap-3 sm:max-w-xl">
          {stats.map((s) => (
            <div key={s.label} className="glass flex flex-col-reverse rounded-2xl p-3 text-center sm:p-4" style={{ '--accent': s.color } as React.CSSProperties}>
              <dt className="mt-1 text-[11px] font-semibold text-muted sm:text-xs">{s.label}</dt>
              <dd className="font-display text-2xl font-bold text-accent sm:text-3xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>

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

        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {shown.map((c, i) => (
              <motion.li
                key={c.id}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0, y: 28, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.95 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: 0.55, delay: reduce ? 0 : (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <article className="cert-card flex h-full flex-col gap-4 p-5" style={{ '--accent': c.color } as React.CSSProperties} data-testid="cert-card">
                  <div className="relative z-[2] flex items-start justify-between gap-3">
                    <span className="cert-icon" style={{ animationDelay: `${(i % 4) * 0.6}s` }}>
                      <CertIcon name={c.icon} className="h-6 w-6" />
                    </span>
                    <span className="chip chip-accent">{tx(c.kind, locale)}</span>
                  </div>

                  <div className="relative z-[2] flex flex-1 flex-col">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-accent">{c.issuer}</p>
                    <h3 className="mt-1 font-display text-lg font-semibold leading-snug">{tx(c.name, locale)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{tx(c.summary, locale)}</p>
                    {c.note ? <p className="mt-2 text-[11px] italic leading-snug text-dim">{tx(c.note, locale)}</p> : null}
                  </div>

                  <div className="relative z-[2] mt-auto flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-line pt-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                      {tx(c.date, locale)}
                    </span>
                    {c.hours ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
                        {t('hours', { hours: c.hours })}
                      </span>
                    ) : null}
                  </div>
                </article>
              </motion.li>
            ))}
          </AnimatePresence>
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
