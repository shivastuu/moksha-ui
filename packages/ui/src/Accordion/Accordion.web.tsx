'use client';

import { useId } from 'react';
import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { useControllableState } from '../utils/useControllableState';
import { toggle, type AccordionProps } from './Accordion.shared';

/** Sections that open and close on a spring, on one raised card. The WAI-ARIA accordion pattern */
export function Accordion({ items, multiple = false, value, defaultValue = [], onValueChange, headingLevel = 3, testID }: AccordionProps) {
  const [open, setOpen] = useControllableState(value, defaultValue, onValueChange);
  const id = useId();
  return (
    <div className="ds-accordion" data-testid={testID}>
      {items.map((item, index) => {
        const expanded = open.includes(item.value);
        return (
          <div key={item.value} className="ds-accordion__item" data-open={expanded || undefined}>
            <div role="heading" aria-level={headingLevel} className="ds-accordion__heading">
              <button
                type="button"
                id={`${id}-${index}`}
                className="ds-accordion__trigger ds-press"
                aria-expanded={expanded}
                aria-controls={`${id}-${index}-panel`}
                onClick={() => setOpen(toggle(open, item.value, multiple))}
              >
                {item.title}
                <ChevronIcon direction="down" className="ds-accordion__chevron" />
              </button>
            </div>
            {/* Stays mounted so it can animate closed; inert keeps it out of tab order and the accessibility tree */}
            <div id={`${id}-${index}-panel`} role="region" aria-labelledby={`${id}-${index}`} className="ds-accordion__panel" inert={!expanded}>
              <div className="ds-accordion__clip">
                <div className="ds-accordion__content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
