import { Text, View } from 'react-native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { bannerColors, type BannerProps, type BannerTone } from './Banner.shared';

const glyphs: Record<BannerTone, string> = { info: 'i', success: '✓', warning: '!', danger: '✕' };

/** A message that stays on the screen until it is dealt with, like a pending KYC or a failed payment */
export function Banner({ tone = 'info', title, children, action, onDismiss, testID }: BannerProps) {
  const theme = useTheme();
  const { colors, components, space, radius, borderWidth, typography } = theme;
  const { banner, button } = components;
  const tones = bannerColors(tone, colors, banner.tint);
  const circle = {
    width: banner.iconSize,
    height: banner.iconSize,
    borderRadius: radius.full,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };

  return (
    <View
      testID={testID}
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: banner.gap,
        padding: banner.padding,
        borderWidth: borderWidth.thin,
        borderColor: tones.border,
        borderRadius: banner.radius,
        backgroundColor: tones.background,
      }}
    >
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[circle, { backgroundColor: tones.accent }]}>
        <Text style={{ color: tones.glyph, fontSize: typography.fontSize.md, ...fontFor(theme, 'semibold') }}>{glyphs[tone]}</Text>
      </View>
      {/* The text grows to push the action to the end; with no room, the action moves under the text */}
      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', columnGap: banner.gap, rowGap: space.sm, minHeight: banner.iconSize }}>
        <View style={{ flexGrow: 1, flexShrink: 1, flexBasis: 192 }}>
          {title ? <Text style={[textStyleFor(theme, 'body'), fontFor(theme, 'semibold'), { color: colors.text }]}>{title}</Text> : null}
          {typeof children === 'string' ? (
            <Text style={[textStyleFor(theme, 'bodySmall'), { color: title ? colors.textMuted : colors.text }]}>{children}</Text>
          ) : (
            children
          )}
        </View>
        {action ? (
          <Press
            object
            ink={colors.textInverse}
            fill={colors.surfaceInverse}
            accessibilityRole="button"
            onPress={action.onPress}
            style={{ minHeight: button.sizes.sm.height, justifyContent: 'center', paddingHorizontal: button.sizes.sm.paddingX, borderRadius: radius.full }}
          >
            <Text style={[textStyleFor(theme, 'label'), fontFor(theme, 'semibold'), { color: colors.textInverse }]}>{action.label}</Text>
          </Press>
        ) : null}
      </View>
      {onDismiss ? (
        <Press object ink={colors.textMuted} accessibilityRole="button" accessibilityLabel="Dismiss" onPress={onDismiss} style={circle}>
          <Text style={{ color: colors.textMuted, fontSize: typography.fontSize.md }}>✕</Text>
        </Press>
      ) : null}
    </View>
  );
}
