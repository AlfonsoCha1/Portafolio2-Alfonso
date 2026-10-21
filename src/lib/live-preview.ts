import type { Project, ProjectImage } from '@/data/types';

/** ¿Este proyecto se puede ver en vivo dentro del portafolio? */
export function canLivePreview(p: Project): boolean {
  return Boolean(p.demo) && p.livePreview !== false;
}

/** Primera captura real aprobada del proyecto (no conceptual), si existe. */
export function realShot(p: Project): ProjectImage | undefined {
  return p.gallery?.find((g) => !g.conceptual);
}

/** ¿La página del proyecto está en Render (puede tardar en despertar)? Compara el dominio exacto. */
export function isRenderHosted(url?: string): boolean {
  if (!url) return false;
  try {
    const host = new URL(url).hostname.toLowerCase();
    return host === 'onrender.com' || host.endsWith('.onrender.com');
  } catch {
    return false;
  }
}
