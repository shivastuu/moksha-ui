'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import { useControllableState } from '../utils/useControllableState';
import { itemLabel, type SidebarProps } from './Sidebar.shared';

/** App navigation for wide screens: grouped rows, and a raised pill that springs to the page you're on */
export function Sidebar({ sections, value, defaultValue, onValueChange, header, footer, accessibilityLabel = 'Main', testID }: SidebarProps) {
  const first = sections[0]?.items[0]?.value ?? '';
  const [selected, setSelected] = useControllableState(value, defaultValue ?? first, onValueChange);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const [pill, setPill] = useState<{ top: number; height: number }>();
  const id = useId();

  // Measured, because section titles sit between the rows
  useLayoutEffect(() => {
    const row = rows.current.get(selected);
    setPill(row ? { top: row.offsetTop, height: row.offsetHeight } : undefined);
  }, [selected, sections]);

  return (
    <nav className="ds-sidebar" aria-label={accessibilityLabel} data-testid={testID}>
      {header}
      <div className="ds-sidebar__body">
        {pill && <span className="ds-sidebar__indicator" aria-hidden="true" style={{ height: pill.height, transform: `translateY(${pill.top}px)` }} />}
        {sections.map((section, index) => (
          <div key={section.title ?? index}>
            {section.title && (
              <p id={`${id}-${index}`} className="ds-sidebar__title">
                {section.title}
              </p>
            )}
            <ul className="ds-sidebar__list" aria-labelledby={section.title ? `${id}-${index}` : undefined}>
              {section.items.map((item) => (
                <li key={item.value}>
                  <button
                    ref={(element) => {
                      if (element) {
                        rows.current.set(item.value, element);
                      } else {
                        rows.current.delete(item.value);
                      }
                    }}
                    type="button"
                    className="ds-sidebar__item"
                    aria-label={item.count ? itemLabel(item) : undefined}
                    aria-current={item.value === selected ? 'page' : undefined}
                    onClick={() => setSelected(item.value)}
                  >
                    {item.icon && (
                      <span className="ds-sidebar__icon" aria-hidden="true">
                        {item.icon('currentColor')}
                      </span>
                    )}
                    <span className="ds-sidebar__label">{item.label}</span>
                    {item.count ? (
                      <span className="ds-sidebar__count" aria-hidden="true">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {footer}
    </nav>
  );
}
