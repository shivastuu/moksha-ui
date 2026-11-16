'use client';

import type { PointerEvent, ReactNode } from 'react';
import { cardLabel, type BankCardProps } from './BankCard.shared';

const Icon = ({ className, children }: { className: string; children: ReactNode }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    {children}
  </svg>
);

const Contactless = () => (
  <Icon className="ds-bank-card__contactless">
    <path d="M8.5 8.5a5 5 0 0 1 0 7M12 6a8.5 8.5 0 0 1 0 12M15.5 3.5a12 12 0 0 1 0 17" />
  </Icon>
);

const Frost = () => (
  <span className="ds-bank-card__frost">
    <span className="ds-bank-card__frozen">
      <Icon className="ds-bank-card__snowflake">
        <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />
      </Icon>
      Frozen
    </span>
  </span>
);

/** Pointer position over the card, from 0 to 1, as CSS variables the tilt, glare and holo read */
function follow(event: PointerEvent<HTMLDivElement>) {
  const box = event.currentTarget.getBoundingClientRect();
  event.currentTarget.style.setProperty('--ds-card-x', String((event.clientX - box.left) / box.width));
  event.currentTarget.style.setProperty('--ds-card-y', String((event.clientY - box.top) / box.height));
}

function rest(event: PointerEvent<HTMLDivElement>) {
  event.currentTarget.style.removeProperty('--ds-card-x');
  event.currentTarget.style.removeProperty('--ds-card-y');
}

/** A payment card that tilts toward the pointer, catches the light, flips to its back and can be frozen */
export function BankCard(props: BankCardProps) {
  const { last4, holder, expiry, label = 'Moksha', finish = 'brand', flipped, cvv = '•••', frozen, network, interactive = true, testID } = props;
  const light = (
    <>
      <span className="ds-bank-card__holo" />
      <span className="ds-bank-card__glare" />
      <Frost />
    </>
  );

  return (
    <div
      className={`ds-bank-card ds-bank-card--${finish}`}
      role="img"
      aria-label={cardLabel(props)}
      data-flipped={flipped || undefined}
      data-frozen={frozen || undefined}
      data-testid={testID}
      onPointerMove={interactive ? follow : undefined}
      onPointerLeave={interactive ? rest : undefined}
    >
      <div className="ds-bank-card__body" aria-hidden="true">
        <div className="ds-bank-card__face ds-bank-card__front">
          <div className="ds-bank-card__row">
            <span className="ds-bank-card__label">{label}</span>
            <Contactless />
          </div>
          <span className="ds-bank-card__chip" />
          <span className="ds-bank-card__number">•••• •••• •••• {last4}</span>
          <div className="ds-bank-card__row ds-bank-card__details">
            <span className="ds-bank-card__field">
              <span className="ds-bank-card__caption">Card holder</span>
              {holder}
            </span>
            <span className="ds-bank-card__field">
              <span className="ds-bank-card__caption">Valid thru</span>
              {expiry}
            </span>
            {network !== undefined && <span className="ds-bank-card__network">{network}</span>}
          </div>
          {light}
        </div>
        <div className="ds-bank-card__face ds-bank-card__back">
          <span className="ds-bank-card__stripe" />
          <span className="ds-bank-card__signature">
            <span className="ds-bank-card__cvv">{cvv}</span>
          </span>
          <span className="ds-bank-card__caption ds-bank-card__fine">
            {label} · •••• {last4}
          </span>
          {light}
        </div>
      </div>
    </div>
  );
}
