import { useId } from 'react';
import type { Project } from '@/data/types';
import { categoryColor, categoryMap } from '@/data/categories';

/**
 * Portada conceptual generada en SVG (no es una captura real).
 * Se usa mientras no existan capturas aprobadas del proyecto.
 */
export function ProjectCover({ project, label, className = '' }: { project: Project; label: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const c1 = categoryColor(project.category);
  const c2 = project.category !== 'practice' ? categoryMap[project.category].color2 : '#5d6b94';
  const motif = project.cover;

  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={`${project.name} — ${label}`}>
      <svg viewBox="0 0 400 225" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a0f2e" />
            <stop offset="1" stopColor="#120a33" />
          </linearGradient>
          <radialGradient id={`gl-${uid}`} cx="0.7" cy="0.35" r="0.7">
            <stop offset="0" stopColor={c1} stopOpacity="0.55" />
            <stop offset="1" stopColor={c1} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`ln-${uid}`} x1="-80" y1="-60" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={c1} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
          <pattern id={`grid-${uid}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke={c1} strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="400" height="225" fill={`url(#bg-${uid})`} />
        <rect width="400" height="225" fill={`url(#grid-${uid})`} />
        <rect width="400" height="225" fill={`url(#gl-${uid})`} />
        <g transform="translate(270 112)" stroke={`url(#ln-${uid})`} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          {motif === 'shield' && (
            <>
              <path d="M0 -62 L50 -42 V2 C50 34 26 54 0 66 C-26 54 -50 34 -50 2 V-42 Z" />
              <path d="M-20 2 L-4 18 L24 -14" strokeWidth="5" />
            </>
          )}
          {motif === 'logs' && (
            <>
              {[-48, -28, -8, 12, 32].map((y, i) => (
                <path key={y} d={`M-70 ${y} H${[30, 60, 10, 50, 20][i]}`} strokeOpacity={i === 2 ? 1 : 0.6} />
              ))}
              <circle cx="40" cy="-8" r="16" />
              <path d="M52 4 L68 20" strokeWidth="5" />
            </>
          )}
          {motif === 'ai' && (
            <>
              <circle r="44" strokeOpacity="0.5" />
              <circle r="22" />
              {[0, 60, 120, 180, 240, 300].map((a) => (
                <g key={a} transform={`rotate(${a})`}>
                  <path d="M0 -22 V-44" />
                  <circle cy="-52" r="7" />
                </g>
              ))}
            </>
          )}
          {motif === 'voice' && (
            <>
              {[-60, -45, -30, -15, 0, 15, 30, 45, 60].map((x, i) => (
                <path key={x} d={`M${x} ${-[10, 22, 38, 52, 30, 46, 24, 14, 8][i]!} V${[10, 22, 38, 52, 30, 46, 24, 14, 8][i]}`} strokeWidth="6" />
              ))}
            </>
          )}
          {motif === 'store' && (
            <>
              <path d="M-50 -30 H50 L42 30 H-42 Z" />
              <path d="M-25 -30 C-25 -60 25 -60 25 -30" />
              <circle cx="-22" cy="48" r="6" />
              <circle cx="22" cy="48" r="6" />
            </>
          )}
          {motif === 'loyalty' && (
            <>
              <rect x="-62" y="-38" width="124" height="76" rx="12" />
              {[-36, -12, 12, 36].map((x, i) => (
                <circle key={x} cx={x} cy="8" r="9" fill={i < 3 ? c1 : 'none'} />
              ))}
              <path d="M-44 -18 H10" />
            </>
          )}
          {motif === 'academy' && (
            <>
              <path d="M-60 -10 L0 -40 L60 -10 L0 20 Z" />
              <path d="M-36 2 V30 C-20 44 20 44 36 30 V2" />
              <path d="M60 -10 V24" />
            </>
          )}
          {motif === 'terminal' && (
            <>
              <rect x="-70" y="-46" width="140" height="92" rx="10" />
              <path d="M-50 -16 L-30 0 L-50 16" strokeWidth="5" />
              <path d="M-20 20 H20" strokeWidth="5" />
            </>
          )}
          {motif === 'video' && (
            <>
              <rect x="-66" y="-42" width="132" height="84" rx="10" />
              <path d="M-14 -22 L22 0 L-14 22 Z" fill={c1} />
              <path d="M-54 54 H54" strokeOpacity="0.5" />
              <path d="M-54 54 H0" />
            </>
          )}
          {motif === 'chip' && (
            <>
              <rect x="-38" y="-38" width="76" height="76" rx="8" />
              <rect x="-18" y="-18" width="36" height="36" rx="4" fill={c1} fillOpacity="0.4" />
              {[-24, 0, 24].map((k) => (
                <g key={k}>
                  <path d={`M${k} -38 V-56`} />
                  <path d={`M${k} 38 V56`} />
                  <path d={`M-38 ${k} H-56`} />
                  <path d={`M38 ${k} H56`} />
                </g>
              ))}
            </>
          )}
          {motif === 'nfc' && (
            <>
              <rect x="-70" y="-50" width="56" height="100" rx="10" />
              <path d="M-54 30 H-30" />
              {[18, 34, 50].map((r) => (
                <path key={r} d={`M${10 + r * 0.45} ${-r * 0.88} A${r} ${r} 0 0 1 ${10 + r * 0.45} ${r * 0.88}`} />
              ))}
            </>
          )}
          {(motif === 'web' || motif === 'code') && (
            <>
              <rect x="-70" y="-46" width="140" height="92" rx="10" />
              <path d="M-70 -26 H70" />
              <path d="M-26 0 L-40 14 L-26 28" />
              <path d="M26 0 L40 14 L26 28" />
              <path d="M8 -6 L-8 34" />
            </>
          )}
        </g>
        <text x="24" y="196" fill="#ffffff" fillOpacity="0.92" fontFamily="var(--font-display)" fontSize="20" fontWeight="600">
          {project.name.length > 26 ? `${project.name.slice(0, 25)}…` : project.name}
        </text>
        <rect x="24" y="24" width="8" height="8" rx="4" fill={c1} />
        <rect x="38" y="24" width="8" height="8" rx="4" fill={c2} opacity="0.7" />
      </svg>
      <span className="absolute right-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/85 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
