import type { Education } from './types';

/** Fuente: CV de octubre de 2026. Sin imágenes de diplomas (privacidad). */
export const education: Education[] = [
  {
    id: 'posgrado',
    program: {
      es: 'Posgrado en Administración de Tecnologías',
      en: 'Postgraduate Degree in Technology Management',
    },
    institution: 'Universidad Internacional (UNINTER)',
    period: { es: 'feb 2025 – abr 2026', en: 'Feb 2025 – Apr 2026' },
    mode: { es: 'En línea', en: 'Online' },
  },
  {
    id: 'ingenieria',
    program: {
      es: 'Ingeniería en Sistemas Computacionales',
      en: 'B.Eng. in Computer Systems Engineering',
    },
    institution: 'Universidad Internacional (UNINTER)',
    period: { es: 'ene 2020 – dic 2024', en: 'Jan 2020 – Dec 2024' },
    mode: { es: 'Cuernavaca, Morelos', en: 'Cuernavaca, Morelos' },
    detail: {
      es: 'Generación 2020–2024. 3.ª Presentación de Proyectos UNINTER · ESCAT (may 2024).',
      en: 'Class of 2020–2024. 3rd UNINTER · ESCAT Project Showcase (May 2024).',
    },
  },
];
