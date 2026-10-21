'use client';

import { AnimatePresence, motion } from 'motion/react';
import { SlidersHorizontal, SquareTerminal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from '@/i18n/navigation';
import { usePreferences, useUI } from '@/components/providers/AppProvider';
import { PerformanceModeSwitcher } from './PerformanceModeSwitcher';

/**
 * Controles siempre accesibles (modo 3D/2D, pausa y terminal) cuando el hero ya no está en pantalla.
 * Se muestran plegados en un botón pequeño para no tapar el contenido.
 */
export function FloatingDock() {
  const t = useTranslations('labs');
  const tc = useTranslations('controls');
  const pathname = usePathname();
  const { setTerminalOpen } = useUI();
  const { renderMode } = usePreferences();
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setShow(pathname !== '/' || window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="fixed bottom-5 left-4 z-40 hidden flex-col items-start gap-2 md:flex print:hidden"
        >
          <AnimatePresence>
            {open ? (
              <motion.div
                id="dock-panel"
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                className="glass-strong flex items-center gap-2 rounded-2xl p-2"
              >
                <PerformanceModeSwitcher />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    setOpen(false);
                    setTerminalOpen(true);
                  }}
                  aria-label={t('openTerminal')}
                  title={`${t('openTerminal')} (Ctrl K)`}
                >
                  <SquareTerminal className="h-4 w-4 text-cyan" aria-hidden="true" />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="dock-panel"
            aria-label={tc('mode')}
            title={tc('mode')}
            className="icon-btn relative opacity-80 hover:opacity-100"
            data-testid="dock-toggle"
          >
            {open ? <X className="h-4 w-4" aria-hidden="true" /> : <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />}
            <span className="absolute -right-1.5 -top-1.5 rounded-md bg-gradient-to-r from-violet to-blue px-1 font-mono text-[9px] font-bold uppercase text-white">{renderMode}</span>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
