# CHAVATRIX UNIVERSE · Portafolio de Alfonso Chavarín

> **Beyond the Code — Un universo de soluciones.**
> Portafolio personal 3D e interactivo de **José Alfonso Chavarín Montoya**, Ingeniero en Sistemas Computacionales (soporte TI, redes, ciberseguridad defensiva, IA y automatización).

Diseñado y desarrollado por **Alfonso Chavarín**.

🌐 **En línea:** https://portafolio2-alfonso.vercel.app

---

## Qué incluye

| Área | Detalle |
| --- | --- |
| **Universo 3D** | Planeta central que rota (shader propio con continentes, retícula holográfica, luces de ciudad y atmósfera), mi fotografía en un círculo holográfico dentro del mundo, monograma **AC** extruido con las letras del favicon, 7 islas flotantes con estructuras propias, caminos de energía animados, paquetes de datos y candados en órbita (tráfico de red protegido), estrellas con parpadeo y cámara que reacciona al cursor y viaja a cada isla. |
| **Modo ligero 2D** | Mismo concepto con CSS/SVG (planeta, retrato, islas, caminos). Se activa solo si no hay WebGL, en equipos débiles, con ahorro de datos o movimiento reducido, y siempre se puede elegir a mano. |
| **Islas** | Ciberseguridad (cian), IA (violeta), Redes y soporte TI (naranja), Desarrollo web (rosa), Automatización (azul), Hardware e IoT (verde turquesa), Contenido (magenta). Hover/foco: brillo, elevación, borde neón, camino iluminado y panel holográfico. Clic/toque/Enter: la cámara se acerca y se abre el módulo con proyectos reales. |
| **Secciones** | Inicio, Sobre mí, Proyectos (filtros + búsqueda + página por proyecto), Experiencia (línea del tiempo accesible), Educación, Certificaciones (un cuadro animado por credencial, solo texto: nombre, de qué trata, fecha y horas), Laboratorios SOC, Habilidades, CV, Contacto. Además, una página por módulo (`/modules/[isla]`). |
| **Proyectos** | Los proyectos con página pública muestran una **captura real** de su página (tomada con Playwright en GitHub Actions y revisada); los demás, una portada animada propia (SVG + CSS). Además muestran **"Ver en vivo"**: la página real se carga dentro del portafolio solo cuando el visitante lo pide (iframe aislado con `sandbox`). Los privados no muestran código. |
| **CV interactivo** | `/[es|en]/cv`, legible sin la escena 3D, imprimible y con los PDF reales en español e inglés. |
| **Tema** | Un solo botón con 4 modos: **Automático** (sigue el dispositivo), **Claro**, **Nocturno** y **Según la hora** (claro de 7:00 a 19:00). Cada tema tiene su propia paleta, no es una inversión de colores. Sin parpadeo al cargar. |
| **Idiomas** | Español e inglés completos (`/es`, `/en`), con selector ES \| EN, preferencia persistente y metadatos `hreflang`. Sin traductores externos. |
| **Intro** | Secuencia de ~3 s (partículas → núcleo → planeta → anillos → AC → islas → nombre). Se puede saltar, no se repite en la sesión, respeta `prefers-reduced-motion`, versión corta en equipos lentos y respaldo CSS por si falla JavaScript. |
| **NEXBOT** | Robot original en SVG que guía por secciones con **respuestas predefinidas** (no es un agente de IA). Se puede ocultar. |
| **Terminal SOC** | Comandos `help`, `about`, `projects`, `skills`, `certifications`, `soc`, `contact`, `clear` con datos reales. Simulación segura: no ejecuta nada del sistema. Atajo **Ctrl/Cmd + K**. |
| **Contacto** | React Hook Form + Zod, validación en servidor, honeypot, tiempo mínimo de llenado, límite de frecuencia por IP y verificación de origen. **No finge el envío**: sin servicio configurado lo dice y ofrece el correo. |

## Tecnologías

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.9 · Tailwind CSS 4 · Three.js 0.186 · React Three Fiber 9 · Drei 10 · GSAP 3 + ScrollTrigger · Motion · Lucide · next-intl 4 · React Hook Form + Zod 4 · Vitest · Playwright.
Fuentes autoalojadas (Unbounded, Manrope, JetBrains Mono vía Fontsource): el sitio no carga recursos de terceros.

## Comandos

```bash
npm install          # instala dependencias (Node 20.9+; probado con Node 22)
npm run dev          # desarrollo en http://localhost:3000
npm run build        # compilación de producción
npm start            # sirve la compilación (puerto 3000)

npm run lint         # ESLint (config de Next.js)
npm run typecheck    # TypeScript sin emitir
npm test             # pruebas unitarias (Vitest)
npm run test:e2e     # pruebas de extremo a extremo (Playwright, escritorio + móvil)
npm run check        # lint + typecheck + test + build
```

Para las pruebas E2E primero compila (`npm run build`); Playwright levanta `next start` en el puerto 3100.
La primera vez instala el navegador con `npx playwright install chromium`, o usa uno existente con `PW_CHROMIUM_PATH=/ruta/a/chromium npm run test:e2e`.

## Estructura

```
messages/                 Textos de la interfaz (es.json, en.json)
public/
  cv/                     CV en PDF (ES y EN), los archivos originales
  images/alfonso/         Fotografía (recortes optimizados)
  icon.svg, favicon*      Favicon AC con degradado neón (mismas letras del favicon original)
src/
  app/[locale]/           Páginas: inicio, cv, projects/[slug], modules/[category], privacy
  app/api/contact/        API del formulario
  components/
    universe/             UniverseStage, Universe2D, IslandNavigator, ModulePanel, ModuleContent
    universe/three/       UniverseScene, RotatingPlanet, FloatingIsland, EnergyPath, StarField, Fleet, shaders
    sections/             Hero, About, ProjectExplorer, CareerTimeline, Education, CertificationGallery, Labs, Skills, CVTeaser, Contact
    layout/               SiteHeader, ThemeSwitcher, LanguageSwitcher, PerformanceModeSwitcher, ScrollProgress, FloatingDock, SiteFooter
    projects/ cv/ nexbot/ terminal/ intro/ contact/ ui/
  data/                   Contenido estructurado (perfil, proyectos, experiencia, educación, certificaciones, habilidades, islas, aviso legal)
  lib/                    Tema, capacidades, i18n, terminal, rate limit, esquema de contacto
tests/unit/               Vitest
e2e/                      Playwright
docs/                     Inventario de contenido, guía para agregar contenido y pendientes
```

**Todo el contenido vive en `src/data/` y no en los componentes.** Para agregar un proyecto, una credencial o un empleo, consulta [`docs/CONTENIDO.md`](docs/CONTENIDO.md).

## Formulario de contacto

Funciona con [Resend](https://resend.com). Configura en Vercel (Project → Settings → Environment Variables):

| Variable | Ejemplo |
| --- | --- |
| `RESEND_API_KEY` | `re_...` (secreta, solo servidor) |
| `CONTACT_FROM_EMAIL` | `Portafolio <contacto@tu-dominio.com>` (dominio verificado en Resend) |
| `CONTACT_TO_EMAIL` | `alfonso.chavarin@hotmail.com` |
| `NEXT_PUBLIC_SITE_URL` | URL pública final (metadatos, sitemap, Open Graph) |

Sin esas variables la API responde `503 not_configured` y la interfaz muestra que **el mensaje no se envió** junto con el botón para escribir por correo. El límite de frecuencia es en memoria por instancia; si se necesita un límite global estricto se puede cambiar por Redis/Upstash sin tocar la interfaz.

## Despliegue

Publicado en Vercel (plan Hobby, no se duerme) desde la rama `main`: cada cambio que llega a `main` se publica solo en https://portafolio2-alfonso.vercel.app. En Vercel se activan HSTS y `upgrade-insecure-requests` automáticamente (HTTPS). Para activar el formulario, agrega en Vercel las variables de entorno de la tabla anterior.

El portafolio anterior (`portafolio-original-tau.vercel.app`) es otro proyecto y no se modificó.

## Rendimiento

Presupuestos medidos en la compilación de producción:

| Métrica | Presupuesto | Actual |
| --- | --- | --- |
| JS inicial de la página de inicio (gzip) | ≤ 350 KB | ~336 KB |
| Escena 3D (chunk aparte, solo en modo 3D) | ≤ 280 KB gzip | ~256 KB |
| Pixel ratio máximo | alto 1.75 · medio 1.35 · bajo 1.0 | — |
| Estrellas | 1 sola llamada de dibujo (shader propio) | — |

En celulares el 3D va en calidad baja (o en modo ligero si el teléfono tiene poca memoria), el desenfoque de fondo solo se usa en la barra de navegación y las animaciones que no están en pantalla se pausan, para que el scroll sea fluido y el navegador no recargue la página por falta de memoria. El 3D solo pasa a 2D por sí solo si WebGL falla de verdad o si el equipo no llega a 12 fps sostenidos (y nunca si el visitante eligió 3D).

Medidas aplicadas: code splitting de la escena 3D y del formulario, carga progresiva (el 2D se pinta de inmediato y el 3D aparece con transición), texturas generadas en código, geometrías ligeras, sin postprocesado, `PerformanceMonitor` que baja la calidad y vuelve a 2D si el equipo no puede, render pausado cuando el universo no está en pantalla, la pestaña está oculta o el usuario pausa las animaciones, y `prefers-reduced-motion`.

## Accesibilidad

Navegación completa con teclado (islas también desde la barra de islas), enlace "Saltar al contenido", foco visible, diálogos con `Esc` y foco atrapado, línea del tiempo con patrón de pestañas (flechas, Inicio, Fin), etiquetas ARIA, contraste revisado en ambos temas, objetivos táctiles de 44 px y botón para pausar animaciones.

## Seguridad y privacidad

El portafolio es un sitio de solo lectura: no tiene base de datos, cuentas, panel de administración ni subida de archivos, así que no hay información guardada que se pueda robar. La única entrada de datos es el formulario de contacto.

**Navegador**
- CSP estricta: solo scripts, estilos, fuentes e imágenes del propio dominio (sin terceros ni `eval` en producción), `frame-ancestors 'none'`, `object-src 'none'`, `form-action 'self'`; los iframes solo pueden cargar las páginas públicas de los propios proyectos.
- `X-Frame-Options: DENY` (nadie puede incrustar el portafolio para engañar con clics), `nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` que bloquea cámara, micrófono, ubicación, pagos, USB, puertos serie, HID y seguimiento por intereses.
- Aislamiento: `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy: same-site`, `Origin-Agent-Cluster`, `X-Permitted-Cross-Domain-Policies: none`, `X-DNS-Prefetch-Control: off`.
- HTTPS obligatorio en producción (HSTS de 2 años + `upgrade-insecure-requests`).
- La vista "Ver en vivo" usa `sandbox` y `referrerpolicy="no-referrer"`.

**Formulario y API (`/api/contact`)**
- Solo acepta `POST` en JSON desde el propio sitio: sin encabezado `Origin` o desde otro dominio → 403.
- Cuerpo máximo de 10 KB, validación con Zod en el servidor, caracteres de control eliminados (evita inyección de encabezados en el correo) y HTML escapado.
- Anti-spam: campo trampa (honeypot), tiempo mínimo de llenado, límite de 5 envíos cada 10 minutos por IP y un tope global.
- Si el envío de correo no está configurado responde con honestidad (`503 not_configured`); nunca finge que se envió.
- Las claves (Resend) viven solo en variables de entorno del servidor; nunca llegan al navegador ni al repositorio (`.env*` está en `.gitignore`).

**Datos personales**
- Sin analítica ni cookies de rastreo: solo una cookie funcional de idioma y preferencias locales.
- Los certificados se muestran solo como texto (nombre, de qué trata, fecha y horas): no se publican imágenes, PDF ni enlaces de verificación. Pruebas automáticas lo vigilan.
- No se enlaza ni se muestra código de repositorios privados.
- Aviso de privacidad en `/[es|en]/privacy` y contacto de seguridad en `/.well-known/security.txt`.

**Repositorio**
- Dependabot revisa dependencias cada semana; CI ejecuta lint, tipos, pruebas, build y `npm audit` en cada PR; CodeQL analiza el código cada semana.

## Pruebas

- **Unitarias (Vitest):** integridad de los datos (sin enlaces a código privado, imágenes existentes, experiencia igual al CV y sin datos de la imagen de referencia), claves idénticas ES/EN, tema de 4 modos, detección de capacidades, rate limit, esquema del formulario (incluye eliminación de caracteres de control) y terminal segura.
- **E2E (Playwright, escritorio y móvil):** carga sin errores de consola, intro saltable, idiomas, tema, islas con mouse y teclado, modo 3D/2D persistente, filtros y detalle de proyectos, proyectos privados sin código, línea del tiempo, CV y PDFs, terminal, NEXBOT, formulario honesto, API (bloqueo de otros orígenes), menú móvil sin desplazamiento horizontal, SEO y encabezados de seguridad.

---

© 2026 José Alfonso Chavarín Montoya. Todos los derechos reservados.
