import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { toneColors, type BannerProps } from './Banner.shared';

/** A message that stays on the screen until it is dealt with, like a pending KYC or a failed payment */
export function Banner({ tone = 'info', title, children, action, onDismiss, testID }: BannerProps) {
  const theme = useTheme();
  const { colors, components, space } = theme;
  const { banner } = components;
  const { accent, background } = toneColors(tone, colors);
  const text = [textStyleFor(theme, 'bodySmall'), { color: colors.text }];

  return (
    <View
      testID={testID}
      accessibilityRole={tone === 'danger' ? 'alert' : undefined}
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: space.md,
        padding: banner.padding,
        borderRadius: banner.radius,
        borderLeftWidth: banner.accentWidth,
        borderLeftColor: accent,
        backgroundColor: background,
      }}
    >
      <View style={{ flex: 1, gap: space.xs, alignItems: 'flex-start' }}>
        {title ? <Text style={[text, fontFor(theme, 'semibold')]}>{title}</Text> : null}
        {typeof children === 'string' ? <Text style={text}>{children}</Text> : children}
        {action ? (
          <Pressable accessibilityRole="button" hitSlop={space.sm} onPress={action.onPress} style={{ marginTop: space.xs }}>
            <Text style={[text, fontFor(theme, 'semibold'), { textDecorationLine: 'underline' }]}>{action.label}</Text>
          </Pressable>
        ) : null}
      </View>
      {onDismiss ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={space.sm} onPress={onDismiss}>
          <Text style={[text, { fontSize: theme.typography.fontSize.lg, lineHeight: theme.typography.lineHeight.sm }]}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
