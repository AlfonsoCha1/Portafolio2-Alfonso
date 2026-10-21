import { ArrowLeft, CalendarDays, CheckCircle2, Info, Lock, Unlock, UserRound } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categoryColor, categoryMap, practiceCategory } from '@/data/categories';
import { projectsInCategory } from '@/data/projects';
import type { Project } from '@/data/types';
import { tx } from '@/lib/i18n';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProjectCover } from './ProjectCover';
import { ProjectLinks } from './ProjectLinks';
import { LivePreviewInline } from './LivePreview';
import { canLivePreview, realShot } from '@/lib/live-preview';
import { ProjectShot } from './ProjectShot';

/** Página de presentación de un proyecto (también para proyectos privados, sin datos confidenciales). */
export function ProjectDetail({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const shot = realShot(project);
  const color = categoryColor(project.category);
  const color2 = project.category !== 'practice' ? categoryMap[project.category].color2 : '#5d6b94';
  const catName = project.category === 'practice' ? tx(practiceCategory.name, locale) : tx(categoryMap[project.category].name, locale);
  const related = project.category !== 'practice' ? projectsInCategory(project.category).filter((p) => p.slug !== project.slug).slice(0, 4) : [];

  return (
    <div className="container-x pb-24 pt-28" style={{ '--accent': color, '--accent-2': color2 } as React.CSSProperties}>
      <Link href={{ pathname: '/', hash: 'proyectos' }} className="btn btn-ghost mb-6 h-10 min-h-0 px-3 text-sm">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('back')}
      </Link>

      <article className="grid grid-cols-1 gap-10 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            {project.category !== 'practice' ? (
              <Link href={`/modules/${project.category}`} className="chip chip-accent hover:brightness-125">
                <CategoryIcon id={project.category} className="h-3.5 w-3.5" />
                {catName}
              </Link>
            ) : (
              <span className="chip chip-accent">{catName}</span>
            )}
            <StatusBadge status={project.status} />
            <span className="chip">
              {project.visibility === 'private' ? <Lock className="h-3.5 w-3.5" aria-hidden="true" /> : <Unlock className="h-3.5 w-3.5" aria-hidden="true" />}
              {project.visibility === 'private' ? t('private') : t('public')}
            </span>
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight md:text-5xl">{project.name}</h1>
          <p className="text-lg font-semibold text-accent">{tx(project.statusDetail, locale)}</p>
          <p className="text-lg leading-relaxed text-fg/90">{tx(project.description, locale)}</p>

          {canLivePreview(project) ? (
            <LivePreviewInline project={project} />
          ) : (
            <div className="neon-card overflow-hidden">
              {shot ? (
                <ProjectShot project={project} shot={shot} alt={tx(shot.alt, locale)} label={t('screenshot')} className="aspect-[16/9] w-full" sizes="(min-width: 1024px) 760px, 100vw" priority />
              ) : (
                <ProjectCover project={project} label={t('conceptual')} className="aspect-[16/9] w-full" />
              )}
              {shot ? null : (
                <p className="flex items-start gap-2 p-3 text-xs text-dim">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  {t('conceptualNote')}
                </p>
              )}
            </div>
          )}

          <section aria-labelledby="features-h">
            <h2 id="features-h" className="mb-3 font-display text-xl font-semibold">
              {t('features')}
            </h2>
            <ul className="flex flex-col gap-2.5">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {tx(f, locale)}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-5 lg:sticky lg:top-28 lg:self-start">
          <div className="neon-card flex flex-col gap-5 p-6">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-dim">{t('links')}</h2>
              <div className="mt-3">{project.repo || project.demo ? <ProjectLinks project={project} /> : <p className="text-sm text-muted">{t('noLinks')}</p>}</div>
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-dim">{t('tech')}</h2>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {project.tech.map((x) => (
                  <li key={x} className="chip chip-accent">
                    {x}
                  </li>
                ))}
              </ul>
            </div>
            <dl className="grid grid-cols-1 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-dim">{t('role')}</dt>
                  <dd className="mt-0.5">{tx(project.role, locale)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-bold uppercase tracking-wider text-dim">{t('year')}</dt>
                  <dd className="mt-0.5">{project.year}</dd>
                </div>
              </div>
            </dl>
            {project.note ? (
              <p className="rounded-xl border border-line bg-[var(--surface-soft)] p-3 text-xs leading-relaxed text-muted">
                <strong className="text-fg">{t('note')}:</strong> {tx(project.note, locale)}
              </p>
            ) : null}
          </div>

          {related.length ? (
            <div>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-dim">{t('related')}</h2>
              <ul className="flex flex-col gap-2">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/projects/${p.slug}`} className="glass flex items-center justify-between gap-2 rounded-xl p-3 text-sm font-semibold hover:text-accent">
                      {p.name}
                      <StatusBadge status={p.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </article>
    </div>
  );
}
