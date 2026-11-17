import { useContext } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { alpha } from '@moksha-ui/tokens';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { ListGroupContext } from '../ListGroup/ListGroup.shared';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { isTextValue, type ListItemProps } from './ListItem.shared';

/** A row with a title, an optional description, something before it and a value or control after it */
export function ListItem({ title, description, leading, trailing, onPress, disabled, accessibilityLabel, testID }: ListItemProps) {
  const theme = useTheme();
  const { colors, space, opacity } = theme;
  const separated = useContext(ListGroupContext);
  const value = isTextValue(trailing);
  const row = { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingLeft: space.lg } as const;
  const body = (
    <>
      {leading != null ? <View>{leading}</View> : null}
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: space.md,
          paddingVertical: space.md,
          paddingRight: space.lg,
          borderTopWidth: separated ? StyleSheet.hairlineWidth : 0,
          borderTopColor: surfaceColors(colors).edge,
        }}
      >
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={[textStyleFor(theme, 'body'), fontFor(theme, 'medium'), { color: colors.text }]}>{title}</Text>
          {description ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{description}</Text> : null}
        </View>
        {value ? <Text style={[textStyleFor(theme, 'body'), { color: colors.textMuted, fontVariant: ['tabular-nums'] }]}>{trailing}</Text> : trailing}
        {onPress ? <ChevronIcon /> : null}
      </View>
    </>
  );

  if (!onPress) {
    return (
      // With a label, the row reads as one element; without, a control in it stays reachable
      <View testID={testID} accessible={!!accessibilityLabel} accessibilityLabel={accessibilityLabel} style={row}>
        {body}
      </View>
    );
  }
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (value ? `${title}, ${trailing}` : title)}
      accessibilityHint={description}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [row, { backgroundColor: alpha(colors.text, pressed ? 0.08 : 0), opacity: disabled ? opacity.disabled : 1 }]}
    >
      {body}
    </Pressable>
  );
}
