import { profile } from '@/data/profile';
import { sortedProjects } from '@/data/projects';
import { skillGroups, labs } from '@/data/skills';
import { sortedCertifications } from '@/data/certifications';
import { categoryMap } from '@/data/categories';
import type { Locale, ProjectStatus } from '@/data/types';
import { tx } from './i18n';

/**
 * Terminal SOC del portafolio.
 * Es una simulación: NO ejecuta comandos del sistema. Solo interpreta una lista cerrada
 * de comandos y responde con información real del portafolio.
 */
export type Tone = 'default' | 'accent' | 'muted' | 'success' | 'warn' | 'error' | 'link';

export interface TermLine {
  text: string;
  tone?: Tone;
  href?: string;
}

export interface TermResult {
  lines: TermLine[];
  clear?: boolean;
}

export const TERMINAL_COMMANDS = ['help', 'about', 'projects', 'skills', 'certifications', 'soc', 'contact', 'clear'] as const;
export type TerminalCommand = (typeof TERMINAL_COMMANDS)[number];

const ALIASES: Record<string, TerminalCommand> = {
  '?': 'help',
  ayuda: 'help',
  whoami: 'about',
  sobre: 'about',
  proyectos: 'projects',
  ls: 'projects',
  habilidades: 'skills',
  certs: 'certifications',
  certificaciones: 'certifications',
  labs: 'soc',
  contacto: 'contact',
  cls: 'clear',
  limpiar: 'clear',
};

const MAX_INPUT = 64;

const statusLabel: Record<ProjectStatus, { es: string; en: string }> = {
  live: { es: 'en línea', en: 'live' },
  beta: { es: 'beta', en: 'beta' },
  demo: { es: 'demo', en: 'demo' },
  lab: { es: 'laboratorio', en: 'lab' },
  development: { es: 'en desarrollo', en: 'in development' },
  archive: { es: 'archivo', en: 'archive' },
  personal: { es: 'personal', en: 'personal' },
};

export function normalizeCommand(raw: string): { command: TerminalCommand | null; input: string } {
  const input = raw.slice(0, MAX_INPUT).trim().toLowerCase();
  const first = input.split(/\s+/)[0] ?? '';
  if ((TERMINAL_COMMANDS as readonly string[]).includes(first)) return { command: first as TerminalCommand, input };
  return { command: ALIASES[first] ?? null, input };
}

export function runCommand(raw: string, locale: Locale): TermResult {
  const es = locale === 'es';
  const { command, input } = normalizeCommand(raw);
  if (!input) return { lines: [] };

  switch (command) {
    case 'help':
      return {
        lines: [
          { text: es ? 'Comandos disponibles:' : 'Available commands:', tone: 'accent' },
          { text: `  about           ${es ? 'quién soy' : 'who I am'}` },
          { text: `  projects        ${es ? 'proyectos y su estado real' : 'projects and their real status'}` },
          { text: `  skills          ${es ? 'habilidades técnicas' : 'technical skills'}` },
          { text: `  certifications  ${es ? 'cursos y certificados' : 'courses and certificates'}` },
          { text: `  soc             ${es ? 'laboratorios de ciberseguridad' : 'cybersecurity labs'}` },
          { text: `  contact         ${es ? 'cómo contactarme' : 'how to reach me'}` },
          { text: `  clear           ${es ? 'limpiar la pantalla' : 'clear the screen'}` },
          {
            text: es
              ? 'Simulación segura: no se ejecutan comandos del sistema.'
              : 'Safe simulation: no system commands are executed.',
            tone: 'muted',
          },
        ],
      };
    case 'about':
      return {
        lines: [
          { text: `${profile.fullName}`, tone: 'accent' },
          { text: `${tx(profile.headline, locale)} · ${tx(profile.location, locale)}` },
          { text: tx(profile.intro, locale) },
          { text: `${es ? 'Construyendo ahora' : 'Building now'}: ${tx(profile.building, locale)}`, tone: 'success' },
          {
            text: `${es ? 'Idiomas' : 'Languages'}: ${profile.languages.map((l) => `${tx(l.name, locale)} (${tx(l.level, locale)})`).join(' · ')}`,
            tone: 'muted',
          },
        ],
      };
    case 'projects': {
      const list = sortedProjects.filter((p) => p.category !== 'practice');
      return {
        lines: [
          { text: es ? `Proyectos (${list.length}):` : `Projects (${list.length}):`, tone: 'accent' },
          ...list.map<TermLine>((p) => ({
            text: `  ▸ ${p.name.padEnd(36, ' ')} [${tx(statusLabel[p.status], locale)}] ${p.category !== 'practice' ? tx(categoryMap[p.category].short, locale) : ''}`,
            href: `/${locale}/projects/${p.slug}`,
            tone: 'link',
          })),
          { text: es ? 'Abre un proyecto con clic o desde la sección Proyectos.' : 'Open a project by clicking it or from the Projects section.', tone: 'muted' },
        ],
      };
    }
    case 'skills':
      return {
        lines: skillGroups.flatMap<TermLine>((g) => [
          { text: `# ${tx(g.name, locale)}`, tone: 'accent' },
          { text: `  ${g.items.map((i) => tx(i.name, locale)).join(' · ')}` },
        ]),
      };
    case 'certifications':
      return {
        lines: [
          { text: es ? `Cursos y certificados (${sortedCertifications.length}):` : `Courses & certificates (${sortedCertifications.length}):`, tone: 'accent' },
          ...sortedCertifications.map<TermLine>((c) => ({
            text: `  ✓ ${tx(c.name, locale)} — ${c.issuer} (${tx(c.date, locale)}${c.hours ? ` · ${c.hours} h` : ''})`,
          })),
          {
            text: es
              ? 'Los cursos CCNAv7 de Cisco Networking Academy son certificados de finalización.'
              : 'The Cisco Networking Academy CCNAv7 courses are completion certificates.',
            tone: 'muted',
          },
        ],
      };
    case 'soc':
      return {
        lines: [
          { text: 'SOC LAB // Cybersecurity Python Lab', tone: 'accent' },
          ...labs.map<TermLine>((l) => ({
            text: `  ${l.status === 'available' ? '[OK]  ' : '[WAIT]'} ${tx(l.name, locale)}`,
            tone: l.status === 'available' ? 'success' : 'warn',
            href: l.link,
          })),
          { text: es ? 'Herramientas de aprendizaje con datos sintéticos, no productos para producción.' : 'Learning tools with synthetic data, not production products.', tone: 'muted' },
        ],
      };
    case 'contact':
      return {
        lines: [
          { text: es ? 'Contacto:' : 'Contact:', tone: 'accent' },
          { text: `  email     ${profile.email}`, href: `mailto:${profile.email}`, tone: 'link' },
          { text: `  linkedin  ${profile.linkedin.replace('https://www.', '')}`, href: profile.linkedin, tone: 'link' },
          { text: `  github    github.com/${profile.githubUser}`, href: profile.github, tone: 'link' },
        ],
      };
    case 'clear':
      return { lines: [], clear: true };
    default:
      return {
        lines: [
          {
            text: es
              ? `Comando no reconocido: "${input.slice(0, 32)}". Escribe "help" para ver los comandos.`
              : `Unknown command: "${input.slice(0, 32)}". Type "help" to see the commands.`,
            tone: 'error',
          },
        ],
      };
  }
}
