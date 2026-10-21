'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CategoryId } from '@/data/types';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { ISLAND_LAYOUT } from './layout';
import type { IslandInfo } from './three/FloatingIsland';

interface Props {
  islands: IslandInfo[];
  hovered: CategoryId | null;
  onHover: (id: CategoryId | null) => void;
  onSelect: (id: CategoryId) => void;
  portraitUrl: string;
  portraitAlt: string;
  leftPanel: boolean;
}

/** Estrellas deterministas (sin Math.random en render para que SSR y cliente coincidan). */
function useStars(count: number) {
  return useMemo(() => {
    let seed = 42;
    const r = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    return Array.from({ length: count }).map(() => ({
      left: r() * 100,
      top: r() * 100,
      size: 1 + r() * 2.2,
      delay: r() * 4,
      dur: 2.5 + r() * 3,
    }));
  }, [count]);
}

/**
 * Universo en modo ligero 2D: mismo concepto (planeta, retrato, siete islas, caminos de energía)
 * con CSS y SVG. Sin WebGL y con muy bajo consumo.
 */
export function Universe2D({ islands, hovered, onHover, onSelect, portraitUrl, portraitAlt, leftPanel }: Props) {
  const stars = useStars(70);
  const ref = useRef<HTMLDivElement>(null);
  const [tall, setTall] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      if (e) setTall(e.contentRect.width / Math.max(1, e.contentRect.height) < 0.95);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pos = (l: (typeof ISLAND_LAYOUT)[number]) => (tall ? l.flatTall : l.flat);
  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden [container-type:size] ${leftPanel ? 'lg:bottom-20 lg:left-[38%]' : ''}`} data-testid="universe-2d" data-pause-offscreen="">
      {/* Estrellas */}
      <div aria-hidden="true" className="absolute inset-0 dark:opacity-100 light:opacity-40">
        {stars.map((s, i) => (
          <span
            key={i}
            className="animate-twinkle absolute rounded-full bg-white dark:bg-white light:bg-violet"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s`, animationDuration: `${s.dur}s` }}
          />
        ))}
      </div>

      {/* Caminos de energía */}
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          {islands.map((i) => (
            <linearGradient key={i.id} id={`flow-${i.id}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={i.color} stopOpacity="0.2" />
              <stop offset="1" stopColor={i.color} stopOpacity="0.9" />
            </linearGradient>
          ))}
        </defs>
        {ISLAND_LAYOUT.map((l) => {
          const info = islands.find((i) => i.id === l.id);
          if (!info) return null;
          const [x, y] = pos(l);
          const cx = (50 + x) / 2 + (y < 50 ? -4 : 4) * (x < 50 ? 1 : -1);
          const cy = (50 + y) / 2 - 8;
          const active = hovered === l.id;
          return (
            <g key={l.id}>
              <path d={`M50 50 Q ${cx} ${cy} ${x} ${y}`} fill="none" stroke={`url(#flow-${l.id})`} strokeWidth={active ? 0.55 : 0.28} vectorEffect="non-scaling-stroke" style={{ strokeWidth: active ? 3 : 1.5 }} opacity={active ? 1 : 0.6} />
              <path
                d={`M50 50 Q ${cx} ${cy} ${x} ${y}`}
                fill="none"
                stroke={info.color}
                strokeDasharray="4 16"
                className="animate-dash"
                vectorEffect="non-scaling-stroke"
                style={{ strokeWidth: active ? 4 : 2.5, filter: `drop-shadow(0 0 4px ${info.color})` }}
                opacity={active ? 1 : 0.75}
              />
            </g>
          );
        })}
      </svg>

      {/* Planeta central con retrato */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '40cqmin', height: '40cqmin' }}>
        <div aria-hidden="true" className="animate-pulse-glow absolute -inset-[30%] rounded-full bg-[radial-gradient(circle,rgba(157,53,255,0.45),rgba(20,125,255,0.15)_45%,transparent_70%)] light:bg-[radial-gradient(circle,rgba(157,53,255,0.25),rgba(0,229,255,0.12)_45%,transparent_70%)]" />
        <div
          aria-hidden="true"
          className="planet-2d absolute inset-0 overflow-hidden rounded-full shadow-[inset_-18px_-12px_40px_rgba(0,0,0,0.65),0_0_60px_-10px_rgba(157,53,255,0.8)]"
        />
        {/* Anillos */}
        <div aria-hidden="true" className="absolute -inset-[24%] rounded-full border border-cyan/70 [transform:rotateX(72deg)_rotateZ(0deg)]" style={{ boxShadow: '0 0 18px rgba(0,229,255,0.5)' }}>
          <div className="animate-spin-slow absolute inset-0 rounded-full border-t-2 border-cyan" />
        </div>
        <div aria-hidden="true" className="absolute -inset-[36%] rounded-full border border-violet/60 [transform:rotateX(76deg)_rotateY(14deg)]" />
        {/* Retrato */}
        <div className="holo-ring absolute left-1/2 top-1/2 h-[52%] w-[52%] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_40px_-6px_rgba(0,229,255,0.8)]">
          <div className="relative h-full w-full overflow-hidden rounded-full bg-night">
            <Image src={portraitUrl} alt={portraitAlt} fill sizes="240px" className="object-cover" priority />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,229,255,0.07)_0px,rgba(0,229,255,0.07)_1px,transparent_1px,transparent_4px)]" />
          </div>
        </div>
      </div>

      {/* Islas */}
      {ISLAND_LAYOUT.map((l, idx) => {
        const info = islands.find((i) => i.id === l.id);
        if (!info) return null;
        const active = hovered === l.id;
        return (
          <button
            key={l.id}
            type="button"
            onMouseEnter={() => onHover(l.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(l.id)}
            onBlur={() => onHover(null)}
            onClick={() => onSelect(l.id)}
            aria-label={`${info.name}: ${info.tagline}. ${info.count}. ${info.enterLabel}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2 outline-none"
            style={{ left: `${pos(l)[0]}%`, top: `${pos(l)[1]}%`, '--accent': info.color } as React.CSSProperties}
            data-testid={`island2d-${l.id}`}
          >
            <span className="animate-float flex flex-col items-center" style={{ animationDelay: `${idx * 0.7}s` }}>
              <span
                className={`relative grid place-items-center transition-transform duration-300 ${active ? '-translate-y-2 scale-110' : ''}`}
                style={{ width: 'clamp(54px, 13cqmin, 96px)', height: 'clamp(46px, 11cqmin, 82px)' }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 transition-[filter] duration-300"
                  style={{
                    clipPath: 'polygon(6% 22%, 30% 6%, 70% 4%, 95% 20%, 84% 52%, 62% 80%, 50% 100%, 38% 80%, 16% 54%)',
                    background: `linear-gradient(180deg, color-mix(in srgb, ${info.color} 35%, #2a2f66) 0%, #1a1d3d 38%, #0d0f26 100%)`,
                    filter: active ? `drop-shadow(0 0 18px ${info.color})` : `drop-shadow(0 0 8px color-mix(in srgb, ${info.color} 60%, transparent))`,
                  }}
                />
                <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-[14%] h-[3px] rounded-full" style={{ background: info.color, boxShadow: `0 0 12px ${info.color}` }} />
                <CategoryIcon id={l.id} className="relative -mt-2 h-[38%] w-[38%] text-white" style={{ filter: `drop-shadow(0 0 6px ${info.color})` }} />
              </span>
              <span
                className="glass-strong no-blur mt-1.5 max-w-[110px] rounded-lg px-2 py-1 text-center font-display text-[10px] font-semibold leading-tight text-fg transition-shadow sm:max-w-none sm:text-xs"
                style={{ borderColor: `color-mix(in srgb, ${info.color} ${active ? 80 : 35}%, transparent)`, boxShadow: active ? `0 0 24px -6px ${info.color}` : undefined }}
              >
                {info.name}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
