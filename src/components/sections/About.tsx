import Image from 'next/image';
import { GraduationCap, Languages, MapPin, Rocket, Target } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import { certifications } from '@/data/certifications';
import { education } from '@/data/education';
import { tx } from '@/lib/i18n';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function About() {
  const t = useTranslations('about');
  const locale = useLocale();
  const realProjects = projects.filter((p) => p.category !== 'practice').length;
  const stats = [
    { value: `${realProjects}`, label: t('statProjects'), color: '#FF39C6' },
    { value: `${certifications.length}`, label: t('statCerts'), color: '#19E3B1' },
    { value: `${profile.itSince}`, label: t('statYears'), color: '#00E5FF' },
    { value: `${profile.languages.length}`, label: t('statLanguages'), color: '#FF943D' },
  ];
  const facts = [
    { icon: MapPin, label: t('location'), value: tx(profile.location, locale), color: '#FF39C6' },
    {
      icon: Languages,
      label: t('languages'),
      value: profile.languages.map((l) => `${tx(l.name, locale)} (${tx(l.level, locale)})`).join(' · '),
      color: '#FF943D',
    },
    { icon: GraduationCap, label: t('education'), value: education.map((e) => tx(e.program, locale)).join(' · '), color: '#9D35FF' },
    { icon: Target, label: t('focus'), value: profile.roles[locale === 'en' ? 'en' : 'es'].join(' · '), color: '#00E5FF' },
  ];

  return (
    <section id="sobre-mi" aria-labelledby="about-title" className="section">
      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-[420px]">
          <div aria-hidden="true" className="animate-pulse-glow absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_20%,rgba(157,53,255,0.35),transparent_60%),radial-gradient(circle_at_80%_80%,rgba(0,229,255,0.3),transparent_60%)] blur-2xl" />
          <div className="relative rounded-[2rem] p-[3px] [background:conic-gradient(from_var(--holo-angle),#9d35ff,#147dff,#00e5ff,#ff39c6,#9d35ff)] [animation:holo-spin_8s_linear_infinite]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.85rem] bg-night">
              <Image src={profile.photo.portrait} alt={tx(profile.photo.alt, locale)} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-white">
                <div>
                  <p className="font-display text-lg font-semibold">{profile.name}</p>
                  <p className="text-xs text-white/80">{tx(profile.headline, locale)}</p>
                </div>
                <span className="rounded-full bg-black/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider backdrop-blur">{profile.brand}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <div>
          <SectionHeading kicker={t('kicker')} title={t('title')} accent="#9D35FF" id="about-title" />
          <Reveal>
            <p className="text-base leading-relaxed text-fg/90 md:text-lg">{tx(profile.summary, locale)}</p>
            <p className="mt-4 text-base leading-relaxed text-muted">{tx(profile.about, locale)}</p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="neon-card mt-6 flex items-start gap-3 p-4" style={{ '--accent': '#19E3B1' } as React.CSSProperties}>
              <Rocket className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
              <p className="text-sm leading-relaxed">
                <strong className="text-accent">{t('building')}:</strong> {tx(profile.building, locale)}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="glass flex flex-col-reverse rounded-2xl p-4 text-center" style={{ '--accent': s.color } as React.CSSProperties}>
                  <dt className="mt-1 text-xs font-semibold text-muted">{s.label}</dt>
                  <dd className="font-display text-3xl font-bold text-accent [text-shadow:0_0_24px_color-mix(in_srgb,var(--accent)_45%,transparent)]">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.15}>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              {facts.map((f) => (
                <div key={f.label} className="flex items-start gap-3 rounded-2xl border border-line p-4" style={{ '--accent': f.color } as React.CSSProperties}>
                  <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
                  <div>
                    <dt className="text-xs font-bold uppercase tracking-wider text-dim">{f.label}</dt>
                    <dd className="mt-1 text-sm">{f.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
