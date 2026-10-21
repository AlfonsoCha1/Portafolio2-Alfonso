'use client';

import { AdaptiveEvents, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import type { CategoryId } from '@/data/types';
import { QUALITY_PRESETS, type QualityTier } from '@/lib/capabilities';
import { ISLAND_LAYOUT } from '../layout';
import { EnergyPath } from './EnergyPath';
import { DataFleet } from './Fleet';
import { FloatingIsland, type IslandInfo } from './FloatingIsland';
import { RotatingPlanet } from './RotatingPlanet';
import { Sparkles, StarField } from './StarField';

export interface UniverseSceneProps {
  islands: IslandInfo[];
  light: boolean;
  quality: QualityTier;
  reducedMotion: boolean;
  /** false = se detiene el ciclo de render (fuera de pantalla o animaciones en pausa). */
  active: boolean;
  hovered: CategoryId | null;
  focused: CategoryId | null;
  portraitUrl: string;
  onHover: (id: CategoryId | null) => void;
  onSelect: (id: CategoryId) => void;
  onReady?: () => void;
  /** 'fallback' = el 3D falló (contexto perdido); 'slow' = va demasiado lento incluso en calidad baja. */
  onQualityDrop?: (q: QualityTier | 'fallback' | 'slow') => void;
  /** Deja espacio a la izquierda para el texto del hero en pantallas anchas. */
  leftPanel: boolean;
}

const tmpTarget = new THREE.Vector3();
const tmpLook = new THREE.Vector3();

const TAN_HALF_FOV = Math.tan(THREE.MathUtils.degToRad(21));

function CameraRig({
  focusPoint,
  tall,
  reducedMotion,
  leftPanel,
}: {
  focusPoint: THREE.Vector3 | null;
  tall: boolean;
  reducedMotion: boolean;
  leftPanel: boolean;
}) {
  const look = useRef(new THREE.Vector3(0, 0, 0));
  useFrame((state, delta) => {
    const d = Math.min(delta, 0.5);
    const cam = state.camera;
    const px = reducedMotion ? 0 : state.pointer.x;
    const py = reducedMotion ? 0 : state.pointer.y;
    if (focusPoint) {
      tmpTarget.set(focusPoint.x * 1.05, focusPoint.y + 1.0, focusPoint.z + (tall ? 7.5 : 5.6));
      tmpLook.copy(focusPoint);
    } else {
      // Distancia según la proporción de la pantalla para que todas las islas quepan.
      const aspect = state.size.width / Math.max(1, state.size.height);
      const halfWidth = tall ? 4.7 : leftPanel ? 10.2 : 8.6;
      const baseZ = Math.max(tall ? 21 : 17.5, halfWidth / (TAN_HALF_FOV * aspect));
      tmpTarget.set(px * 0.9, (tall ? 0.2 : 1.6) + py * 0.55, Math.min(baseZ, 30));
      tmpLook.set(px * 0.25, tall ? 0 : 0.2, 0);
    }
    const lambda = reducedMotion ? 12 : focusPoint ? 2.6 : 2;
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tmpTarget.x, lambda, d);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, tmpTarget.y, lambda, d);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tmpTarget.z, lambda, d);
    look.current.x = THREE.MathUtils.damp(look.current.x, tmpLook.x, lambda, d);
    look.current.y = THREE.MathUtils.damp(look.current.y, tmpLook.y, lambda, d);
    look.current.z = THREE.MathUtils.damp(look.current.z, tmpLook.z, lambda, d);
    cam.lookAt(look.current);
  });
  return null;
}

function SceneContent(props: UniverseSceneProps & { preset: (typeof QUALITY_PRESETS)[QualityTier] }) {
  const { islands, light, reducedMotion, hovered, focused, portraitUrl, onHover, onSelect, preset, leftPanel } = props;
  const size = useThree((s) => s.size);
  const tall = size.width / Math.max(1, size.height) < 1;
  const speed = reducedMotion ? 0.15 : 1;
  const offsetX = leftPanel && !tall ? 3.6 : 0;
  const sceneScale = leftPanel && !tall ? 0.82 : 1;

  const layout = useMemo(
    () =>
      ISLAND_LAYOUT.map((l) => ({
        ...l,
        pos: (tall ? l.tall : l.wide) as [number, number, number],
      })),
    [tall],
  );

  const focusPoint = useMemo(() => {
    if (!focused) return null;
    const l = layout.find((x) => x.id === focused);
    if (!l) return null;
    return new THREE.Vector3(l.pos[0] * sceneScale + offsetX, l.pos[1] * sceneScale, l.pos[2] * sceneScale);
  }, [focused, layout, offsetX, sceneScale]);

  const accent = hovered ? (islands.find((i) => i.id === hovered)?.color ?? null) : null;

  return (
    <>
      <ambientLight intensity={light ? 1.1 : 0.8} />
      <hemisphereLight args={['#b9a6ff', '#0b1033', light ? 1.2 : 0.9]} />
      <directionalLight position={[-6, 8, 6]} intensity={light ? 1.6 : 1.3} color="#ffffff" />
      <pointLight position={[0, 0, 4]} intensity={light ? 6 : 10} distance={14} color="#9D35FF" />
      <pointLight position={[6, -3, 3]} intensity={light ? 4 : 7} distance={14} color="#00E5FF" />
      <pointLight position={[-6, -3, 3]} intensity={light ? 3 : 6} distance={14} color="#FF39C6" />

      <StarField count={preset.stars} light={light} speed={speed} />

      <group position={[offsetX, 0, 0]} scale={sceneScale}>
        <Suspense fallback={null}>
          <RotatingPlanet light={light} speed={speed} segments={preset.segments} portraitUrl={portraitUrl} accent={accent} />
        </Suspense>
        <Sparkles count={preset.particles} light={light} />
        {layout.map((l) => {
          const info = islands.find((i) => i.id === l.id);
          if (!info) return null;
          return (
            <group key={l.id}>
              <EnergyPath to={l.pos} color={info.color} active={hovered === l.id || focused === l.id} light={light} speed={speed} />
              <FloatingIsland
                info={info}
                position={l.pos}
                scale={l.scale}
                hovered={hovered === l.id || focused === l.id}
                dimmed={Boolean((hovered && hovered !== l.id) || (focused && focused !== l.id))}
                light={light}
                speed={speed}
                showLabel={!focused}
                compactLabel
                onHover={onHover}
                onSelect={onSelect}
              />
            </group>
          );
        })}
        <DataFleet count={preset.packets} light={light} speed={speed} />
      </group>

      <CameraRig focusPoint={focusPoint} tall={tall} reducedMotion={reducedMotion} leftPanel={leftPanel && !tall} />
    </>
  );
}

/**
 * Detecta un 3D realmente inutilizable (por ejemplo, render por software): menos de 12 fps
 * de promedio durante ~12 s seguidos en calidad baja. Solo se monta mientras el universo está activo.
 */
function SlowGuard({ onSlow }: { onSlow: () => void }) {
  const acc = useRef({ frames: 0, time: 0, strikes: 0, skip: 3 });
  useFrame((_, delta) => {
    const a = acc.current;
    if (a.skip > 0) {
      a.skip -= 1; // los primeros cuadros tras reanudar traen deltas grandes
      return;
    }
    a.frames += 1;
    a.time += Math.min(delta, 2);
    if (a.time < 4) return;
    const fps = a.frames / a.time;
    a.strikes = fps < 12 ? a.strikes + 1 : 0;
    a.frames = 0;
    a.time = 0;
    if (a.strikes >= 3) {
      a.strikes = 0;
      onSlow();
    }
  });
  return null;
}

export default function UniverseScene(props: UniverseSceneProps) {
  const [tier, setTier] = useState<QualityTier>(props.quality);
  const preset = QUALITY_PRESETS[tier];
  const [dpr, setDpr] = useState(preset.dpr[1]);

  // Solo se baja la calidad cuando el equipo va lento de verdad (< 30 fps sostenidos).
  // Nunca se cambia a 2D por variaciones normales de fps (pantallas de 120/144 Hz, GPU integrada, etc.).
  const decline = () => {
    if (tier === 'high') {
      setTier('medium');
      setDpr(QUALITY_PRESETS.medium.dpr[1]);
      props.onQualityDrop?.('medium');
    } else if (tier === 'medium') {
      setTier('low');
      setDpr(QUALITY_PRESETS.low.dpr[1]);
      props.onQualityDrop?.('low');
    } else {
      setDpr(QUALITY_PRESETS.low.dpr[0]);
    }
  };

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={dpr}
      frameloop={props.active ? 'always' : 'demand'}
      camera={{ fov: 42, position: [0, 1.6, 17.5], near: 0.1, far: 220 }}
      gl={{ antialias: tier !== 'low', alpha: true, powerPreference: 'high-performance', stencil: false }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        // Si el navegador pierde el contexto WebGL (cambio de GPU, suspensión, muchas pestañas),
        // se espera a que lo recupere; solo si no vuelve en 6 s se pasa al modo 2D.
        let lostTimer: number | undefined;
        gl.domElement.addEventListener('webglcontextlost', (e) => {
          e.preventDefault();
          window.clearTimeout(lostTimer);
          lostTimer = window.setTimeout(() => props.onQualityDrop?.('fallback'), 6000);
        });
        gl.domElement.addEventListener('webglcontextrestored', () => window.clearTimeout(lostTimer));
        props.onReady?.();
      }}
      onPointerMissed={() => props.onHover(null)}
      aria-hidden="true"
    >
      {/* El monitor solo mide mientras el universo está en pantalla: fuera de ella no hay cuadros y daría lecturas falsas. */}
      {props.active ? <PerformanceMonitor bounds={() => [30, 1000]} onDecline={decline} /> : null}
      {props.active && tier === 'low' ? <SlowGuard onSlow={() => props.onQualityDrop?.('slow')} /> : null}
      <AdaptiveEvents />
      <SceneContent {...props} preset={preset} />
    </Canvas>
  );
}
