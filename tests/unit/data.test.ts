import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { categories } from '@/data/categories';
import { certifications } from '@/data/certifications';
import { education } from '@/data/education';
import { experience } from '@/data/experience';
import { profile } from '@/data/profile';
import { projects } from '@/data/projects';
import type { L } from '@/data/types';

const publicFile = (p: string) => existsSync(join(process.cwd(), 'public', p));
const filled = (l: L) => l.es.trim().length > 0 && l.en.trim().length > 0;

describe('proyectos', () => {
  it('tienen slugs únicos y en formato URL', () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    slugs.forEach((s) => expect(s).toMatch(/^[a-z0-9-]+$/));
  });

  it('tienen todos los campos obligatorios en ambos idiomas', () => {
    for (const p of projects) {
      expect(p.name.length, p.slug).toBeGreaterThan(1);
      expect(filled(p.summary), p.slug).toBe(true);
      expect(filled(p.description), p.slug).toBe(true);
      expect(filled(p.role), p.slug).toBe(true);
      expect(filled(p.statusDetail), p.slug).toBe(true);
      expect(p.features.length, p.slug).toBeGreaterThan(0);
      p.features.forEach((f) => expect(filled(f), p.slug).toBe(true));
      expect(p.tech.length, p.slug).toBeGreaterThan(0);
    }
  });

  it('usan categorías existentes', () => {
    const ids = new Set<string>([...categories.map((c) => c.id), 'practice']);
    for (const p of projects) {
      expect(ids.has(p.category), p.slug).toBe(true);
      p.alsoIn?.forEach((c) => expect(ids.has(c), p.slug).toBe(true));
    }
  });

  it('solo enlazan a HTTPS y nunca a código privado', () => {
    for (const p of projects) {
      if (p.repo) expect(p.repo, p.slug).toMatch(/^https:\/\/github\.com\/AlfonsoCha1\//);
      if (p.demo) expect(p.demo, p.slug).toMatch(/^https:\/\//);
      if (p.visibility === 'private') expect(p.repo, `${p.slug} es privado y no debe enlazar código`).toBeUndefined();
    }
  });

  it('no marcan como "en línea" proyectos sin página pública', () => {
    for (const p of projects.filter((x) => x.status === 'live' || x.status === 'beta' || x.status === 'demo')) {
      if (p.slug === 'el-chavatrix') continue; // canal de video: activo, enlaces pendientes de confirmar
      expect(p.demo ?? p.repo, p.slug).toBeTruthy();
    }
  });

  it('las capturas declaradas existen', () => {
    for (const p of projects) p.gallery?.forEach((g) => expect(publicFile(g.src), g.src).toBe(true));
  });
});

describe('experiencia y educación (según el CV)', () => {
  it('coincide con las empresas del CV y no incluye datos inventados', () => {
    expect(experience.map((e) => e.company).sort()).toEqual(
      ['BBVA Technology America', 'Hayward and Burgers Camping', 'Junta de Conciliación y Arbitraje', 'Marelli', 'Secretaría de Desarrollo Agropecuario (SEDAGRO)'].sort(),
    );
    const all = JSON.stringify({ experience, education, projects, certifications, profile });
    // Datos que aparecían en la imagen de referencia y NO pertenecen a Alfonso
    for (const fake of ['Space AI', 'Huawei', 'Continental', 'IT Basari', 'IENTC', 'Surrey', 'Tecnológico de Monterrey', 'Mecatrónica', 'Querétaro']) {
      expect(all.includes(fake), fake).toBe(false);
    }
  });

  it('está ordenada de la más reciente a la más antigua', () => {
    const starts = experience.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
  });

  it('las fechas tienen formato válido y fin >= inicio', () => {
    for (const e of experience) {
      expect(e.start).toMatch(/^\d{4}-\d{2}$/);
      expect(e.end).toMatch(/^\d{4}-\d{2}$/);
      expect(e.end >= e.start, e.id).toBe(true);
    }
  });

  it('educación con UNINTER', () => {
    expect(education).toHaveLength(2);
    education.forEach((e) => expect(e.institution).toContain('UNINTER'));
  });
});

describe('certificaciones', () => {
  it('ids únicos, ícono y color propios', () => {
    const ids = certifications.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of certifications) {
      expect(filled(c.name)).toBe(true);
      expect(c.icon, c.id).toBeTruthy();
      expect(c.color, c.id).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('privacidad: sin imágenes ni enlaces a los certificados (CURP, folios, QR)', () => {
    for (const c of certifications) {
      expect('image' in c, c.id).toBe(false);
      expect('verifyUrl' in c, c.id).toBe(false);
    }
    for (const e of education) expect('image' in e, e.id).toBe(false);
    expect(publicFile('images/certificados')).toBe(false);
    expect(JSON.stringify(certifications)).not.toMatch(/coursera\.org\/verify|https?:\/\//);
  });

  it('los cursos de Cisco NetAcad aclaran que no son la certificación CCNA', () => {
    certifications.filter((c) => c.issuer.includes('Cisco Networking Academy')).forEach((c) => expect(c.note?.es).toMatch(/no es la certificación CCNA/));
  });
});

describe('perfil', () => {
  it('fotografía y CV existen', () => {
    expect(publicFile(profile.photo.circle)).toBe(true);
    expect(publicFile(profile.photo.portrait)).toBe(true);
    expect(publicFile(profile.photo.circleTexture)).toBe(true);
    expect(publicFile(profile.cv.es)).toBe(true);
    expect(publicFile(profile.cv.en)).toBe(true);
  });

  it('la disponibilidad coincide con la del CV (confirmada por Alfonso)', () => {
    expect(profile.availability).toEqual({ es: 'Disponibilidad inmediata · presencial o remoto', en: 'Available immediately · on-site or remote' });
  });

  it('el nivel de inglés coincide con el CV vigente (B1)', () => {
    const english = profile.languages.find((l) => l.name.es === 'Inglés');
    expect(english?.level.es).toContain('B1');
  });

  it('siete islas con colores distintos', () => {
    expect(categories).toHaveLength(7);
    expect(new Set(categories.map((c) => c.color)).size).toBe(7);
  });
});
