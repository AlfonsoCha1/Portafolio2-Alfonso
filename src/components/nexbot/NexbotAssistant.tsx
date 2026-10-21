'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Bot, EyeOff, FileText, Mail, Sparkles, SquareTerminal, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { categoryMap } from '@/data/categories';
import { usePreferences, useUI } from '@/components/providers/AppProvider';

/** Robot original de NEXBOT dibujado en SVG (sin personajes de terceros). */
function NexbotFigure({ glow, happy, blink }: { glow: string; happy: boolean; blink: boolean }) {
  return (
    <svg viewBox="0 0 120 130" className="h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id="nb-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f4f6ff" />
          <stop offset="1" stopColor="#b9c2e8" />
        </linearGradient>
        <linearGradient id="nb-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a1030" />
          <stop offset="1" stopColor="#1b1150" />
        </linearGradient>
        <radialGradient id="nb-thrust" cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor={glow} stopOpacity="0.9" />
          <stop offset="1" stopColor={glow} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Propulsor */}
      <ellipse cx="60" cy="118" rx="18" ry="10" fill="url(#nb-thrust)">
        <animate attributeName="ry" values="8;12;8" dur="1.2s" repeatCount="indefinite" />
      </ellipse>
      {/* Antena */}
      <line x1="60" y1="14" x2="60" y2="26" stroke="#9aa5d6" strokeWidth="3" strokeLinecap="round" />
      <circle cx="60" cy="11" r="5" fill={glow}>
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Cabeza */}
      <rect x="22" y="24" width="76" height="56" rx="26" fill="url(#nb-body)" stroke="#ffffff" strokeOpacity="0.6" />
      <rect x="30" y="34" width="60" height="36" rx="18" fill="url(#nb-visor)" stroke={glow} strokeOpacity="0.8" strokeWidth="1.5" />
      {/* Ojos */}
      {happy ? (
        <>
          <path d="M43 54 Q48 46 53 54" stroke={glow} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M67 54 Q72 46 77 54" stroke={glow} strokeWidth="4" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x="43" y={blink ? 51 : 45} width="10" height={blink ? 2 : 14} rx="5" fill={glow} />
          <rect x="67" y={blink ? 51 : 45} width="10" height={blink ? 2 : 14} rx="5" fill={glow} />
        </>
      )}
      {/* Orejas */}
      <rect x="15" y="44" width="8" height="18" rx="4" fill="#9aa5d6" />
      <rect x="97" y="44" width="8" height="18" rx="4" fill="#9aa5d6" />
      {/* Cuerpo */}
      <path d="M40 84 H80 Q84 84 83 90 L78 106 Q76 112 70 112 H50 Q44 112 42 106 L37 90 Q36 84 40 84 Z" fill="url(#nb-body)" />
      <circle cx="60" cy="97" r="5" fill={glow} opacity="0.9" />
      {/* Brazos flotantes */}
      <circle cx="28" cy="96" r="6" fill="url(#nb-body)">
        <animate attributeName="cy" values="96;92;96" dur="2.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="92" cy="96" r="6" fill="url(#nb-body)">
        <animate attributeName="cy" values="92;96;92" dur="2.4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/**
 * NEXBOT: acompañante con mensajes predefinidos según la sección.
 * No es un agente de IA: solo muestra respuestas programadas.
 */
export function NexbotAssistant() {
  const t = useTranslations('nexbot');
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const { nexbotHidden, setNexbotHidden } = usePreferences();
  const { activeSection, hoveredIsland, setTerminalOpen } = useUI();
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState(-1);
  const [unread, setUnread] = useState(false);
  const [blink, setBlink] = useState(false);
  const [prevSection, setPrevSection] = useState(activeSection);
  const onHome = pathname === '/';
  const sectionKey = onHome ? activeSection : pathname.startsWith('/cv') ? 'cv' : 'proyectos';
  const glow = hoveredIsland ? categoryMap[hoveredIsland].color : '#00E5FF';
  const tips = t.raw('tips') as string[];

  // Saludo inicial breve (después de la intro). En pantallas pequeñas solo se marca un aviso para no tapar el contenido.
  useEffect(() => {
    if (window.innerWidth < 640) {
      const id = window.setTimeout(() => setUnread(true), 5200);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setOpen(true), 5200);
    const close = window.setTimeout(() => setOpen(false), 12500);
    return () => {
      window.clearTimeout(id);
      window.clearTimeout(close);
    };
  }, []);

  // Al cambiar de sección: reinicia el consejo y marca un aviso si el globo está cerrado.
  if (prevSection !== activeSection) {
    setPrevSection(activeSection);
    setTip(-1);
    if (!open) setUnread(true);
  }

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => {
      setBlink(true);
      window.setTimeout(() => setBlink(false), 160);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduce]);

  if (nexbotHidden) {
    return (
      <button
        type="button"
        onClick={() => setNexbotHidden(false)}
        className="icon-btn fixed bottom-4 right-4 z-40 h-10 w-10 opacity-70 hover:opacity-100 print:hidden"
        aria-label={t('show')}
        title={t('show')}
        data-testid="nexbot-show"
      >
        <Bot className="h-5 w-5" aria-hidden="true" />
      </button>
    );
  }

  const message = tip >= 0 ? tips[tip % tips.length] : t(`messages.${sectionKey}` as 'messages.inicio');

  return (
    <div className="fixed bottom-3 right-3 z-40 flex flex-col items-end gap-2 sm:bottom-5 sm:right-5 print:hidden" data-testid="nexbot">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-strong w-[min(320px,calc(100vw-24px))] rounded-2xl p-4"
            style={{ borderColor: `${glow}66`, boxShadow: `0 0 40px -16px ${glow}` }}
            role="dialog"
            aria-label={t('name')}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-display text-sm font-semibold">
                {t('name')}
                <span className="ml-2 rounded-md bg-[var(--surface-soft)] px-1.5 py-0.5 align-middle font-sans text-[10px] font-semibold text-muted">{t('badge')}</span>
              </p>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setNexbotHidden(true)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-[var(--surface)] hover:text-fg" aria-label={t('hide')} title={t('hide')} data-testid="nexbot-hide">
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                </button>
                <button type="button" onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-[var(--surface)] hover:text-fg" aria-label={t('close')}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <p className="text-sm leading-relaxed" aria-live="polite">
              {message}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/cv" className="btn btn-ghost h-9 min-h-0 px-2 text-[11px]" onClick={() => setOpen(false)}>
                <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                {t('actions.cv')}
              </Link>
              <Link href={{ pathname: '/', hash: 'proyectos' }} className="btn btn-ghost h-9 min-h-0 px-2 text-[11px]" onClick={() => setOpen(false)}>
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                {t('actions.projects')}
              </Link>
              <button
                type="button"
                className="btn btn-ghost h-9 min-h-0 px-2 text-[11px]"
                onClick={() => {
                  setOpen(false);
                  setTerminalOpen(true);
                }}
              >
                <SquareTerminal className="h-3.5 w-3.5" aria-hidden="true" />
                {t('actions.terminal')}
              </button>
              <Link href={{ pathname: '/', hash: 'contacto' }} className="btn btn-ghost h-9 min-h-0 px-2 text-[11px]" onClick={() => setOpen(false)}>
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                {t('actions.contact')}
              </Link>
            </div>
            <button type="button" onClick={() => setTip((v) => v + 1)} className="mt-2 w-full rounded-lg py-1.5 text-[11px] font-semibold text-muted hover:text-fg">
              {t('next')} →
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setUnread(false);
        }}
        aria-expanded={open}
        aria-label={t('open')}
        className="relative h-[68px] w-[62px] drop-shadow-[0_8px_20px_rgba(0,0,0,0.35)] sm:h-[78px] sm:w-[72px]"
        animate={reduce ? undefined : { y: [0, -6, 0] }}
        transition={reduce ? undefined : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={reduce ? undefined : { scale: 1.06, rotate: -3 }}
        whileTap={{ scale: 0.94 }}
        data-testid="nexbot-toggle"
      >
        <NexbotFigure glow={glow} happy={open} blink={blink} />
        {unread ? <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-[var(--bg)] bg-pink" aria-hidden="true" /> : null}
      </motion.button>
    </div>
  );
}
