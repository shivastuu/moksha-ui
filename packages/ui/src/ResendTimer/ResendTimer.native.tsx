import { Pressable, Text } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { clock, useResend, type ResendTimerProps } from './ResendTimer.shared';

/** "Resend code in 0:27", then a link-style button */
export function ResendTimer({ seconds = 30, onResend, label = 'Resend code', testID }: ResendTimerProps) {
  const theme = useTheme();
  const { colors, space } = theme;
  const { remaining, waiting, resend } = useResend(seconds, onResend);
  const name = remaining > 0 ? `${label} in ${clock(remaining)}` : label;
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={name}
      accessibilityState={{ disabled: waiting }}
      onPress={resend}
      hitSlop={space.sm}
      style={{ alignSelf: 'flex-start', paddingVertical: space.xs }}
    >
      <Text style={[textStyleFor(theme, 'label'), { color: waiting ? colors.textMuted : textTones(colors).primary }]}>
        {label}
        {remaining > 0 ? (
          <>
            {' in '}
            <Text style={{ color: colors.text, fontVariant: ['tabular-nums'], ...fontFor(theme, 'medium') }}>{clock(remaining)}</Text>
          </>
        ) : null}
      </Text>
    </Pressable>
  );
}
