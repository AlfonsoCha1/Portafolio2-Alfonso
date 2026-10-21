/**
 * Tipos del contenido del portafolio.
 * Todo el contenido vive en /src/data y es bilingüe ({ es, en }).
 * Guía para agregar contenido: docs/CONTENIDO.md
 */

export type Locale = 'es' | 'en';

/** Texto bilingüe. */
export interface L {
  es: string;
  en: string;
}

export type CategoryId =
  | 'cyber'
  | 'ai'
  | 'network'
  | 'web'
  | 'automation'
  | 'hardware'
  | 'content';

/** Categoría de proyecto que no es isla (prácticas académicas). */
export type ProjectCategoryId = CategoryId | 'practice';

export interface Category {
  id: CategoryId;
  name: L;
  short: L;
  tagline: L;
  description: L;
  /** Color de identidad (hex). */
  color: string;
  /** Segundo color para degradados. */
  color2: string;
  /** Nombre del ícono de lucide-react. */
  icon: string;
  /** Puntos reales relacionados (experiencia, cursos) que no son proyectos. */
  highlights: L[];
  /** Mensaje cuando la categoría aún no tiene proyectos documentados. */
  pending?: L;
}

/**
 * Estado real del proyecto. Nunca marcar como "completed" algo que sigue en desarrollo.
 */
export type ProjectStatus =
  | 'live' // en línea y en uso
  | 'beta' // beta pública
  | 'demo' // demostración funcional, no lista para uso real
  | 'lab' // laboratorio / aprendizaje
  | 'development' // en desarrollo
  | 'archive' // versión anterior o ejercicio
  | 'personal'; // herramienta personal sin publicar

export type Visibility = 'public' | 'private';

export interface ProjectImage {
  src: string;
  alt: L;
  /** true = ilustración conceptual generada en código, no captura real. */
  conceptual?: boolean;
}

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategoryId;
  /** Categorías secundarias (aparece también en esas islas). */
  alsoIn?: CategoryId[];
  status: ProjectStatus;
  /** Detalle corto del estado (ej. "v0.1.0 · primer módulo operativo"). */
  statusDetail: L;
  visibility: Visibility;
  featured: boolean;
  /** Orden (menor = primero). */
  order: number;
  year: string;
  summary: L;
  description: L;
  features: L[];
  tech: string[];
  role: L;
  repo?: string;
  demo?: string;
  note?: L;
  /** Capturas reales aprobadas. Si no hay, se usa una portada conceptual generada en código. */
  gallery?: ProjectImage[];
  /**
   * Vista en vivo de la página dentro del portafolio (iframe bajo demanda).
   * Ponlo en false si el sitio no permite mostrarse dentro de otra página.
   */
  livePreview?: boolean;
  /** Motivo visual de la portada animada. */
  cover: 'shield' | 'logs' | 'ai' | 'voice' | 'store' | 'loyalty' | 'web' | 'terminal' | 'video' | 'chip' | 'academy' | 'code' | 'nfc' | 'planner';
}

export interface Experience {
  id: string;
  company: string;
  role: L;
  start: string; // YYYY-MM
  end: string; // YYYY-MM
  period: L;
  location: L;
  color: string;
  summary: L;
  bullets: L[];
  tech: string[];
  relatedCategories: CategoryId[];
}

export interface Education {
  id: string;
  program: L;
  institution: string;
  period: L;
  mode: L;
  detail?: L;
}

export type CertGroup = 'networking' | 'cyber' | 'ai' | 'management' | 'dev' | 'communication';

/** Ícono de la tarjeta de cada certificación (lucide-react). */
export type CertIcon =
  | 'shield'
  | 'headset'
  | 'network'
  | 'router'
  | 'server'
  | 'terminal'
  | 'landmark'
  | 'brain'
  | 'sparkles'
  | 'kanban'
  | 'users'
  | 'git'
  | 'coffee'
  | 'code'
  | 'bot'
  | 'messages'
  | 'globe'
  | 'sheet'
  | 'presentation';

export interface Certification {
  id: string;
  name: L;
  /** De qué trata el curso, en una línea. */
  summary: L;
  issuer: string;
  date: L;
  /** Para ordenar: YYYY-MM */
  sortDate: string;
  kind: L;
  group: CertGroup;
  hours?: number;
  /** Ícono y color propios de la tarjeta. */
  icon: CertIcon;
  color: string;
  skills: string[];
  featured?: boolean;
  /** Aclaración importante (p. ej. "certificado de curso, no la certificación CCNA"). */
  note?: L;
}

export interface SkillGroup {
  id: string;
  name: L;
  color: string;
  items: { name: string | L; level?: L }[];
}

export interface Lab {
  id: string;
  name: string | L;
  status: 'available' | 'pending';
  detail: L;
  tech: string[];
  link?: string;
}
