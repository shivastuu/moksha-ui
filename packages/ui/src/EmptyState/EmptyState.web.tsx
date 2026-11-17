import { Button } from '../Button/Button.web';
import type { EmptyStateProps } from './EmptyState.shared';

/** What to show when there is nothing yet: an icon medallion, a title, a hint and one next step */
export function EmptyState({ title, description, icon, action, testID }: EmptyStateProps) {
  return (
    <div className="ds-empty" data-testid={testID}>
      {icon != null && (
        <span className="ds-empty__medallion" aria-hidden="true">
          {icon}
        </span>
      )}
      <p className="ds-empty__title">{title}</p>
      {description && <p className="ds-empty__description">{description}</p>}
      {action && <Button onPress={action.onPress}>{action.label}</Button>}
    </div>
  );
}
