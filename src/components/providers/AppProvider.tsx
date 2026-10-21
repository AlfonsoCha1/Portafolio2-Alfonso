'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { isThemeMode, nextThemeMode, resolveTheme, type ResolvedTheme, type ThemeMode } from '@/lib/theme';
import { evaluateCapabilities, readDeviceSignals, type QualityTier, type RenderMode } from '@/lib/capabilities';
import { readStorage, STORAGE_KEYS, writeStorage } from '@/lib/storage';
import type { CategoryId } from '@/data/types';

interface Preferences {
  themeMode: ThemeMode;
  theme: ResolvedTheme;
  cycleTheme: () => ThemeMode;
  renderMode: RenderMode;
  setRenderMode: (m: RenderMode, persist?: boolean) => void;
  quality: QualityTier;
  setQuality: (q: QualityTier) => void;
  /** true cuando ya se leyó la preferencia/capacidad en el cliente. */
  ready: boolean;
  webglAvailable: boolean;
  reducedMotion: boolean;
  motionPaused: boolean;
  toggleMotion: () => void;
  nexbotHidden: boolean;
  setNexbotHidden: (v: boolean) => void;
}

interface UIState {
  terminalOpen: boolean;
  setTerminalOpen: (v: boolean) => void;
  activeModule: CategoryId | null;
  openModule: (id: CategoryId | null) => void;
  hoveredIsland: CategoryId | null;
  setHoveredIsland: (id: CategoryId | null) => void;
  activeSection: string;
  setActiveSection: (id: string) => void;
}

const PrefContext = createContext<Preferences | null>(null);
const UIContext = createContext<UIState | null>(null);

function currentPrefersDark() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
}

function applyTheme(mode: ThemeMode): ResolvedTheme {
  const resolved = resolveTheme(mode, Boolean(currentPrefersDark()), new Date().getHours());
  const root = document.documentElement;
  root.setAttribute('data-theme', resolved);
  root.setAttribute('data-theme-mode', mode);
  root.style.colorScheme = resolved;
  return resolved;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setTheme] = useState<ResolvedTheme>('dark');
  const [renderMode, setRenderModeState] = useState<RenderMode>('2d');
  const [quality, setQuality] = useState<QualityTier>('medium');
  const [ready, setReady] = useState(false);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const [nexbotHidden, setNexbotHiddenState] = useState(false);

  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<CategoryId | null>(null);
  const [hoveredIsland, setHoveredIsland] = useState<CategoryId | null>(null);
  const [activeSection, setActiveSection] = useState('inicio');

  // Lectura inicial de preferencias y capacidades (solo cliente).
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- sincronización inicial con el navegador */
    const storedTheme = readStorage(STORAGE_KEYS.theme);
    const mode = isThemeMode(storedTheme) ? storedTheme : 'system';
    setThemeMode(mode);
    setTheme(applyTheme(mode));

    const signals = readDeviceSignals();
    const caps = evaluateCapabilities(signals);
    setWebglAvailable(signals.webgl);
    setReducedMotion(Boolean(signals.reducedMotion));
    setQuality(caps.quality);
    const storedMode = readStorage(STORAGE_KEYS.mode);
    const mode3d = storedMode === '3d' || storedMode === '2d' ? storedMode : caps.recommended;
    setRenderModeState(signals.webgl ? mode3d : '2d');

    setMotionPaused(readStorage(STORAGE_KEYS.motion) === 'paused');
    setNexbotHiddenState(readStorage(STORAGE_KEYS.nexbot) === 'hidden');
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Reaccionar a cambios del sistema (modo automático) y de la hora (modo según la hora).
  useEffect(() => {
    if (!ready) return;
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onChange = () => setTheme(applyTheme(themeMode));
    mq?.addEventListener?.('change', onChange);
    const timer = themeMode === 'time' ? window.setInterval(onChange, 60_000) : undefined;
    return () => {
      mq?.removeEventListener?.('change', onChange);
      if (timer) window.clearInterval(timer);
    };
  }, [themeMode, ready]);

  useEffect(() => {
    document.documentElement.setAttribute('data-motion', motionPaused ? 'paused' : 'running');
  }, [motionPaused]);

  const cycleTheme = useCallback(() => {
    const next = nextThemeMode(themeMode);
    setThemeMode(next);
    writeStorage(STORAGE_KEYS.theme, next);
    setTheme(applyTheme(next));
    return next;
  }, [themeMode]);

  const setRenderMode = useCallback(
    (m: RenderMode, persist = true) => {
      const target = m === '3d' && !webglAvailable ? '2d' : m;
      setRenderModeState(target);
      if (persist) writeStorage(STORAGE_KEYS.mode, target);
    },
    [webglAvailable],
  );

  const toggleMotion = useCallback(() => {
    setMotionPaused((p) => {
      writeStorage(STORAGE_KEYS.motion, p ? null : 'paused');
      return !p;
    });
  }, []);

  const setNexbotHidden = useCallback((v: boolean) => {
    setNexbotHiddenState(v);
    writeStorage(STORAGE_KEYS.nexbot, v ? 'hidden' : null);
  }, []);

  const prefs = useMemo<Preferences>(
    () => ({
      themeMode,
      theme,
      cycleTheme,
      renderMode,
      setRenderMode,
      quality,
      setQuality,
      ready,
      webglAvailable,
      reducedMotion,
      motionPaused,
      toggleMotion,
      nexbotHidden,
      setNexbotHidden,
    }),
    [themeMode, theme, cycleTheme, renderMode, setRenderMode, quality, ready, webglAvailable, reducedMotion, motionPaused, toggleMotion, nexbotHidden, setNexbotHidden],
  );

  const ui = useMemo<UIState>(
    () => ({
      terminalOpen,
      setTerminalOpen,
      activeModule,
      openModule: setActiveModule,
      hoveredIsland,
      setHoveredIsland,
      activeSection,
      setActiveSection,
    }),
    [terminalOpen, activeModule, hoveredIsland, activeSection],
  );

  return (
    <PrefContext.Provider value={prefs}>
      <UIContext.Provider value={ui}>{children}</UIContext.Provider>
    </PrefContext.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(PrefContext);
  if (!ctx) throw new Error('usePreferences debe usarse dentro de <AppProvider>');
  return ctx;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI debe usarse dentro de <AppProvider>');
  return ctx;
}
