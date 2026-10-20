import { ArrowUp } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { AcLogo } from '@/components/ui/AcLogo';
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons';
import { profile } from '@/data/profile';

export async function SiteFooter() {
  const t = await getTranslations('footer');
  const tc = await getTranslations('common');
  const year = 2026;
  return (
    <footer className="relative border-t border-line">
      <div className="container-x flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-14 place-items-center rounded-xl bg-[var(--night)] ring-1 ring-white/10">
            <AcLogo className="h-7 w-10" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">
              {profile.name} · <span className="text-gradient">{profile.brand}</span>
            </p>
            <p className="text-xs text-muted">{t('rights', { year })}</p>
          </div>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-dim">{t('built')}</p>
        <div className="flex items-center gap-2">
          <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${tc('newTab')}`}>
            <GithubIcon className="h-5 w-5" />
          </a>
          <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${tc('newTab')}`}>
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <Link className="btn btn-ghost h-11 min-h-0 px-3 text-xs" href="/privacy">
            {t('privacy')}
          </Link>
          <a className="icon-btn" href="#top" aria-label={t('top')}>
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
