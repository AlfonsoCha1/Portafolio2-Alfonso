/**
 * Shaders propios de la escena (GLSL). Ruido simplex 3D: Ian McEwan / Stefan Gustavson (MIT).
 */

export const SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+10.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
float fbm(vec3 p){
  float v = 0.0; float a = 0.5;
  for (int k = 0; k < 4; k++) { v += a * snoise(p); p *= 2.03; a *= 0.5; }
  return v;
}
`;

/* ───────────── Planeta tecnológico ───────────── */
export const planetVertex = /* glsl */ `
varying vec3 vObjNormal;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
void main(){
  vObjNormal = normalize(normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  vViewDir = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`;

export const planetFragment = /* glsl */ `
uniform float uTime;
uniform float uLight; // 0 = tema nocturno, 1 = tema claro
uniform vec3 uSunDir;
varying vec3 vObjNormal;
varying vec3 vWorldNormal;
varying vec3 vViewDir;
${SIMPLEX_3D}
void main(){
  vec3 n = normalize(vObjNormal);
  float h = fbm(n * 1.7 + vec3(3.1, 1.7, 0.4));
  float land = smoothstep(0.02, 0.09, h);
  float coast = smoothstep(0.0, 0.05, h) * (1.0 - smoothstep(0.05, 0.12, h));

  vec3 ocean = mix(vec3(0.03, 0.04, 0.16), vec3(0.06, 0.05, 0.26), smoothstep(-0.4, 0.1, h));
  vec3 ground = mix(vec3(0.13, 0.07, 0.34), vec3(0.24, 0.10, 0.48), smoothstep(0.1, 0.45, h));
  vec3 col = mix(ocean, ground, land);

  // Retícula de latitud / longitud (estética holográfica)
  float lat = asin(clamp(n.y, -1.0, 1.0));
  float lon = atan(n.z, n.x);
  float gx = abs(fract(lon * 18.0 / 6.2831853) - 0.5);
  float gy = abs(fract(lat * 9.0 / 3.1415926) - 0.5);
  float grid = (1.0 - smoothstep(0.0, 0.035, min(gx, gy)));
  col += grid * mix(vec3(0.0, 0.55, 0.8), vec3(0.45, 0.2, 0.9), land) * (0.18 + 0.25 * land);

  // Costas neón
  col += coast * vec3(0.0, 0.9, 1.0) * 0.55;

  // Luces de ciudades
  float cityN = snoise(n * 38.0);
  float city = smoothstep(0.62, 0.8, cityN) * land;
  vec3 cityCol = mix(vec3(1.0, 0.22, 0.78), vec3(0.0, 0.9, 1.0), step(0.5, fract(cityN * 7.0)));

  // Iluminación día / noche
  float diffuse = clamp(dot(normalize(vWorldNormal), normalize(uSunDir)), 0.0, 1.0);
  float night = 1.0 - smoothstep(0.0, 0.35, diffuse);
  col *= 0.55 + 0.75 * diffuse;
  col += city * cityCol * (0.35 + 1.2 * night);

  // Borde con brillo (fresnel)
  float fres = pow(1.0 - max(dot(normalize(vViewDir), normalize(vWorldNormal)), 0.0), 2.6);
  vec3 rim = mix(vec3(0.62, 0.21, 1.0), vec3(0.0, 0.9, 1.0), smoothstep(-0.6, 0.8, n.y));
  col += rim * fres * (1.25 - 0.35 * uLight);

  // Leve pulso de energía
  col += vec3(0.08, 0.02, 0.14) * (0.5 + 0.5 * sin(uTime * 0.8 + h * 12.0)) * land * 0.35;

  gl_FragColor = vec4(col, 1.0);
}
`;

/* ───────────── Atmósfera ───────────── */
export const atmosphereVertex = /* glsl */ `
varying vec3 vNormal;
varying vec3 vPos;
void main(){
  vNormal = normalize(normalMatrix * normal);
  vPos = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const atmosphereFragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uIntensity;
varying vec3 vNormal;
varying vec3 vPos;
void main(){
  float i = pow(clamp(0.78 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 2.4);
  vec3 col = mix(uColorA, uColorB, smoothstep(-1.0, 1.0, normalize(vPos).y));
  gl_FragColor = vec4(col, 1.0) * i * uIntensity;
}
`;

/* ───────────── Caminos de energía (tubos) ───────────── */
export const flowVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const flowFragment = /* glsl */ `
uniform vec3 uColor;
uniform float uTime;
uniform float uIntensity;
uniform float uSpeed;
varying vec2 vUv;
void main(){
  float along = vUv.x;
  float pulse = smoothstep(0.75, 1.0, fract(along * 4.0 - uTime * uSpeed));
  float base = 0.22 + 0.18 * uIntensity;
  float fade = smoothstep(0.0, 0.06, along) * smoothstep(1.0, 0.9, along);
  float a = (base + pulse * (0.75 + uIntensity)) * fade;
  gl_FragColor = vec4(uColor * (1.0 + pulse * 0.8 + uIntensity * 0.6), a);
}
`;

/* ───────────── Estrellas ───────────── */
export const starsVertex = /* glsl */ `
attribute float aSize;
attribute float aPhase;
attribute vec3 aColor;
uniform float uTime;
uniform float uPixelRatio;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (120.0 / -mv.z);
  vColor = aColor;
  vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aPhase) + aPhase * 6.2831);
}
`;

export const starsFragment = /* glsl */ `
uniform float uOpacity;
varying vec3 vColor;
varying float vTwinkle;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float a = smoothstep(0.5, 0.0, d);
  a *= a;
  gl_FragColor = vec4(vColor, a * vTwinkle * uOpacity);
}
`;

/* ───────────── Retrato holográfico ───────────── */
export const holoVertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const holoFragment = /* glsl */ `
uniform sampler2D uMap;
uniform float uTime;
uniform float uReveal;
varying vec2 vUv;
void main(){
  vec2 c = vUv - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  vec3 photo = texture2D(uMap, vUv).rgb;
  // Efectos discretos: no alteran la identidad de la persona.
  float scan = 0.035 * sin(vUv.y * 320.0 - uTime * 3.0);
  float sweep = smoothstep(0.08, 0.0, abs(fract(uTime * 0.12) * 1.6 - 0.3 - vUv.y)) * 0.18;
  vec3 tint = mix(vec3(0.0, 0.9, 1.0), vec3(0.62, 0.21, 1.0), vUv.y);
  vec3 col = photo * (1.0 + scan) + tint * sweep;
  float edge = smoothstep(0.43, 0.5, r);
  col = mix(col, tint * 1.4, edge * 0.85);
  float alpha = smoothstep(0.5, 0.485, r) * uReveal;
  gl_FragColor = vec4(col, alpha);
}
`;
