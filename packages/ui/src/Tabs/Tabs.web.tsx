'use client';

import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react';
import { nextIndex } from '../SegmentedControl/SegmentedControl.shared';
import { useControllableState } from '../utils/useControllableState';
import type { TabsProps } from './Tabs.shared';

/** Tabs with an underline that slides and resizes to the selected tab, on the theme's smooth spring */
export function Tabs({ items, value, defaultValue, onValueChange, accessibilityLabel, testID }: TabsProps) {
  const [selected, setSelected] = useControllableState(value, defaultValue ?? items[0]?.value ?? '', onValueChange);
  const index = items.findIndex((item) => item.value === selected);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [bar, setBar] = useState<{ left: number; width: number }>();
  const id = useId();

  // Measured, not computed: tab widths depend on the label and the loaded font
  useLayoutEffect(() => {
    const measure = () => {
      const tab = tabs.current[index];
      setBar(tab ? { left: tab.offsetLeft, width: tab.offsetWidth } : undefined);
    };
    measure();
    const observer = new ResizeObserver(measure);
    for (const tab of tabs.current) {
      if (tab) {
        observer.observe(tab);
      }
    }
    return () => observer.disconnect();
  }, [index, items.length]);

  const onKeyDown = (event: KeyboardEvent) => {
    const next = nextIndex(event.key, Math.max(index, 0), items.length);
    if (next === null) {
      return;
    }
    event.preventDefault();
    setSelected(items[next]!.value);
    tabs.current[next]?.focus();
  };

  return (
    <div className="ds-tabs" data-testid={testID}>
      <div className="ds-tabs__list" role="tablist" aria-label={accessibilityLabel} onKeyDown={onKeyDown}>
        {items.map((item, position) => (
          <button
            key={item.value}
            ref={(element) => {
              tabs.current[position] = element;
            }}
            id={`${id}-tab-${position}`}
            type="button"
            role="tab"
            className="ds-tabs__tab"
            aria-selected={position === index}
            aria-controls={position === index ? `${id}-panel` : undefined}
            tabIndex={position === Math.max(index, 0) ? 0 : -1}
            onClick={() => setSelected(item.value)}
          >
            {item.label}
          </button>
        ))}
        {bar && <span className="ds-tabs__indicator" aria-hidden="true" style={{ width: bar.width, transform: `translateX(${bar.left}px)` }} />}
      </div>
      {index >= 0 && (
        // Keyed so the new panel fades in
        <div key={selected} id={`${id}-panel`} role="tabpanel" className="ds-tabs__panel" aria-labelledby={`${id}-tab-${index}`} tabIndex={0}>
          {items[index]!.content}
        </div>
      )}
    </div>
  );
}
