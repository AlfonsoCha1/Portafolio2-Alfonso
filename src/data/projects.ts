import type { Project } from './types';

/**
 * Inventario de proyectos verificados.
 *
 * Fuentes: CV (oct 2026), README y perfil.toml de github.com/AlfonsoCha1,
 * READMEs de cada repositorio público y páginas publicadas.
 *
 * Reglas:
 * - Proyectos privados: solo nombre, descripción no confidencial, tecnologías divulgables
 *   y enlace a la página pública si existe. Nunca enlazar código privado.
 * - No marcar como terminado lo que está en desarrollo (ver `status`).
 * - Sin capturas reales aprobadas → portada conceptual generada en código (`cover`),
 *   identificada como "Ilustración conceptual".
 *
 * Para agregar un proyecto: copia un objeto, cambia el `slug` (único) y sigue docs/CONTENIDO.md.
 */
export const projects: Project[] = [
  // ───────────────────────── Ciberseguridad ─────────────────────────
  {
    slug: 'alba',
    name: 'ALBA — Mi Kit Técnico',
    category: 'cyber',
    alsoIn: ['automation'],
    status: 'development',
    statusDetail: { es: 'v0.1.0 · primer módulo operativo', en: 'v0.1.0 · first module working' },
    visibility: 'public',
    featured: true,
    order: 1,
    year: '2026',
    summary: {
      es: 'Aplicación local en español para revisar la seguridad de proyectos web y Node.js mientras aprendes.',
      en: 'Local Spanish-language app to review the security of web and Node.js projects while you learn.',
    },
    description: {
      es: 'ALBA revisa proyectos en modo de solo lectura: busca secretos expuestos, configuraciones peligrosas y dependencias con avisos conocidos. Funciona sin internet y solo usa la biblioteca estándar de Python. Cada hallazgo separa hechos, indicios e hipótesis, y los secretos nunca se muestran completos.',
      en: 'ALBA reviews projects in read-only mode: it looks for exposed secrets, dangerous configurations and dependencies with known advisories. It works offline and only uses the Python standard library. Each finding separates facts, signals and hypotheses, and secrets are never shown in full.',
    },
    features: [
      {
        es: 'Antes de empezar muestra el alcance: qué va a leer, siempre en solo lectura.',
        en: 'Shows the scope before starting: what it will read, always read-only.',
      },
      {
        es: 'Detecta secretos expuestos (16 reglas específicas + 1 genérica) y usa Gitleaks como segundo detector si está instalado.',
        en: 'Detects exposed secrets (16 specific rules + 1 generic) and uses Gitleaks as a second detector when installed.',
      },
      {
        es: 'Revisa CORS, TLS, eval/exec, cookies y Docker, además de dependencias con avisos conocidos.',
        en: 'Checks CORS, TLS, eval/exec, cookies and Docker, plus dependencies with known advisories.',
      },
      {
        es: 'Secretos enmascarados: prefijo, longitud y huella HMAC.',
        en: 'Masked secrets: prefix, length and HMAC fingerprint.',
      },
      {
        es: 'Correcciones acotadas con vista previa, aprobación, respaldo, verificación y reversión.',
        en: 'Scoped fixes with preview, approval, backup, verification and rollback.',
      },
      { es: 'Informes en HTML, Markdown y JSON.', en: 'Reports in HTML, Markdown and JSON.' },
    ],
    tech: ['Python (stdlib)', 'Linux', 'Gitleaks', 'HTML/CSS/JS'],
    role: {
      es: 'Proyecto personal: diseño, desarrollo, pruebas y documentación.',
      en: 'Personal project: design, development, testing and documentation.',
    },
    repo: 'https://github.com/AlfonsoCha1/Herramientas_cyberseguridad',
    note: {
      es: 'Probado en Ubuntu 24.04 (base de Linux Mint 22). Windows y macOS: prototipo. El resto del kit está diseñado y marcado como pendiente.',
      en: 'Tested on Ubuntu 24.04 (Linux Mint 22 base). Windows and macOS: prototype. The rest of the kit is designed and marked as pending.',
    },
    cover: 'shield',
  },
  {
    slug: 'cybersecurity-python-lab',
    name: 'Cybersecurity Python Lab',
    category: 'cyber',
    alsoIn: ['automation'],
    status: 'lab',
    statusDetail: { es: '4 de 14 herramientas disponibles', en: '4 of 14 tools available' },
    visibility: 'public',
    featured: true,
    order: 2,
    year: '2026',
    summary: {
      es: 'Laboratorio de ciberseguridad defensiva: herramientas pequeñas con código, datos sintéticos, pruebas y guía.',
      en: 'Defensive cybersecurity lab: small tools with code, synthetic data, tests and a guide.',
    },
    description: {
      es: 'Colección de herramientas independientes en Python para practicar tareas de un analista SOC: generar reportes, contar intentos de inicio de sesión, buscar en registros y detectar accesos repetidos. Son herramientas de aprendizaje, no productos para producción.',
      en: 'A collection of independent Python tools to practice SOC analyst tasks: generating reports, counting login attempts, searching logs and detecting repeated access. They are learning tools, not production products.',
    },
    features: [
      {
        es: '08 · Generador de reportes: convierte eventos JSON, JSON Lines o CSV en reportes Markdown y HTML.',
        en: '08 · Report generator: turns JSON, JSON Lines or CSV events into Markdown and HTML reports.',
      },
      {
        es: '09 · Contador de intentos de login por usuario e IP en registros de OpenSSH y otros formatos.',
        en: '09 · Login attempt counter by user and IP in OpenSSH logs and other formats.',
      },
      {
        es: '11 · Buscador en logs por palabras, IPs, rangos CIDR y fechas, sin cargar el archivo completo.',
        en: '11 · Log searcher by keywords, IPs, CIDR ranges and dates, without loading the whole file.',
      },
      {
        es: '12 · Detector de múltiples accesos fallidos en una ventana de tiempo, con evidencia.',
        en: '12 · Detector of multiple failed logins within a time window, with evidence.',
      },
      {
        es: 'Menú (python menu.py) para ejecutar demostraciones y pruebas.',
        en: 'Menu (python menu.py) to run demos and tests.',
      },
    ],
    tech: ['Python', 'pytest', 'Análisis de logs', 'Regex'],
    role: {
      es: 'Proyecto personal de aprendizaje: desarrollo de cada herramienta, datos de prueba y documentación.',
      en: 'Personal learning project: development of each tool, test data and documentation.',
    },
    repo: 'https://github.com/AlfonsoCha1/Tipos-de-Proyectos/tree/main/ciberseguridad',
    note: {
      es: 'Las otras 10 herramientas se publican por entregas.',
      en: 'The other 10 tools are being released in batches.',
    },
    cover: 'logs',
  },
  {
    slug: 'cyberquest-academy',
    name: 'CyberQuest Academy',
    category: 'cyber',
    alsoIn: ['web', 'network'],
    status: 'live',
    statusDetail: { es: 'En línea · en desarrollo activo', en: 'Live · in active development' },
    visibility: 'public',
    featured: true,
    order: 3,
    year: '2026',
    summary: {
      es: 'Academia gratuita de ciberseguridad para aprender practicando: redes, terminal, SQL, Security+ y casos SOC.',
      en: 'Free cybersecurity academy to learn by doing: networking, terminal, SQL, Security+ and SOC cases.',
    },
    description: {
      es: 'Aplicación web instalable (PWA) que funciona sin internet una vez cargada. Todo ocurre en simulaciones dentro del navegador: nada toca equipos o redes reales. Sin cuentas, sin anuncios y sin datos personales; el progreso se puede sincronizar con un código.',
      en: 'Installable web app (PWA) that works offline once loaded. Everything happens in in-browser simulations: nothing touches real devices or networks. No accounts, no ads and no personal data; progress can be synced with a code.',
    },
    features: [
      {
        es: 'Laboratorio de redes: IP, máscara, puerta de enlace, rutas, ARP, NAT y zonas LAN/DMZ/WAN.',
        en: 'Network lab: IP, mask, gateway, routes, ARP, NAT and LAN/DMZ/WAN zones.',
      },
      {
        es: 'Terminal simulada Linux, CMD y PowerShell con retos de equipos comprometidos.',
        en: 'Simulated Linux, CMD and PowerShell terminal with compromised-host challenges.',
      },
      {
        es: 'Bases de datos con SQLite real en el navegador (sql.js): lecciones, retos y examen.',
        en: 'Databases with real in-browser SQLite (sql.js): lessons, challenges and exam.',
      },
      {
        es: 'Preparación Security+ SY0-701, alertas SOC con logs y analizador de vacantes.',
        en: 'Security+ SY0-701 prep, SOC alerts with logs and a job-posting analyzer.',
      },
      {
        es: 'API en Node para sincronizar progreso con límite de peticiones y CORS restringido.',
        en: 'Node API to sync progress with rate limiting and restricted CORS.',
      },
    ],
    tech: ['JavaScript', 'HTML/CSS', 'PWA', 'Node.js', 'sql.js', 'Vercel', 'Render'],
    role: {
      es: 'Proyecto personal: contenido, desarrollo del frontend, API y despliegue.',
      en: 'Personal project: content, frontend and API development, deployment.',
    },
    repo: 'https://github.com/AlfonsoCha1/CyberQuest-Academy',
    demo: 'https://cyberquest-academy.vercel.app',
    // Su configuración de seguridad (X-Frame-Options) impide mostrarla dentro de otra página.
    livePreview: false,
    cover: 'academy',
  },
  {
    slug: 'chavatrix-aegis',
    name: 'CHAVATRIX AEGIS',
    category: 'cyber',
    alsoIn: ['ai'],
    status: 'development',
    statusDetail: { es: 'En desarrollo · proyecto privado', en: 'In development · private project' },
    visibility: 'private',
    featured: true,
    order: 4,
    year: '2026',
    summary: {
      es: 'Plataforma de ciberseguridad con IA local: antivirus, limpieza segura y privacidad.',
      en: 'Cybersecurity platform with local AI: antivirus, secure cleanup and privacy.',
    },
    description: {
      es: 'Proyecto en desarrollo de una plataforma de protección para el equipo con inteligencia artificial local, compuesta por un sitio web y una aplicación de escritorio. El código es privado; aquí solo se muestra información no confidencial.',
      en: 'In-development protection platform for the computer with local artificial intelligence, made of a website and a desktop app. The code is private; only non-confidential information is shown here.',
    },
    features: [
      { es: 'Protección con IA local.', en: 'Local AI-based protection.' },
      { es: 'Antivirus.', en: 'Antivirus.' },
      { es: 'Limpieza segura.', en: 'Secure cleanup.' },
      { es: 'Privacidad.', en: 'Privacy.' },
    ],
    tech: ['IA local', 'Web', 'App de escritorio'],
    role: { es: 'Proyecto personal: concepto y desarrollo.', en: 'Personal project: concept and development.' },
    demo: 'https://chavatrix-aegis.vercel.app',
    note: {
      es: 'Código privado. Las funciones listadas son las que describe su sitio público; los detalles técnicos se publicarán cuando el proyecto lo permita.',
      en: 'Private code. The listed features are the ones described on its public site; technical details will be published when the project allows.',
    },
    cover: 'shield',
  },
  {
    slug: 'defender-powershell',
    name: 'Scripts PowerShell · Windows Defender',
    category: 'automation',
    alsoIn: ['cyber', 'network'],
    status: 'personal',
    statusDetail: { es: 'Herramienta personal · 2026', en: 'Personal tool · 2026' },
    visibility: 'private',
    featured: false,
    order: 12,
    year: '2026',
    summary: {
      es: 'Scripts de diagnóstico y control de Windows Defender para automatizar revisiones de seguridad del equipo.',
      en: 'Diagnostic and Windows Defender control scripts to automate workstation security checks.',
    },
    description: {
      es: 'Conjunto de scripts personales en PowerShell para revisar el estado de Windows Defender y automatizar comprobaciones de seguridad del equipo.',
      en: 'A set of personal PowerShell scripts to check Windows Defender status and automate workstation security checks.',
    },
    features: [
      { es: 'Diagnóstico del estado de Windows Defender.', en: 'Windows Defender status diagnostics.' },
      { es: 'Automatización de revisiones de seguridad.', en: 'Automated security checks.' },
    ],
    tech: ['PowerShell', 'Windows'],
    role: { es: 'Autor (uso personal).', en: 'Author (personal use).' },
    note: { es: 'Uso personal; sin repositorio público.', en: 'Personal use; no public repository.' },
    cover: 'terminal',
  },

  // ───────────────────────── Inteligencia artificial ─────────────────────────
  {
    slug: 'sophya',
    name: 'SOPHYA — Asistente de IA',
    category: 'ai',
    status: 'beta',
    statusDetail: { es: 'Beta gratuita · requiere cuenta', en: 'Free beta · account required' },
    visibility: 'private',
    featured: true,
    order: 5,
    year: '2026',
    summary: {
      es: 'Asistente de inteligencia artificial en español para investigar, redactar, analizar datos y pensar ideas de negocio.',
      en: 'Spanish-language AI assistant to research, write, analyze data and brainstorm business ideas.',
    },
    description: {
      es: 'SOPHYA es un asistente con memoria, voz e investigación web, en beta gratuita. Se usa desde el navegador con una cuenta. El código es privado; el enlace lleva a la aplicación.',
      en: 'SOPHYA is an assistant with memory, voice and web research, in free beta. It is used from the browser with an account. The code is private; the link goes to the app.',
    },
    features: [
      {
        es: 'Chat con memoria dentro de la conversación y entre sesiones; la memoria se puede exportar.',
        en: 'Chat with memory within and across sessions; memory can be exported.',
      },
      { es: 'Voz: dictado y respuestas habladas.', en: 'Voice: dictation and spoken replies.' },
      { es: 'Investigación web y modo de trabajo autónomo.', en: 'Web research and autonomous work mode.' },
      {
        es: 'Herramientas de correo y agenda, y búsqueda de empleo.',
        en: 'Email and calendar tools, and job search.',
      },
    ],
    tech: ['Python', 'FastAPI', 'JavaScript'],
    role: {
      es: 'Proyecto personal: backend, frontend e integración de IA.',
      en: 'Personal project: backend, frontend and AI integration.',
    },
    demo: 'https://ia-sophya.vercel.app/',
    note: { es: 'Código privado: el enlace lleva a la aplicación.', en: 'Private code: the link goes to the app.' },
    cover: 'ai',
  },
  {
    slug: 'english-speaking-coach',
    name: 'English Speaking Coach',
    category: 'ai',
    status: 'demo',
    statusDetail: { es: 'Demo en línea · entrevista de trabajo completa', en: 'Live demo · full job interview' },
    visibility: 'private',
    featured: true,
    order: 6,
    year: '2026',
    summary: {
      es: 'Practica inglés hablando con un coach de IA: te escucha, te corrige y te hace repetir las palabras difíciles.',
      en: 'Practice English by speaking with an AI coach: it listens, corrects you and makes you repeat difficult words.',
    },
    description: {
      es: 'Tutor de inglés por voz, sin escribir. Eliges escenario, nivel y estilo de corrección, y al final recibes tus tres errores principales con ejercicios. Un agente de IA decide cada turno de la conversación.',
      en: 'A voice-first English tutor, no typing. You choose the scenario, level and correction style, and at the end you get your top three mistakes with exercises. An AI agent decides each conversation turn.',
    },
    features: [
      {
        es: 'Escenarios: entrevista de trabajo, conversación cotidiana, viajes, reuniones, presentaciones o negocios.',
        en: 'Scenarios: job interview, everyday conversation, travel, meetings, presentations or business.',
      },
      {
        es: 'Nivel de A2 a C1, estilo Profesor o Conversación fluida, duración Corta o Completa.',
        en: 'Level A2 to C1, Teacher or Fluent conversation style, Short or Full length.',
      },
      {
        es: 'Al final: tus 3 errores principales con ejercicios.',
        en: 'At the end: your top 3 mistakes with exercises.',
      },
      {
        es: 'Compatible con Groq, OpenAI o Anthropic usando una clave propia.',
        en: 'Works with Groq, OpenAI or Anthropic using your own key.',
      },
    ],
    tech: ['TypeScript', 'Next.js', 'Web Speech API', 'IA generativa'],
    role: {
      es: 'Proyecto personal: producto, desarrollo y despliegue.',
      en: 'Personal project: product, development and deployment.',
    },
    demo: 'https://english-speaking-coach-nine.vercel.app/',
    note: { es: 'Código privado: el enlace lleva a la aplicación.', en: 'Private code: the link goes to the app.' },
    cover: 'voice',
  },

  // ───────────────────────── Desarrollo web ─────────────────────────
  {
    slug: 'smuckys-by-chavamon',
    name: "Smucky's by Chavamon",
    category: 'web',
    status: 'live',
    statusDetail: { es: 'Tienda en línea · en mejora continua', en: 'Online store · continuously improving' },
    visibility: 'private',
    featured: true,
    order: 7,
    year: '2026',
    summary: {
      es: 'Tienda en línea de mi marca de ropa deportiva y casual: playeras, blusas, playeras sin mangas y shorts.',
      en: 'Online store for my sportswear and casual clothing brand: t-shirts, blouses, tank tops and shorts.',
    },
    description: {
      es: 'Marca y tienda propias. Las ventas se apoyan en Mercado Libre con tráfico desde Instagram y TikTok; el sitio usa Firebase, FastAPI y Mercado Pago, desplegado en Vercel y Render. Incluye diagnóstico del negocio y plan de 90 días con seguimiento en Excel.',
      en: 'My own brand and store. Sales run through Mercado Libre with traffic from Instagram and TikTok; the site uses Firebase, FastAPI and Mercado Pago, deployed on Vercel and Render. Includes a business diagnostic and a 90-day plan tracked in Excel.',
    },
    features: [
      { es: 'Catálogo por categorías con carrito y favoritos.', en: 'Catalog by category with cart and favorites.' },
      {
        es: 'Cuenta de cliente con pedidos, entregas y devoluciones.',
        en: 'Customer account with orders, deliveries and returns.',
      },
      {
        es: 'Pago con tarjeta y Mercado Pago.',
        en: 'Card and Mercado Pago payments.',
      },
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase', 'FastAPI', 'Mercado Pago'],
    role: {
      es: 'Fundador: marca, desarrollo del sitio, ventas y operación.',
      en: 'Founder: brand, website development, sales and operations.',
    },
    demo: 'https://smuckys-bychavamon.vercel.app/',
    note: { es: 'Código privado: el enlace lleva a la tienda.', en: 'Private code: the link goes to the store.' },
    cover: 'store',
  },
  {
    slug: 'chavarin-said-lealtad',
    name: 'Chavarín & Said — Lealtad',
    category: 'web',
    status: 'demo',
    statusDetail: { es: 'Demostración funcional · base para pilotos', en: 'Working demo · pilot-ready base' },
    visibility: 'public',
    featured: true,
    order: 8,
    year: '2026',
    summary: {
      es: 'Plataforma de tarjetas de puntos o sellos para pequeños negocios de comida, tiendas y servicios.',
      en: 'Points or stamp card platform for small food businesses, shops and services.',
    },
    description: {
      es: 'Plataforma full stack (nombre provisional) con directorio de negocios, registro por QR de mostrador, tarjeta web e impresa, y paneles para cliente, empleado, dueño y administración. Todavía no está lista para negocios reales: la demo usa negocios y personas ficticios.',
      en: 'Full-stack platform (working name) with a business directory, counter-QR sign-up, web and printed card, and panels for customers, staff, owners and admins. Not yet ready for real businesses: the demo uses fictional businesses and people.',
    },
    features: [
      { es: 'Directorio de negocios con categorías y búsqueda.', en: 'Business directory with categories and search.' },
      {
        es: 'Registro de clientes con QR de mostrador por sucursal; tarjeta web e impresa.',
        en: 'Customer sign-up with a counter QR per branch; web and printed card.',
      },
      {
        es: 'Paneles por rol; los tickets repetidos se rechazan.',
        en: 'Role-based panels; duplicate tickets are rejected.',
      },
    ],
    tech: ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
    role: {
      es: 'Desarrollo full stack junto con un socio.',
      en: 'Full-stack development together with a partner.',
    },
    repo: 'https://github.com/AlfonsoCha1/Chavarin_-_Said',
    demo: 'https://chavarin-said-lealtad.onrender.com/',
    note: {
      es: 'La demo está en un servidor gratuito: puede tardar alrededor de un minuto en despertar.',
      en: 'The demo runs on a free server: it may take about a minute to wake up.',
    },
    cover: 'loyalty',
  },
  {
    slug: 'restaurante-smuckys',
    name: "Restaurante Smucky's",
    category: 'web',
    status: 'archive',
    statusDetail: { es: 'Práctica web · en línea', en: 'Web practice · live' },
    visibility: 'public',
    featured: false,
    order: 20,
    year: '2024',
    summary: {
      es: 'Sitio de restaurante con menú por categorías, pedidos y reservaciones.',
      en: 'Restaurant website with a menu by category, orders and reservations.',
    },
    description: {
      es: 'Práctica de desarrollo web: sitio de un restaurante ficticio con menú por categorías, pedidos y reservaciones.',
      en: 'Web development practice: a fictional restaurant site with a menu by category, orders and reservations.',
    },
    features: [
      { es: 'Menú por categorías.', en: 'Menu by category.' },
      { es: 'Pedidos y reservaciones.', en: 'Orders and reservations.' },
    ],
    tech: ['HTML', 'CSS', 'JavaScript', 'Firebase'],
    role: { es: 'Desarrollo completo (práctica).', en: 'Full development (practice).' },
    repo: 'https://github.com/AlfonsoCha1/PROYECTO-INTERLIGENCIA-ARTIFICIAL',
    demo: 'https://proyecto-interligencia-artificial.vercel.app/',
    cover: 'web',
  },
  {
    slug: 'portafolio-anterior',
    name: 'Portafolio web (versión anterior)',
    category: 'web',
    status: 'archive',
    statusDetail: { es: 'Versión anterior · en línea', en: 'Previous version · live' },
    visibility: 'public',
    featured: false,
    order: 21,
    year: '2025',
    summary: {
      es: 'Mi sitio personal anterior con experiencia, proyectos y CV descargable.',
      en: 'My previous personal site with experience, projects and a downloadable CV.',
    },
    description: {
      es: 'Versión anterior de mi portafolio, hecha con HTML, CSS y JavaScript. Las versiones previas (portafolio-alfonso y Portafolio) muestran cómo ha evolucionado.',
      en: 'Previous version of my portfolio, built with HTML, CSS and JavaScript. Earlier versions (portafolio-alfonso and Portafolio) show how it has evolved.',
    },
    features: [
      { es: 'Experiencia, educación y proyectos.', en: 'Experience, education and projects.' },
      { es: 'CV descargable en español e inglés.', en: 'Downloadable CV in Spanish and English.' },
    ],
    tech: ['HTML', 'CSS', 'JavaScript'],
    role: { es: 'Diseño y desarrollo.', en: 'Design and development.' },
    repo: 'https://github.com/AlfonsoCha1/portafolio-original',
    demo: 'https://portafolio-original-tau.vercel.app/',
    cover: 'web',
  },

  {
    slug: 'mi-vida-personal',
    name: 'Mi Vida Personal',
    category: 'web',
    status: 'development',
    statusDetail: { es: 'En desarrollo · proyecto privado', en: 'In development · private project' },
    visibility: 'private',
    featured: true,
    order: 8.5,
    year: '2026',
    summary: {
      es: 'App para organizar mi vida en un solo lugar: metas, finanzas, entrenamiento, estudio y trabajo. Se instala en iPhone y Android.',
      en: 'An app to organize my life in one place: goals, finances, training, study and work. Installs on iPhone and Android.',
    },
    description: {
      es: 'Organizador personal pensado como sitio web y como aplicación instalable (PWA) en iPhone y Android. Los datos personales se quedan en el dispositivo, con respaldos que se exportan y restauran, para que cada persona use su propia copia sin mezclar información. El código es privado.',
      en: 'A personal organizer built as a website and as an installable app (PWA) for iPhone and Android. Personal data stays on the device, with backups you can export and restore, so each person uses their own copy without mixing information. The code is private.',
    },
    features: [
      {
        es: 'Secciones: Panel de vida, Asesor financiero, Entrenador y nutriólogo, Segundo cerebro, Metas y proyectos, Forma de estudio y Trabajo.',
        en: 'Sections: Life dashboard, Financial advisor, Coach & nutritionist, Second brain, Goals & projects, Study method and Work.',
      },
      { es: 'Instalable como app (PWA) en iPhone y Android.', en: 'Installable as an app (PWA) on iPhone and Android.' },
      {
        es: 'Datos solo en el dispositivo, con respaldo para exportar y restaurar.',
        en: 'Data stays on the device, with export and restore backups.',
      },
      { es: 'Acompañante animado configurable y colores naranja y morado.', en: 'Configurable animated companion with orange and purple colors.' },
    ],
    tech: ['PWA', 'Web app'],
    role: { es: 'Proyecto personal: idea, diseño y desarrollo.', en: 'Personal project: idea, design and development.' },
    note: { es: 'Código privado.', en: 'Private code.' },
    cover: 'planner',
  },

  // ───────────────────────── Automatización ─────────────────────────
  {
    slug: 'tipos-bash',
    name: 'Tipos-bash',
    category: 'automation',
    alsoIn: ['network'],
    status: 'archive',
    statusDetail: { es: 'Scripts publicados', en: 'Published scripts' },
    visibility: 'public',
    featured: false,
    order: 11,
    year: '2026',
    summary: {
      es: 'Scripts .bat para Windows: limpieza automática de temporales y organizador de archivos de producción.',
      en: 'Windows .bat scripts: automatic temp-file cleanup and a production file organizer.',
    },
    description: {
      es: 'Scripts por lotes para Windows que automatizan la limpieza de archivos temporales y organizan archivos de producción.',
      en: 'Windows batch scripts that automate temporary file cleanup and organize production files.',
    },
    features: [
      { es: 'Limpieza automática de archivos temporales.', en: 'Automatic temporary file cleanup.' },
      { es: 'Organizador de archivos de producción.', en: 'Production file organizer.' },
    ],
    tech: ['Batch (.bat)', 'Windows'],
    role: { es: 'Autor.', en: 'Author.' },
    repo: 'https://github.com/AlfonsoCha1/Tipos-bash',
    cover: 'terminal',
  },

  // ───────────────────────── Hardware e IoT ─────────────────────────
  {
    slug: 'soportes-nfc-resenas',
    name: 'Soportes NFC para reseñas de Google',
    category: 'hardware',
    status: 'development',
    statusDetail: { es: 'En desarrollo · con un socio', en: 'In development · with a partner' },
    visibility: 'private',
    featured: false,
    order: 13,
    year: '2026',
    summary: {
      es: 'Soportes con NFC que llevan a los clientes a dejar una reseña de Google, para cafeterías, cines y oficinas.',
      en: 'NFC stands that take customers to leave a Google review, for cafés, cinemas and offices.',
    },
    description: {
      es: 'Proyecto en desarrollo junto con un socio. Incluye mockups de contenido estilo UGC para presentar el producto a cafeterías, cines y oficinas.',
      en: 'In-development project with a partner. Includes UGC-style content mockups to pitch the product to cafés, cinemas and offices.',
    },
    features: [
      { es: 'Soporte físico con etiqueta NFC.', en: 'Physical stand with an NFC tag.' },
      { es: 'Mockups de contenido UGC.', en: 'UGC content mockups.' },
    ],
    tech: ['NFC'],
    role: { es: 'Cofundador del proyecto.', en: 'Project co-founder.' },
    cover: 'nfc',
  },

  // ───────────────────────── Contenido y creatividad ─────────────────────────
  {
    slug: 'chavamon',
    name: 'CHAVAMON',
    category: 'content',
    status: 'development',
    statusDetail: { es: 'En desarrollo · versión básica pública 0.1.0', en: 'In development · public basic version 0.1.0' },
    visibility: 'public',
    featured: true,
    order: 9,
    year: '2026',
    summary: {
      es: 'Editor de video local de escritorio (antes "Montoya Studio"), sin marca de agua, sin telemetría y sin suscripciones.',
      en: 'Local desktop video editor (formerly "Montoya Studio"), with no watermark, no telemetry and no subscriptions.',
    },
    description: {
      es: 'CHAVAMON es mi editor de video de escritorio y la base de futuras herramientas de creación. La versión básica pública contiene el paquete 0.1.0; el desarrollo continúa en un repositorio privado.',
      en: 'CHAVAMON is my desktop video editor and the base for future creation tools. The public basic version contains the 0.1.0 package; development continues in a private repository.',
    },
    features: [
      { es: 'Edición de video local en el escritorio.', en: 'Local desktop video editing.' },
      { es: 'Sin marca de agua, sin telemetría y sin suscripciones.', en: 'No watermark, no telemetry and no subscriptions.' },
    ],
    tech: ['Electron', 'React', 'Zustand', 'Mediabunny'],
    role: { es: 'Proyecto personal: producto y desarrollo.', en: 'Personal project: product and development.' },
    repo: 'https://github.com/AlfonsoCha1/CHAVAMON_BASICO',
    note: {
      es: 'El repositorio público es la versión básica; las mejoras continúan en privado.',
      en: 'The public repository is the basic version; improvements continue privately.',
    },
    cover: 'video',
  },
  {
    slug: 'el-chavatrix',
    name: 'EL CHAVATRIX',
    category: 'content',
    alsoIn: ['automation', 'ai'],
    status: 'live',
    statusDetail: { es: 'Activo desde 2026', en: 'Active since 2026' },
    visibility: 'private',
    featured: false,
    order: 10,
    year: '2026',
    summary: {
      es: 'Canal de video vertical asistido por IA, publicado en 3 plataformas.',
      en: 'AI-assisted vertical video channel, published on 3 platforms.',
    },
    description: {
      es: 'Canal propio de video vertical. La edición se hace con CapCut y un flujo local llamado "AI_Video_Studio" que automatiza parte del proceso.',
      en: 'My own vertical video channel. Editing is done with CapCut and a local workflow called "AI_Video_Studio" that automates part of the process.',
    },
    features: [
      { es: 'Video vertical 9:16 en 3 plataformas.', en: '9:16 vertical video on 3 platforms.' },
      {
        es: 'Flujo local "AI_Video_Studio" para automatizar la edición.',
        en: 'Local "AI_Video_Studio" workflow to automate editing.',
      },
    ],
    tech: ['CapCut', 'IA generativa', 'Automatización'],
    role: { es: 'Creador: guion, grabación y edición.', en: 'Creator: script, recording and editing.' },
    cover: 'video',
  },

  // ───────────────────────── Prácticas académicas ─────────────────────────
  {
    slug: 'java',
    name: 'Java',
    category: 'practice',
    status: 'archive',
    statusDetail: { es: 'Ejercicios', en: 'Exercises' },
    visibility: 'public',
    featured: false,
    order: 30,
    year: '2023',
    summary: {
      es: 'Ejercicios de Java: condicionales, bucles, juego de adivinar el número y sistema de descuentos.',
      en: 'Java exercises: conditionals, loops, a number-guessing game and a discount system.',
    },
    description: {
      es: 'Ejercicios de programación orientada a objetos en Java.',
      en: 'Object-oriented programming exercises in Java.',
    },
    features: [{ es: 'Condicionales, bucles y POO.', en: 'Conditionals, loops and OOP.' }],
    tech: ['Java', 'POO'],
    role: { es: 'Autor.', en: 'Author.' },
    repo: 'https://github.com/AlfonsoCha1/Java',
    cover: 'code',
  },
  {
    slug: 'suma',
    name: 'SUMA',
    category: 'practice',
    status: 'archive',
    statusDetail: { es: 'Escolar', en: 'School work' },
    visibility: 'public',
    featured: false,
    order: 32,
    year: '2023',
    summary: { es: 'Ejercicio básico en C# y ASP.NET.', en: 'Basic C# and ASP.NET exercise.' },
    description: { es: 'Ejercicio básico de lógica en C# y ASP.NET.', en: 'Basic logic exercise in C# and ASP.NET.' },
    features: [{ es: 'Operaciones básicas.', en: 'Basic operations.' }],
    tech: ['C#', 'ASP.NET'],
    role: { es: 'Autor.', en: 'Author.' },
    repo: 'https://github.com/AlfonsoCha1/SUMA',
    cover: 'code',
  },
  {
    slug: 'proyectos-web',
    name: 'PROYECTOS',
    category: 'practice',
    status: 'archive',
    statusDetail: { es: 'Ejercicios', en: 'Exercises' },
    visibility: 'public',
    featured: false,
    order: 33,
    year: '2022',
    summary: { es: 'Ejercicios de HTML, CSS y JavaScript.', en: 'HTML, CSS and JavaScript exercises.' },
    description: {
      es: 'Colección de ejercicios de desarrollo web con HTML, CSS y JavaScript.',
      en: 'A collection of web development exercises with HTML, CSS and JavaScript.',
    },
    features: [{ es: 'Ejercicios del 0 al 10 y proyecto final.', en: 'Exercises 0–10 and a final project.' }],
    tech: ['HTML', 'CSS', 'JavaScript'],
    role: { es: 'Autor.', en: 'Author.' },
    repo: 'https://github.com/AlfonsoCha1/PROYECTOS',
    cover: 'code',
  },
];

export const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectsInCategory(id: string): Project[] {
  return sortedProjects.filter((p) => p.category === id || p.alsoIn?.includes(id as never));
}
