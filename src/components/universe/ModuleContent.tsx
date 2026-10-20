import { ArrowUpRight, CircleDashed, Sparkles } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Category } from '@/data/types';
import { projectsInCategory } from '@/data/projects';
import { tx } from '@/lib/i18n';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProjectLinks } from '@/components/projects/ProjectLinks';

/** Contenido de un módulo (isla): proyectos reales, experiencia relacionada y pendientes. */
export function ModuleContent({ category, headingLevel = 2, compact = false }: { category: Category; headingLevel?: 1 | 2; compact?: boolean }) {
  const t = useTranslations('universe');
  const tp = useTranslations('projects');
  const tm = useTranslations('modules');
  const locale = useLocale();
  const items = projectsInCategory(category.id);
  const H = headingLevel === 1 ? 'h1' : 'h2';

  return (
    <div style={{ '--accent': category.color, '--accent-2': category.color2 } as React.CSSProperties} className="flex flex-col gap-6">
      <div className="flex items-start gap-4">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl"
          style={{ background: `linear-gradient(135deg, ${category.color}33, ${category.color2}22)`, boxShadow: `0 0 30px -8px ${category.color}`, border: `1px solid ${category.color}66` }}
        >
          <CategoryIcon id={category.id} className="h-7 w-7 text-accent" />
        </span>
        <div className="min-w-0">
          <p className="kicker">{tm('kicker')} · {tx(category.tagline, locale)}</p>
          <H className={`font-display font-semibold tracking-tight ${headingLevel === 1 ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{tx(category.name, locale)}</H>
          <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{tx(category.description, locale)}</p>
        </div>
      </div>

      <section aria-label={tm('projectsTitle')}>
        <h3 className="mb-3 flex items-center justify-between gap-2 text-sm font-bold uppercase tracking-wider text-muted">
          {tm('projectsTitle')}
          <span className="chip">{t('projectsCount', { count: items.length })}</span>
        </h3>
        {items.length ? (
          <ul className={`grid grid-cols-1 gap-3 ${compact ? '' : 'md:grid-cols-2'}`}>
            {items.map((p) => (
              <li key={p.slug} className="neon-card flex flex-col gap-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/projects/${p.slug}`} className="font-display text-base font-semibold hover:underline">
                    {p.name}
                  </Link>
                  <StatusBadge status={p.status} detail={tx(p.statusDetail, locale)} />
                </div>
                <p className="text-sm text-muted">{tx(p.summary, locale)}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ProjectLinks project={p} size="sm" />
                  <Link href={`/projects/${p.slug}`} className="inline-flex h-10 items-center gap-1 text-xs font-bold text-accent hover:underline">
                    {tp('details')}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
        {category.pending ? (
          <p className="mt-3 flex items-start gap-2 rounded-xl border border-dashed p-4 text-sm text-muted" style={{ borderColor: `${category.color}88` }} data-testid="pending-placeholder">
            <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <span>
              <strong className="text-fg">[{t('pending')}]</strong> {tx(category.pending, locale)}
            </span>
          </p>
        ) : null}
      </section>

      {category.highlights.length ? (
        <section aria-label={tm('highlightsTitle')}>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-muted">{tm('highlightsTitle')}</h3>
          <ul className="flex flex-col gap-2">
            {category.highlights.map((h, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <span>{tx(h, locale)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
