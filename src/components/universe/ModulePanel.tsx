'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { tx } from '@/lib/i18n';
import { useEffect, useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { categoryMap } from '@/data/categories';
import { useUI } from '@/components/providers/AppProvider';
import { ModuleContent } from './ModuleContent';

/** Panel del módulo de una isla. Se cierra con Esc, el botón "Volver" o tocando fuera. */
export function ModulePanel() {
  const t = useTranslations('universe');
  const locale = useLocale();
  const { activeModule, openModule } = useUI();
  const category = activeModule ? categoryMap[activeModule] : null;
  const panelRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!category) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    const id = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') openModule(null);
      if (e.key === 'Tab' && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
        const first = f[0];
        const last = f[f.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKey);
      returnFocus.current?.focus?.();
    };
  }, [category, openModule]);

  return (
    <AnimatePresence>
      {category ? (
        <motion.div key="module-backdrop" className="fixed inset-0 z-[60]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" aria-label={t('back')} tabIndex={-1} className="absolute inset-0 h-full w-full cursor-default bg-[color-mix(in_srgb,var(--bg)_35%,transparent)]" onClick={() => openModule(null)} />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={tx(category.name, locale)}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 30 }}
            className="glass-strong absolute bottom-0 right-0 flex max-h-[78dvh] w-full flex-col overflow-hidden rounded-t-3xl sm:bottom-auto sm:top-[84px] sm:right-4 sm:max-h-[calc(100dvh-100px)] sm:w-[min(560px,calc(100vw-2rem))] sm:rounded-3xl"
            style={{ borderColor: `${category.color}66`, boxShadow: `0 0 60px -20px ${category.color}` }}
            data-testid="module-panel"
          >
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
              <button type="button" onClick={() => openModule(null)} className="btn btn-ghost h-10 min-h-0 px-3 text-sm" data-autofocus data-testid="module-back">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                {t('back')}
              </button>
              <Link href={`/modules/${category.id}`} className="btn btn-accent h-10 min-h-0 px-3 text-sm" style={{ '--accent': category.color } as React.CSSProperties} onClick={() => openModule(null)}>
                <Maximize2 className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('openModule')}</span>
              </Link>
            </div>
            <div className="overflow-y-auto p-5 scroll-thin">
              <ModuleContent category={category} compact />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
