import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListGroupContext } from '../ListGroup/ListGroup.shared';
import { isTextValue } from '../ListItem/ListItem.shared';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import type { DetailRowProps } from './DetailRow.shared';

/** A label and its value on one line, like "Transaction ID · UTR 4021 8876 1290" on a receipt */
export function DetailRow({ label, value, testID }: DetailRowProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  const separated = useContext(ListGroupContext);
  const text = isTextValue(value);
  return (
    <View
      testID={testID}
      // A text value reads with its label as one line; an element like a Tag keeps its own name
      accessible={text}
      accessibilityLabel={text ? `${label}, ${value}` : undefined}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.lg, paddingVertical: space.md, paddingHorizontal: space.lg }}
    >
      {separated ? <View style={{ position: 'absolute', top: 0, right: 0, left: space.lg, height: StyleSheet.hairlineWidth, backgroundColor: surfaceColors(colors).edge }} /> : null}
      <Text style={[textStyleFor(theme, 'body'), { color: colors.textMuted }]}>{label}</Text>
      {text ? (
        <Text style={[textStyleFor(theme, 'body'), fontFor(theme, 'medium'), { flexShrink: 1, color: colors.text, textAlign: 'right', fontVariant: ['tabular-nums'] }]}>{value}</Text>
      ) : (
        value
      )}
    </View>
  );
}
