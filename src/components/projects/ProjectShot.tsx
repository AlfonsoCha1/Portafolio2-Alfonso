import Image from 'next/image';
import type { Project, ProjectImage } from '@/data/types';

/** Captura real de la página del proyecto (aprobada), dentro de una ventana de navegador. */
export function ProjectShot({
  project,
  shot,
  alt,
  label,
  className = '',
  sizes = '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  priority = false,
}: {
  project: Project;
  shot: ProjectImage;
  alt: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  let host = '';
  try {
    host = project.demo ? new URL(project.demo).host : '';
  } catch {
    host = '';
  }
  return (
    <div className={`project-shot relative flex flex-col overflow-hidden bg-[#070b24] ${className}`}>
      <div className="flex h-7 shrink-0 items-center gap-1.5 border-b border-white/10 bg-black/70 px-3" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-[#ff5f87]" />
        <span className="h-2 w-2 rounded-full bg-[#ffc46b]" />
        <span className="h-2 w-2 rounded-full bg-[#4dffb5]" />
        {host ? <span className="ml-2 min-w-0 truncate rounded-md bg-white/10 px-2 py-0.5 font-mono text-[9px] text-white/80">🔒 {host}</span> : null}
        <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-[#4dffb5]" />
      </div>
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <Image src={shot.src} alt={alt} fill sizes={sizes} priority={priority} className="project-shot__img object-cover object-top" />
        <span aria-hidden="true" className="project-shot__shine" />
      </div>
      {label ? (
        <span className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-white/90 backdrop-blur">
          {label}
        </span>
      ) : null}
    </div>
  );
}
