import { useId, type ReactNode } from 'react';
import type { Project } from '@/data/types';
import { categoryColor, categoryMap } from '@/data/categories';

/** Dominio de la página pública (para la barra del navegador). */
function domainOf(url?: string) {
  if (!url) return '';
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

const d = (s: number) => ({ animationDelay: `${s}s` });

/** Motivo animado de cada proyecto (SVG + CSS, sin JavaScript). */
function Motif({ motif, c1, c2 }: { motif: Project['cover']; c1: string; c2: string }): ReactNode {
  switch (motif) {
    case 'shield':
      return (
        <>
          <circle r="62" fill={c1} fillOpacity="0.08" className="a-pulse" />
          <path d="M0 -58 L46 -40 V0 C46 30 24 48 0 60 C-24 48 -46 30 -46 0 V-40 Z" />
          <path d="M-18 2 L-4 16 L22 -12" strokeWidth="5" className="a-draw" />
          <rect x="-46" y="-2" width="92" height="3" rx="1.5" fill={c2} stroke="none" opacity="0.8" className="a-scan" />
        </>
      );
    case 'logs':
      return (
        <>
          {[-44, -26, -8, 10, 28].map((y, i) => (
            <rect key={y} x="-72" y={y} width={[96, 120, 70, 110, 84][i]} height="5" rx="2.5" fill={i === 2 ? c2 : c1} stroke="none" fillOpacity={i === 2 ? 1 : 0.6} className="a-grow" style={d(i * 0.25)} />
          ))}
          <g className="a-bounce">
            <circle cx="44" cy="-6" r="17" />
            <path d="M56 6 L70 20" strokeWidth="5" />
          </g>
        </>
      );
    case 'ai':
      return (
        <>
          <circle r="46" strokeDasharray="6 8" strokeOpacity="0.6" className="a-spin" />
          <circle r="22" fill={c1} fillOpacity="0.25" className="a-pulse" />
          {[0, 60, 120, 180, 240, 300].map((a, i) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 -22 V-44" strokeOpacity="0.7" />
              <circle cy="-52" r="7" fill={i % 2 ? c2 : c1} fillOpacity="0.5" className="a-pulse" style={d(i * 0.3)} />
            </g>
          ))}
        </>
      );
    case 'voice':
      return (
        <>
          {[-64, -48, -32, -16, 0, 16, 32, 48, 64].map((x, i) => (
            <rect key={x} x={x - 4} y="-46" width="8" height="92" rx="4" fill={i % 2 ? c2 : c1} stroke="none" className="a-bar" style={d(i * 0.1)} />
          ))}
        </>
      );
    case 'store':
      return (
        <>
          <g className="a-bounce">
            <path d="M-48 -26 H48 L40 30 H-40 Z" />
            <path d="M-24 -26 C-24 -56 24 -56 24 -26" />
          </g>
          <circle cx="-20" cy="46" r="6" />
          <circle cx="20" cy="46" r="6" />
          <circle cx="58" cy="-40" r="5" fill={c2} stroke="none" className="a-pulse" />
          <circle cx="-60" cy="-30" r="3" fill={c1} stroke="none" className="a-pulse" style={d(0.6)} />
        </>
      );
    case 'loyalty':
      return (
        <>
          <rect x="-64" y="-40" width="128" height="80" rx="12" />
          <path d="M-46 -20 H10" />
          {[-38, -13, 12, 37].map((x, i) => (
            <circle key={x} cx={x} cy="10" r="9" fill={i % 2 ? c2 : c1} className="a-fill" style={d(i * 0.45)} />
          ))}
        </>
      );
    case 'academy':
      return (
        <>
          <circle r="62" strokeDasharray="3 9" strokeOpacity="0.5" className="a-spin-rev" />
          <g className="a-bounce">
            <path d="M-56 -8 L0 -36 L56 -8 L0 20 Z" fill={c1} fillOpacity="0.15" />
            <path d="M-34 4 V28 C-18 40 18 40 34 28 V4" />
            <path d="M56 -8 V22" />
          </g>
        </>
      );
    case 'terminal':
      return (
        <>
          <rect x="-72" y="-46" width="144" height="92" rx="10" />
          <path d="M-52 -16 L-34 0 L-52 16" strokeWidth="5" />
          <rect x="-22" y="14" width="56" height="5" rx="2.5" fill={c2} stroke="none" className="a-grow" />
          <rect x="40" y="10" width="4" height="12" fill={c1} stroke="none" className="a-blink" />
        </>
      );
    case 'video':
      return (
        <>
          <rect x="-68" y="-44" width="136" height="84" rx="10" />
          <path d="M-14 -22 L22 0 L-14 22 Z" fill={c1} className="a-pulse" />
          <rect x="-56" y="52" width="112" height="5" rx="2.5" fill={c1} fillOpacity="0.3" stroke="none" />
          <rect x="-56" y="52" width="112" height="5" rx="2.5" fill={c2} stroke="none" className="a-progress" />
        </>
      );
    case 'chip':
      return (
        <>
          <rect x="-36" y="-36" width="72" height="72" rx="8" />
          <rect x="-16" y="-16" width="32" height="32" rx="4" fill={c1} fillOpacity="0.4" className="a-pulse" />
          {[-22, 0, 22].map((k) => (
            <g key={k} className="a-flow">
              <path d={`M${k} -36 V-58`} />
              <path d={`M${k} 36 V58`} />
              <path d={`M-36 ${k} H-58`} />
              <path d={`M36 ${k} H58`} />
            </g>
          ))}
        </>
      );
    case 'nfc':
      return (
        <>
          <rect x="-70" y="-50" width="56" height="100" rx="10" />
          <path d="M-54 30 H-30" />
          {[18, 34, 50].map((r, i) => (
            <path key={r} d={`M${10 + r * 0.45} ${-r * 0.88} A${r} ${r} 0 0 1 ${10 + r * 0.45} ${r * 0.88}`} className="a-wave" style={d(i * 0.35)} />
          ))}
        </>
      );
    case 'planner':
      return (
        <>
          <rect x="-70" y="-48" width="96" height="96" rx="12" />
          {[-24, 0, 24].map((y, i) => (
            <g key={y}>
              <rect x="-58" y={y - 8} width="16" height="16" rx="4" strokeWidth="2.5" />
              <path d={`M-55 ${y} L-51 ${y + 4} L-44 ${y - 4}`} strokeWidth="3" className="a-draw" style={d(i * 0.5)} />
              <rect x="-36" y={y - 3} width={[46, 36, 52][i]} height="6" rx="3" fill={i === 1 ? c2 : c1} stroke="none" fillOpacity="0.7" className="a-grow" style={d(i * 0.5)} />
            </g>
          ))}
          <circle cx="56" cy="0" r="24" strokeOpacity="0.3" />
          <circle cx="56" cy="0" r="24" stroke={c2} className="a-draw" />
          <circle cx="56" cy="0" r="6" fill={c1} stroke="none" className="a-pulse" />
        </>
      );
    case 'web':
    case 'code':
    default:
      return (
        <>
          <rect x="-72" y="-46" width="144" height="92" rx="10" />
          <path d="M-72 -26 H72" />
          <path d="M-26 0 L-40 14 L-26 28" />
          <path d="M26 0 L40 14 L26 28" />
          <path d="M8 -6 L-8 34" className="a-pulse" />
          <rect x="-60" y="-40" width="40" height="6" rx="3" fill={c2} stroke="none" fillOpacity="0.6" className="a-grow" />
        </>
      );
  }
}

/**
 * Portada animada generada en código (no es una captura real).
 * Si el proyecto tiene página pública, se dibuja como una ventana de navegador con su dominio.
 */
export function ProjectCover({ project, label, className = '' }: { project: Project; label: string; className?: string }) {
  const uid = useId().replace(/:/g, '');
  const c1 = categoryColor(project.category);
  const c2 = project.category !== 'practice' ? categoryMap[project.category].color2 : '#5d6b94';
  const domain = domainOf(project.demo);
  const browser = Boolean(domain);

  return (
    <div className={`relative overflow-hidden ${className}`} role="img" aria-label={`${project.name} — ${label}`}>
      <svg viewBox="0 0 400 225" className="cover-anim h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a0f2e" />
            <stop offset="1" stopColor="#140a36" />
          </linearGradient>
          <radialGradient id={`gl-${uid}`} cx="0.68" cy="0.5" r="0.7">
            <stop offset="0" stopColor={c1} stopOpacity="0.55" />
            <stop offset="1" stopColor={c1} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`gl2-${uid}`} cx="0.1" cy="0.9" r="0.6">
            <stop offset="0" stopColor={c2} stopOpacity="0.35" />
            <stop offset="1" stopColor={c2} stopOpacity="0" />
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
        <rect width="400" height="225" fill={`url(#gl2-${uid})`} />
        {/* Partículas */}
        {[
          [40, 60, 2, 0],
          [120, 30, 1.5, 0.8],
          [360, 190, 2, 1.4],
          [330, 40, 1.5, 0.4],
          [200, 200, 1.5, 1.1],
        ].map(([x, y, r, delay]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#ffffff" className="a-pulse" style={d(delay as number)} />
        ))}

        {browser ? (
          <g>
            <rect x="14" y="12" width="372" height="22" rx="8" fill="#000000" fillOpacity="0.35" stroke={c1} strokeOpacity="0.35" />
            <circle cx="28" cy="23" r="3.5" fill="#ff5f87" />
            <circle cx="40" cy="23" r="3.5" fill="#ffc46b" />
            <circle cx="52" cy="23" r="3.5" fill="#4dffb5" />
            <rect x="70" y="16" width="230" height="14" rx="7" fill="#ffffff" fillOpacity="0.08" />
            <text x="80" y="26.5" fill="#ffffff" fillOpacity="0.85" fontFamily="var(--font-mono)" fontSize="9">
              🔒 {domain.length > 38 ? `${domain.slice(0, 37)}…` : domain}
            </text>
            <circle cx="372" cy="23" r="3" fill="#4dffb5" className="a-pulse" />
          </g>
        ) : null}

        <g transform={`translate(272 ${browser ? 124 : 112})`} stroke={`url(#ln-${uid})`} fill="none" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <Motif motif={project.cover} c1={c1} c2={c2} />
        </g>
        <text x="24" y="198" fill="#ffffff" fillOpacity="0.95" fontFamily="var(--font-display)" fontSize="20" fontWeight="600">
          {project.name.length > 24 ? `${project.name.slice(0, 23)}…` : project.name}
        </text>
        <rect x="24" y="206" width="56" height="3" rx="1.5" fill={c1} />
        <rect x="84" y="206" width="20" height="3" rx="1.5" fill={c2} opacity="0.7" />
      </svg>
      <span className="absolute bottom-2 right-2 rounded-md bg-black/55 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/85 backdrop-blur">
        {label}
      </span>
    </div>
  );
}
