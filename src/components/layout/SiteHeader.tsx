'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Menu, Send, X } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useUI } from '@/components/providers/AppProvider';
import { AcLogo } from '@/components/ui/AcLogo';
import { profile } from '@/data/profile';
import { tx } from '@/lib/i18n';
import { NAV_ITEMS } from './nav-items';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PerformanceModeSwitcher } from './PerformanceModeSwitcher';
import { ScrollProgress, useExplored } from './ScrollProgress';

type SectionLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { onHome: boolean; id: string };

/** En la página de inicio usa un ancla local; en otras páginas navega al inicio con la sección. */
function SectionLink({ onHome, id, children, ...rest }: SectionLinkProps) {
  if (onHome) {
    return (
      <a href={`#${id}`} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={{ pathname: '/', hash: id }} {...rest}>
      {children}
    </Link>
  );
}

export function SiteHeader() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const { activeSection } = useUI();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const explored = useExplored();
  const onHome = pathname === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);


  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <ScrollProgress />
      <div className={`transition-all duration-300 ${scrolled || open ? 'py-2' : 'py-3 md:py-4'}`}>
        <div className="mx-auto flex max-w-[1480px] items-center gap-3 px-3 sm:px-5">
          <div className={`glass flex w-full items-center gap-2 rounded-2xl py-1.5 pl-2 pr-1.5 transition-shadow ${scrolled ? 'glass-strong' : ''}`}>
            <Link href="/" className="group flex shrink-0 items-center gap-2.5 rounded-xl px-1.5 py-1" aria-label={`${profile.name} — ${t('home')}`}>
              <span className="grid h-10 w-12 place-items-center rounded-xl bg-[var(--night)] ring-1 ring-white/10 transition-shadow group-hover:shadow-[0_0_22px_-4px_var(--violet)]">
                <AcLogo className="h-7 w-10" />
              </span>
              <span className="hidden flex-col leading-tight min-[420px]:flex xl:hidden 2xl:flex">
                <span className="font-display text-[0.9rem] font-semibold tracking-tight">{profile.name}</span>
                <span className="hidden text-[0.68rem] text-muted sm:block">{tx(profile.headline, locale)}</span>
              </span>
            </Link>

            <nav aria-label={t('main')} className="mx-auto hidden xl:block">
              <ul className="flex items-center gap-0.5">
                {NAV_ITEMS.map((item) => {
                  const active = onHome && activeSection === item.id;
                  return (
                    <li key={item.id}>
                      <SectionLink
                        onHome={onHome}
                        id={item.id}
                        aria-current={active ? 'true' : undefined}
                        className="group relative block rounded-lg px-2.5 py-2 text-[0.8rem] font-semibold text-muted transition-colors hover:text-fg aria-[current=true]:text-fg"
                        style={{ '--accent': item.color } as React.CSSProperties}
                      >
                        <span className="relative z-10 transition-[text-shadow] group-hover:[text-shadow:0_0_14px_var(--accent)]">{t(item.key)}</span>
                        <span
                          aria-hidden="true"
                          className={`absolute inset-x-2 -bottom-0.5 h-[2px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)] transition-all duration-300 ${
                            active ? 'opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-70'
                          }`}
                        />
                      </SectionLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
              <ThemeSwitcher />
              <LanguageSwitcher />
              <SectionLink onHome={onHome} id="contacto" className="btn btn-primary hidden h-11 min-h-0 px-4 text-sm 2xl:inline-flex">
                {t('talk')}
                <Send className="h-4 w-4" aria-hidden="true" />
              </SectionLink>
              <button
                type="button"
                className="icon-btn xl:hidden"
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t('closeMenu') : t('openMenu')}
                onClick={() => setOpen((v) => !v)}
                data-testid="menu-toggle"
              >
                {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22 }}
            className="xl:hidden"
          >
            <div className="mx-3 max-h-[calc(100dvh-90px)] overflow-y-auto rounded-2xl glass-strong p-3 scroll-thin sm:mx-5">
              <nav aria-label={t('main')}>
                <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                  {NAV_ITEMS.map((item, i) => {
                    const active = onHome && activeSection === item.id;
                    const seen = explored.seen.has(item.id);
                    return (
                      <motion.li key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.025 }}>
                        <SectionLink
                          onHome={onHome}
                          id={item.id}
                          onClick={() => setOpen(false)}
                          aria-current={active ? 'true' : undefined}
                          className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 text-base font-semibold transition-colors hover:bg-[var(--surface)] aria-[current=true]:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
                          style={{ '--accent': item.color } as React.CSSProperties}
                        >
                          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                          <span className="flex-1">{t(item.key)}</span>
                          {seen ? <span aria-hidden="true" className="text-xs text-dim">✓</span> : null}
                        </SectionLink>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
                <PerformanceModeSwitcher />
                <p className="text-xs text-muted">{t('explored', { count: explored.seen.size, total: NAV_ITEMS.length })}</p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
