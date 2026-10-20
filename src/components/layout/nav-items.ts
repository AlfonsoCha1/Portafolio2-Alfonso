/** Secciones del portafolio con su color de acento. El orden define el menú. */
export const NAV_ITEMS = [
  { id: 'inicio', key: 'home', color: '#00E5FF' },
  { id: 'sobre-mi', key: 'about', color: '#9D35FF' },
  { id: 'proyectos', key: 'projects', color: '#FF39C6' },
  { id: 'experiencia', key: 'experience', color: '#147DFF' },
  { id: 'educacion', key: 'education', color: '#FF943D' },
  { id: 'certificaciones', key: 'certifications', color: '#19E3B1' },
  { id: 'laboratorios', key: 'labs', color: '#00E5FF' },
  { id: 'habilidades', key: 'skills', color: '#D946EF' },
  { id: 'cv', key: 'cv', color: '#9D35FF' },
  { id: 'contacto', key: 'contact', color: '#FF39C6' },
] as const;

export type SectionId = (typeof NAV_ITEMS)[number]['id'];
