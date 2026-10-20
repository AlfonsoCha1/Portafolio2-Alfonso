/**
 * Tema visual con 4 modos en un solo botón:
 *  - light  → Claro
 *  - dark   → Nocturno
 *  - system → Automático: sigue el tema del dispositivo
 *  - time   → Según la hora: claro de 7:00 a 18:59, nocturno el resto
 */
export const THEME_MODES = ['system', 'light', 'dark', 'time'] as const;
export type ThemeMode = (typeof THEME_MODES)[number];
export type ResolvedTheme = 'light' | 'dark';

export const DAY_START_HOUR = 7;
export const NIGHT_START_HOUR = 19;

export function isThemeMode(v: unknown): v is ThemeMode {
  return typeof v === 'string' && (THEME_MODES as readonly string[]).includes(v);
}

export function nextThemeMode(current: ThemeMode): ThemeMode {
  const i = THEME_MODES.indexOf(current);
  return THEME_MODES[(i + 1) % THEME_MODES.length] ?? 'system';
}

export function themeForHour(hour: number): ResolvedTheme {
  return hour >= DAY_START_HOUR && hour < NIGHT_START_HOUR ? 'light' : 'dark';
}

export function resolveTheme(mode: ThemeMode, prefersDark: boolean, hour: number): ResolvedTheme {
  switch (mode) {
    case 'light':
      return 'light';
    case 'dark':
      return 'dark';
    case 'time':
      return themeForHour(hour);
    default:
      return prefersDark ? 'dark' : 'light';
  }
}

/**
 * Script en línea que se ejecuta antes del primer pintado para evitar parpadeo de tema.
 * Debe mantenerse sincronizado con resolveTheme().
 */
export const themeInitScript = `(function(){try{var k='chavatrix.theme';var m=null;try{m=localStorage.getItem(k)}catch(e){}if(['light','dark','system','time'].indexOf(m)<0)m='system';var d=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var h=new Date().getHours();var t=m==='light'?'light':m==='dark'?'dark':m==='time'?((h>=${DAY_START_HOUR}&&h<${NIGHT_START_HOUR})?'light':'dark'):(d?'dark':'light');var r=document.documentElement;r.setAttribute('data-theme',t);r.setAttribute('data-theme-mode',m);r.style.colorScheme=t;}catch(e){}})();`;
