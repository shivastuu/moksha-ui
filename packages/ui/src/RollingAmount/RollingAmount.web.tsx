'use client';

import type { CSSProperties } from 'react';
import { amountText, reelDigits, reels, spokenAmount, type RollingAmountProps } from './RollingAmount.shared';

/** An amount whose digits roll into place like a mechanical counter, with a blur for hiding the balance */
export function RollingAmount(props: RollingAmountProps) {
  const { value, currency = '₹', decimals = 2, hidden, size = 'lg', rollOnMount = true, testID } = props;
  const { sign, grouped } = amountText(value, decimals);

  return (
    <span
      className={`ds-amount ds-amount--${size}`}
      data-hidden={hidden || undefined}
      data-roll={rollOnMount || undefined}
      data-testid={testID}
    >
      <span className="ds-visually-hidden">{spokenAmount(props)}</span>
      <span className="ds-amount__visual" aria-hidden="true">
        <span className="ds-amount__currency">
          {sign}
          {currency}
        </span>
        <span className="ds-amount__digits">
          {reels(grouped).map(({ char, place, digit }) =>
            digit === null ? (
              <span key={place} className="ds-amount__mark">
                {char}
              </span>
            ) : (
              <span key={place} className="ds-amount__digit">
                <span className="ds-amount__reel" style={{ '--ds-digit': digit, '--ds-place': place } as CSSProperties}>
                  {reelDigits.map((reelDigit) => (
                    <span key={reelDigit}>{reelDigit}</span>
                  ))}
                </span>
              </span>
            )
          )}
        </span>
      </span>
    </span>
  );
}
