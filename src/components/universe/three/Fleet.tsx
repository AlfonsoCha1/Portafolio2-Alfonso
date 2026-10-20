'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { getGlowTexture } from './textures';

interface Orbit {
  rx: number;
  rz: number;
  y: number;
  tilt: number;
  speed: number;
  offset: number;
  color: string;
  kind: 'ship' | 'drone';
}

/** Pequeñas naves y drones que recorren órbitas alrededor del universo. */
export function Fleet({ count, light, speed }: { count: number; light: boolean; speed: number }) {
  const orbits = useMemo<Orbit[]>(() => {
    const colors = ['#00E5FF', '#FF943D', '#FF39C6', '#9D35FF', '#19E3B1', '#147DFF'];
    return Array.from({ length: count }).map((_, i) => ({
      rx: 6 + (i % 3) * 1.8,
      rz: 3.2 + (i % 2) * 1.4,
      y: -1.5 + (i * 1.3) % 4.2,
      tilt: ((i % 4) - 1.5) * 0.12,
      speed: (0.09 + (i % 3) * 0.035) * (i % 2 ? 1 : -1),
      offset: (i / Math.max(1, count)) * Math.PI * 2,
      color: colors[i % colors.length] as string,
      kind: i % 2 ? 'drone' : 'ship',
    }));
  }, [count]);

  const refs = useRef<(THREE.Group | null)[]>([]);
  const glow = useMemo(() => getGlowTexture(), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    orbits.forEach((o, i) => {
      const g = refs.current[i];
      if (!g) return;
      const a = t * o.speed * 2 + o.offset;
      const x = Math.cos(a) * o.rx;
      const z = Math.sin(a) * o.rz;
      const y = o.y + Math.sin(a * 2) * 0.3 + x * o.tilt;
      g.position.set(x, y, z);
      // Orientar en la dirección del movimiento
      const a2 = a + 0.05 * Math.sign(o.speed);
      tmp.set(Math.cos(a2) * o.rx, o.y + Math.sin(a2 * 2) * 0.3 + Math.cos(a2) * o.rx * o.tilt, Math.sin(a2) * o.rz);
      g.lookAt(tmp);
    });
  });

  return (
    <group>
      {orbits.map((o, i) => (
        <group key={i} ref={(el) => void (refs.current[i] = el)} scale={0.55}>
          {o.kind === 'ship' ? (
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh>
                <coneGeometry args={[0.12, 0.5, 6]} />
                <meshStandardMaterial color={light ? '#5b5f95' : '#c9d4ff'} metalness={0.7} roughness={0.25} />
              </mesh>
              <mesh position={[0, -0.08, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[0.04, 0.5, 0.12]} />
                <meshStandardMaterial color="#2b3266" metalness={0.6} roughness={0.3} />
              </mesh>
            </group>
          ) : (
            <group>
              <mesh>
                <boxGeometry args={[0.22, 0.06, 0.22]} />
                <meshStandardMaterial color="#2b3266" metalness={0.6} roughness={0.3} />
              </mesh>
              {([
                [-0.16, -0.16],
                [0.16, -0.16],
                [-0.16, 0.16],
                [0.16, 0.16],
              ] as [number, number][]).map(([x, z], j) => (
                <mesh key={j} position={[x, 0.04, z]}>
                  <cylinderGeometry args={[0.08, 0.08, 0.01, 10]} />
                  <meshBasicMaterial color={o.color} transparent opacity={0.8} toneMapped={false} />
                </mesh>
              ))}
            </group>
          )}
          {/* Propulsor luminoso */}
          <sprite position={[0, 0, -0.32]} scale={[0.5, 0.5, 1]}>
            <spriteMaterial map={glow} color={o.color} transparent depthWrite={false} blending={light ? THREE.NormalBlending : THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  );
}
