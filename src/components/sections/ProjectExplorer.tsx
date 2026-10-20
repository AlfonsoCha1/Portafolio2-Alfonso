'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Search } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { categories, practiceCategory } from '@/data/categories';
import { sortedProjects } from '@/data/projects';
import type { ProjectCategoryId } from '@/data/types';
import { tx } from '@/lib/i18n';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { NeonCard } from '@/components/projects/NeonCard';

type Filter = 'all' | ProjectCategoryId;

export function ProjectExplorer() {
  const t = useTranslations('projects');
  const locale = useLocale();
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const filters = useMemo(
    () => [
      { id: 'all' as Filter, name: t('all'), color: '#9D35FF', count: sortedProjects.length },
      ...categories.map((c) => ({
        id: c.id as Filter,
        name: tx(c.short, locale),
        color: c.color,
        count: sortedProjects.filter((p) => p.category === c.id || p.alsoIn?.includes(c.id)).length,
      })),
      { id: 'practice' as Filter, name: tx(practiceCategory.name, locale), color: practiceCategory.color, count: sortedProjects.filter((p) => p.category === 'practice').length },
    ],
    [locale, t],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedProjects.filter((p) => {
      const inFilter = filter === 'all' || p.category === filter || (filter !== 'practice' && p.alsoIn?.includes(filter));
      if (!inFilter) return false;
      if (!q) return true;
      const hay = [p.name, tx(p.summary, locale), ...p.tech].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }, [filter, query, locale]);

  return (
    <section id="proyectos" aria-labelledby="projects-title" className="section">
      <div className="container-x">
        <SectionHeading kicker={t('kicker')} title={t('title')} intro={t('intro')} accent="#FF39C6" id="projects-title" />

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div role="group" aria-label={t('category')} className="scroll-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {filters.map((f) => {
              const active = filter === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(f.id)}
                  className={`flex min-h-[42px] shrink-0 items-center gap-2 rounded-xl border px-3 text-xs font-bold transition-all ${
                    active ? 'text-fg' : 'border-line text-muted hover:text-fg'
                  }`}
                  style={{
                    '--accent': f.color,
                    borderColor: active ? `${f.color}` : undefined,
                    background: active ? `color-mix(in srgb, ${f.color} 16%, transparent)` : undefined,
                    boxShadow: active ? `0 0 22px -8px ${f.color}` : undefined,
                  } as React.CSSProperties}
                  data-testid={`filter-${f.id}`}
                >
                  {f.id !== 'all' ? <CategoryIcon id={f.id} className="h-4 w-4 text-accent" /> : null}
                  {f.name}
                  <span className="text-[10px] text-dim">{f.count}</span>
                </button>
              );
            })}
          </div>
          <label className="glass flex h-11 w-full items-center gap-2 rounded-xl px-3 lg:w-72">
            <Search className="h-4 w-4 text-muted" aria-hidden="true" />
            <span className="sr-only">{t('search')}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search')}
              maxLength={60}
              className="h-full w-full bg-transparent text-sm outline-none placeholder:text-dim"
              data-testid="project-search"
            />
          </label>
        </div>

        <p className="sr-only" aria-live="polite">
          {t('count', { count: visible.length })}
        </p>

        {visible.length ? (
          <motion.ul layout={!reduce} className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visible.map((p, i) => (
                <motion.li
                  key={p.slug}
                  layout={!reduce}
                  initial={reduce ? false : { opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i, 8) * 0.03 }}
                >
                  <NeonCard project={p} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        ) : (
          <p className="glass rounded-2xl p-8 text-center text-muted">{t('empty')}</p>
        )}
      </div>
    </section>
  );
}
