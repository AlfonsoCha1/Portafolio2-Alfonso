'use client';

import { useEffect } from 'react';

const SELECTOR = '.cert-card, .project-card, .neon-card, [data-pause-offscreen]';

/**
 * Pausa las animaciones infinitas de las tarjetas y adornos que no están en pantalla
 * (marca data-offscreen="true"; el CSS hace el resto). Ahorra batería y mantiene fluido el scroll,
 * sobre todo en celulares.
 */
export function OffscreenAnimations() {
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || typeof MutationObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) (e.target as HTMLElement).dataset.offscreen = e.isIntersecting ? 'false' : 'true';
      },
      { rootMargin: '150px 0px' },
    );
    const observed = new Set<Element>();
    let queued = false;
    const scan = () => {
      queued = false;
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (!observed.has(el)) {
          observed.add(el);
          io.observe(el);
        }
      });
      observed.forEach((el) => {
        if (!el.isConnected) {
          io.unobserve(el);
          observed.delete(el);
        }
      });
    };
    scan();
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(scan);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
