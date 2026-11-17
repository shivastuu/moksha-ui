import { View } from 'react-native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { Floating } from './Floating.native';
import type { PopoverProps } from './Popover.shared';

/** A small panel that opens from a trigger: details, a quick form, a confirmation */
export function Popover({ anchor, open, onClose, accessibilityLabel, children, side, align, testID }: PopoverProps) {
  const { colors, space, radius, shadows } = useTheme();
  return (
    <Floating anchor={anchor} open={open} onClose={onClose} side={side} align={align} label={accessibilityLabel} testID={testID}>
      <View style={{ maxWidth: 320, padding: space.lg, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.lg}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}>{children}</View>
    </Floating>
  );
}
