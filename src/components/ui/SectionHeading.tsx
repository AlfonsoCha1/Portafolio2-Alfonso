import type { ReactNode } from 'react';

export function SectionHeading({
  kicker,
  title,
  intro,
  accent,
  align = 'left',
  id,
  children,
}: {
  kicker: string;
  title: string;
  intro?: string;
  accent?: string;
  align?: 'left' | 'center';
  id?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`mb-10 flex flex-col gap-3 md:mb-14 ${align === 'center' ? 'items-center text-center' : ''}`} style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}>
      <p className="kicker flex items-center gap-3">
        <span aria-hidden="true" className="inline-block h-px w-8 bg-gradient-to-r from-transparent to-[var(--accent,var(--cyan))]" />
        {kicker}
      </p>
      <h2 id={id} className="font-display text-3xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {intro ? <p className={`max-w-2xl text-base leading-relaxed text-muted md:text-lg ${align === 'center' ? 'mx-auto' : ''}`}>{intro}</p> : null}
      {children}
    </div>
  );
}
