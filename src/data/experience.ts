import type { Experience } from './types';

/**
 * Experiencia laboral — fuente: CV del 21 de octubre de 2026 (ES/EN).
 * Ordenada de la más reciente a la más antigua.
 */
export const experience: Experience[] = [
  {
    id: 'marelli',
    company: 'Marelli',
    role: { es: 'Técnico de Pruebas', en: 'Test Technician' },
    start: '2026-05',
    end: '2026-07',
    period: { es: 'may 2026 – jul 2026', en: 'May 2026 – Jul 2026' },
    location: { es: 'Tepotzotlán, Estado de México', en: 'Tepotzotlán, State of Mexico' },
    color: '#FF943D',
    summary: {
      es: 'Pruebas funcionales de tarjetas electrónicas, base de datos de resultados y página web de entrenamiento.',
      en: 'Functional testing of circuit boards, a test-results database and a training web page.',
    },
    bullets: [
      {
        es: 'Ejecuté pruebas funcionales a tarjetas electrónicas en manufactura, antes de la entrega al cliente y en la verificación posterior.',
        en: 'Ran functional tests on electronic circuit boards before customer delivery and during post-delivery verification.',
      },
      {
        es: 'Creé y administré una base de datos en Excel de resultados de prueba y materiales reparados; respaldé datos de producción.',
        en: 'Built and maintained an Excel database to track test results and repaired materials; backed up production data.',
      },
      {
        es: 'Desarrollé una página web de componentes para el entrenamiento del área.',
        en: 'Created a component training web page for the team.',
      },
    ],
    tech: ['Pruebas funcionales', 'Excel', 'Bases de datos', 'Respaldos', 'Desarrollo web'],
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
      es: 'Ciudad de México · clientes en Colombia, España y Venezuela',
      en: 'Mexico City · clients in Colombia, Spain and Venezuela',
    },
    color: '#147DFF',
    summary: {
      es: 'Autenticación biométrica, seguridad de licencias y credenciales en Linux para clientes internacionales.',
      en: 'Biometric authentication, license security and Linux credentials for international clients.',
    },
    bullets: [
      {
        es: 'Desarrollé funciones de autenticación biométrica (reconocimiento facial y de huella) para Colombia, España y Venezuela.',
        en: 'Developed biometric authentication features (face and fingerprint recognition) for Colombia, Spain and Venezuela.',
      },
      {
        es: 'Corregí vulnerabilidades en el manejo de licencias para evitar su uso no autorizado.',
        en: 'Fixed licensing vulnerabilities to prevent unauthorized use.',
      },
      {
        es: 'Administré credenciales de usuarios en Linux y di soporte a clientes internacionales en un equipo de 2 personas.',
        en: 'Managed user credentials on Linux and supported international clients in a two-person team.',
      },
      {
        es: 'Participé en parte del desarrollo en Java del asistente digital "Blue".',
        en: 'Contributed to the Java development of the "Blue" digital assistant.',
      },
    ],
    tech: ['Autenticación biométrica', 'Linux', 'Java', 'Seguridad de licencias', 'Soporte TI'],
    relatedCategories: ['network', 'cyber', 'ai'],
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
        es: 'Mantenimiento de instalaciones en un entorno de trabajo en inglés.',
        en: 'Facility maintenance in an English-only workplace.',
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
      es: 'Soporte de primer nivel, conectividad en más de 50 estaciones, switches y recuperación de la red.',
      en: 'First-level support, connectivity across 50+ workstations, switches and network recovery.',
    },
    bullets: [
      {
        es: 'Di soporte de primer nivel y mantenimiento a equipos; resolví fallas de conexión en más de 50 estaciones y configuré switches.',
        en: 'Provided first-level support and equipment maintenance; fixed connectivity issues on 50+ workstations and configured switches.',
      },
      {
        es: 'Ayudé a restablecer la red de la oficina después de una caída del servicio.',
        en: 'Helped restore the office network after an outage.',
      },
    ],
    tech: ['Redes', 'Switches', 'Soporte TI', 'Mantenimiento'],
    relatedCategories: ['network', 'cyber'],
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
        es: 'Instalé cableado estructurado, diagnostiqué fallas de internet y configuré impresoras y periféricos.',
        en: 'Installed structured cabling, diagnosed internet outages and set up printers and peripherals.',
      },
    ],
    tech: ['Cableado estructurado', 'Redes', 'Periféricos'],
    relatedCategories: ['network'],
  },
];
