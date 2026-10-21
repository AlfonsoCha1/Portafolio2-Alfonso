'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { starsFragment, starsVertex } from './shaders';

/** Estrellas con parpadeo en un shader propio (una sola llamada de dibujo). */
export function StarField({ count, light, speed }: { count: number; light: boolean; speed: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const palette = ['#ffffff', '#bfe9ff', '#d7b8ff', '#7cf3ff', '#ffc2ee'].map((c) => new THREE.Color(c));
    let seed = 1337;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < count; i++) {
      const r = 30 + rand() * 60;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      pos[i * 3 + 2] = -Math.abs(r * Math.cos(phi)) - 8;
      size[i] = 1.2 + rand() * 3.4;
      phase[i] = rand();
      const c = palette[Math.floor(rand() * palette.length)] as THREE.Color;
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starsVertex,
        fragmentShader: starsFragment,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uOpacity: { value: 1 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    material.uniforms.uPixelRatio!.value = Math.min(dpr, 2);
    material.uniforms.uOpacity!.value = light ? 0 : 1;
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
  }, [dpr, light, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime * Math.max(speed, 0.2);
  });

  if (light) return null;
  return <points geometry={geometry} material={material} />;
}

/** Partículas flotantes alrededor del planeta (también visibles en tema claro). */
export function Sparkles({ count, light }: { count: number; light: boolean }) {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const size = new Float32Array(count);
    const phase = new Float32Array(count);
    const col = new Float32Array(count * 3);
    const palette = ['#9D35FF', '#00E5FF', '#FF39C6', '#147DFF'].map((c) => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
      const r = 3 + Math.random() * 7;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 7;
      pos[i * 3 + 2] = Math.sin(a) * r * 0.5;
      size[i] = 2 + Math.random() * 4;
      phase[i] = Math.random();
      const c = palette[i % palette.length] as THREE.Color;
      col.set([c.r, c.g, c.b], i * 3);
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
    return geo;
  }, [count]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: starsVertex,
        fragmentShader: starsFragment,
        uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, uOpacity: { value: 0.9 } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  );

  useEffect(() => {
    material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.uniforms.uOpacity!.value = light ? 0.75 : 0.9;
  }, [light, material]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame((state) => {
    material.uniforms.uTime!.value = state.clock.elapsedTime;
  });

  return <points geometry={geometry} material={material} rotation={[0, 0, 0]} />;
}
