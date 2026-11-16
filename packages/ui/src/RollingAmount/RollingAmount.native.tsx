import { useEffect, useRef } from 'react';
import { Animated, Text, View, type TextStyle } from 'react-native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { amountText, reelDigits, reels, spokenAmount, type RollingAmountProps } from './RollingAmount.shared';

const fontSizes = { md: 'xl', lg: '2xl', xl: '3xl' } as const;

interface ReelProps {
  digit: number;
  place: number;
  height: number;
  roll: boolean;
  textStyle: TextStyle;
}

function Reel({ digit, place, height, roll, textStyle }: ReelProps) {
  const { motion } = useTheme();
  const reduced = useReducedMotion();
  const position = useRef(new Animated.Value(roll ? 0 : digit)).current;

  useEffect(() => {
    if (reduced === null) {
      return;
    }
    if (reduced) {
      position.setValue(digit);
      return;
    }
    // Lower places roll first, like a mechanical counter
    const animation = Animated.spring(position, { toValue: digit, ...motion.spring.smooth, delay: place * 25, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [digit, place, reduced, position, motion]);

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

/** An amount whose digits roll into place like a mechanical counter, with bullets for hiding the balance */
export function RollingAmount(props: RollingAmountProps) {
  const { value, currency = '₹', decimals = 2, hidden, size = 'lg', rollOnMount = true, testID } = props;
  const theme = useTheme();
  const { colors, typography } = theme;
  const fontSize = typography.fontSize[fontSizes[size]];
  const height = Math.round(fontSize * 1.15);
  const { sign, grouped } = amountText(value, decimals);
  const textStyle: TextStyle = {
    color: colors.text,
    fontSize,
    letterSpacing: -0.02 * fontSize,
    fontVariant: ['tabular-nums'],
    ...fontFor(theme, 'semibold'),
  };

  return (
    <View testID={testID} accessible accessibilityRole="text" accessibilityLabel={spokenAmount(props)} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[textStyle, { height, lineHeight: height, marginRight: 0.18 * fontSize, opacity: 0.75, ...fontFor(theme, 'medium') }]}>
        {sign}
        {currency}
      </Text>
      {reels(grouped).map(({ char, place, digit }) =>
        digit === null || hidden ? (
          <Text key={place} style={[textStyle, { height, lineHeight: height }]}>
            {hidden && digit !== null ? '•' : char}
          </Text>
        ) : (
          <Reel key={place} digit={digit} place={place} height={height} roll={rollOnMount} textStyle={textStyle} />
        )
      )}
    </View>
  );
}
