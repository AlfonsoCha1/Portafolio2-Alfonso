'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { PLANET_RADIUS } from '../layout';
import { flowFragment, flowVertex } from './shaders';

/** Camino de energía animado entre el planeta y una isla; se ilumina al seleccionar la isla. */
export function EnergyPath({ to, color, active, light, speed }: { to: [number, number, number]; color: string; active: boolean; light: boolean; speed: number }) {
  const geometry = useMemo(() => {
    const end = new THREE.Vector3(to[0], to[1] - 0.55, to[2]);
    const start = end.clone().normalize().multiplyScalar(PLANET_RADIUS * 1.02);
    const mid = start.clone().lerp(end, 0.5);
    const control = mid.clone().add(mid.clone().normalize().multiplyScalar(0.9)).add(new THREE.Vector3(0, 0.7, 0));
    const curve = new THREE.QuadraticBezierCurve3(start, control, end);
    return new THREE.TubeGeometry(curve, 72, 0.026, 6, false);
  }, [to]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: flowVertex,
        fragmentShader: flowFragment,
        uniforms: {
          uColor: { value: new THREE.Color(color) },
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uSpeed: { value: 0.45 },
        },
        transparent: true,
        depthWrite: false,
        blending: light ? THREE.NormalBlending : THREE.AdditiveBlending,
      }),
    [color, light],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state, delta) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime * speed;
    const u = material.uniforms.uIntensity!;
    u.value = THREE.MathUtils.damp(u.value, active ? 1 : 0, 5, Math.min(delta, 0.5));
    material.uniforms.uSpeed!.value = active ? 0.9 : 0.45;
  });

  return <mesh geometry={geometry} material={material} />;
}
