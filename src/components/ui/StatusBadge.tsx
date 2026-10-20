import { useTranslations } from 'next-intl';
import type { ProjectStatus } from '@/data/types';

const COLORS: Record<ProjectStatus, string> = {
  live: '#19E3B1',
  beta: '#9D35FF',
  demo: '#147DFF',
  lab: '#00E5FF',
  development: '#FF943D',
  archive: '#8EA2C8',
  personal: '#D946EF',
};

export function StatusBadge({ status, detail }: { status: ProjectStatus; detail?: string }) {
  const t = useTranslations('projects.statuses');
  const color = COLORS[status];
  return (
    <span className="chip chip-accent" style={{ '--accent': color } as React.CSSProperties} title={detail}>
      <span aria-hidden="true" className="relative flex h-2 w-2">
        {status === 'live' || status === 'beta' ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: color }} />
        ) : null}
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: color }} />
      </span>
      {t(status)}
    </span>
  );
}
