'use client';

import { Html } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import * as THREE from 'three';
import type { CategoryId } from '@/data/types';
import { getGlowTexture, getScreenTexture } from './textures';

export interface IslandInfo {
  id: CategoryId;
  name: string;
  tagline: string;
  description: string;
  color: string;
  color2: string;
  count: string;
  enterLabel: string;
}

interface Props {
  info: IslandInfo;
  position: [number, number, number];
  scale: number;
  hovered: boolean;
  dimmed: boolean;
  light: boolean;
  speed: number;
  showLabel: boolean;
  compactLabel: boolean;
  onHover: (id: CategoryId | null) => void;
  onSelect: (id: CategoryId) => void;
}

/** Roca flotante con forma irregular (cono invertido con ruido). */
function useRockGeometry(seed: number) {
  return useMemo(() => {
    const geo = new THREE.ConeGeometry(1.05, 1.5, 9, 4, false);
    geo.rotateX(Math.PI);
    geo.translate(0, -0.75, 0);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      if (v.y < -0.02) {
        const n = Math.sin(v.x * 3.1 + seed) * Math.cos(v.z * 2.7 + seed * 1.7) * 0.16 + Math.sin(v.y * 5 + seed) * 0.06;
        v.x *= 1 + n;
        v.z *= 1 + n;
        v.y += Math.sin(v.x * 4 + seed) * 0.05;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [seed]);
}

function Structure({ id, color, color2, speed }: { id: CategoryId; color: string; color2: string; speed: number }) {
  const spin = useRef<THREE.Group>(null);
  const rotors = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.5) * speed;
    if (spin.current) spin.current.rotation.y += d * 0.8;
    if (rotors.current) {
      rotors.current.children.forEach((drone, i) => {
        drone.position.y = 0.75 + Math.sin(state.clock.elapsedTime * 2 * speed + i * 2) * 0.08;
        drone.children.slice(1).forEach((r) => (r.rotation.y += d * 25));
      });
    }
  });

  const emissive = (c: string, i = 1.4) => (
    <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} toneMapped={false} />
  );

  switch (id) {
    case 'cyber':
      return (
        <group>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.16, 0.24, 0.9, 6]} />
            <meshStandardMaterial color="#1b2550" metalness={0.6} roughness={0.3} />
          </mesh>
          <group ref={spin} position={[0, 1.05, 0]}>
            <mesh>
              <octahedronGeometry args={[0.26, 0]} />
              {emissive(color, 2)}
            </mesh>
            <mesh>
              <icosahedronGeometry args={[0.5, 1]} />
              <meshBasicMaterial color={color} wireframe transparent opacity={0.35} toneMapped={false} />
            </mesh>
          </group>
          <mesh position={[0.5, 0.2, 0.25]}>
            <boxGeometry args={[0.22, 0.4, 0.22]} />
            <meshStandardMaterial color="#202c5c" metalness={0.5} roughness={0.35} />
          </mesh>
          <mesh position={[-0.45, 0.16, -0.2]}>
            <boxGeometry args={[0.2, 0.32, 0.2]} />
            <meshStandardMaterial color="#202c5c" metalness={0.5} roughness={0.35} />
          </mesh>
        </group>
      );
    case 'ai':
      return (
        <group>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.36, 0.44, 0.3, 8]} />
            <meshStandardMaterial color="#1d1a4d" metalness={0.6} roughness={0.3} />
          </mesh>
          <group ref={spin} position={[0, 0.85, 0]}>
            <mesh>
              <icosahedronGeometry args={[0.42, 1]} />
              <meshBasicMaterial color={color} wireframe toneMapped={false} />
            </mesh>
            <mesh>
              <sphereGeometry args={[0.24, 24, 24]} />
              {emissive(color2, 1.6)}
            </mesh>
          </group>
        </group>
      );
    case 'drones':
      return (
        <group>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.38, 0.5, 32]} />
            <meshBasicMaterial color={color} side={THREE.DoubleSide} toneMapped={false} />
          </mesh>
          <group ref={rotors}>
            {(
              [
                [-0.25, 0],
                [0.35, 0.3],
              ] as [number, number][]
            ).map(([x, z], i) => (
              <group key={i} position={[x, 0.75, z]} scale={0.9 - i * 0.2}>
                <mesh>
                  <boxGeometry args={[0.32, 0.08, 0.32]} />
                  <meshStandardMaterial color="#222a4d" metalness={0.6} roughness={0.3} />
                </mesh>
                {(
                  [
                    [-0.2, -0.2],
                    [0.2, -0.2],
                    [-0.2, 0.2],
                    [0.2, 0.2],
                  ] as [number, number][]
                ).map(([rx, rz], j) => (
                  <mesh key={j} position={[rx, 0.06, rz]}>
                    <cylinderGeometry args={[0.11, 0.11, 0.01, 12]} />
                    <meshBasicMaterial color={color} transparent opacity={0.7} toneMapped={false} />
                  </mesh>
                ))}
              </group>
            ))}
          </group>
        </group>
      );
    case 'web':
      return (
        <group ref={spin}>
          {[0, 1, 2].map((i) => {
            const a = (i / 3) * Math.PI * 2;
            return (
              <mesh key={i} position={[Math.cos(a) * 0.45, 0.6 + i * 0.12, Math.sin(a) * 0.45]} rotation={[0, -a + Math.PI / 2, 0]}>
                <planeGeometry args={[0.7, 0.44]} />
                <meshBasicMaterial map={getScreenTexture(i === 1 ? '#7cf3ff' : color, i === 2 ? 'chart' : 'code')} side={THREE.DoubleSide} toneMapped={false} />
              </mesh>
            );
          })}
        </group>
      );
    case 'automation':
      return (
        <group>
          <group ref={spin} position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <mesh>
              <torusGeometry args={[0.36, 0.09, 8, 10]} />
              {emissive(color, 1.2)}
            </mesh>
            {Array.from({ length: 8 }).map((_, i) => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0]} rotation={[0, 0, a]}>
                  <boxGeometry args={[0.16, 0.12, 0.12]} />
                  {emissive(color, 1.2)}
                </mesh>
              );
            })}
          </group>
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 0.5, 8]} />
            <meshStandardMaterial color="#1b2550" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );
    case 'hardware':
      return (
        <group>
          <mesh position={[0, 0.16, 0]}>
            <boxGeometry args={[0.7, 0.12, 0.7]} />
            <meshStandardMaterial color="#0f2f33" metalness={0.5} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.27, 0]}>
            <boxGeometry args={[0.36, 0.1, 0.36]} />
            {emissive(color, 1.1)}
          </mesh>
          {Array.from({ length: 12 }).map((_, i) => {
            const side = Math.floor(i / 3);
            const k = ((i % 3) - 1) * 0.18;
            const p: [number, number, number] =
              side === 0 ? [k, 0.24, 0.42] : side === 1 ? [k, 0.24, -0.42] : side === 2 ? [0.42, 0.24, k] : [-0.42, 0.24, k];
            return (
              <mesh key={i} position={p}>
                <boxGeometry args={[0.06, 0.04, 0.06]} />
                <meshBasicMaterial color={color2} toneMapped={false} />
              </mesh>
            );
          })}
          <group ref={spin} position={[0, 0.75, 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.32, 0.015, 6, 48]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          </group>
        </group>
      );
    case 'content':
    default:
      return (
        <group>
          <group ref={spin} position={[0, 0.6, 0]}>
            <mesh>
              <planeGeometry args={[0.9, 0.56]} />
              <meshBasicMaterial map={getScreenTexture(color, 'play')} side={THREE.DoubleSide} toneMapped={false} />
            </mesh>
          </group>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.05, 0.1, 0.4, 8]} />
            <meshStandardMaterial color="#2a1b4d" metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );
  }
}

/** Isla flotante interactiva: brillo, elevación, borde neón y panel holográfico al pasar el cursor. */
export function FloatingIsland({ info, position, scale, hovered, dimmed, light, speed, showLabel, compactLabel, onHover, onSelect }: Props) {
  const group = useRef<THREE.Group>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.SpriteMaterial>(null);
  const seed = useMemo(() => info.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 17, [info.id]);
  const rock = useRockGeometry(seed);
  const glow = useMemo(() => getGlowTexture(), []);
  const phase = seed * 0.37;

  useEffect(() => () => rock.dispose(), [rock]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.5);
    const lift = hovered ? 0.35 : 0;
    const bob = Math.sin(t * 0.8 * speed + phase) * 0.12 * Math.min(1, speed * 2);
    // Las islas emergen desde el planeta al cargar y se reacomodan suavemente al cambiar de diseño.
    g.position.x = THREE.MathUtils.damp(g.position.x, position[0], 2.2, d);
    g.position.z = THREE.MathUtils.damp(g.position.z, position[2], 2.2, d);
    g.position.y = THREE.MathUtils.damp(g.position.y, position[1] + bob + lift, 3, d);
    const s = scale * (hovered ? 1.1 : 1);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, s, 4, d));
    g.rotation.y += d * 0.06 * speed;
    if (rimMat.current) rimMat.current.opacity = THREE.MathUtils.damp(rimMat.current.opacity, hovered ? 1 : dimmed ? 0.35 : 0.7, 6, d);
    if (glowMat.current) glowMat.current.opacity = THREE.MathUtils.damp(glowMat.current.opacity, hovered ? 0.95 : dimmed ? 0.25 : 0.5, 6, d);
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(info.id);
    document.body.style.cursor = 'pointer';
  };
  const out = () => {
    onHover(null);
    document.body.style.cursor = '';
  };
  const click = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(info.id);
  };

  const rockColor = light ? '#5a5f9e' : '#3a3f7c';
  const topColor = light ? '#6a70b0' : '#454c95';
  const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <group ref={group} scale={0.001}>
      {/* Zona de toque amplia (invisible) para facilitar la selección en pantallas táctiles */}
      <mesh onPointerOver={over} onPointerOut={out} onClick={click} visible={false}>
        <sphereGeometry args={[1.45, 12, 12]} />
        <meshBasicMaterial />
      </mesh>

      <sprite scale={[3.6, 3.6, 1]} position={[0, -0.2, -0.3]}>
        <spriteMaterial ref={glowMat} map={glow} color={info.color} transparent opacity={0.5} depthWrite={false} blending={blend} />
      </sprite>

      <mesh geometry={rock}>
        <meshStandardMaterial color={rockColor} emissive="#140f3c" emissiveIntensity={0.6} roughness={0.8} metalness={0.1} flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[1.08, 1.05, 0.12, 24]} />
        <meshStandardMaterial color={topColor} emissive={info.color} emissiveIntensity={0.08} roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Borde neón animado */}
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.07, 0.03, 8, 64]} />
        <meshBasicMaterial ref={rimMat} color={info.color} transparent opacity={0.7} toneMapped={false} />
      </mesh>
      {/* Haz inferior */}
      <mesh position={[0, -1.7, 0]}>
        <coneGeometry args={[0.12, 0.6, 8]} />
        <meshBasicMaterial color={info.color} transparent opacity={0.6} toneMapped={false} />
      </mesh>

      <group position={[0, 0.08, 0]}>
        <Structure id={info.id} color={info.color} color2={info.color2} speed={speed} />
      </group>

      {showLabel ? (
        <Html position={[0, 1.75, 0]} center zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <IslandLabel info={info} hovered={hovered} compact={compactLabel} />
        </Html>
      ) : null}
    </group>
  );
}

function IslandLabel({ info, hovered, compact }: { info: IslandInfo; hovered: boolean; compact: boolean }): ReactNode {
  return (
    <div
      aria-hidden="true"
      className="select-none whitespace-nowrap transition-all duration-300"
      style={{ '--accent': info.color, transform: `scale(${hovered ? 1.06 : 1})`, opacity: compact && !hovered ? 0.85 : 1 } as React.CSSProperties}
    >
      <div
        className="glass-strong rounded-xl px-3 py-2 text-left"
        style={{
          borderColor: `color-mix(in srgb, ${info.color} ${hovered ? 80 : 35}%, transparent)`,
          boxShadow: hovered ? `0 0 30px -6px ${info.color}` : undefined,
        }}
      >
        <p className="flex items-center gap-2 font-display text-[11px] font-semibold tracking-tight text-fg sm:text-[13px]">
          <span className="h-2 w-2 rounded-full" style={{ background: info.color, boxShadow: `0 0 10px ${info.color}` }} />
          {info.name}
        </p>
        {!compact || hovered ? <p className="mt-0.5 font-mono text-[10px] text-muted">{info.tagline}</p> : null}
        {hovered ? (
          <div className="mt-1.5 max-w-[220px] whitespace-normal">
            <p className="text-[11px] leading-snug text-muted">{info.description}</p>
            <p className="mt-1.5 flex items-center justify-between gap-3 text-[11px] font-bold">
              <span className="text-dim">{info.count}</span>
              <span className="text-accent">{info.enterLabel} →</span>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
