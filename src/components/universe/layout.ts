import type { CategoryId } from '@/data/types';

/**
 * Posición de cada isla en la escena 3D (unidades de escena, planeta en el origen)
 * y en el universo 2D (porcentajes del contenedor).
 */
export interface IslandLayout {
  id: CategoryId;
  /** Escena 3D en pantallas horizontales. */
  wide: [number, number, number];
  /** Escena 3D en pantallas verticales (móvil): más compacta en X. */
  tall: [number, number, number];
  /** Universo 2D, porcentajes [left, top]. */
  flat: [number, number];
  /** Universo 2D en contenedores verticales (móvil). */
  flatTall: [number, number];
  /** Escala relativa de la isla. */
  scale: number;
}

export const ISLAND_LAYOUT: IslandLayout[] = [
  { id: 'cyber', wide: [-4.4, 3.0, -1.4], tall: [-2.6, 4.9, -1.2], flat: [22, 18], flatTall: [25, 12], scale: 1.05 },
  { id: 'ai', wide: [3.9, 3.2, -1.8], tall: [2.6, 4.6, -1.6], flat: [76, 16], flatTall: [75, 13], scale: 1.05 },
  { id: 'drones', wide: [6.6, 0.9, -0.8], tall: [3.3, 1.6, -0.6], flat: [90, 46], flatTall: [85, 42], scale: 0.9 },
  { id: 'web', wide: [-6.4, 0.9, -0.4], tall: [-3.3, 1.2, -0.2], flat: [11, 47], flatTall: [15, 44], scale: 0.95 },
  { id: 'hardware', wide: [5.8, -2.3, 0.8], tall: [3.0, -3.0, 0.6], flat: [84, 76], flatTall: [80, 75], scale: 0.9 },
  { id: 'automation', wide: [-5.2, -2.5, 1.0], tall: [-3.0, -3.3, 0.8], flat: [17, 77], flatTall: [20, 76], scale: 0.9 },
  { id: 'content', wide: [0.4, -3.8, 2.0], tall: [0.0, -5.4, 1.6], flat: [50, 87], flatTall: [50, 89], scale: 0.85 },
];

export const PLANET_RADIUS = 2.25;
