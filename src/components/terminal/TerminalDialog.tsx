'use client';

import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useUI } from '@/components/providers/AppProvider';
import { CyberTerminal } from './CyberTerminal';

/** Terminal SOC en ventana flotante (se abre desde NEXBOT o el atajo de teclado). */
export function TerminalDialog() {
  const t = useTranslations('terminal');
  const { terminalOpen, setTerminalOpen } = useUI();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && terminalOpen) setTerminalOpen(false);
      // Atajo: Ctrl/Cmd + K abre la terminal
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setTerminalOpen(!terminalOpen);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [terminalOpen, setTerminalOpen]);

  return (
    <AnimatePresence>
      {terminalOpen ? (
        <motion.div className="fixed inset-0 z-[80] grid place-items-end p-3 sm:place-items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <button type="button" tabIndex={-1} aria-label={t('close')} className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => setTerminalOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('label')}
            initial={{ y: 30, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 30, scale: 0.98 }}
            className="relative w-full max-w-2xl"
          >
            <button type="button" onClick={() => setTerminalOpen(false)} className="icon-btn absolute -top-12 right-0 z-10" aria-label={t('close')}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            <CyberTerminal autoFocus height="h-[min(52dvh,420px)]" />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
