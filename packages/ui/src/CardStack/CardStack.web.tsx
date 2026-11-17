'use client';

import { useControllableState } from '../utils/useControllableState';
import { depthOf, stackLook, stackStep, type CardStackProps } from './CardStack.shared';

/** Cards stacked like a wallet: the ones behind peek out above, and a tap on one springs it to the front */
export function CardStack({ cards, index, defaultIndex = 0, onIndexChange, accessibilityLabel = 'Your cards', testID }: CardStackProps) {
  const [front, setFront] = useControllableState(index, defaultIndex, onIndexChange);
  return (
    <div data-testid={testID}>
      <ul className="ds-card-stack" aria-label={accessibilityLabel} style={{ paddingTop: (cards.length - 1) * stackStep.lift }}>
        {cards.map((item, position) => {
          const depth = depthOf(position, front, cards.length);
          const look = stackLook(depth);
          return (
            <li
              key={item.key}
              className="ds-card-stack__card"
              aria-current={depth === 0 || undefined}
              style={{ zIndex: cards.length - depth, transform: `translateY(${look.y}px) scale(${look.scale})`, filter: depth ? `brightness(${look.brightness})` : undefined }}
            >
              {/* Cards behind are hidden from screen readers; their button names them instead */}
              <div aria-hidden={depth > 0 || undefined} inert={depth > 0}>
                {item.card}
              </div>
              {depth > 0 && <button type="button" className="ds-card-stack__pick" aria-label={`Show ${item.label}`} onClick={() => setFront(position)} />}
            </li>
          );
        })}
      </ul>
      <span className="ds-visually-hidden" role="status">
        {cards[front] ? `Showing ${cards[front].label}` : ''}
      </span>
    </div>
  );
}
