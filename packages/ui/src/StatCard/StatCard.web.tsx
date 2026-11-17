import { trendArrows, trendTone, trendWords, type StatCardProps } from './StatCard.shared';

/** A key figure with its change, like "Spent this month ₹ 42,180 ↑ 12.4% vs last month" */
export function StatCard({ label, value, change, trend = 'flat', upIsGood = true, caption, testID }: StatCardProps) {
  return (
    <div className="ds-stat-card" data-testid={testID}>
      <span className="ds-stat-card__label">{label}</span>
      <span className="ds-stat-card__value">{value}</span>
      {(change || caption) && (
        <span className="ds-stat-card__footer">
          {change && (
            <span className="ds-stat-card__change" data-tone={trendTone(trend, upIsGood)}>
              {/* The arrow is drawn, the direction is spoken */}
              <span aria-hidden="true">{trendArrows[trend]}</span>
              <span className="ds-visually-hidden">{trendWords[trend]} </span>
              {change}
            </span>
          )}
          {caption && <span className="ds-stat-card__caption">{caption}</span>}
        </span>
      )}
    </div>
  );
}
