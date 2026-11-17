import { Animated, Text, View } from 'react-native';
import { DetailRow } from '../DetailRow/DetailRow.native';
import { breathOpacity, useBreathe } from '../motion/nativeMotion.native';
import { RollingAmount } from '../RollingAmount/RollingAmount.native';
import { Spinner } from '../Spinner/Spinner.native';
import { SuccessCheck } from '../SuccessCheck/SuccessCheck.native';
import { surfaceColors } from '../Surface/Surface.shared';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { softTones, solidTones } from '../utils/tones';
import { receipt, receiptStatusWords, type ReceiptProps } from './Receipt.shared';

function Cross({ color }: { color: string }) {
  const bar = { position: 'absolute', width: 22, height: 3, borderRadius: 1.5, backgroundColor: color } as const;
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ ...bar, transform: [{ rotate: '45deg' }] }} />
      <View style={{ ...bar, transform: [{ rotate: '-45deg' }] }} />
    </View>
  );
}

/** A payment receipt like a torn ticket: the status, the amount rolling in, a tear line, then the details */
export function Receipt({ status, amount, title, subtitle, details, actions, testID }: ReceiptProps) {
  const theme = useTheme();
  const { colors, motion, space, radius, shadows } = theme;
  const breath = useBreathe(status === 'pending');
  const edge = surfaceColors(colors).edge;
  const words = receiptStatusWords[status];
  const pending = softTones(colors).warning;
  const failed = solidTones(colors).danger;
  const notch = (side: 'left' | 'right') => (
    <View
      style={{
        position: 'absolute',
        [side]: -receipt.notch,
        width: receipt.notch * 2,
        height: receipt.notch * 2,
        borderRadius: receipt.notch,
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: edge,
      }}
    />
  );
  return (
    <View testID={testID} style={{ gap: space.lg }}>
      <View style={{ borderRadius: radius.xl, backgroundColor: colors.surfaceRaised, boxShadow: `${shadows.md}, 0px 0px 0px 1px ${edge}` }}>
        <View style={{ alignItems: 'center', gap: space.xs, paddingTop: space.xl, paddingBottom: space.lg, paddingHorizontal: space.lg }}>
          {status === 'success' ? (
            <SuccessCheck size={receipt.status} accessibilityLabel={words} />
          ) : (
            <Animated.View
              accessible
              accessibilityRole="image"
              accessibilityLabel={words}
              style={{
                // A pending payment breathes, like every loader
                opacity: status === 'pending' ? breathOpacity(breath, motion.breathe.low) : 1,
                width: receipt.status,
                height: receipt.status,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: receipt.status / 2,
                backgroundColor: status === 'pending' ? pending.background : failed.background,
                borderWidth: 1,
                borderColor: status === 'pending' ? pending.border : failed.edge,
              }}
            >
              {status === 'pending' ? <Spinner size="md" /> : <Cross color={failed.ink} />}
            </Animated.View>
          )}
          <View style={{ marginTop: space.sm }}>
            <RollingAmount value={amount} size="xl" />
          </View>
          <Text style={[textStyleFor(theme, 'body'), fontFor(theme, 'medium'), { marginTop: space.xs, color: colors.text, textAlign: 'center' }]}>{title}</Text>
          {subtitle ? <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted, textAlign: 'center' }]}>{subtitle}</Text> : null}
        </View>
        {/* The tear line: a dashed rule between two notches filled with the page color */}
        <View importantForAccessibility="no-hide-descendants" accessibilityElementsHidden style={{ height: receipt.notch * 2, justifyContent: 'center' }}>
          <View style={{ marginHorizontal: receipt.notch + 8, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border }} />
          {notch('left')}
          {notch('right')}
        </View>
        <View style={{ paddingBottom: space.sm }}>
          {details.map((detail) => (
            <DetailRow key={detail.label} label={detail.label} value={detail.value} />
          ))}
        </View>
      </View>
      {actions ? <View style={{ flexDirection: 'row', justifyContent: 'center', gap: space.sm }}>{actions}</View> : null}
    </View>
  );
}
