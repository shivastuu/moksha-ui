import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { CheckIcon } from '../Icon/CheckIcon.native';
import { useReducedMotion } from '../motion/useReducedMotion.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { controlColors } from '../utils/controls';
import { textTones } from '../utils/tones';
import { stepDot, stepState, stepSummary, type StepIndicatorProps } from './StepIndicator.shared';

/** The line into a step: a gray track, and a brand fill that springs across once the step is reached */
function Line({ filled }: { filled: boolean }) {
  const { colors, motion, radius } = useTheme();
  const reduced = useReducedMotion();
  const progress = useRef(new Animated.Value(filled ? 1 : 0)).current;

  useEffect(() => {
    if (reduced !== false) {
      progress.setValue(filled ? 1 : 0);
      return;
    }
    const spring = Animated.spring(progress, { toValue: filled ? 1 : 0, ...motion.spring.smooth, useNativeDriver: true });
    spring.start();
    return () => spring.stop();
  }, [filled, reduced, progress, motion]);

  return (
    <View style={{ position: 'absolute', top: stepDot / 2 - 1, left: '-50%', right: '50%', marginLeft: stepDot / 2 + 6, marginRight: stepDot / 2 + 6, height: 2, borderRadius: radius.full, backgroundColor: colors.border, overflow: 'hidden' }}>
      {/* Scaled from the left on the native driver; the rounded track clips the fill's ends */}
      <Animated.View style={{ height: 2, backgroundColor: controlColors(colors).indicator, transformOrigin: 'left', transform: [{ scaleX: progress }] }} />
    </View>
  );
}

/** Numbered steps joined by a line that fills in as you go, like PAN → Aadhaar → Selfie → Done */
export function StepIndicator({ steps, current, accessibilityLabel = 'Progress', testID }: StepIndicatorProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  const look = controlColors(colors);
  return (
    <View
      testID={testID}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: stepSummary(steps, current) }}
      style={{ flexDirection: 'row' }}
    >
      {steps.map((step, index) => {
        const state = stepState(index, current);
        return (
          <View key={step} style={{ flex: 1, alignItems: 'center', gap: space.sm }}>
            {index > 0 ? <Line filled={state !== 'upcoming'} /> : null}
            <View
              style={{
                width: stepDot,
                height: stepDot,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: stepDot / 2,
                borderWidth: 1.5,
                borderColor: state === 'complete' ? colors.primary : state === 'current' ? look.indicator : look.boxBorder,
                backgroundColor: state === 'complete' ? colors.primary : colors.background,
                boxShadow: state === 'current' ? `0px 0px 0px 4px ${look.selectedFill}` : undefined,
              }}
            >
              {state === 'complete' ? (
                <CheckIcon color={colors.textOnPrimary} size={14} />
              ) : (
                <Text style={[textStyleFor(theme, 'label'), fontFor(theme, 'semibold'), { color: state === 'current' ? textTones(colors).primary : colors.textMuted, fontVariant: ['tabular-nums'] }]}>
                  {index + 1}
                </Text>
              )}
            </View>
            <Text
              style={[
                textStyleFor(theme, 'bodySmall'),
                state === 'current' ? fontFor(theme, 'medium') : null,
                { color: state === 'upcoming' ? colors.textMuted : colors.text, textAlign: 'center' },
              ]}
            >
              {step}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
