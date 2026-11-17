import { Text, View } from 'react-native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { softTones } from '../utils/tones';
import { statLabel, trendArrows, trendTone, type StatCardProps } from './StatCard.shared';

/** A key figure with its change, like "Spent this month ₹ 42,180 ↑ 12.4% vs last month" */
export function StatCard(props: StatCardProps) {
  const { label, value, change, trend = 'flat', upIsGood = true, caption, testID } = props;
  const theme = useTheme();
  const { colors, space, radius, shadows, typography } = theme;
  const tone = softTones(colors)[trendTone(trend, upIsGood)];
  const small = [textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }];
  const heading = typography.textStyles.heading;
  return (
    <View
      testID={testID}
      accessible
      accessibilityLabel={statLabel(props)}
      style={{ gap: space.xs, padding: space.lg, borderRadius: radius.xl, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.sm}, 0px 0px 0px 1px ${surfaceColors(colors).edge}` }}
    >
      <Text style={[small, fontFor(theme, 'medium')]}>{label}</Text>
      <Text style={[textStyleFor(theme, 'heading'), { color: colors.text, letterSpacing: -0.02 * heading.fontSize, fontVariant: ['tabular-nums'] }]}>{value}</Text>
      {change || caption ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm, marginTop: space.xs }}>
          {change ? (
            <Text
              style={[
                textStyleFor(theme, 'label'),
                { paddingHorizontal: space.sm, paddingVertical: 1, borderWidth: 1, borderRadius: radius.full, borderColor: tone.border, backgroundColor: tone.background, color: tone.ink, fontVariant: ['tabular-nums'], overflow: 'hidden' },
              ]}
            >
              {trendArrows[trend]} {change}
            </Text>
          ) : null}
          {caption ? <Text style={small}>{caption}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
