'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ExternalLink, Loader2, MonitorPlay, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Project } from '@/data/types';
import { canLivePreview, realShot } from '@/lib/live-preview';
import { tx } from '@/lib/i18n';
import { ProjectShot } from './ProjectShot';

/** Marco con la página real del proyecto. Solo se carga cuando la persona lo pide. */
function LiveFrame({ project, className = '' }: { project: Project; className?: string }) {
  const t = useTranslations('projects');
  const [loaded, setLoaded] = useState(false);
  if (!project.demo) return null;
  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      {!loaded ? (
        <div className="absolute inset-0 grid place-items-center bg-[var(--bg)] text-sm text-muted">
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            {t('liveLoading')}
          </span>
        </div>
      ) : null}
      <iframe
        src={project.demo}
        title={`${t('liveTitle')}: ${project.name}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        className="h-full w-full border-0"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

function Chrome({ project, onClose }: { project: Project; onClose?: () => void }) {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const host = project.demo ? new URL(project.demo).host : '';
  return (
    <div className="flex items-center gap-2 border-b border-line bg-[var(--surface-strong)] px-3 py-2">
      <span className="h-3 w-3 rounded-full bg-[#ff5f87]" aria-hidden="true" />
      <span className="h-3 w-3 rounded-full bg-[#ffc46b]" aria-hidden="true" />
      <span className="h-3 w-3 rounded-full bg-[#4dffb5]" aria-hidden="true" />
      <span className="ml-2 min-w-0 flex-1 truncate rounded-lg bg-[var(--surface-soft)] px-3 py-1 font-mono text-xs text-muted">🔒 {host}</span>
      <a href={project.demo} target="_blank" rel="noopener noreferrer" className="icon-btn h-9 w-9" aria-label={`${t('liveOpen')} ${tc('newTab')}`} title={t('liveOpen')}>
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
      </a>
      {onClose ? (
        <button type="button" onClick={onClose} className="icon-btn h-9 w-9" aria-label={tc('close')}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

/** Botón "Ver en vivo" + ventana con la página real. */
export function LivePreviewButton({ project, className = '' }: { project: Project; className?: string }) {
  const t = useTranslations('projects');
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!canLivePreview(project)) return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`btn btn-primary h-10 min-h-0 px-3 text-xs ${className}`} data-testid="live-preview-open">
        <MonitorPlay className="h-4 w-4" aria-hidden="true" />
        {t('live')}
      </button>
      {typeof document !== 'undefined'
        ? createPortal(
      <AnimatePresence>
        {open ? (
          <motion.div className="fixed inset-0 z-[90] grid place-items-center p-2 sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" tabIndex={-1} aria-label={t('liveClose')} className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              ref={closeRef}
              role="dialog"
              aria-modal="true"
              aria-label={`${t('liveTitle')}: ${project.name}`}
              initial={{ y: 24, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 24, scale: 0.97 }}
              className="glass-strong relative flex h-[min(86dvh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl"
              data-testid="live-preview-dialog"
            >
              <Chrome project={project} onClose={() => setOpen(false)} />
              <LiveFrame project={project} className="flex-1" />
              <p className="border-t border-line px-3 py-2 text-center text-[11px] text-dim">{project.demo?.includes('onrender.com') ? `${t('liveHint')} · ` : ''}{t('liveFallback')}</p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}

/** Vista en vivo dentro de la página del proyecto (se carga con un clic). */
export function LivePreviewInline({ project }: { project: Project }) {
  const t = useTranslations('projects');
  const locale = useLocale();
  const [active, setActive] = useState(false);
  if (!canLivePreview(project)) return null;
  const shot = realShot(project);
  return (
    <div className="neon-card overflow-hidden" data-testid="live-preview-inline">
      <Chrome project={project} />
      {active ? (
        <LiveFrame project={project} className="aspect-[16/10] w-full" />
      ) : shot ? (
        <div className="group relative aspect-[16/10] w-full">
          <ProjectShot project={project} shot={shot} alt={tx(shot.alt, locale)} label={t('screenshot')} className="h-full w-full [&>div:first-child]:hidden" sizes="(min-width: 1024px) 760px, 100vw" priority />
          <div className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/70 via-black/20 to-transparent p-6">
            <button type="button" onClick={() => setActive(true)} className="btn btn-primary shadow-lg">
              <MonitorPlay className="h-4 w-4" aria-hidden="true" />
              {t('liveLoad')}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid aspect-[16/10] w-full place-items-center bg-[radial-gradient(circle_at_50%_40%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_70%)] p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <MonitorPlay className="h-10 w-10 text-accent" aria-hidden="true" />
            <p className="max-w-sm text-sm text-muted">{t('liveIntro')}</p>
            <button type="button" onClick={() => setActive(true)} className="btn btn-primary">
              {t('liveLoad')}
            </button>
          </div>
        </div>
      )}
      <p className="px-3 py-2 text-center text-[11px] text-dim">{t('liveFallback')}</p>
    </div>
  );
}
