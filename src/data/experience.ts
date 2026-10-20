import type { Experience } from './types';

/**
 * Experiencia laboral — fuente: CV de octubre de 2026 (ES/EN).
 * Ordenada de la más reciente a la más antigua.
 */
export const experience: Experience[] = [
  {
    id: 'marelli',
    company: 'Marelli',
    role: { es: 'Técnico de Pruebas', en: 'Testing Technician' },
    start: '2026-05',
    end: '2026-07',
    period: { es: 'may 2026 – jul 2026', en: 'May 2026 – Jul 2026' },
    location: { es: 'Tepotzotlán, Estado de México', en: 'Tepotzotlán, State of Mexico' },
    color: '#FF943D',
    summary: {
      es: 'Pruebas funcionales de tarjetas electrónicas y bases de datos de resultados.',
      en: 'Functional testing of circuit boards and test-result databases.',
    },
    bullets: [
      {
        es: 'Pruebas funcionales a tarjetas electrónicas en manufactura, previo a la entrega y en verificación posterior.',
        en: 'Ran functional tests on electronic circuit boards during manufacturing, before customer delivery and in post-delivery verification.',
      },
      {
        es: 'Desarrollé y administré bases de datos de seguimiento de resultados y de materiales reparados, con visión de escalarlas a otros departamentos.',
        en: 'Built and administered databases to track test results and repaired materials, designed to scale to other plant departments.',
      },
      { es: 'Respaldo de datos de producción.', en: 'Backed up production data.' },
    ],
    tech: ['Bases de datos', 'Pruebas funcionales', 'Respaldos', 'Electrónica'],
    relatedCategories: ['hardware', 'automation'],
  },
  {
    id: 'bbva',
    company: 'BBVA Technology America',
    role: { es: 'Técnico de Soporte e Implementación TI', en: 'IT Support & Implementation Technician' },
    start: '2025-08',
    end: '2025-10',
    period: { es: 'ago 2025 – oct 2025', en: 'Aug 2025 – Oct 2025' },
    location: {
      es: 'Ciudad de México · clientes en Colombia, Venezuela y España',
      en: 'Mexico City · clients in Colombia, Venezuela and Spain',
    },
    color: '#147DFF',
    summary: {
      es: 'Soporte a clientes internacionales, autenticación biométrica y credenciales en Linux.',
      en: 'International client support, biometric authentication and Linux credentials.',
    },
    bullets: [
      {
        es: 'Soporte técnico a clientes de Colombia, Venezuela y España en un equipo de 2 personas; servicios de AWS para infraestructura y despliegue.',
        en: 'Provided technical support to clients in Colombia, Venezuela and Spain in a 2-person team; used AWS services for infrastructure and deployment.',
      },
      {
        es: 'Implementé autenticación biométrica (Face ID y huella) y gestioné credenciales de usuario en Linux para mantener accesos seguros.',
        en: 'Implemented biometric authentication (Face ID and fingerprint) and managed Linux user credentials to keep access secure.',
      },
      {
        es: 'Contribuí al desarrollo en Java del asistente digital "Blue"; capacitación en IA, Gemini, protección de datos y código de conducta.',
        en: 'Contributed to Java development of the "Blue" digital assistant; trained in AI, Gemini, data protection and code of conduct.',
      },
    ],
    tech: ['AWS', 'Linux', 'Java', 'Autenticación biométrica', 'Soporte TI'],
    relatedCategories: ['cyber', 'ai'],
  },
  {
    id: 'hayward',
    company: 'Hayward and Burgers Camping',
    role: { es: 'Asistente de Mantenimiento', en: 'Maintenance Assistant' },
    start: '2024-06',
    end: '2024-08',
    period: { es: 'jun 2024 – ago 2024', en: 'Jun 2024 – Aug 2024' },
    location: { es: 'Boston, EUA', en: 'Boston, USA' },
    color: '#19E3B1',
    summary: {
      es: 'Mantenimiento de instalaciones en un entorno de habla inglesa.',
      en: 'Facility maintenance in a fully English-speaking environment.',
    },
    bullets: [
      {
        es: 'Mantenimiento general de instalaciones en un entorno de habla inglesa.',
        en: 'General facility maintenance in a fully English-speaking environment.',
      },
    ],
    tech: ['Inglés', 'Trabajo en equipo'],
    relatedCategories: [],
  },
  {
    id: 'junta',
    company: 'Junta de Conciliación y Arbitraje',
    role: { es: 'Técnico en TI (Servicio Social)', en: 'IT Technician (Social Service)' },
    start: '2023-08',
    end: '2024-09',
    period: { es: 'ago 2023 – sep 2024', en: 'Aug 2023 – Sep 2024' },
    location: { es: 'Cuernavaca, Morelos', en: 'Cuernavaca, Morelos' },
    color: '#00E5FF',
    summary: {
      es: 'Conectividad en más de 50 estaciones, switches y soporte de primer nivel.',
      en: 'Connectivity across 50+ workstations, switches and first-level support.',
    },
    bullets: [
      {
        es: 'Resolví problemas de conectividad en más de 50 estaciones de trabajo y configuré switches.',
        en: 'Resolved network connectivity issues across 50+ workstations and configured switches.',
      },
      {
        es: 'Mantenimiento preventivo y correctivo, y soporte de primer nivel.',
        en: 'Preventive and corrective maintenance, and first-level support.',
      },
    ],
    tech: ['Redes', 'Switches', 'Soporte TI', 'Mantenimiento'],
    relatedCategories: ['hardware', 'cyber'],
  },
  {
    id: 'sedagro',
    company: 'Secretaría de Desarrollo Agropecuario (SEDAGRO)',
    role: { es: 'Practicante en TI', en: 'IT Intern' },
    start: '2021-08',
    end: '2021-12',
    period: { es: 'ago 2021 – dic 2021', en: 'Aug 2021 – Dec 2021' },
    location: { es: 'Cuernavaca, Morelos', en: 'Cuernavaca, Morelos' },
    color: '#9D35FF',
    summary: {
      es: 'Cableado estructurado, fallas de internet, impresoras y periféricos.',
      en: 'Structured cabling, internet faults, printers and peripherals.',
    },
    bullets: [
      {
        es: 'Cableado estructurado hacia switches y diagnóstico de fallas de internet.',
        en: 'Structured cabling to switches and internet fault diagnosis.',
      },
      {
        es: 'Configuración de impresoras y periféricos.',
        en: 'Printer and peripheral setup.',
      },
    ],
    tech: ['Cableado estructurado', 'Redes', 'Periféricos'],
    relatedCategories: ['hardware'],
  },
];
