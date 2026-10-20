import { describe, expect, it } from 'vitest';
import { normalizeCommand, runCommand, TERMINAL_COMMANDS } from '@/lib/terminal';
import { projects } from '@/data/projects';

const text = (r: ReturnType<typeof runCommand>) => r.lines.map((l) => l.text).join('\n');

describe('terminal SOC', () => {
  it('help lista todos los comandos', () => {
    const out = text(runCommand('help', 'es'));
    for (const c of TERMINAL_COMMANDS.filter((c) => c !== 'help')) expect(out).toContain(c);
  });

  it('projects muestra todos los proyectos no académicos con enlace a su página', () => {
    const r = runCommand('projects', 'en');
    const real = projects.filter((p) => p.category !== 'practice');
    for (const p of real) expect(text(r)).toContain(p.name);
    expect(r.lines.filter((l) => l.href?.startsWith('/en/projects/'))).toHaveLength(real.length);
  });

  it('soc, skills, certifications, about y contact responden con datos reales', () => {
    expect(text(runCommand('soc', 'es'))).toContain('Generador de reportes');
    expect(text(runCommand('skills', 'es'))).toContain('Python');
    expect(text(runCommand('certifications', 'es'))).toContain('Scrum Master');
    expect(text(runCommand('about', 'es'))).toContain('José Alfonso Chavarín Montoya');
    expect(text(runCommand('contact', 'es'))).toContain('alfonso.chavarin@hotmail.com');
  });

  it('clear limpia y los alias funcionan', () => {
    expect(runCommand('clear', 'es').clear).toBe(true);
    expect(normalizeCommand('ayuda').command).toBe('help');
    expect(normalizeCommand('WHOAMI').command).toBe('about');
  });

  it('no ejecuta comandos del sistema: todo lo desconocido es un error controlado', () => {
    for (const evil of ['rm -rf /', 'cat /etc/passwd', '$(curl evil)', 'eval(alert(1))', '<script>']) {
      const r = runCommand(evil, 'es');
      expect(r.lines).toHaveLength(1);
      expect(r.lines[0]?.tone).toBe('error');
    }
  });

  it('limita la longitud de la entrada', () => {
    expect(normalizeCommand('a'.repeat(500)).input.length).toBeLessThanOrEqual(64);
  });
});
