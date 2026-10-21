'use client';

import { useEffect } from 'react';
import { useUI } from '@/components/providers/AppProvider';
import { markSectionSeen } from './ScrollProgress';
import { NAV_ITEMS } from './nav-items';

/** Observa las secciones de la página para marcar la activa en el menú y las ya exploradas. */
export function SectionObserver() {
  const { setActiveSection } = useUI();

  useEffect(() => {
    const els = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter((el): el is HTMLElement => Boolean(el));
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visible.set(e.target.id, e.intersectionRatio);
            markSectionSeen(e.target.id);
          } else visible.delete(e.target.id);
        }
        let best: string | null = null;
        let bestRatio = 0;
        visible.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });
        if (best) setActiveSection(best);
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setActiveSection]);

  return null;
}
