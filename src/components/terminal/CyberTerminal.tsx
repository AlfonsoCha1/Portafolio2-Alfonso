'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';
import { runCommand, type TermLine } from '@/lib/terminal';
import type { Locale } from '@/data/types';

interface Line extends TermLine {
  id: number;
  prompt?: boolean;
}

const TONES: Record<string, string> = {
  default: 'text-[#d6e2ff]',
  accent: 'text-[#7cf3ff] font-bold',
  muted: 'text-[#7f8bb3]',
  success: 'text-[#4dffb5]',
  warn: 'text-[#ffc46b]',
  error: 'text-[#ff6b9a]',
  link: 'text-[#c79bff] underline decoration-dotted underline-offset-4 hover:text-white',
};

const MAX_LINES = 220;
let counter = 0;

/**
 * Terminal SOC simulada. Solo interpreta comandos de una lista cerrada (ver lib/terminal.ts);
 * no ejecuta nada en el sistema.
 */
export function CyberTerminal({ autoFocus = false, height = 'h-[360px]' }: { autoFocus?: boolean; height?: string }) {
  const t = useTranslations('terminal');
  const locale = useLocale() as Locale;
  const [lines, setLines] = useState<Line[]>(() => [{ id: counter++, text: t('welcome'), tone: 'accent' }]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [hIndex, setHIndex] = useState(-1);
  const [busy, setBusy] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);
  const inputId = useId();

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus({ preventScroll: true });
    const list = timers.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, [autoFocus]);

  useEffect(() => {
    outRef.current?.scrollTo({ top: outRef.current.scrollHeight });
  }, [lines]);

  const push = (newLines: Line[]) => setLines((prev) => [...prev, ...newLines].slice(-MAX_LINES));

  const submit = (raw: string) => {
    const cmd = raw.slice(0, 64);
    if (busy) return;
    const echo: Line = { id: counter++, text: cmd, prompt: true };
    const result = runCommand(cmd, locale);
    if (cmd.trim()) {
      setHistory((h) => [cmd, ...h].slice(0, 30));
    }
    setHIndex(-1);
    setInput('');
    if (result.clear) {
      setLines([]);
      return;
    }
    push([echo]);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || result.lines.length === 0) {
      push(result.lines.map((l) => ({ ...l, id: counter++ })));
      return;
    }
    // Aparición progresiva de las líneas (efecto de escritura discreto)
    setBusy(true);
    result.lines.forEach((l, i) => {
      timers.current.push(
        window.setTimeout(() => {
          push([{ ...l, id: counter++ }]);
          if (i === result.lines.length - 1) setBusy(false);
        }, 28 * i),
      );
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(history.length - 1, hIndex + 1);
      if (history[next] !== undefined) {
        setHIndex(next);
        setInput(history[next] ?? '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = hIndex - 1;
      setHIndex(Math.max(-1, next));
      setInput(next >= 0 ? (history[next] ?? '') : '');
    }
  };

  const prompt = (
    <span className="shrink-0 select-none">
      <span className="text-[#4dffb5]">chavatrix</span>
      <span className="text-[#7f8bb3]">@</span>
      <span className="text-[#7cf3ff]">soc</span>
      <span className="text-[#7f8bb3]">:~$</span>
    </span>
  );

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-[#1f3a66] bg-[#050915] font-mono text-[13px] text-[#d6e2ff] shadow-[0_0_60px_-25px_#00e5ff]"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
      data-testid="cyber-terminal"
    >
      <div className="flex items-center gap-2 border-b border-[#1f3a66] bg-[#0a1226] px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f87]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#ffc46b]" aria-hidden="true" />
        <span className="h-3 w-3 rounded-full bg-[#4dffb5]" aria-hidden="true" />
        <span className="ml-2 text-xs text-[#7f8bb3]">{t('title')}</span>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-[#4dffb5]">● live</span>
      </div>
      {/* Línea de escaneo decorativa */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-10 h-24 bg-gradient-to-b from-[#00e5ff]/[0.04] to-transparent [animation:scan_6s_linear_infinite]" />
      <div ref={outRef} className={`${height} overflow-y-auto px-4 py-3 scroll-thin`} role="log" aria-live="polite" aria-label={t('label')}>
        {lines.map((l) => (
          <div key={l.id} className="flex gap-2 whitespace-pre-wrap break-words leading-relaxed">
            {l.prompt ? prompt : null}
            {l.href ? (
              <a
                href={l.href}
                className={TONES[l.tone ?? 'link']}
                {...(l.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                onClick={(e) => e.stopPropagation()}
              >
                {l.text}
              </a>
            ) : (
              <span className={TONES[l.tone ?? 'default']}>{l.text}</span>
            )}
          </div>
        ))}
      </div>
      <form
        className="flex items-center gap-2 border-t border-[#1f3a66] bg-[#070d1d] px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
      >
        {prompt}
        <label htmlFor={inputId} className="sr-only">
          {t('placeholder')}
        </label>
        <input
          id={inputId}
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value.slice(0, 64))}
          onKeyDown={onKeyDown}
          placeholder={t('placeholder')}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          maxLength={64}
          className="min-w-0 flex-1 bg-transparent text-[#e9f1ff] caret-[#00e5ff] outline-none placeholder:text-[#4f5b82]"
          data-testid="terminal-input"
        />
        <button type="submit" className="rounded-md border border-[#1f3a66] px-2 py-1 text-[11px] text-[#7cf3ff] hover:bg-[#0f1c3a]">
          {t('run')}
        </button>
      </form>
    </div>
  );
}
