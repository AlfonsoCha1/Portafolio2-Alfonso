import * as THREE from 'three';

/** Texturas generadas en código (sin descargas): brillo radial y pantallas. */
let glowTexture: THREE.Texture | null = null;

export function getGlowTexture(): THREE.Texture {
  if (glowTexture) return glowTexture;
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  glowTexture = new THREE.CanvasTexture(canvas);
  return glowTexture;
}

const screenCache = new Map<string, THREE.Texture>();

/** Pantalla con "líneas de código" del color de la categoría. */
export function getScreenTexture(color: string, variant: 'code' | 'play' | 'chart' = 'code'): THREE.Texture {
  const key = `${color}-${variant}`;
  const cached = screenCache.get(key);
  if (cached) return cached;
  const w = 256;
  const h = 160;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#070b22';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    if (variant === 'code') {
      const widths = [140, 90, 180, 120, 60, 160, 100, 130];
      widths.forEach((lw, i) => {
        ctx.fillStyle = i % 3 === 0 ? color : i % 3 === 1 ? '#7cf3ff' : '#c79bff';
        ctx.globalAlpha = 0.85;
        ctx.fillRect(18 + (i % 2) * 16, 18 + i * 16, lw, 7);
      });
    } else if (variant === 'play') {
      ctx.globalAlpha = 1;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 22, h / 2 - 28);
      ctx.lineTo(w / 2 + 30, h / 2);
      ctx.lineTo(w / 2 - 22, h / 2 + 28);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.5;
      ctx.fillRect(20, h - 22, w - 40, 5);
      ctx.globalAlpha = 1;
      ctx.fillRect(20, h - 22, (w - 40) * 0.4, 5);
    } else {
      ctx.globalAlpha = 0.9;
      [50, 90, 70, 120, 100, 135].forEach((bh, i) => {
        ctx.fillStyle = i % 2 ? color : '#7cf3ff';
        ctx.fillRect(24 + i * 36, h - 18 - bh * 0.9, 22, bh * 0.9);
      });
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  screenCache.set(key, tex);
  return tex;
}
