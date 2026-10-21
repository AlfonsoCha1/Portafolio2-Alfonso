import type { Project, ProjectImage } from '@/data/types';

/** ¿Este proyecto se puede ver en vivo dentro del portafolio? */
export function canLivePreview(p: Project): boolean {
  return Boolean(p.demo) && p.livePreview !== false;
}

/** Primera captura real aprobada del proyecto (no conceptual), si existe. */
export function realShot(p: Project): ProjectImage | undefined {
  return p.gallery?.find((g) => !g.conceptual);
}
