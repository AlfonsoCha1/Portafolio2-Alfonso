'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'motion/react';
import { Briefcase, CheckCircle2, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { experience } from '@/data/experience';
import { categoryMap } from '@/data/categories';
import { tx } from '@/lib/i18n';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useUI } from '@/components/providers/AppProvider';

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Línea del tiempo animada con tarjetas expandibles (patrón de pestañas accesible). */
export function CareerTimeline() {
  const t = useTranslations('experience');
  const locale = useLocale();
  const { openModule } = useUI();
  const [selected, setSelected] = useState(experience[0]?.id ?? '');
  const root = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = experience.find((e) => e.id === selected) ?? experience[0];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '[data-timeline-line]',
          { scaleX: 0, scaleY: 0 },
          { scaleX: 1, scaleY: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 75%', end: 'top 25%', scrub: true } },
        );
        gsap.from('[data-timeline-node]', {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 70%' },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const onKey = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % experience.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + experience.length) % experience.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = experience.length - 1;
    else return;
    e.preventDefault();
    const id = experience[next]?.id;
    if (id) setSelected(id);
    tabs.current[next]?.focus();
  };

  if (!current) return null;

  return (
    <section id="experiencia" ref={root} aria-labelledby="experience-title" className="section">
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#147DFF" id="experience-title" />

        <div className="relative">
          {/* Línea luminosa */}
          <div aria-hidden="true" className="absolute left-[19px] top-0 h-full w-[2px] lg:left-0 lg:top-[19px] lg:h-[2px] lg:w-full">
            <div className="h-full w-full bg-line" />
            <div data-timeline-line className="absolute inset-0 origin-top bg-gradient-to-b from-orange via-blue to-violet shadow-[0_0_12px_var(--blue)] lg:origin-left lg:bg-gradient-to-r" />
          </div>

          <div role="tablist" aria-label={t('title')} aria-orientation="horizontal" className="relative grid grid-cols-1 gap-3 lg:grid-cols-5 lg:gap-4">
            {experience.map((e, i) => {
              const active = e.id === selected;
              return (
                <button
                  key={e.id}
                  ref={(el) => void (tabs.current[i] = el)}
                  role="tab"
                  type="button"
                  id={`tab-${e.id}`}
                  aria-selected={active}
                  aria-controls={`panel-${e.id}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => {
                    setSelected(e.id);
                    // En móvil, lleva la vista al detalle de la etapa elegida
                    if (window.innerWidth < 1024) {
                      window.setTimeout(() => document.getElementById('timeline-detail')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
                    }
                  }}
                  onKeyDown={(ev) => onKey(ev, i)}
                  data-timeline-node
                  className="group flex items-start gap-3 text-left lg:flex-col"
                  style={{ '--accent': e.color } as React.CSSProperties}
                  data-testid={`timeline-${e.id}`}
                >
                  <span
                    className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${active ? 'scale-110' : 'group-hover:scale-105'}`}
                    style={{
                      borderColor: e.color,
                      background: active ? e.color : 'var(--bg)',
                      boxShadow: active ? `0 0 24px ${e.color}` : `0 0 10px -2px ${e.color}`,
                    }}
                  >
                    <Briefcase className="h-4 w-4" style={{ color: active ? '#060A19' : e.color }} aria-hidden="true" />
                  </span>
                  <span className={`flex-1 rounded-2xl border p-3 transition-all duration-300 lg:w-full ${active ? 'glass-strong' : 'border-transparent group-hover:border-line'}`} style={active ? { borderColor: `${e.color}88` } : undefined}>
                    <span className="block font-mono text-[11px] font-bold text-accent">{tx(e.period, locale)}</span>
                    <span className="mt-0.5 block font-display text-sm font-semibold leading-snug">{e.company}</span>
                    <span className="block text-xs text-muted">{tx(e.role, locale)}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div id="timeline-detail" className="scroll-mt-24" />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              role="tabpanel"
              id={`panel-${current.id}`}
              aria-labelledby={`tab-${current.id}`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="neon-card mt-6 grid grid-cols-1 gap-6 p-6 md:grid-cols-[1.4fr_1fr] md:p-8"
              style={{ '--accent': current.color } as React.CSSProperties}
              data-testid="timeline-panel"
            >
              <div>
                <p className="kicker">{tx(current.period, locale)}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold">{tx(current.role, locale)}</h3>
                <p className="mt-1 text-base font-semibold text-accent">{current.company}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  {tx(current.location, locale)}
                </p>
                <h4 className="mt-5 text-xs font-bold uppercase tracking-wider text-dim">{t('responsibilities')}</h4>
                <ul className="mt-2 flex flex-col gap-2">
                  {current.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                      {tx(b, locale)}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-dim">{t('tech')}</h4>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {current.tech.map((x) => (
                      <li key={x} className="chip chip-accent">
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                {current.relatedCategories.length ? (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-dim">{t('related')}</h4>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {current.relatedCategories.map((c) => (
                        <li key={c}>
                          <button
                            type="button"
                            onClick={() => openModule(c)}
                            className="btn btn-accent h-10 min-h-0 px-3 text-xs"
                            style={{ '--accent': categoryMap[c].color } as React.CSSProperties}
                          >
                            <CategoryIcon id={c} className="h-4 w-4" />
                            {tx(categoryMap[c].name, locale)}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
