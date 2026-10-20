import type { Project } from '@/data/types';

/** ¿Este proyecto se puede ver en vivo dentro del portafolio? */
export function canLivePreview(p: Project): boolean {
  return Boolean(p.demo) && p.livePreview !== false;
}
