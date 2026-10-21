/**
 * Acceso seguro a localStorage: puede no existir (modo privado, SSR, permisos bloqueados).
 * Solo se guardan preferencias de interfaz; nunca datos personales.
 */
export const STORAGE_KEYS = {
  theme: 'chavatrix.theme',
  mode: 'chavatrix.mode',
  nexbot: 'chavatrix.nexbot',
  motion: 'chavatrix.motion',
} as const;

export function readStorage(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorage(key: string, value: string | null): void {
  try {
    if (typeof window === 'undefined') return;
    if (value === null) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, value);
  } catch {
    /* sin almacenamiento disponible: la preferencia vive solo en memoria */
  }
}

export function readSession(key: string): string | null {
  try {
    return typeof window === 'undefined' ? null : window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeSession(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(key, value);
  } catch {
    /* ignorado */
  }
}
