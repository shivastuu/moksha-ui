'use client';

import { Children, isValidElement, useId } from 'react';
import type { ListGroupProps } from './ListGroup.shared';

/** Rows on one raised card with inset dividers, under an optional title */
export function ListGroup({ children, title, footer, testID }: ListGroupProps) {
  const id = useId();
  return (
    <div className="ds-list-group" data-testid={testID}>
      {title && (
        <div id={id} className="ds-list-group__title">
          {title}
        </div>
      )}
      <ul className="ds-list-group__list" aria-labelledby={title ? id : undefined}>
        {/* toArray drops the false and null left by conditional rows */}
        {Children.toArray(children).map((child, index) => (
          <li key={isValidElement(child) ? child.key : index} className="ds-list-group__item">
            {child}
          </li>
        ))}
      </ul>
      {footer && <p className="ds-list-group__footer">{footer}</p>}
    </div>
  );
}
