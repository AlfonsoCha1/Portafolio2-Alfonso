import type { L } from './types';

/**
 * Datos personales verificados.
 * Fuentes: CV_Alfonso_Chavarin_ES.pdf / EN.pdf (versión del 21 oct 2026),
 * README de github.com/AlfonsoCha1 y portafolio anterior.
 */
export const profile = {
  name: 'Alfonso Chavarín',
  fullName: 'José Alfonso Chavarín Montoya',
  firstName: 'Alfonso',
  lastName: 'Chavarín',
  initials: 'AC',
  brand: 'CHAVATRIX',
  concept: { es: 'Beyond the Code — Un universo de soluciones', en: 'Beyond the Code — A universe of solutions' } satisfies L,
  headline: { es: 'Ingeniero en Sistemas Computacionales', en: 'Computer Systems Engineer' } satisfies L,
  roles: {
    es: ['Soporte TI y Redes', 'Ciberseguridad', 'Python e IA', 'Automatización', 'Scrum'],
    en: ['IT Support & Networking', 'Cybersecurity', 'Python & AI', 'Automation', 'Scrum'],
  },
  location: { es: 'Cuernavaca, Morelos, México', en: 'Cuernavaca, Morelos, Mexico' } satisfies L,
  email: 'alfonso.chavarin@hotmail.com',
  github: 'https://github.com/AlfonsoCha1',
  githubUser: 'AlfonsoCha1',
  linkedin: 'https://www.linkedin.com/in/alfonso-chavarin/',
  previousPortfolio: 'https://portafolio-original-tau.vercel.app/',
  photo: {
    circle: '/images/alfonso/alfonso-circle.webp',
    circleTexture: '/images/alfonso/alfonso-circle-512.jpg',
    portrait: '/images/alfonso/alfonso-portrait.webp',
    alt: { es: 'Fotografía de Alfonso Chavarín', en: 'Photo of Alfonso Chavarín' } satisfies L,
  },
  languages: [
    { name: { es: 'Español', en: 'Spanish' }, level: { es: 'Nativo', en: 'Native' } },
    { name: { es: 'Inglés', en: 'English' }, level: { es: 'B1 (intermedio)', en: 'B1 (intermediate)' } },
  ],
  intro: {
    es: 'Construyo soluciones tecnológicas que combinan soporte TI, redes, ciberseguridad defensiva, inteligencia artificial y automatización para resolver problemas reales.',
    en: 'I build technology solutions that combine IT support, networking, defensive cybersecurity, artificial intelligence and automation to solve real problems.',
  } satisfies L,
  summary: {
    es: 'Ingeniero en Sistemas Computacionales con experiencia en soporte e implementación de TI para BBVA, soporte y redes en el sector público, y pruebas funcionales en manufactura automotriz (Marelli). Desarrollo herramientas de ciberseguridad defensiva en Python (análisis de logs, detección de accesos sospechosos y de secretos expuestos) y aplicaciones con IA. Me preparo para CompTIA Security+ y el certificado Google Cybersecurity.',
    en: 'Computer Systems Engineer with IT support and implementation experience at BBVA, public-sector support and networking, and functional testing in automotive manufacturing (Marelli). I build defensive security tools in Python (log analysis, suspicious-login detection, secret scanning) and AI applications. Preparing for CompTIA Security+ and the Google Cybersecurity Certificate.',
  } satisfies L,
  about: {
    es: 'Trabajo de forma metódica: diagnostico, encuentro la causa raíz y documento soluciones estables. Hoy enfoco mis proyectos en la ciberseguridad defensiva con Python y en aplicaciones con IA, sin dejar de lado la base que me dio el soporte TI y las redes.',
    en: 'I work methodically: I diagnose, find the root cause and document stable solutions. Today I focus my projects on defensive cybersecurity with Python and AI-powered applications, building on the foundation that IT support and networking gave me.',
  } satisfies L,
  building: {
    es: 'ALBA, un kit local para revisar la seguridad de proyectos, y nuevas herramientas para mi laboratorio de ciberseguridad en Python.',
    en: 'ALBA, a local kit to review project security, and new tools for my Python cybersecurity lab.',
  } satisfies L,
  quote: {
    es: 'La tecnología no se trata solo de construir cosas, sino de resolver problemas reales con soluciones útiles.',
    en: 'Technology is not only about building things, but about solving real problems with useful solutions.',
  } satisfies L,
  /** Primer trabajo en TI: SEDAGRO, agosto de 2021. */
  itSince: 2021,
  /** Disponibilidad profesional (confirmada en el CV del 21 oct 2026). */
  availability: { es: 'Disponibilidad inmediata · presencial o remoto', en: 'Available immediately · on-site or remote' } as L | null,
  cv: {
    es: '/cv/CV_Alfonso_Chavarin_ES.pdf',
    en: '/cv/CV_Alfonso_Chavarin_EN.pdf',
  },
} as const;

export type Profile = typeof profile;
