import { useEffect } from 'react';
import { AccessibilityInfo, Animated, Text, View } from 'react-native';
import { CheckIcon } from '../Icon/CheckIcon.native';
import { CopyIcon } from '../Icon/CopyIcon.native';
import { usePop } from '../motion/nativeMotion.native';
import { Press } from '../motion/Press.native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { useCopy, type CopyFieldProps } from './CopyField.shared';

/** A value with a copy button, like a UPI ID or account number */
export function CopyField({ label, value, onCopy, testID }: CopyFieldProps) {
  const theme = useTheme();
  const { colors, components, space, radius, borderWidth } = theme;
  const { copied, run } = useCopy(value, onCopy);
  const pop = usePop(copied);

  useEffect(() => {
    if (copied) {
      AccessibilityInfo.announceForAccessibility(`${label} copied`);
    }
  }, [copied, label]);

  const size = components.iconButton.sizes.md;
  return (
    <View
      testID={testID}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: space.md,
        paddingVertical: space.sm,
        paddingLeft: space.lg,
        paddingRight: space.sm,
        minHeight: size + 2 * space.sm,
        borderWidth: borderWidth.thin,
        borderColor: colors.border,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[textStyleFor(theme, 'bodySmall'), { color: colors.textMuted }]}>{label}</Text>
        {/* Long-press to copy works even without onCopy */}
        <Text selectable style={[textStyleFor(theme, 'body'), fontFor(theme, 'medium'), { color: colors.text, fontVariant: ['tabular-nums'] }]}>
          {value}
        </Text>
      </View>
      {onCopy ? (
        <Press
          object
          ink={colors.textMuted}
          accessibilityRole="button"
          accessibilityLabel={`Copy ${label}`}
          onPress={run}
          style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', borderRadius: size / 2 }}
        >
          {copied ? (
            <Animated.View style={{ transform: [{ scale: pop }] }}>
              <CheckIcon color={textTones(colors).success} size={18} />
            </Animated.View>
          ) : (
            <CopyIcon color={colors.textMuted} background={colors.surface} size={17} />
          )}
        </Press>
      ) : null}
    </View>
  );
}
