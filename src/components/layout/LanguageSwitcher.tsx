'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

/** Selector ES | EN. Mantiene la página actual y la sección (hash). */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const t = useTranslations('controls');
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const change = (next: Locale) => {
    if (next === locale) return;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    startTransition(() => {
      router.replace(`${pathname}${hash}`, { locale: next, scroll: false });
    });
  };

  return (
    <div
      role="group"
      aria-label={t('language')}
      className={`glass inline-flex h-11 items-center rounded-xl p-1 text-xs font-bold ${pending ? 'opacity-70' : ''} ${className}`}
    >
      {routing.locales.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          onClick={() => change(l)}
          aria-pressed={l === locale}
          data-testid={`lang-${l}`}
          className={`h-9 min-w-[40px] rounded-lg px-2 uppercase tracking-wider transition-colors ${
            l === locale ? 'bg-gradient-to-r from-violet to-blue text-white shadow-[0_0_14px_-4px_var(--violet)]' : 'text-muted hover:text-fg'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
