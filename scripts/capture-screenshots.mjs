/**
 * Toma una captura real (parte superior, 1440×900) de la página pública de cada proyecto.
 * Se ejecuta en GitHub Actions: `node --experimental-strip-types scripts/capture-screenshots.mjs`.
 * Las imágenes se revisan a mano antes de agregarlas al portafolio (public/images/proyectos/).
 */
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const { projects } = await import('../src/data/projects.ts');
const targets = projects.filter((p) => p.demo);
const OUT = 'capturas';
await mkdir(OUT, { recursive: true });

const SLEEPING = /SERVICE WAKING UP|APPLICATION LOADING|ALLOCATING COMPUTE|STARTING THE INSTANCE/i;
const browser = await chromium.launch();
let ok = 0;
for (const p of targets) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: 'dark',
    locale: 'es-MX',
  });
  const page = await ctx.newPage();
  try {
    await page.goto(p.demo, { waitUntil: 'domcontentloaded', timeout: 120_000 });
    // Servicios gratuitos de Render se duermen: esperar a que despierten (hasta ~3 min).
    const deadline = Date.now() + 180_000;
    while (Date.now() < deadline) {
      const text = await page.evaluate(() => document.body?.innerText ?? '').catch(() => '');
      if (!SLEEPING.test(text)) break;
      await page.waitForTimeout(5000);
    }
    await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
    // Cerrar avisos de cookies si existen
    for (const name of [/solo esenciales/i, /rechazar/i, /aceptar/i, /accept/i]) {
      const b = page.getByRole('button', { name }).first();
      if (await b.isVisible().catch(() => false)) {
        await b.click().catch(() => {});
        break;
      }
    }
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `${OUT}/${p.slug}.png` });
    console.log('ok', p.slug, page.url());
    ok++;
  } catch (e) {
    console.error('error', p.slug, e instanceof Error ? e.message : e);
  }
  await ctx.close();
}
await browser.close();
console.log(`${ok}/${targets.length} capturas`);
