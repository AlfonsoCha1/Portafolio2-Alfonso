import { expect, test } from '@playwright/test';
import { collectErrors, prepare } from './helpers';

test.describe('Inicio', () => {
  test('carga en español sin errores de consola', async ({ page }) => {
    const errors = collectErrors(page);
    await prepare(page);
    await page.goto('/es');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Alfonso');
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });

  test('la raíz redirige a un idioma', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(es|en)$/);
  });

  test('la intro se puede saltar y no se repite en la sesión', async ({ page }) => {
    await prepare(page, { intro: true });
    await page.goto('/es');
    const intro = page.getByTestId('intro');
    await expect(intro).toBeVisible();
    await page.getByTestId('intro-skip').click();
    await expect(intro).toBeHidden();
    await page.reload();
    await expect(page.getByTestId('intro')).toBeHidden();
  });

  test('selector de idioma cambia la interfaz a inglés', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    await page.getByTestId('lang-en').click();
    await expect(page).toHaveURL(/\/en/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.getByRole('heading', { name: "What I've built" })).toBeVisible();
  });

  test('el botón de tema recorre los 4 modos y aplica el tema', async ({ page }) => {
    await prepare(page);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/es');
    const btn = page.getByTestId('theme-toggle');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-theme-mode', 'system');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await btn.click();
    await expect(html).toHaveAttribute('data-theme-mode', 'light');
    await expect(html).toHaveAttribute('data-theme', 'light');
    await btn.click();
    await expect(html).toHaveAttribute('data-theme-mode', 'dark');
    await expect(html).toHaveAttribute('data-theme', 'dark');
    await btn.click();
    await expect(html).toHaveAttribute('data-theme-mode', 'time');
    await btn.click();
    await expect(html).toHaveAttribute('data-theme-mode', 'system');
    // La preferencia persiste
    await btn.click();
    await page.reload();
    await expect(html).toHaveAttribute('data-theme-mode', 'light');
  });
});

test.describe('Universo', () => {
  test('modo 2D: las islas abren su módulo con proyectos reales y se puede volver', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    await expect(page.getByTestId('universe-2d')).toBeVisible();
    await page.getByTestId('island2d-cyber').click();
    const panel = page.getByTestId('module-panel');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('ALBA');
    await expect(panel).toContainText('CyberQuest Academy');
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

  test('las islas funcionan con teclado', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    await page.getByTestId('island-nav-ai').focus();
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('module-panel')).toContainText('SOPHYA');
    await page.getByTestId('module-back').click();
    await expect(page.getByTestId('module-panel')).toBeHidden();
  });

  test('la isla de drones muestra un marcador de pendiente (sin inventar proyectos)', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    await page.getByTestId('island-nav-drones').click();
    await expect(page.getByTestId('pending-placeholder')).toBeVisible();
  });

  test('selector 3D/2D: cambia y recuerda la preferencia', async ({ page, isMobile }) => {
    test.skip(isMobile, 'El selector del hero es de escritorio; en móvil está en el menú');
    await prepare(page, { mode: '3d' });
    await page.goto('/es');
    await expect(page.locator('[data-render-mode="3d"]')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(1, { timeout: 20_000 });
    await page.getByTestId('mode-2d').first().click();
    await expect(page.locator('[data-render-mode="2d"]')).toBeVisible();
    await expect(page.locator('canvas')).toHaveCount(0);
    await page.reload();
    await expect(page.locator('[data-render-mode="2d"]')).toBeVisible();
  });
});

test.describe('Contenido', () => {
  test('proyectos: filtros, búsqueda y página de detalle', async ({ page }) => {
    await prepare(page);
    await page.goto('/es#proyectos');
    const cards = page.getByTestId('project-card');
    const total = await cards.count();
    expect(total).toBeGreaterThan(10);
    await page.getByTestId('filter-ai').click();
    await expect(cards).toHaveCount(4);
    await page.getByTestId('filter-all').click();
    await page.getByTestId('project-search').fill('PostgreSQL');
    await expect(cards).toHaveCount(1);
    await cards.first().getByRole('link', { name: /Chavarín & Said/ }).first().click();
    await expect(page).toHaveURL(/\/es\/projects\/chavarin-said-lealtad/);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Chavarín & Said — Lealtad');
    await expect(page.getByRole('link', { name: /Ver código/ })).toHaveAttribute('href', 'https://github.com/AlfonsoCha1/Chavarin_-_Said');
  });

  test('proyecto privado: sin enlace a código, con su página pública', async ({ page }) => {
    await prepare(page);
    await page.goto('/es/projects/sophya');
    await expect(page.getByText('Código privado').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Visitar proyecto/ })).toHaveAttribute('href', 'https://ia-sophya.vercel.app/');
    await expect(page.locator('a[href*="github.com/AlfonsoCha1/"]').filter({ hasText: /código|GitHub/i })).toHaveCount(0);
  });

  test('línea del tiempo: seleccionar una empresa muestra su información', async ({ page }) => {
    await prepare(page);
    await page.goto('/es#experiencia');
    await page.getByTestId('timeline-bbva').click();
    await expect(page.getByTestId('timeline-panel')).toContainText('BBVA Technology America');
    await expect(page.getByTestId('timeline-panel')).toContainText('autenticación biométrica');
  });

  test('CV: página interactiva y PDFs reales en ES y EN', async ({ page, request }) => {
    await prepare(page);
    await page.goto('/es/cv');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('José Alfonso Chavarín Montoya');
    await expect(page.getByText('Marelli').first()).toBeVisible();
    for (const file of ['/cv/CV_Alfonso_Chavarin_ES.pdf', '/cv/CV_Alfonso_Chavarin_EN.pdf']) {
      const res = await request.get(file);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('pdf');
    }
  });

  test('terminal SOC: comandos seguros con datos reales', async ({ page }) => {
    await prepare(page);
    await page.goto('/es#laboratorios');
    const term = page.getByTestId('cyber-terminal').first();
    const input = term.getByTestId('terminal-input');
    await input.fill('help');
    await input.press('Enter');
    await expect(term).toContainText('certifications');
    await input.fill('soc');
    await input.press('Enter');
    await expect(term).toContainText('Detector de múltiples accesos');
    await input.fill('rm -rf /');
    await input.press('Enter');
    await expect(term).toContainText('Comando no reconocido');
    await input.fill('clear');
    await input.press('Enter');
    await expect(term).not.toContainText('Detector de múltiples accesos');
  });

  test('NEXBOT se puede ocultar y volver a mostrar', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    // El robot flota continuamente: se fuerza el clic porque nunca está "quieto".
    await page.getByTestId('nexbot-toggle').click({ force: true });
    await expect(page.getByTestId('nexbot')).toContainText('respuestas predefinidas');
    await page.getByTestId('nexbot-hide').click();
    await expect(page.getByTestId('nexbot-show')).toBeVisible();
    await page.reload();
    await expect(page.getByTestId('nexbot-show')).toBeVisible();
    await page.getByTestId('nexbot-show').click();
    await expect(page.getByTestId('nexbot-toggle')).toBeVisible();
  });
});

test.describe('Contacto', () => {
  test('valida campos y no finge el envío sin servicio configurado', async ({ page }) => {
    await prepare(page);
    await page.goto('/es#contacto');
    const form = page.getByTestId('contact-form');
    await form.getByTestId('contact-submit').click();
    await expect(form).toContainText('Escribe tu nombre');
    await expect(form).toContainText('Escribe un correo válido');
    await form.getByLabel('Nombre').fill('Prueba Automática');
    await form.getByLabel('Correo electrónico').fill('prueba@example.com');
    await form.getByLabel('Mensaje').fill('Mensaje de prueba de Playwright para validar el formulario.');
    await page.waitForTimeout(3200); // protección anti-bots: mínimo 3 s
    await form.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-status')).toContainText(/no está activado|no se envió|No se pudo/);
    await expect(page.getByTestId('contact-status')).not.toContainText('¡Mensaje enviado!');
  });
});

test.describe('API de contacto', () => {
  test('valida, limita y responde con honestidad', async ({ request }, info) => {
    test.skip(info.project.name !== 'desktop', 'Una sola ejecución basta');
    const bad = await request.post('/api/contact', { data: { name: 'A' } });
    expect(bad.status()).toBe(400);
    const bot = await request.post('/api/contact', {
      data: { name: 'Bot', email: 'bot@example.com', message: 'Soy un bot muy rápido', startedAt: Date.now(), locale: 'es', website: '' },
    });
    expect(bot.status()).toBe(400);
    expect((await bot.json()).error).toBe('spam');
    const ok = await request.post('/api/contact', {
      data: { name: 'Persona', email: 'p@example.com', message: 'Mensaje válido de prueba', startedAt: Date.now() - 10_000, locale: 'es' },
    });
    expect([503, 200, 502, 429]).toContain(ok.status());
    if (ok.status() === 503) expect((await ok.json()).error).toBe('not_configured');
    const get = await request.get('/api/contact');
    expect(get.status()).toBe(405);
  });
});

test.describe('Móvil y accesibilidad básica', () => {
  test('sin desplazamiento horizontal y menú utilizable', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Solo móvil');
    await prepare(page);
    await page.goto('/es');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.getByTestId('menu-toggle').click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toBeVisible();
    await menu.getByRole('link', { name: 'Certificaciones' }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator('#certificaciones')).toBeInViewport();
  });

  test('enlace para saltar al contenido y títulos jerárquicos', async ({ page }) => {
    await prepare(page);
    await page.goto('/es');
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Saltar al contenido' })).toBeFocused();
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.locator('h2').count()).toBeGreaterThan(6);
  });

  test('páginas legales y SEO', async ({ page, request }) => {
    await prepare(page);
    await page.goto('/en/privacy');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy notice');
    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain('/es/projects/alba');
    const robots = await request.get('/robots.txt');
    expect(await robots.text()).toContain('Sitemap:');
    const res = await request.get('/es');
    expect(res.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(res.headers()['x-content-type-options']).toBe('nosniff');
  });
});
