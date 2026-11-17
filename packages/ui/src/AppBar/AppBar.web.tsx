import { ChevronIcon } from '../Icon/ChevronIcon.web';
import { IconButton } from '../IconButton/IconButton.web';
import type { AppBarProps } from './AppBar.shared';

/** A screen's top bar: back, a centered title with an optional subtitle, and actions */
export function AppBar({ title, subtitle, onBack, backLabel = 'Back', actions, headingLevel = 1, testID }: AppBarProps) {
  return (
    <header className="ds-appbar" data-testid={testID}>
      <div className="ds-appbar__side">{onBack && <IconButton icon={<ChevronIcon direction="left" />} accessibilityLabel={backLabel} variant="ghost" onPress={onBack} />}</div>
      <div className="ds-appbar__titles">
        <div role="heading" aria-level={headingLevel} className="ds-appbar__title">
          {title}
        </div>
        {subtitle && <div className="ds-appbar__subtitle">{subtitle}</div>}
      </div>
      <div className="ds-appbar__side ds-appbar__side--end">{actions}</div>
    </header>
  );
}
