'use client';

import { ArrowUpRight, Star } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { categoryColor, categoryMap, practiceCategory } from '@/data/categories';
import type { Project } from '@/data/types';
import { tx } from '@/lib/i18n';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProjectCover } from './ProjectCover';
import { ProjectLinks } from './ProjectLinks';
import { LivePreviewButton } from './LivePreview';

/** Tarjeta de proyecto con brillo por categoría, inclinación 3D ligera y zoom de imagen. */
export function NeonCard({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const ref = useRef<HTMLElement>(null);
  const color = categoryColor(project.category);
  const color2 = project.category !== 'practice' ? categoryMap[project.category].color2 : '#5d6b94';
  const catName = project.category === 'practice' ? tx(practiceCategory.name, locale) : tx(categoryMap[project.category].name, locale);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    el.style.setProperty('--mx', `${(x + 0.5) * 100}%`);
    el.style.setProperty('--my', `${(y + 0.5) * 100}%`);
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  return (
    <article
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="cert-card project-card group flex h-full flex-col overflow-hidden will-change-transform"
      style={{ '--accent': color, '--accent-2': color2 } as React.CSSProperties}
      data-testid="project-card"
      data-category={project.category}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[1.2rem]">
        <ProjectCover project={project} label={t('conceptual')} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.05]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--mx,50%) var(--my,50%), rgba(255,255,255,0.12), transparent 50%)' }} />
        <div aria-hidden="true" className="project-card__bar absolute inset-x-0 bottom-0" />
        {project.featured ? (
          <span className={`absolute left-3 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur ${project.demo ? 'top-11' : 'top-3'}`}>
            <Star className="h-3 w-3 fill-current text-[var(--accent)]" aria-hidden="true" />
            {t('featured')}
          </span>
        ) : null}
      </div>
      <div className="relative z-[2] flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip chip-accent">
            <CategoryIcon id={project.category} className="h-3.5 w-3.5" />
            {catName}
          </span>
          <StatusBadge status={project.status} detail={tx(project.statusDetail, locale)} />
        </div>
        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">
          <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0 after:z-0 after:content-[''] focus-visible:outline-none">
            {project.name}
          </Link>
        </h3>
        <p className="text-xs font-semibold text-accent">{tx(project.statusDetail, locale)}</p>
        <p className="text-sm leading-relaxed text-muted">{tx(project.summary, locale)}</p>
        <ul className="flex flex-wrap gap-1.5" aria-label={t('tech')}>
          {project.tech.slice(0, 5).map((tech) => (
            <li key={tech} className="chip">
              {tech}
            </li>
          ))}
        </ul>
        <div className="relative z-[3] mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex flex-wrap items-center gap-2">
            <LivePreviewButton project={project} />
            <ProjectLinks project={project} size="sm" />
          </div>
          <Link href={`/projects/${project.slug}`} className="inline-flex h-10 items-center gap-1 rounded-lg px-2 text-xs font-bold text-accent hover:underline" aria-label={`${t('details')} — ${project.name}`}>
            {t('details')}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
