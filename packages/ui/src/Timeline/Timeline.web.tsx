import { CheckIcon } from '../Icon/CheckIcon.web';
import { timelineWords, type TimelineProps } from './Timeline.shared';

const Cross = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
    <path d="M7 7l10 10M17 7 7 17" />
  </svg>
);

/** A payment's journey, step by step: done, in progress (pulsing), next or failed */
export function Timeline({ items, testID }: TimelineProps) {
  return (
    <ol className="ds-timeline" data-testid={testID}>
      {items.map((item, index) => (
        <li key={index} className="ds-timeline__item" data-status={item.status} aria-current={item.status === 'current' ? 'step' : undefined}>
          <span className="ds-timeline__rail" aria-hidden="true">
            <span className="ds-timeline__dot">{item.status === 'complete' ? <CheckIcon /> : item.status === 'failed' ? <Cross /> : null}</span>
          </span>
          <span className="ds-timeline__body">
            <span className="ds-timeline__title">
              <span className="ds-visually-hidden">{timelineWords[item.status]}: </span>
              {item.title}
            </span>
            {item.description && <span className="ds-timeline__description">{item.description}</span>}
          </span>
          {item.time ? <span className="ds-timeline__time">{item.time}</span> : <span />}
        </li>
      ))}
    </ol>
  );
}
