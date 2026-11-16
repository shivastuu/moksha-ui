import { Linking, Text } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import type { LinkProps } from './Link.shared';

/** A link that opens `href` with `Linking`, or calls `onPress` */
export function Link({ children, href, onPress, external, tone = 'primary', testID }: LinkProps) {
  const theme = useTheme();
  return (
    <Text
      testID={testID}
      accessibilityRole="link"
      accessibilityHint={external ? 'Opens outside the app' : undefined}
      onPress={() => (onPress ? onPress() : href ? Linking.openURL(href) : undefined)}
      style={{ color: textTones(theme.colors)[tone], textDecorationLine: 'underline', ...fontFor(theme, 'medium') }}
    >
      {children}
      {external ? ' ↗' : null}
    </Text>
  );
}
