import { Text, View } from 'react-native';
import { ChevronIcon } from '../Icon/ChevronIcon.native';
import { IconButton } from '../IconButton/IconButton.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import type { AppBarProps } from './AppBar.shared';

/** A screen's top bar: back, a centered title with an optional subtitle, and actions. Safe-area padding is the app's */
export function AppBar({ title, subtitle, onBack, backLabel = 'Back', actions, testID }: AppBarProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  return (
    <View
      testID={testID}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 56, paddingVertical: space.xs, paddingHorizontal: space.sm, backgroundColor: colors.background, borderBottomWidth: 1, borderBottomColor: surfaceColors(colors).edge }}
    >
      {/* Equal flex on both sides keeps the title centered */}
      <View style={{ flex: 1, flexDirection: 'row' }}>{onBack ? <IconButton icon={<ChevronIcon direction="left" color={colors.text} />} accessibilityLabel={backLabel} variant="ghost" onPress={onBack} /> : null}</View>
      <View style={{ flexShrink: 1, alignItems: 'center' }}>
        <Text accessibilityRole="header" numberOfLines={1} style={[textStyleFor(theme, 'body'), fontFor(theme, 'semibold'), { color: colors.text }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[textStyleFor(theme, 'caption'), { color: colors.textMuted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', gap: space.xs }}>{actions}</View>
    </View>
  );
}
