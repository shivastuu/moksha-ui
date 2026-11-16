import { useEffect, useRef } from 'react';
import { Animated, Text, View, type TextStyle } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { amountText, hiddenRow, reelDigits, reels, spokenAmount, type RollingAmountProps } from './RollingAmount.shared';

const fontSizes = { md: 'xl', lg: '2xl', xl: '3xl', hero: '3xl' } as const;
/** Decimals and the currency sign are drawn at this size, like most banking apps */
const small = 0.56;

interface ReelProps {
  /** The digit, or the dot row when hidden */
  row: number;
  place: number;
  height: number;
  roll: boolean;
  textStyle: TextStyle;
}

function Reel({ row, place, height, roll, textStyle }: ReelProps) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const position = useRef(new Animated.Value(roll ? 0 : row)).current;

  useEffect(() => {
    if (reduced === null) {
      return;
    }
    if (reduced) {
      position.setValue(row);
      return;
    }
    // Lower places roll first, like a mechanical counter
    const animation = Animated.spring(position, { toValue: row, ...motion.spring.smooth, delay: place * 25, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [row, place, reduced, position, motion]);

  return (
    <View style={{ height, overflow: 'hidden' }}>
      <Animated.View style={{ transform: [{ translateY: Animated.multiply(position, -height) }] }}>
        {reelDigits.map((reelDigit) => (
          <Text key={reelDigit} style={[textStyle, { height, lineHeight: height }]}>
            {reelDigit}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
}

/** An amount whose digits roll into place like a mechanical counter, and roll away into dots to hide the balance */
export function RollingAmount(props: RollingAmountProps) {
  const { value, currency = '₹', decimals = 2, hidden, size = 'lg', rollOnMount = true, testID } = props;
  const theme = useTheme();
  const { colors, typography } = theme;
  const fontSize = typography.fontSize[fontSizes[size]] * (size === 'hero' ? 1.5 : 1);
  const { sign, grouped } = amountText(value, decimals);
  const styleAt = (scale: number): TextStyle => ({
    color: colors.text,
    fontSize: fontSize * scale,
    letterSpacing: -0.035 * fontSize * scale,
    fontVariant: ['tabular-nums'],
    textAlign: 'center',
    opacity: scale === 1 ? 1 : 0.6,
    ...fontFor(theme, 'semibold'),
  });
  const heightAt = (scale: number) => Math.round(fontSize * scale * 1.15);

  return (
    <View testID={testID} accessible accessibilityRole="text" accessibilityLabel={spokenAmount(props)} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
      <Text style={[styleAt(small), { alignSelf: 'flex-start', marginTop: 0.14 * fontSize, marginRight: 0.12 * fontSize, ...fontFor(theme, 'medium') }]}>
        {sign}
        {currency}
      </Text>
      {reels(grouped).map(({ char, place, digit, fraction }) => {
        const scale = fraction ? small : 1;
        const height = heightAt(scale);
        const textStyle = styleAt(scale);
        const offset = fraction ? { marginBottom: 0.08 * fontSize * small } : undefined;
        return digit === null ? (
          <Text key={place} style={[textStyle, offset, { height, lineHeight: height }]}>
            {hidden ? '' : char}
          </Text>
        ) : (
          <View key={place} style={offset}>
            <Reel row={hidden ? hiddenRow : digit} place={place} height={height} roll={rollOnMount} textStyle={textStyle} />
          </View>
        );
      })}
    </View>
  );
}
