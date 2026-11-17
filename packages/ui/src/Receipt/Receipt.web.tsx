import { DetailRow } from '../DetailRow/DetailRow.web';
import { RollingAmount } from '../RollingAmount/RollingAmount.web';
import { Spinner } from '../Spinner/Spinner.web';
import { SuccessCheck } from '../SuccessCheck/SuccessCheck.web';
import { receipt, receiptStatusWords, type ReceiptProps } from './Receipt.shared';

const Cross = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
    <path d="M7 7l10 10M17 7 7 17" />
  </svg>
);

/** A payment receipt like a torn ticket: the status, the amount rolling in, a tear line, then the details */
export function Receipt({ status, amount, title, subtitle, details, actions, testID }: ReceiptProps) {
  const words = receiptStatusWords[status];
  return (
    <section className="ds-receipt" aria-label={words} data-testid={testID}>
      <div className="ds-receipt__card">
        <div className="ds-receipt__top">
          {status === 'success' ? (
            <SuccessCheck size={receipt.status} accessibilityLabel={words} />
          ) : (
            <span className={`ds-receipt__status ds-receipt__status--${status}`} role="img" aria-label={words}>
              {status === 'pending' ? <Spinner size="md" tone="current" label={words} /> : <Cross />}
            </span>
          )}
          <RollingAmount value={amount} size="xl" />
          <p className="ds-receipt__title">{title}</p>
          {subtitle && <p className="ds-receipt__subtitle">{subtitle}</p>}
        </div>
        <div className="ds-receipt__tear" aria-hidden="true">
          <span />
        </div>
        <div className="ds-receipt__details">
          {details.map((detail) => (
            <DetailRow key={detail.label} label={detail.label} value={detail.value} />
          ))}
        </div>
      </div>
      {actions && <div className="ds-receipt__actions">{actions}</div>}
    </section>
  );
}
