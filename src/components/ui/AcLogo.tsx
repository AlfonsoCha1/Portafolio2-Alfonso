'use client';

import { useId } from 'react';
import { AC_PATH } from './ac-path';

/**
 * Monograma "AC" con las mismas letras del favicon de Alfonso,
 * relleno con un degradado neón que recorre las letras.
 */
export function AcLogo({ className, animated = true, title }: { className?: string; animated?: boolean; title?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox="20 110 472 300" className={className} role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <defs>
        <linearGradient id={`ac-${id}`} x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="#FF39C6" />
          <stop offset="0.3" stopColor="#9D35FF" />
          <stop offset="0.6" stopColor="#147DFF" />
          <stop offset="0.85" stopColor="#00E5FF" />
          <stop offset="1" stopColor="#7CFFF2" />
          {animated ? (
            <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="7s" repeatCount="indefinite" />
          ) : null}
        </linearGradient>
      </defs>
      <path d={AC_PATH} fill={`url(#ac-${id})`} fillRule="evenodd" />
    </svg>
  );
}
