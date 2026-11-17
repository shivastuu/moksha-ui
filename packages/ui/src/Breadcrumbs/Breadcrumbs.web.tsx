'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { visibleCrumbs, type BreadcrumbsProps, type Crumb } from './Breadcrumbs.shared';

/** Where you are: links up the path, and the current page last. A long middle folds behind "…" */
export function Breadcrumbs({ items, maxItems = 4, testID }: BreadcrumbsProps) {
  const [expanded, setExpanded] = useState(false);
  const firstHidden = useRef<HTMLElement>(null);
  const shown = visibleCrumbs(items, maxItems, expanded);

  // The "…" button disappears once pressed, so focus moves to the first item it revealed
  useEffect(() => {
    if (expanded) {
      firstHidden.current?.focus();
    }
  }, [expanded]);

  const crumb = (item: Crumb, index: number) => {
    if (index === items.length - 1) {
      return (
        <span className="ds-breadcrumbs__current" aria-current="page">
          {item.label}
        </span>
      );
    }
    const ref = expanded && index === 1 ? (element: HTMLElement | null) => void (firstHidden.current = element) : undefined;
    if (item.href) {
      return (
        <a ref={ref} className="ds-breadcrumbs__link" href={item.href} onClick={item.onPress}>
          {item.label}
        </a>
      );
    }
    return (
      <button ref={ref} type="button" className="ds-breadcrumbs__link" onClick={item.onPress}>
        {item.label}
      </button>
    );
  };

  return (
    <nav aria-label="Breadcrumb" data-testid={testID}>
      <ol className="ds-breadcrumbs__list">
        {shown.map((item, position) => {
          const index = item ? items.indexOf(item) : -1;
          return (
            <li key={item ? index : 'more'} className="ds-breadcrumbs__item">
              {position > 0 && <ChevronIcon className="ds-breadcrumbs__separator" />}
              {item ? (
                crumb(item, index)
              ) : (
                <button type="button" className="ds-breadcrumbs__more" aria-label="Show the full path" onClick={() => setExpanded(true)}>
                  …
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
