import type { L } from './types';

/**
 * Datos personales verificados.
 * Fuentes: CV_Alfonso_Chavarin_Maestro.pdf / Master_EN.pdf (oct 2026),
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
    es: ['Soporte TI', 'Ciberseguridad', 'IA y Automatización', 'Redes', 'Scrum'],
    en: ['IT Support', 'Cybersecurity', 'AI & Automation', 'Networking', 'Scrum'],
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
    { name: { es: 'Inglés', en: 'English' }, level: { es: 'B2', en: 'B2' } },
  ],
  intro: {
    es: 'Construyo soluciones tecnológicas que combinan soporte TI, redes, ciberseguridad defensiva, inteligencia artificial y automatización para resolver problemas reales.',
    en: 'I build technology solutions that combine IT support, networking, defensive cybersecurity, artificial intelligence and automation to solve real problems.',
  } satisfies L,
  summary: {
    es: 'Ingeniero en Sistemas Computacionales con perfil multidisciplinario respaldado por certificados y diplomas: soporte TI y redes (cursos Cisco CCNAv7, HelpDesk), ciberseguridad (Google Foundations of Cybersecurity), IA generativa y prompts (Diplomado de 112 h), Scrum (Scrum Master) y marketing digital. Experiencia en banca internacional, manufactura y gobierno, además de proyectos propios de e-commerce y contenido. Posgrado en Administración de Tecnologías. Bilingüe (español nativo, inglés B2).',
    en: 'Computer Systems Engineer with a multidisciplinary profile backed by certificates and diplomas: IT support and networking (Cisco CCNAv7 courses, HelpDesk), cybersecurity (Google Foundations of Cybersecurity), generative AI and prompt engineering (112-hour Diploma), Scrum (Scrum Master) and digital marketing. Experience in international banking, manufacturing and government, plus personal e-commerce and content projects. Postgraduate degree in Technology Management. Bilingual (native Spanish, B2 English).',
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
  /**
   * Disponibilidad profesional. Se deja en null hasta que Alfonso la confirme
   * (el encargo pide mostrarla solo si está confirmada).
   */
  availability: null as L | null,
  cv: {
    es: '/cv/CV_Alfonso_Chavarin_ES.pdf',
    en: '/cv/CV_Alfonso_Chavarin_EN.pdf',
  },
} as const;

export type Profile = typeof profile;
