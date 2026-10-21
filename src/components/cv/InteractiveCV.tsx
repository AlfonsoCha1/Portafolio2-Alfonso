import Image from 'next/image';
import { ArrowLeft, Download, Globe, Mail, MapPin } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { education } from '@/data/education';
import { skillGroups } from '@/data/skills';
import { sortedProjects } from '@/data/projects';
import { sortedCertifications } from '@/data/certifications';
import { tx } from '@/lib/i18n';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { PrintButton } from './PrintButton';

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 flex items-center gap-3 font-display text-lg font-semibold tracking-tight">
      <span aria-hidden="true" className="h-5 w-1 rounded-full bg-gradient-to-b from-violet to-cyan" />
      {children}
    </h2>
  );
}

/** CV interactivo: toda la trayectoria sin depender de la escena 3D. */
export function InteractiveCV() {
  const t = useTranslations('cv');
  const tp = useTranslations('projects');
  const locale = useLocale();
  const pdf = locale === 'en' ? profile.cv.en : profile.cv.es;
  const otherPdf = locale === 'en' ? profile.cv.es : profile.cv.en;
  const mainProjects = sortedProjects.filter((p) => p.category !== 'practice');

  return (
    <div className="container-x pb-24 pt-28">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="btn btn-ghost h-10 min-h-0 px-3 text-sm">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('backHome')}
        </Link>
        <div className="flex flex-wrap gap-2">
          <a href={pdf} download className="btn btn-primary h-10 min-h-0 px-4 text-sm" data-testid="cv-page-download">
            <Download className="h-4 w-4" aria-hidden="true" />
            {t('download')} ({locale.toUpperCase()})
          </a>
          <a href={otherPdf} download className="btn btn-ghost h-10 min-h-0 px-3 text-sm">
            <Download className="h-4 w-4" aria-hidden="true" />
            PDF {locale === 'en' ? 'ES' : 'EN'}
          </a>
          <PrintButton label={t('print')} />
        </div>
      </div>

      <article className="glass-strong print-plain overflow-hidden rounded-3xl" aria-labelledby="cv-name">
        {/* Encabezado */}
        <header className="relative flex flex-col gap-6 border-b border-line p-6 sm:flex-row sm:items-center md:p-10">
          <div aria-hidden="true" className="no-print pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_0%,rgba(157,53,255,0.18),transparent_60%)]" />
          <div className="holo-ring relative h-28 w-28 shrink-0">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-night">
              <Image src={profile.photo.circle} alt={tx(profile.photo.alt, locale)} fill sizes="112px" className="object-cover" />
            </div>
          </div>
          <div className="relative flex-1">
            <p className="kicker">{t('title')}</p>
            <h1 id="cv-name" className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              {profile.fullName}
            </h1>
            <p className="mt-1 text-base font-semibold text-gradient">{tx(profile.headline, locale)}</p>
            <p className="mt-1 text-sm text-muted">{profile.roles[locale === 'en' ? 'en' : 'es'].join(' · ')}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <li className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {tx(profile.location, locale)}
              </li>
              <li>
                <a className="flex items-center gap-1.5 hover:text-fg" href={`mailto:${profile.email}`}>
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {profile.email}
                </a>
              </li>
              <li>
                <a className="flex items-center gap-1.5 hover:text-fg" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                  <LinkedinIcon className="h-4 w-4" />
                  in/alfonso-chavarin
                </a>
              </li>
              <li>
                <a className="flex items-center gap-1.5 hover:text-fg" href={profile.github} target="_blank" rel="noopener noreferrer">
                  <GithubIcon className="h-4 w-4" />
                  {profile.githubUser}
                </a>
              </li>
            </ul>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-10 p-6 md:p-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="flex flex-col gap-10">
            <section aria-label={t('profile')}>
              <H2>{t('profile')}</H2>
              <p className="leading-relaxed text-fg/90">{tx(profile.summary, locale)}</p>
            </section>

            <section aria-label={t('experience')}>
              <H2>{t('experience')}</H2>
              <ol className="flex flex-col gap-6">
                {experience.map((e) => (
                  <li key={e.id} className="relative border-l-2 pl-5" style={{ borderColor: `${e.color}88` }}>
                    <span aria-hidden="true" className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full" style={{ background: e.color, boxShadow: `0 0 10px ${e.color}` }} />
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold">{e.company}</h3>
                      <p className="font-mono text-xs text-muted">{tx(e.period, locale)}</p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: e.color }}>
                      {tx(e.role, locale)}
                    </p>
                    <p className="text-xs text-dim">{tx(e.location, locale)}</p>
                    <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-fg/90 marker:text-dim">
                      {e.bullets.map((b, i) => (
                        <li key={i}>{tx(b, locale)}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>

            <section aria-label={t('projects')}>
              <H2>{t('projects')}</H2>
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {mainProjects.map((p) => (
                  <li key={p.slug} className="rounded-2xl border border-line p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link href={`/projects/${p.slug}`} className="font-semibold hover:underline">
                        {p.name}
                      </Link>
                      <StatusBadge status={p.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">{tx(p.summary, locale)}</p>
                    <p className="mt-2 font-mono text-[10px] text-dim">{p.tech.join(' · ')}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-dim">
                {tp('count', { count: sortedProjects.length })} — github.com/{profile.githubUser}
              </p>
            </section>
          </div>

          <aside className="flex flex-col gap-10">
            <section aria-label={t('education')}>
              <H2>{t('education')}</H2>
              <ul className="flex flex-col gap-4">
                {education.map((e) => (
                  <li key={e.id}>
                    <p className="font-semibold">{tx(e.program, locale)}</p>
                    <p className="text-sm text-muted">{e.institution}</p>
                    <p className="font-mono text-xs text-dim">
                      {tx(e.period, locale)} · {tx(e.mode, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label={t('skills')}>
              <H2>{t('skills')}</H2>
              <div className="flex flex-col gap-4">
                {skillGroups.map((g) => (
                  <div key={g.id}>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: g.color }}>
                      {tx(g.name, locale)}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-fg/90">
                      {g.items.map((s) => tx(s.name, locale) + (s.level ? ` (${tx(s.level, locale)})` : '')).join(' · ')}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section aria-label={t('languages')}>
              <H2>{t('languages')}</H2>
              <ul className="flex flex-col gap-1 text-sm">
                {profile.languages.map((l) => (
                  <li key={l.name.es} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-cyan" aria-hidden="true" />
                      {tx(l.name, locale)}
                    </span>
                    <span className="font-semibold">{tx(l.level, locale)}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label={t('certifications')}>
              <H2>{t('certifications')}</H2>
              <ul className="flex flex-col gap-2.5 text-sm">
                {sortedCertifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-semibold leading-snug">{tx(c.name, locale)}</p>
                    <p className="text-xs text-muted">
                      {c.issuer} · {tx(c.date, locale)}
                      {c.hours ? ` · ${c.hours} h` : ''}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-label={t('links')}>
              <H2>{t('links')}</H2>
              <ul className="flex flex-col gap-1 text-sm">
                <li>
                  <a className="hover:underline" href={profile.github} target="_blank" rel="noopener noreferrer">
                    github.com/{profile.githubUser}
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    linkedin.com/in/alfonso-chavarin
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </article>
      <p className="no-print mt-4 text-center text-xs text-dim">{t('pdfFrom')}</p>
    </div>
  );
}
