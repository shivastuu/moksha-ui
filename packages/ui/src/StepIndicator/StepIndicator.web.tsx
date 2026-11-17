import { CheckIcon } from '../Icon/CheckIcon.web';
import { stepState, type StepIndicatorProps } from './StepIndicator.shared';

/** Numbered steps joined by a line that fills in as you go, like PAN → Aadhaar → Selfie → Done */
export function StepIndicator({ steps, current, accessibilityLabel = 'Progress', testID }: StepIndicatorProps) {
  return (
    <ol className="ds-steps" aria-label={accessibilityLabel} data-testid={testID} style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
      {steps.map((step, index) => {
        const state = stepState(index, current);
        return (
          <li key={step} className="ds-steps__step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="ds-steps__dot" aria-hidden="true">
              {state === 'complete' ? <CheckIcon className="ds-steps__check" /> : index + 1}
            </span>
            <span className="ds-steps__label">
              {state === 'complete' && <span className="ds-visually-hidden">Done: </span>}
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
