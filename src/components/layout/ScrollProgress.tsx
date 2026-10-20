'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import { NAV_ITEMS } from './nav-items';

/* Registro global de secciones vistas (para "x de 10 secciones exploradas"). */
const seen = new Set<string>();
const listeners = new Set<() => void>();
let snapshot = { seen: new Set<string>() };

export function markSectionSeen(id: string) {
  if (seen.has(id)) return;
  seen.add(id);
  snapshot = { seen: new Set(seen) };
  listeners.forEach((l) => l());
}

const serverSnapshot = { seen: new Set<string>() };

export function useExplored() {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snapshot,
    () => serverSnapshot,
  );
}

/** Barra superior: progreso de desplazamiento + secciones exploradas. */
export function ScrollProgress() {
  const t = useTranslations('nav');
  const [progress, setProgress] = useState(0);
  const explored = useExplored();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const pct = Math.round(progress * 100);
  return (
    <div
      className="absolute inset-x-0 top-0 h-[3px] bg-transparent"
      role="progressbar"
      aria-label={t('progress')}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
      aria-valuetext={`${pct}% · ${t('explored', { count: explored.seen.size, total: NAV_ITEMS.length })}`}
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-violet via-cyan to-pink shadow-[0_0_12px_var(--cyan)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
