import type { DetailRowProps } from './DetailRow.shared';

/** A label and its value on one line, like "Transaction ID · UTR 4021 8876 1290" on a receipt */
export function DetailRow({ label, value, testID }: DetailRowProps) {
  return (
    <div className="ds-detail-row" data-testid={testID}>
      <span className="ds-detail-row__label">{label}</span>
      <span className="ds-detail-row__value">{value}</span>
    </div>
  );
}
