import { Animated, Text } from 'react-native';
import { usePop } from '../motion/nativeMotion.native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { solidTones } from '../utils/tones';
import { badgeText, type BadgeProps } from './Badge.shared';

/** A count or a dot, popping each time it changes */
export function Badge(props: BadgeProps) {
  const { tone = 'danger', dot, label, testID } = props;
  const theme = useTheme();
  const { colors, components, radius } = theme;
  const text = badgeText(props);
  const scale = usePop(text);
  if (text === null) {
    return null;
  }
  const { background, ink, edge, gloss } = solidTones(colors)[tone];
  const size = dot ? components.badge.dot : components.badge.size;
  return (
    <Animated.View
      testID={testID}
      accessible={!!label || !dot}
      accessibilityLabel={label ?? (dot ? undefined : text)}
      style={{
        minWidth: size,
        height: size,
        paddingHorizontal: dot ? 0 : size * 0.3,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.full,
        backgroundColor: background,
        boxShadow: `0px 0px 0px 2px ${colors.background}, inset 0px 0px 0px 1px ${edge}, inset 0px 1px 0px ${gloss}`,
        transform: [{ scale }],
      }}
    >
      {dot ? null : <Text style={{ color: ink, fontSize: size * 0.55, ...fontFor(theme, 'semibold'), fontVariant: ['tabular-nums'] }}>{text}</Text>}
    </Animated.View>
  );
}
