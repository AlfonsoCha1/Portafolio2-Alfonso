import type { Category, CategoryId } from './types';

/**
 * Las siete islas del universo. Cada una tiene su color de identidad.
 * Los "highlights" son hechos verificables (experiencia y cursos) que no son proyectos.
 */
export const categories: Category[] = [
  {
    id: 'cyber',
    name: { es: 'Ciberseguridad', en: 'Cybersecurity' },
    short: { es: 'Ciber', en: 'Cyber' },
    tagline: { es: 'Defensa · SOC · Labs', en: 'Defense · SOC · Labs' },
    description: {
      es: 'Herramientas defensivas en Python, análisis de registros, revisión segura de proyectos y una academia para aprender practicando.',
      en: 'Defensive Python tools, log analysis, secure project reviews and an academy to learn by doing.',
    },
    color: '#00E5FF',
    color2: '#147DFF',
    icon: 'ShieldCheck',
    highlights: [
      {
        es: 'Foundations of Cybersecurity — Google · Coursera (oct 2026).',
        en: 'Foundations of Cybersecurity — Google · Coursera (Oct 2026).',
      },
      {
        es: 'Autenticación biométrica y gestión de credenciales en Linux en BBVA Technology.',
        en: 'Biometric authentication and Linux credential management at BBVA Technology.',
      },
      {
        es: 'Seguridad de red vista en CCNAv7: mitigación de amenazas, ACL y acceso administrativo seguro.',
        en: 'Network security from CCNAv7: threat mitigation, ACLs and secure administrative access.',
      },
    ],
  },
  {
    id: 'ai',
    name: { es: 'Inteligencia artificial', en: 'Artificial intelligence' },
    short: { es: 'IA', en: 'AI' },
    tagline: { es: 'Asistentes · Voz · Agentes', en: 'Assistants · Voice · Agents' },
    description: {
      es: 'Aplicaciones con IA generativa: un asistente en beta y un coach de inglés por voz.',
      en: 'Generative AI applications: an assistant in beta and a voice-based English coach.',
    },
    color: '#9D35FF',
    color2: '#FF39C6',
    icon: 'BrainCircuit',
    highlights: [
      {
        es: 'Diplomado en IA Generativa y Automatización — Top Learning, 112 h (sep 2025).',
        en: 'Diploma in Generative AI & Automation — Top Learning, 112 h (Sep 2025).',
      },
      {
        es: 'Contribución al desarrollo en Java del asistente digital "Blue" en BBVA Technology.',
        en: 'Contributed to Java development of the "Blue" digital assistant at BBVA Technology.',
      },
      { es: 'IA Express y Gemini Express — BBVA (2025).', en: 'AI Express and Gemini Express — BBVA (2025).' },
    ],
  },
  {
    id: 'drones',
    name: { es: 'Drones y robótica', en: 'Drones & robotics' },
    short: { es: 'Robótica', en: 'Robotics' },
    tagline: { es: 'Robótica · Control · Arduino', en: 'Robotics · Control · Arduino' },
    description: {
      es: 'Formación en robótica aplicada y programación en Python, con Arduino como plataforma de prácticas.',
      en: 'Training in applied robotics and Python programming, with Arduino as a practice platform.',
    },
    color: '#FF943D',
    color2: '#FFC85C',
    icon: 'Drone',
    highlights: [
      {
        es: 'Curso de Robótica Aplicada, nivel avanzado — 60 h, calificación final de 10 (jun–oct 2021).',
        en: 'Applied Robotics course, advanced level — 60 h, final grade 10/10 (Jun–Oct 2021).',
      },
      {
        es: 'Curso de programación en Python — 16 h (ene 2022).',
        en: 'Python programming course — 16 h (Jan 2022).',
      },
      { es: 'Arduino IDE como herramienta de prácticas.', en: 'Arduino IDE as a practice tool.' },
    ],
    pending: {
      es: 'Proyectos de drones y control: pendientes de documentar. Agrega aquí tus proyectos cuando tengas capturas y descripción.',
      en: 'Drone and control projects: pending documentation. Add your projects here once you have screenshots and a description.',
    },
  },
  {
    id: 'web',
    name: { es: 'Desarrollo web', en: 'Web development' },
    short: { es: 'Web', en: 'Web' },
    tagline: { es: 'Tiendas · Plataformas · APIs', en: 'Stores · Platforms · APIs' },
    description: {
      es: 'Tienda en línea, plataforma de lealtad full stack y sitios web publicados en Vercel y Render.',
      en: 'An online store, a full-stack loyalty platform and websites deployed on Vercel and Render.',
    },
    color: '#FF39C6',
    color2: '#FF7AD9',
    icon: 'Code2',
    highlights: [
      {
        es: 'Despliegues en Vercel (frontend) y Render (backend) con planes gratuitos.',
        en: 'Deployments on Vercel (frontend) and Render (backend) on free plans.',
      },
      {
        es: 'Comunicación Web Interactiva — UNINTER, 54 h (nov 2022).',
        en: 'Interactive Web Communication — UNINTER, 54 h (Nov 2022).',
      },
    ],
  },
  {
    id: 'automation',
    name: { es: 'Automatización', en: 'Automation' },
    short: { es: 'Auto', en: 'Auto' },
    tagline: { es: 'Scripts · PowerShell · Python', en: 'Scripts · PowerShell · Python' },
    description: {
      es: 'Scripts que ahorran tiempo: limpieza y organización de archivos en Windows, revisiones de seguridad y flujos de edición automatizados.',
      en: 'Time-saving scripts: Windows file cleanup and organization, security checks and automated editing workflows.',
    },
    color: '#147DFF',
    color2: '#00E5FF',
    icon: 'Workflow',
    highlights: [
      {
        es: 'Bases de datos para el seguimiento de resultados de pruebas y respaldo de datos de producción en Marelli.',
        en: 'Databases to track test results and back up production data at Marelli.',
      },
      {
        es: 'Flujo local "AI_Video_Studio" para automatizar la edición de video.',
        en: 'Local "AI_Video_Studio" workflow to automate video editing.',
      },
    ],
  },
  {
    id: 'hardware',
    name: { es: 'Hardware e IoT', en: 'Hardware & IoT' },
    short: { es: 'Hardware', en: 'Hardware' },
    tagline: { es: 'PCB · Redes físicas · NFC', en: 'PCB · Physical networks · NFC' },
    description: {
      es: 'Pruebas funcionales de tarjetas electrónicas, cableado estructurado, switches y soportes NFC.',
      en: 'Functional testing of electronic boards, structured cabling, switches and NFC stands.',
    },
    color: '#19E3B1',
    color2: '#00E5FF',
    icon: 'Cpu',
    highlights: [
      {
        es: 'Pruebas funcionales a tarjetas electrónicas en manufactura — Marelli (2026).',
        en: 'Functional testing of electronic circuit boards in manufacturing — Marelli (2026).',
      },
      {
        es: 'Conectividad en más de 50 estaciones de trabajo y configuración de switches — Junta de Conciliación y Arbitraje.',
        en: 'Connectivity across 50+ workstations and switch configuration — Junta de Conciliación y Arbitraje.',
      },
      {
        es: 'Cableado estructurado, ponchado y periféricos — SEDAGRO.',
        en: 'Structured cabling, crimping and peripherals — SEDAGRO.',
      },
    ],
  },
  {
    id: 'content',
    name: { es: 'Contenido y creatividad', en: 'Content & creativity' },
    short: { es: 'Contenido', en: 'Content' },
    tagline: { es: 'Video · Edición · Diseño', en: 'Video · Editing · Design' },
    description: {
      es: 'Un editor de video de escritorio propio y un canal de video vertical con edición asistida por IA.',
      en: 'A home-built desktop video editor and a vertical video channel with AI-assisted editing.',
    },
    color: '#D946EF',
    color2: '#FF39C6',
    icon: 'Clapperboard',
    highlights: [
      {
        es: 'Comunicación Digital con Medios Enriquecidos — UNINTER, 54 h (oct 2023).',
        en: 'Digital Communication with Rich Media — UNINTER, 54 h (Oct 2023).',
      },
      {
        es: 'Herramientas: CapCut, Canva, Figma, Photoshop e Illustrator.',
        en: 'Tools: CapCut, Canva, Figma, Photoshop and Illustrator.',
      },
    ],
  },
];

export const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c])) as Record<CategoryId, Category>;

export const practiceCategory = {
  id: 'practice' as const,
  name: { es: 'Prácticas', en: 'Practice' },
  color: '#8EA2C8',
};

export function categoryColor(id: string): string {
  if (id === 'practice') return practiceCategory.color;
  return categoryMap[id as CategoryId]?.color ?? '#9D35FF';
}
