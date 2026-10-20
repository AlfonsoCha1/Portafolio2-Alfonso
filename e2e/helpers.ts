import type { Page } from '@playwright/test';

/** Prepara el navegador: modo 2D (rápido en CI), intro ya vista y NEXBOT visible por defecto. */
export async function prepare(page: Page, opts: { mode?: '2d' | '3d'; intro?: boolean; nexbot?: boolean } = {}) {
  const { mode = '2d', intro = false, nexbot = true } = opts;
  await page.addInitScript(
    ({ mode, intro, nexbot }) => {
      try {
        localStorage.setItem('chavatrix.mode', mode);
        if (!nexbot) localStorage.setItem('chavatrix.nexbot', 'hidden');
        if (!intro) sessionStorage.setItem('chavatrix.intro', '1');
      } catch {
        /* sin almacenamiento */
      }
    },
    { mode, intro, nexbot },
  );
}

/** Errores de consola relevantes (ignora avisos de deprecación de librerías). */
export function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`console: ${m.text()}`);
  });
  return errors;
}
