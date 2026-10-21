/**
 * Detección prudente de capacidades para elegir entre la experiencia 3D y el modo ligero 2D.
 * No depende del modelo de teléfono: combina soporte WebGL, núcleos, memoria, ahorro de datos
 * y preferencia de movimiento reducido. El usuario siempre puede cambiar el modo manualmente.
 */
export type RenderMode = '3d' | '2d';
export type QualityTier = 'high' | 'medium' | 'low';

export interface DeviceSignals {
  webgl: boolean;
  cores?: number;
  memoryGB?: number;
  saveData?: boolean;
  reducedMotion?: boolean;
  coarsePointer?: boolean;
  smallScreen?: boolean;
}

export interface CapabilityResult {
  recommended: RenderMode;
  quality: QualityTier;
  reasons: string[];
}

export function evaluateCapabilities(s: DeviceSignals): CapabilityResult {
  const reasons: string[] = [];
  if (!s.webgl) return { recommended: '2d', quality: 'low', reasons: ['no-webgl'] };
  if (s.saveData) reasons.push('save-data');
  if (s.reducedMotion) reasons.push('reduced-motion');

  const cores = s.cores ?? 4;
  const memory = s.memoryGB ?? 4;
  // Celular: pantalla táctil y pequeña. Su GPU y su memoria son mucho más limitadas que las de una PC,
  // así que el 3D va en calidad baja y los teléfonos con poca memoria usan el modo ligero.
  const phone = Boolean(s.coarsePointer && s.smallScreen);
  const weak = cores <= 2 || memory <= 2 || (phone && (memory <= 3 || cores <= 4));
  const modest = cores <= 4 || memory <= 4;

  if (weak) reasons.push('low-power');
  if (phone) reasons.push('phone');
  if (s.saveData || s.reducedMotion || weak) {
    return { recommended: '2d', quality: 'low', reasons };
  }
  return { recommended: '3d', quality: phone ? 'low' : modest ? 'medium' : 'high', reasons };
}

export function hasWebGL(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function readDeviceSignals(): DeviceSignals {
  if (typeof window === 'undefined') return { webgl: false };
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    webgl: hasWebGL(),
    cores: nav.hardwareConcurrency,
    memoryGB: nav.deviceMemory,
    saveData: nav.connection?.saveData,
    reducedMotion: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    coarsePointer: window.matchMedia?.('(pointer: coarse)').matches,
    smallScreen: window.innerWidth < 768,
  };
}

/** Parámetros de render por nivel de calidad. */
export const QUALITY_PRESETS: Record<QualityTier, { dpr: [number, number]; stars: number; particles: number; packets: number; segments: number }> = {
  high: { dpr: [1, 1.75], stars: 2200, particles: 260, packets: 6, segments: 96 },
  medium: { dpr: [1, 1.35], stars: 1300, particles: 140, packets: 4, segments: 64 },
  low: { dpr: [0.8, 1], stars: 700, particles: 60, packets: 2, segments: 40 },
};
