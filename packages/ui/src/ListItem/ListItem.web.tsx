'use client';

import { useId } from 'react';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { isTextValue, type ListItemProps } from './ListItem.shared';

/** A row with a title, an optional description, something before it and a value or control after it */
export function ListItem({ title, description, leading, trailing, onPress, disabled, accessibilityLabel, testID }: ListItemProps) {
  const id = useId();
  const value = isTextValue(trailing);
  const body = (
    <>
      {leading != null && <span className="ds-list-item__leading">{leading}</span>}
      <span className="ds-list-item__content">
        <span className="ds-list-item__text">
          <span id={`${id}-title`} className="ds-list-item__title">
            {title}
          </span>
          {description && (
            <span id={`${id}-description`} className="ds-list-item__description">
              {description}
            </span>
          )}
        </span>
        {value ? (
          <span id={`${id}-value`} className="ds-list-item__value">
            {trailing}
          </span>
        ) : (
          trailing != null && <span className="ds-list-item__trailing">{trailing}</span>
        )}
        {onPress && <ChevronIcon className="ds-list-item__chevron" />}
      </span>
    </>
  );

  if (!onPress) {
    return (
      <div className="ds-list-item" data-testid={testID}>
        {body}
      </div>
    );
  }
  // Named by the title and value ("Language, English"); the description is announced separately
  return (
    <button
      type="button"
      className="ds-list-item ds-press"
      onClick={onPress}
      disabled={disabled}
      aria-label={accessibilityLabel}
      aria-labelledby={accessibilityLabel ? undefined : value ? `${id}-title ${id}-value` : `${id}-title`}
      aria-describedby={description ? `${id}-description` : undefined}
      data-testid={testID}
    >
      {body}
    </button>
  );
}
