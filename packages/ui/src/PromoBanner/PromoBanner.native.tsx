import { Text, View } from 'react-native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { promoColors, type PromoBannerProps } from './PromoBanner.shared';

/** A card for offers and announcements, on the brand gradient */
export function PromoBanner({ eyebrow, title, description, action, onDismiss, art, testID }: PromoBannerProps) {
  const theme = useTheme();
  const { components, space, radius, borderWidth, typography } = theme;
  const { promo, button } = components;
  // Like a bank card, a promo keeps its light-scheme brand colors in both schemes
  const tones = promoColors(theme.definition.themes.light.colors);
  const onBrand = { color: tones.ink, maxWidth: '62%' as const };

  // The art is a drawing, so its sizes are fixed pixels
  const card = (
    <View
      style={{
        width: 150,
        height: 96,
        marginRight: -14,
        marginBottom: -22,
        borderWidth: borderWidth.thin,
        borderColor: tones.artBorder,
        borderRadius: radius.lg,
        backgroundColor: tones.artFill,
        transform: [{ rotate: '-12deg' }],
      }}
    >
      <View style={{ position: 'absolute', left: 16, top: 22, width: 26, height: 20, borderRadius: 5, backgroundColor: tones.artDetail }} />
      <View style={{ position: 'absolute', left: 16, bottom: 18, width: 84, height: 6, borderRadius: 3, backgroundColor: tones.artDetail }} />
    </View>
  );

  return (
    <View
      testID={testID}
      style={{
        overflow: 'hidden',
        alignItems: 'flex-start',
        gap: space.xs,
        minHeight: promo.minHeight,
        padding: promo.padding,
        borderRadius: promo.radius,
        backgroundImage: tones.background,
      }}
    >
      <View
        pointerEvents="none"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={{ position: 'absolute', right: 0, bottom: 0 }}
      >
        {art === undefined ? card : art}
      </View>
      {eyebrow ? (
        <Text
          style={[
            textStyleFor(theme, 'caption'),
            fontFor(theme, 'semibold'),
            { color: tones.ink, letterSpacing: typography.letterSpacing.wide, textTransform: 'uppercase' },
          ]}
        >
          {eyebrow}
        </Text>
      ) : null}
      <Text accessibilityRole="header" style={[textStyleFor(theme, 'title'), onBrand]}>
        {title}
      </Text>
      {description ? <Text style={[textStyleFor(theme, 'bodySmall'), onBrand]}>{description}</Text> : null}
      {action ? (
        <Press
          object
          ink={tones.actionInk}
          fill={tones.ink}
          accessibilityRole="button"
          onPress={action.onPress}
          outerStyle={{ marginTop: space.sm }}
          style={{ minHeight: button.sizes.sm.height, justifyContent: 'center', paddingHorizontal: button.sizes.sm.paddingX, borderRadius: radius.full }}
        >
          <Text style={[textStyleFor(theme, 'label'), fontFor(theme, 'semibold'), { color: tones.actionInk }]}>{action.label}</Text>
        </Press>
      ) : null}
      {onDismiss ? (
        <Press
          object
          ink={tones.ink}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onDismiss}
          outerStyle={{ position: 'absolute', top: space.sm, right: space.sm }}
          style={{ width: space['2xl'], height: space['2xl'], alignItems: 'center', justifyContent: 'center', borderRadius: radius.full }}
        >
          <Text style={{ color: tones.ink, fontSize: typography.fontSize.md }}>✕</Text>
        </Press>
      ) : null}
    </View>
  );
}
