import { Code2, ExternalLink, Lock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { GithubIcon } from '@/components/ui/BrandIcons';
import type { Project } from '@/data/types';

/**
 * Botones según los enlaces reales del proyecto:
 * - código y demo → "Ver código" + "Abrir proyecto"
 * - solo código   → "Ver en GitHub"
 * - solo demo     → "Visitar proyecto"
 * Nunca se generan enlaces inexistentes ni a código privado.
 */
export function ProjectLinks({ project, size = 'md' }: { project: Project; size?: 'sm' | 'md' }) {
  const t = useTranslations('projects');
  const tc = useTranslations('common');
  const cls = size === 'sm' ? 'btn h-10 min-h-0 px-3 text-xs' : 'btn';
  const { repo, demo, visibility } = project;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {repo && demo ? (
        <>
          <a className={`${cls} btn-ghost`} href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${t('viewCode')} — ${project.name} ${tc('newTab')}`}>
            <Code2 className="h-4 w-4" aria-hidden="true" />
            {t('viewCode')}
          </a>
          <a className={`${cls} btn-accent`} href={demo} target="_blank" rel="noopener noreferrer" aria-label={`${t('openProject')} — ${project.name} ${tc('newTab')}`}>
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {t('openProject')}
          </a>
        </>
      ) : repo ? (
        <a className={`${cls} btn-accent`} href={repo} target="_blank" rel="noopener noreferrer" aria-label={`${t('viewOnGithub')} — ${project.name} ${tc('newTab')}`}>
          <GithubIcon className="h-4 w-4" />
          {t('viewOnGithub')}
        </a>
      ) : demo ? (
        <a className={`${cls} btn-accent`} href={demo} target="_blank" rel="noopener noreferrer" aria-label={`${t('visitProject')} — ${project.name} ${tc('newTab')}`}>
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {t('visitProject')}
        </a>
      ) : null}
      {visibility === 'private' ? (
        <span className="chip" title={t('privateCode')}>
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          {t('privateCode')}
        </span>
      ) : null}
    </div>
  );
}
