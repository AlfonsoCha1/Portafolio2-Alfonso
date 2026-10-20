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
  kind: 'packet' | 'lock';
}

/**
 * Paquetes de datos y candados que recorren órbitas alrededor del universo
 * (representan tráfico de red protegido: redes, soporte y ciberseguridad).
 */
export function DataFleet({ count, light, speed }: { count: number; light: boolean; speed: number }) {
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
      kind: i % 2 ? 'lock' : 'packet',
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
          {o.kind === 'packet' ? (
            <group>
              {/* Paquete de datos: cubo con aristas de neón y núcleo brillante */}
              <mesh>
                <boxGeometry args={[0.26, 0.26, 0.26]} />
                <meshStandardMaterial color={light ? '#3a3f7a' : '#1b2150'} metalness={0.5} roughness={0.35} transparent opacity={0.85} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.27, 0.27, 0.27]} />
                <meshBasicMaterial color={o.color} wireframe toneMapped={false} />
              </mesh>
              <mesh>
                <boxGeometry args={[0.1, 0.1, 0.1]} />
                <meshBasicMaterial color={o.color} toneMapped={false} />
              </mesh>
            </group>
          ) : (
            <group>
              {/* Candado: cuerpo + arco */}
              <mesh position={[0, -0.04, 0]}>
                <boxGeometry args={[0.26, 0.2, 0.1]} />
                <meshStandardMaterial color={light ? '#3a3f7a' : '#232a63'} metalness={0.6} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.07, 0]}>
                <torusGeometry args={[0.08, 0.022, 8, 16, Math.PI]} />
                <meshBasicMaterial color={o.color} toneMapped={false} />
              </mesh>
              <mesh position={[0, -0.04, 0.052]}>
                <circleGeometry args={[0.03, 12]} />
                <meshBasicMaterial color={o.color} toneMapped={false} />
              </mesh>
            </group>
          )}
          {/* Estela luminosa */}
          <sprite position={[0, 0, -0.32]} scale={[0.5, 0.5, 1]}>
            <spriteMaterial map={glow} color={o.color} transparent depthWrite={false} blending={light ? THREE.NormalBlending : THREE.AdditiveBlending} />
          </sprite>
        </group>
      ))}
    </group>
  );
}
