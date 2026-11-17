'use client';

import { Badge } from '../Badge/Badge.web';
import { Surface } from '../Surface/Surface.web';
import { useControllableState } from '../utils/useControllableState';
import type { TabBarProps } from './TabBar.shared';

/** A floating glass bar of icons for an app's main sections. A raised pill springs to the one you're on */
export function TabBar({ items, value, defaultValue, onValueChange, accessibilityLabel = 'Main', testID }: TabBarProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const index = items.findIndex((item) => item.value === selected);
  return (
    <Surface variant="glass" radius="full" padding="xs" testID={testID}>
      <nav className="ds-tabbar" aria-label={accessibilityLabel} style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {index >= 0 && <span className="ds-tabbar__indicator" aria-hidden="true" style={{ width: `calc(100% / ${items.length})`, transform: `translateX(${index * 100}%)` }} />}
        {items.map((item, position) => (
          <button
            key={item.value}
            type="button"
            className="ds-tabbar__item ds-press ds-press--object"
            // The count joins the name ("Pay, 2 new"); the badge itself is hidden so it isn't read twice
            aria-label={item.badge ? `${item.label}, ${item.badge} new` : undefined}
            aria-current={position === index ? 'page' : undefined}
            onClick={() => setSelected(item.value)}
          >
            <span className="ds-tabbar__icon">
              {item.icon('currentColor')}
              {item.badge ? (
                <span className="ds-tabbar__badge" aria-hidden="true">
                  <Badge count={item.badge} />
                </span>
              ) : null}
            </span>
            <span className="ds-tabbar__label">{item.label}</span>
          </button>
        ))}
      </nav>
    </Surface>
  );
}
