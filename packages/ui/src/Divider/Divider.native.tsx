import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import type { DividerProps } from './Divider.shared';

/** A hairline between content, optionally with a label in the middle */
export function Divider({ orientation = 'horizontal', label, testID }: DividerProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  const line = { backgroundColor: colors.border };

  if (orientation === 'vertical') {
    return <View testID={testID} accessibilityRole="none" style={[line, { width: StyleSheet.hairlineWidth, alignSelf: 'stretch' }]} />;
  }
  if (label) {
    return (
      <View testID={testID} style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={[line, { flex: 1, height: StyleSheet.hairlineWidth }]} />
        <Text style={[textStyleFor(theme, 'caption'), { color: colors.textMuted }]}>{label}</Text>
        <View style={[line, { flex: 1, height: StyleSheet.hairlineWidth }]} />
      </View>
    );
  }
  return <View testID={testID} style={[line, { height: StyleSheet.hairlineWidth, alignSelf: 'stretch' }]} />;
}
