'use client';

import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { useControllableState } from '../utils/useControllableState';
import { pageItems, type PaginationProps } from './Pagination.shared';

/** Previous, numbered pages with ellipses, next. The current page is a filled pill that pops in */
export function Pagination({ page, defaultPage = 1, onPageChange, pageCount, accessibilityLabel = 'Pagination', testID }: PaginationProps) {
  const [current, setCurrent] = useControllableState(page, defaultPage, onPageChange);
  if (pageCount < 1) {
    return null;
  }
  const go = (next: number) => next !== current && setCurrent(next);
  return (
    <nav aria-label={accessibilityLabel} data-testid={testID}>
      <ul className="ds-pagination__list">
        <li>
          <button type="button" className="ds-pagination__item ds-press ds-press--object" aria-label="Previous page" disabled={current <= 1} onClick={() => go(current - 1)}>
            <ChevronIcon direction="left" className="ds-pagination__arrow" />
          </button>
        </li>
        {pageItems(current, pageCount).map((item) =>
          typeof item === 'number' ? (
            <li key={item}>
              <button
                type="button"
                className="ds-pagination__item ds-press ds-press--object"
                aria-label={`Page ${item}`}
                aria-current={item === current ? 'page' : undefined}
                onClick={() => go(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className="ds-pagination__gap" aria-hidden="true">
              …
            </li>
          )
        )}
        <li>
          <button type="button" className="ds-pagination__item ds-press ds-press--object" aria-label="Next page" disabled={current >= pageCount} onClick={() => go(current + 1)}>
            <ChevronIcon direction="right" className="ds-pagination__arrow" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
