import { Text, View } from 'react-native';
import { Press } from '../motion/Press.native';
import { Floating } from '../Popover/Floating.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { menuRow, type MenuProps } from './Menu.shared';

/** A list of actions that opens from a trigger */
export function Menu({ anchor, open, onClose, accessibilityLabel, items, side, align = 'end', testID }: MenuProps) {
  const theme = useTheme();
  const { colors, space, radius, shadows, opacity } = theme;
  return (
    <Floating anchor={anchor} open={open} onClose={onClose} side={side} align={align} role="menu" label={accessibilityLabel} testID={testID}>
      <View style={{ minWidth: 200, padding: space.xs, borderRadius: radius.lg, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.lg}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}>
        {items.map((item) => {
          const color = item.tone === 'danger' ? textTones(colors).danger : colors.text;
          return (
            <Press
              key={item.label}
              ink={color}
              accessibilityRole="menuitem"
              accessibilityState={{ disabled: !!item.disabled }}
              disabled={item.disabled}
              onPress={() => {
                onClose();
                item.onSelect();
              }}
              style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: menuRow, paddingVertical: space.sm, paddingHorizontal: space.md, borderRadius: radius.md, opacity: item.disabled ? opacity.disabled : 1 }}
            >
              {item.icon ? <View style={{ width: 18, alignItems: 'center' }}>{item.icon}</View> : null}
              <Text style={[textStyleFor(theme, 'bodySmall'), fontFor(theme, 'medium'), { color }]}>{item.label}</Text>
            </Press>
          );
        })}
      </View>
    </Floating>
  );
}
