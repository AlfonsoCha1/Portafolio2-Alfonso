'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, FileText, Mail, MapPin, Quote } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useRef } from 'react';
import { Link } from '@/i18n/navigation';
import { profile } from '@/data/profile';
import { tx } from '@/lib/i18n';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { UniverseStage } from '@/components/universe/UniverseStage';
import { IslandNavigator } from '@/components/universe/IslandNavigator';
import { PerformanceModeSwitcher } from '@/components/layout/PerformanceModeSwitcher';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Hero() {
  const t = useTranslations('hero');
  const tc = useTranslations('common');
  const locale = useLocale();
  const root = useRef<HTMLElement>(null);
  const roles = profile.roles[locale === 'en' ? 'en' : 'es'];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-hero-item]', {
          y: 28,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          delay: 0.25,
        });
        // Parallax suave del texto al salir del hero
        gsap.to('[data-hero-copy]', {
          yPercent: -12,
          opacity: 0.2,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section id="inicio" ref={root} aria-labelledby="hero-title" className="relative flex min-h-[100svh] flex-col overflow-x-clip lg:block">
      {/* Universo: arriba en móvil, a pantalla completa en escritorio */}
      <div className="relative mt-16 h-[56svh] min-h-[380px] w-full lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
        <UniverseStage />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[var(--bg)] to-transparent lg:hidden" />
        {/* Velo lateral para que el texto del hero se lea sobre el universo */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[46%] bg-gradient-to-r from-[color-mix(in_srgb,var(--bg)_88%,transparent)] via-[color-mix(in_srgb,var(--bg)_55%,transparent)] to-transparent lg:block" />
      </div>

      <div className="container-x relative z-10 flex flex-1 flex-col justify-center gap-6 pb-10 lg:pointer-events-none lg:min-h-[100svh] lg:max-w-[1480px] lg:pb-28 lg:pt-28">
        <div data-hero-copy className="flex max-w-[560px] flex-col gap-5 lg:pointer-events-auto">
          <p data-hero-item className="kicker">
            {t('kicker')}
          </p>
          <h1 id="hero-title" data-hero-item className="font-display text-[clamp(2.6rem,7vw,5.2rem)] font-bold leading-[0.95] tracking-tight">
            <span className="block">{profile.firstName}</span>
            <span className="text-gradient block pb-1">{profile.lastName}</span>
          </h1>
          <p data-hero-item className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-muted">
            <span className="text-fg">{tx(profile.headline, locale)}</span>
            {roles.slice(0, 3).map((r) => (
              <span key={r} className="flex items-center gap-2">
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-cyan" />
                {r}
              </span>
            ))}
          </p>
          <p data-hero-item className="max-w-[52ch] text-base leading-relaxed text-muted sm:text-lg lg:max-w-[44ch]">
            {tx(profile.intro, locale)}
          </p>
          <div data-hero-item className="flex flex-wrap gap-3">
            <a href="#proyectos" className="btn btn-primary">
              {t('explore')}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <Link href="/cv" className="btn btn-ghost">
              <FileText className="h-4 w-4" aria-hidden="true" />
              {t('viewCv')}
            </Link>
          </div>
          <div data-hero-item className="flex flex-wrap items-center gap-2" aria-label={t('socials')}>
            <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${tc('newTab')}`}>
              <GithubIcon className="h-5 w-5" />
            </a>
            <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${tc('newTab')}`}>
              <LinkedinIcon className="h-5 w-5 text-[#3b8cff]" />
            </a>
            <a className="icon-btn" href={`mailto:${profile.email}`} aria-label={`Email: ${profile.email}`}>
              <Mail className="h-5 w-5" aria-hidden="true" />
            </a>
            <span className="chip ml-1 h-11 rounded-xl px-3 text-xs">
              <MapPin className="h-4 w-4 text-pink" aria-hidden="true" />
              {tx(profile.location, locale)}
            </span>
          </div>
          <figure data-hero-item className="glass relative hidden max-w-[440px] rounded-2xl p-4 pl-5 sm:block">
            <span aria-hidden="true" className="absolute inset-y-4 left-0 w-[3px] rounded-full bg-gradient-to-b from-violet to-cyan" />
            <Quote className="mb-1 h-4 w-4 text-violet" aria-hidden="true" />
            <blockquote className="text-sm leading-relaxed text-fg/90">{tx(profile.quote, locale)}</blockquote>
            <figcaption className="mt-2 text-right text-xs text-dim">{t('quoteBy')}</figcaption>
          </figure>
        </div>

        <div data-hero-item className="flex flex-col gap-3 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-6 lg:mx-auto lg:max-w-[1480px] lg:flex-row lg:items-end lg:justify-between lg:px-6">
          <div className="lg:pointer-events-auto lg:max-w-[70%]">
            <IslandNavigator />
          </div>
          <div className="hidden lg:pointer-events-auto lg:mr-24 lg:block">
            <PerformanceModeSwitcher />
          </div>
        </div>
      </div>

    </section>
  );
}
