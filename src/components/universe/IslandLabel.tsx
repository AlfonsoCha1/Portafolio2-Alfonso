import type { ReactNode } from 'react';
import type { IslandInfo } from './three/FloatingIsland';

/** Etiqueta holográfica de una isla (se dibuja como capa normal de la página, encima del 3D). */
export function IslandLabel({ info, hovered, compact }: { info: IslandInfo; hovered: boolean; compact: boolean }): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="select-none whitespace-nowrap transition-all duration-300"
      style={{ '--accent': info.color, transform: `scale(${hovered ? 1.06 : 1})`, opacity: compact && !hovered ? 0.85 : 1 } as React.CSSProperties}
    >
      <div
        className="glass-strong no-blur rounded-xl px-3 py-2 text-left"
        style={{
          borderColor: `color-mix(in srgb, ${info.color} ${hovered ? 80 : 35}%, transparent)`,
          boxShadow: hovered ? `0 0 30px -6px ${info.color}` : undefined,
        }}
      >
        <p className="flex items-center gap-2 font-display text-[11px] font-semibold tracking-tight text-fg sm:text-[13px]">
          <span className="h-2 w-2 rounded-full" style={{ background: info.color, boxShadow: `0 0 10px ${info.color}` }} />
          {info.name}
        </p>
        {!compact || hovered ? <p className="mt-0.5 font-mono text-[10px] text-muted">{info.tagline}</p> : null}
        {hovered ? (
          <div className="mt-1.5 max-w-[220px] whitespace-normal">
            <p className="text-[11px] leading-snug text-muted">{info.description}</p>
            <p className="mt-1.5 flex items-center justify-between gap-3 text-[11px] font-bold">
              <span className="text-dim">{info.count}</span>
              <span className="text-accent">{info.enterLabel} →</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
