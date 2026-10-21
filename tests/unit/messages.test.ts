import { describe, expect, it } from 'vitest';
import es from '../../messages/es.json';
import en from '../../messages/en.json';

function keys(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) return [`${prefix}[${obj.length}]`];
  if (obj && typeof obj === 'object') return Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
  return [prefix];
}

describe('traducciones', () => {
  it('español e inglés tienen exactamente las mismas claves', () => {
    expect(keys(en).sort()).toEqual(keys(es).sort());
  });

  it('no hay textos vacíos', () => {
    const empty = (o: unknown): boolean => (typeof o === 'string' ? o.trim() === '' : o && typeof o === 'object' ? Object.values(o).some(empty) : false);
    expect(empty(es)).toBe(false);
    expect(empty(en)).toBe(false);
  });
});
