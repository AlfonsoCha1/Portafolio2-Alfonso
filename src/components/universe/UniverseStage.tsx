'use client';

import dynamic from 'next/dynamic';
import { useLocale, useTranslations } from 'next-intl';
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { categories } from '@/data/categories';
import { projectsInCategory } from '@/data/projects';
import { profile } from '@/data/profile';
import type { CategoryId } from '@/data/types';
import { tx } from '@/lib/i18n';
import { readStorage, STORAGE_KEYS } from '@/lib/storage';
import { usePreferences, useUI } from '@/components/providers/AppProvider';
import { Universe2D } from './Universe2D';
import { IslandLabel } from './IslandLabel';
import type { IslandInfo } from './three/FloatingIsland';

// La escena 3D se carga aparte (code splitting) y solo en el cliente.
const UniverseScene = dynamic(() => import('./three/UniverseScene'), { ssr: false });

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    // Queda en la consola para poder diagnosticar si algún equipo falla de verdad.
    console.error('[CHAVATRIX] El 3D falló y se activó el modo 2D:', error);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/** Escenario del hero: universo 3D con degradación progresiva al modo 2D. */
export function UniverseStage() {
  const t = useTranslations('universe');
  const th = useTranslations('hero');
  const locale = useLocale();
  const prefs = usePreferences();
  const { hoveredIsland, setHoveredIsland, activeModule, openModule } = useUI();
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const [ready3d, setReady3d] = useState(false);
  // Etiquetas de las islas en el 3D: capa normal del DOM que la escena posiciona en cada cuadro.
  const labelEls = useRef<Partial<Record<CategoryId, HTMLDivElement | null>>>({});
  const [notice, setNotice] = useState<string | null>(null);
  const [leftPanel, setLeftPanel] = useState(false);

  const islands = useMemo<IslandInfo[]>(
    () =>
      categories.map((c) => ({
        id: c.id,
        name: tx(c.name, locale),
        tagline: tx(c.tagline, locale),
        description: tx(c.description, locale),
        color: c.color,
        color2: c.color2,
        count: t('projectsCount', { count: projectsInCategory(c.id).length }),
        enterLabel: t('enter'),
      })),
    [locale, t],
  );

  // Pausar el render cuando el universo no está en pantalla o la pestaña está oculta.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(Boolean(e?.isIntersecting)), { threshold: 0.02 });
    io.observe(el);
    const onVis = () => setPageVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);
    const mq = window.matchMedia('(min-width: 1024px)');
    const onMq = () => setLeftPanel(mq.matches);
    onMq();
    mq.addEventListener('change', onMq);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      mq.removeEventListener('change', onMq);
    };
  }, []);

  useEffect(() => {
    if (!notice) return;
    const id = window.setTimeout(() => setNotice(null), 5000);
    return () => window.clearTimeout(id);
  }, [notice]);

  const use3d = prefs.ready && prefs.renderMode === '3d' && prefs.webglAvailable;
  const select = (id: CategoryId) => openModule(id);

  // Al salir del 3D se reinicia "listo", para que al volver se vea el 2D mientras carga (sin parpadeos ni huecos).
  const [prevUse3d, setPrevUse3d] = useState(use3d);
  if (prevUse3d !== use3d) {
    setPrevUse3d(use3d);
    if (!use3d) setReady3d(false);
  }

  const fallbackTo2d = (reason: 'error' | 'slow' = 'error') => {
    prefs.setRenderMode('2d', false);
    setNotice(t(reason === 'slow' ? 'slowFallback' : 'webglError'));
  };
  const lowFpsShown = useRef(false);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0"
      role="region"
      aria-roledescription={th('universeTitle')}
      aria-label={th('universeDescription')}
      data-render-mode={use3d ? '3d' : '2d'}
    >
      {/* El modo 2D se muestra de inmediato (SSR) y mientras carga el 3D */}
      {!use3d || !ready3d ? (
        <div className={`absolute inset-0 transition-opacity duration-700 ${use3d ? 'pointer-events-none opacity-40' : 'opacity-100'}`}>
          <Universe2D
            islands={islands}
            hovered={hoveredIsland}
            onHover={setHoveredIsland}
            onSelect={select}
            portraitUrl={profile.photo.circle}
            portraitAlt={tx(profile.photo.alt, locale)}
            leftPanel={leftPanel}
          />
        </div>
      ) : null}

      {use3d ? (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready3d ? 'opacity-100' : 'opacity-0'}`} data-testid="universe-3d">
          <SceneBoundary onError={() => fallbackTo2d('error')}>
            <UniverseScene
              islands={islands}
              light={prefs.theme === 'light'}
              quality={prefs.quality}
              reducedMotion={prefs.reducedMotion}
              active={inView && pageVisible && !prefs.motionPaused}
              hovered={hoveredIsland}
              focused={activeModule}
              portraitUrl={profile.photo.circleTexture}
              onHover={setHoveredIsland}
              onSelect={select}
              onReady={() => setReady3d(true)}
              leftPanel={leftPanel}
              labelEls={labelEls}
              onQualityDrop={(q) => {
                if (q === 'fallback') fallbackTo2d('error');
                else if (q === 'slow') {
                  // Si la persona eligió 3D a mano, se respeta su elección.
                  if (readStorage(STORAGE_KEYS.mode) !== '3d') fallbackTo2d('slow');
                } else if (!lowFpsShown.current) {
                  lowFpsShown.current = true;
                  setNotice(t('lowFps'));
                }
              }}
            />
          </SceneBoundary>
        </div>
      ) : null}

      {use3d ? (
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-10 overflow-hidden transition-opacity duration-700 ${ready3d && !activeModule ? 'opacity-100' : 'opacity-0'}`} data-testid="island-labels-3d">
          {islands.map((info) => (
            <div
              key={info.id}
              ref={(el) => {
                labelEls.current[info.id] = el;
              }}
              className="absolute left-0 top-0 opacity-0 will-change-transform"
            >
              <IslandLabel info={info} hovered={hoveredIsland === info.id || activeModule === info.id} compact />
            </div>
          ))}
        </div>
      ) : null}

      {use3d && !ready3d ? (
        <p className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full glass px-4 py-2 font-mono text-xs text-muted" role="status">
          {t('loading')}
        </p>
      ) : null}

      <div aria-live="polite" className="pointer-events-none absolute inset-x-0 bottom-24 z-20 flex justify-center px-4">
        {notice ? <p className="glass-strong rounded-xl px-4 py-2 text-center text-xs font-semibold">{notice}</p> : null}
      </div>
    </div>
  );
}
