import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // Escena Three.js: los materiales y geometrías son recursos imperativos que se mutan
    // cuadro a cuadro dentro de useFrame (patrón estándar de React Three Fiber).
    files: ['src/components/universe/three/**/*.tsx'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/purity': 'off',
    },
  },
  {
    ignores: ['.next/**', 'node_modules/**', 'playwright-report/**', 'test-results/**', 'next-env.d.ts', 'docs/capturas/**'],
  },
];

export default config;
