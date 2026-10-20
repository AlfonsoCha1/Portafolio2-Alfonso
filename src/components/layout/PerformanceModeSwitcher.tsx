'use client';

import { Box, Layers, Pause, Play } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { usePreferences } from '@/components/providers/AppProvider';

/** Selector Modo 3D | Modo ligero 2D, más pausa de animaciones. Siempre accesible. */
export function PerformanceModeSwitcher({ compact = false, showMotion = true }: { compact?: boolean; showMotion?: boolean }) {
  const t = useTranslations('controls');
  const { renderMode, setRenderMode, webglAvailable, motionPaused, toggleMotion } = usePreferences();

  return (
    <div className="flex items-center gap-2">
      <div role="group" aria-label={t('mode')} className="glass inline-flex h-11 items-center rounded-xl p-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setRenderMode('3d')}
          disabled={!webglAvailable}
          aria-pressed={renderMode === '3d'}
          aria-label={t('mode3dLabel')}
          title={t('mode3dLabel')}
          data-testid="mode-3d"
          className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
            renderMode === '3d' ? 'bg-gradient-to-r from-cyan/90 to-blue text-night' : 'text-muted hover:text-fg'
          }`}
        >
          <Box className="h-4 w-4" aria-hidden="true" />
          {compact ? null : <span>{t('mode3d')}</span>}
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('2d')}
          aria-pressed={renderMode === '2d'}
          aria-label={t('mode2dLabel')}
          title={t('mode2dLabel')}
          data-testid="mode-2d"
          className={`inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 transition-colors ${
            renderMode === '2d' ? 'bg-gradient-to-r from-pink to-violet text-white' : 'text-muted hover:text-fg'
          }`}
        >
          <Layers className="h-4 w-4" aria-hidden="true" />
          {compact ? null : <span>{t('mode2d')}</span>}
        </button>
      </div>
      {showMotion ? (
        <button
          type="button"
          onClick={toggleMotion}
          className="icon-btn"
          aria-pressed={motionPaused}
          aria-label={motionPaused ? t('motionResume') : t('motionPause')}
          title={motionPaused ? t('motionResume') : t('motionPause')}
          data-testid="motion-toggle"
        >
          {motionPaused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
        </button>
      ) : null}
    </div>
  );
}
