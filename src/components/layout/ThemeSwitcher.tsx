'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Clock3, Moon, MonitorSmartphone, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { usePreferences } from '@/components/providers/AppProvider';
import type { ThemeMode } from '@/lib/theme';

const ICONS: Record<ThemeMode, typeof Sun> = {
  system: MonitorSmartphone,
  light: Sun,
  dark: Moon,
  time: Clock3,
};

const COLORS: Record<ThemeMode, string> = {
  system: '#00E5FF',
  light: '#FF943D',
  dark: '#9D35FF',
  time: '#FF39C6',
};

/** Un solo botón con 4 modos: Automático → Claro → Nocturno → Según la hora. */
export function ThemeSwitcher({ withLabel = false }: { withLabel?: boolean }) {
  const t = useTranslations('controls.theme');
  const { themeMode, cycleTheme } = usePreferences();
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const Icon = ICONS[themeMode];
  const label = t(themeMode);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onClick = () => {
    const next = cycleTheme();
    setToast(`${t(next)} · ${t(`${next}Hint`)}`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={onClick}
        className={withLabel ? 'btn btn-ghost w-full justify-start' : 'icon-btn'}
        aria-label={t('button', { mode: label })}
        title={`${label} — ${t(`${themeMode}Hint`)}`}
        data-testid="theme-toggle"
        data-mode={themeMode}
        style={{ '--cyan': COLORS[themeMode] } as React.CSSProperties}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={themeMode}
            initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="inline-flex"
            style={{ color: COLORS[themeMode], filter: `drop-shadow(0 0 6px ${COLORS[themeMode]}88)` }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.span>
        </AnimatePresence>
        {withLabel ? <span>{label}</span> : null}
      </button>
      <span className="sr-only" aria-live="polite">
        {toast}
      </span>
      <AnimatePresence>
        {toast && !withLabel ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="glass-strong pointer-events-none absolute right-0 top-[calc(100%+10px)] z-50 w-max max-w-[240px] rounded-xl px-3 py-2 text-xs font-semibold"
            aria-hidden="true"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
