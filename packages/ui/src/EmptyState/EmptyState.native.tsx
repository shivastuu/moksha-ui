import { Text, View } from 'react-native';
import { Button } from '../Button/Button.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { medallion, type EmptyStateProps } from './EmptyState.shared';

/** What to show when there is nothing yet: an icon medallion, a title, a hint and one next step */
export function EmptyState({ title, description, icon, action, testID }: EmptyStateProps) {
  const theme = useTheme();
  const { colors, space, shadows } = theme;
  const edge = surfaceColors(colors).edge;
  const outer = medallion.rings[1]!;
  return (
    <View testID={testID} style={{ alignItems: 'center', gap: space.sm, paddingVertical: space['2xl'], paddingHorizontal: space.lg }}>
      {icon != null ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ width: outer, height: outer, alignItems: 'center', justifyContent: 'center', marginBottom: space.sm }}>
          {/* Rings fade outward, so the medallion reads as lit from its center */}
          {medallion.rings.map((size, index) => (
            <View key={size} style={{ position: 'absolute', width: size, height: size, borderRadius: size / 2, borderWidth: 1, borderColor: edge, opacity: index ? 0.5 : 1 }} />
          ))}
          <View
            style={{
              width: medallion.size,
              height: medallion.size,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: medallion.size / 2,
              backgroundColor: controlColors(colors).selectedFill,
              boxShadow: `0px 0px 0px 1px ${edge}, ${shadows.sm}`,
            }}
          >
            {icon}
          </View>
        </View>
      ) : null}
      <Text accessibilityRole="header" style={[textStyleFor(theme, 'title'), { color: colors.text, textAlign: 'center' }]}>
        {title}
      </Text>
      {description ? <Text style={[textStyleFor(theme, 'body'), { maxWidth: 320, color: colors.textMuted, textAlign: 'center' }]}>{description}</Text> : null}
      {action ? (
        <View style={{ marginTop: space.md }}>
          <Button onPress={action.onPress}>{action.label}</Button>
        </View>
      ) : null}
    </View>
  );
}
