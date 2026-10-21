'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AcLogo } from '@/components/ui/AcLogo';
import { categories } from '@/data/categories';
import { profile } from '@/data/profile';
import { writeSession } from '@/lib/storage';
import { INTRO_KEY } from '@/lib/intro';

gsap.registerPlugin(useGSAP);

const PARTICLES = Array.from({ length: 36 }).map((_, i) => {
  const a = (i * 137.5 * Math.PI) / 180;
  const r = 18 + ((i * 53) % 60);
  return { x: 50 + Math.cos(a) * r * 0.9, y: 50 + Math.sin(a) * r * 0.55, s: 1 + (i % 3), d: (i % 7) * 0.08 };
});

/**
 * Secuencia de apertura (~3 s): partículas → núcleo → planeta → anillos → logo AC →
 * islas → nombre → desaparece. Se puede saltar, no bloquea la carga y no se repite en la sesión.
 */
export function IntroSequence() {
  const t = useTranslations('intro');
  const root = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  const finish = useCallback(() => {
    writeSession(INTRO_KEY, '1');
    document.documentElement.setAttribute('data-intro', 'done');
    setDone(true);
  }, []);

  useEffect(() => {
    if (document.documentElement.getAttribute('data-intro') === 'skip') {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- la intro ya se vio en esta sesión
      setDone(true);
    }
  }, []);

  useGSAP(
    () => {
      if (!root.current || document.documentElement.getAttribute('data-intro') === 'skip') return;
      const slow = (navigator.hardwareConcurrency ?? 4) <= 2;
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });
      if (slow) {
        tl.from('[data-i="logo"]', { opacity: 0, scale: 0.8, duration: 0.5 })
          .from('[data-i="title"]', { opacity: 0, y: 12, duration: 0.4 }, '-=0.1')
          .to(root.current, { opacity: 0, duration: 0.4, delay: 0.4 });
        return;
      }
      tl.from('[data-i="particle"]', { opacity: 0, scale: 0, duration: 0.5, stagger: { each: 0.012, from: 'random' } })
        .from('[data-i="core"]', { scale: 0, opacity: 0, duration: 0.45 }, '-=0.2')
        .to('[data-i="core"]', { scale: 7, opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.05')
        .from('[data-i="planet"]', { scale: 0.2, opacity: 0, duration: 0.7 }, '-=0.45')
        .from('[data-i="ring"]', { strokeDashoffset: 600, duration: 0.7, stagger: 0.12, ease: 'power2.inOut' }, '-=0.35')
        .from('[data-i="logo"]', { opacity: 0, scale: 0.6, filter: 'blur(8px)', duration: 0.5 }, '-=0.4')
        .from('[data-i="island"]', { opacity: 0, scale: 0, duration: 0.35, stagger: 0.05 }, '-=0.2')
        .from('[data-i="title"]', { opacity: 0, y: 16, letterSpacing: '0.4em', duration: 0.55 }, '-=0.2')
        .to(root.current, { opacity: 0, scale: 1.06, duration: 0.5, ease: 'power2.in' }, '+=0.25');
    },
    { scope: root },
  );

  if (done) return null;

  return (
    <div
      ref={root}
      className="intro-overlay fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#060A19] text-white"
      data-testid="intro"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span key={i} data-i="particle" className="absolute rounded-full bg-white" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: 0.7, boxShadow: '0 0 6px #7cf3ff' }} />
        ))}
      </div>
      <div className="relative grid h-[min(70vw,360px)] w-[min(70vw,360px)] place-items-center" aria-hidden="true">
        <span data-i="core" className="absolute h-6 w-6 rounded-full bg-white shadow-[0_0_40px_12px_#00e5ff]" />
        <span
          data-i="planet"
          className="absolute h-[56%] w-[56%] rounded-full shadow-[0_0_80px_-10px_#9d35ff,inset_-16px_-12px_30px_rgba(0,0,0,0.6)]"
          style={{ background: 'radial-gradient(circle at 35% 30%, #4b2bb0, #160e52 60%, #0a0b33)' }}
        />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 200">
          <ellipse data-i="ring" cx="100" cy="100" rx="88" ry="26" fill="none" stroke="#00E5FF" strokeWidth="1.2" strokeDasharray="600" transform="rotate(-12 100 100)" style={{ filter: 'drop-shadow(0 0 4px #00e5ff)' }} />
          <ellipse data-i="ring" cx="100" cy="100" rx="96" ry="34" fill="none" stroke="#9D35FF" strokeWidth="1" strokeDasharray="600" transform="rotate(16 100 100)" style={{ filter: 'drop-shadow(0 0 4px #9d35ff)' }} />
        </svg>
        <div data-i="logo" className="relative w-[34%] drop-shadow-[0_0_18px_rgba(157,53,255,0.9)]">
          <AcLogo className="h-auto w-full" />
        </div>
        {categories.map((c, i) => {
          const a = (i / categories.length) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              key={c.id}
              data-i="island"
              className="absolute h-3 w-5 rounded-b-full"
              style={{ left: `${50 + Math.cos(a) * 47}%`, top: `${50 + Math.sin(a) * 40}%`, background: c.color, boxShadow: `0 0 14px ${c.color}` }}
            />
          );
        })}
      </div>
      <p data-i="title" aria-hidden="true" className="absolute bottom-[18%] font-display text-2xl font-semibold tracking-[0.12em] sm:text-3xl">
        {profile.name}
      </p>
      <p role="status" className="absolute bottom-[13%] font-mono text-[10px] uppercase tracking-[0.35em] text-white/50">{t('loading')}</p>
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/80 backdrop-blur hover:bg-white/10"
        data-testid="intro-skip"
      >
        {t('skip')}
      </button>
    </div>
  );
}
