'use client';

import { useLocale, useTranslations } from 'next-intl';
import { categories } from '@/data/categories';
import { projectsInCategory } from '@/data/projects';
import { tx } from '@/lib/i18n';
import { useUI } from '@/components/providers/AppProvider';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

/** Navegación accesible por las islas (teclado, toque y lectores de pantalla). */
export function IslandNavigator() {
  const t = useTranslations('hero');
  const tu = useTranslations('universe');
  const locale = useLocale();
  const { hoveredIsland, setHoveredIsland, openModule } = useUI();

  return (
    <nav aria-label={t('islandsLabel')} className="w-full">
      <ul className="scroll-thin -mx-1 flex gap-2 overflow-x-auto px-1 pb-2 pt-1 [scroll-snap-type:x_mandatory] lg:flex-wrap lg:overflow-visible">
        {categories.map((c) => {
          const count = projectsInCategory(c.id).length;
          const active = hoveredIsland === c.id;
          return (
            <li key={c.id} className="shrink-0 [scroll-snap-align:start]">
              <button
                type="button"
                onMouseEnter={() => setHoveredIsland(c.id)}
                onMouseLeave={() => setHoveredIsland(null)}
                onFocus={() => setHoveredIsland(c.id)}
                onBlur={() => setHoveredIsland(null)}
                onClick={() => openModule(c.id)}
                className={`glass flex min-h-[44px] items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 ${active ? '-translate-y-0.5' : ''}`}
                style={{
                  '--accent': c.color,
                  borderColor: active ? `${c.color}cc` : undefined,
                  boxShadow: active ? `0 0 24px -6px ${c.color}` : undefined,
                } as React.CSSProperties}
                aria-label={`${tx(c.name, locale)} — ${tu('projectsCount', { count })}`}
                data-testid={`island-nav-${c.id}`}
              >
                <CategoryIcon id={c.id} className="h-4 w-4 text-accent" />
                <span>{tx(c.short, locale)}</span>
                <span className="rounded-md bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] px-1.5 text-[10px] text-muted">{count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
