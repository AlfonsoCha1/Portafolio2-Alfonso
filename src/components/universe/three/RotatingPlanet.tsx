'use client';

import { Billboard, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { AC_PATH } from '@/components/ui/ac-path';
import { PLANET_RADIUS } from '../layout';
import { atmosphereFragment, atmosphereVertex, holoFragment, holoVertex, planetFragment, planetVertex } from './shaders';
import { getGlowTexture } from './textures';

interface Props {
  light: boolean;
  speed: number;
  segments: number;
  portraitUrl: string;
  /** Color de la isla bajo el cursor: tiñe los anillos. */
  accent: string | null;
}

/** Planeta central: rotación continua, atmósfera, anillos de energía, retrato holográfico y monograma AC. */
export function RotatingPlanet({ light, speed, segments, portraitUrl, accent }: Props) {
  const planetRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const portraitRingRef = useRef<THREE.Group>(null);
  const logoRef = useRef<THREE.Group>(null);
  const beadsRef = useRef<THREE.Group>(null);

  const planetMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: planetVertex,
        fragmentShader: planetFragment,
        uniforms: {
          uTime: { value: 0 },
          uLight: { value: 0 },
          uSunDir: { value: new THREE.Vector3(-0.55, 0.5, 0.75).normalize() },
        },
      }),
    [],
  );

  const atmosphereMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: atmosphereVertex,
        fragmentShader: atmosphereFragment,
        uniforms: {
          uColorA: { value: new THREE.Color('#9D35FF') },
          uColorB: { value: new THREE.Color('#00E5FF') },
          uIntensity: { value: 1.2 },
        },
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    [],
  );

  const portrait = useTexture(portraitUrl);
  useEffect(() => {
    portrait.colorSpace = THREE.NoColorSpace;
    portrait.anisotropy = 4;
    portrait.needsUpdate = true;
  }, [portrait]);

  const holoMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: holoVertex,
        fragmentShader: holoFragment,
        uniforms: { uMap: { value: portrait }, uTime: { value: 0 }, uReveal: { value: 0 } },
        transparent: true,
        depthWrite: false,
      }),
    [portrait],
  );

  // Monograma AC extruido a partir del trazo del favicon.
  const logoGeometry = useMemo(() => {
    const loader = new SVGLoader();
    const data = loader.parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${AC_PATH}"/></svg>`);
    const shapes = data.paths.flatMap((p) => p.toShapes());
    const geo = new THREE.ExtrudeGeometry(shapes, { depth: 26, bevelEnabled: true, bevelThickness: 5, bevelSize: 3, bevelSegments: 2, curveSegments: 10 });
    geo.center();
    geo.scale(0.0042, -0.0042, 0.0042);
    // Degradado neón por vértice (rosa → violeta → azul → cian)
    geo.computeBoundingBox();
    const bb = geo.boundingBox ?? new THREE.Box3();
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const stops = ['#FF39C6', '#9D35FF', '#147DFF', '#00E5FF'].map((c) => new THREE.Color(c));
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const t = (pos.getX(i) - bb.min.x) / Math.max(1e-6, bb.max.x - bb.min.x);
      const seg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
      const local = t * (stops.length - 1) - seg;
      tmp.copy(stops[seg] as THREE.Color).lerp(stops[seg + 1] as THREE.Color, local);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  const glow = useMemo(() => getGlowTexture(), []);
  const ringColorA = useMemo(() => new THREE.Color('#00E5FF'), []);
  const ringColorB = useMemo(() => new THREE.Color('#9D35FF'), []);
  const ringMatA = useRef<THREE.MeshBasicMaterial>(null);
  const targetColor = useMemo(() => new THREE.Color(), []);

  useEffect(() => {
    planetMat.uniforms.uLight!.value = light ? 1 : 0;
    atmosphereMat.uniforms.uIntensity!.value = light ? 0.75 : 1.25;
  }, [light, planetMat, atmosphereMat]);

  useEffect(
    () => () => {
      planetMat.dispose();
      atmosphereMat.dispose();
      holoMat.dispose();
      logoGeometry.dispose();
    },
    [planetMat, atmosphereMat, holoMat, logoGeometry],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.5);
    planetMat.uniforms.uTime!.value = t;
    holoMat.uniforms.uTime!.value = t;
    const reveal = holoMat.uniforms.uReveal!;
    reveal.value = Math.min(1, reveal.value + d * 0.8);
    if (planetRef.current) planetRef.current.rotation.y += d * 0.09 * speed;
    if (ringsRef.current) {
      ringsRef.current.children[0]!.rotation.z += d * 0.12 * speed;
      ringsRef.current.children[1]!.rotation.z -= d * 0.08 * speed;
    }
    if (portraitRingRef.current) {
      portraitRingRef.current.children[0]!.rotation.z += d * 0.5 * speed;
      portraitRingRef.current.children[1]!.rotation.z -= d * 0.35 * speed;
    }
    if (logoRef.current) {
      logoRef.current.rotation.y = Math.sin(t * 0.5 * speed) * 0.45;
      logoRef.current.position.y = PLANET_RADIUS + 1.3 + Math.sin(t * 1.2 * speed) * 0.06;
    }
    if (beadsRef.current) beadsRef.current.rotation.y += d * 0.35 * speed;
    if (ringMatA.current) {
      targetColor.set(accent ?? '#00E5FF');
      ringMatA.current.color.lerp(targetColor, Math.min(1, d * 4));
    }
  });

  const R = PLANET_RADIUS;
  const glowBlend = light ? THREE.NormalBlending : THREE.AdditiveBlending;

  return (
    <group>
      {/* Halo trasero */}
      <sprite scale={[R * 4.6, R * 4.6, 1]} position={[0, 0, -0.5]}>
        <spriteMaterial map={glow} color={light ? '#b98cff' : '#6a2bd9'} transparent opacity={light ? 0.35 : 0.55} depthWrite={false} blending={glowBlend} />
      </sprite>

      <mesh ref={planetRef} material={planetMat}>
        <sphereGeometry args={[R, segments, segments]} />
      </mesh>
      <mesh material={atmosphereMat} scale={1.16}>
        <sphereGeometry args={[R, 48, 48]} />
      </mesh>

      {/* Anillos de energía */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.35, 0.25, 0]}>
          <torusGeometry args={[R * 1.48, 0.014, 8, 220]} />
          <meshBasicMaterial ref={ringMatA} color={ringColorA} transparent opacity={0.85} blending={glowBlend} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh rotation={[Math.PI / 1.85, -0.35, 0]}>
          <torusGeometry args={[R * 1.66, 0.01, 8, 220]} />
          <meshBasicMaterial color={ringColorB} transparent opacity={0.7} blending={glowBlend} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      {/* Partículas de energía en órbita */}
      <group ref={beadsRef} rotation={[0.42, 0, 0.18]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <sprite key={i} position={[Math.cos(a) * R * 1.48, 0, Math.sin(a) * R * 1.48]} scale={[0.32, 0.32, 1]}>
              <spriteMaterial map={glow} color={i % 2 ? '#FF39C6' : '#00E5FF'} transparent depthWrite={false} blending={glowBlend} />
            </sprite>
          );
        })}
      </group>

      {/* Retrato holográfico de Alfonso dentro del mundo */}
      <Billboard position={[0, 0, R + 0.32]}>
        <sprite scale={[3.3, 3.3, 1]} position={[0, 0, -0.05]}>
          <spriteMaterial map={glow} color={light ? '#7b5cff' : '#00c8ff'} transparent opacity={light ? 0.35 : 0.5} depthWrite={false} blending={glowBlend} />
        </sprite>
        <mesh material={holoMat} renderOrder={5}>
          <planeGeometry args={[2.1, 2.1]} />
        </mesh>
        <group ref={portraitRingRef}>
          <mesh renderOrder={6}>
            <torusGeometry args={[1.1, 0.022, 8, 120, Math.PI * 1.55]} />
            <meshBasicMaterial color="#00E5FF" transparent opacity={0.95} toneMapped={false} depthWrite={false} />
          </mesh>
          <mesh renderOrder={6}>
            <torusGeometry args={[1.2, 0.012, 8, 120, Math.PI * 1.1]} />
            <meshBasicMaterial color="#FF39C6" transparent opacity={0.9} toneMapped={false} depthWrite={false} />
          </mesh>
        </group>
      </Billboard>

      {/* Monograma AC flotando sobre el planeta */}
      <group ref={logoRef} position={[0, R + 1.3, 0]}>
        <mesh geometry={logoGeometry}>
          <meshBasicMaterial vertexColors toneMapped={false} />
        </mesh>
        <sprite scale={[2.4, 1.6, 1]} position={[0, 0, -0.2]}>
          <spriteMaterial map={glow} color="#9D35FF" transparent opacity={light ? 0.25 : 0.45} depthWrite={false} blending={glowBlend} />
        </sprite>
      </group>
    </group>
  );
}
