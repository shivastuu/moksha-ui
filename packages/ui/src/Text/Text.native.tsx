import { Text as NativeText } from 'react-native';
import { useTheme } from '../theme/context';
import { fontFor, textStyleFor } from '../theme/textStyle';
import { textTones } from '../utils/tones';
import { tracking, type TextProps } from './Text.shared';

/** Text in one of the theme's text styles, with an optional tone */
export function Text({ children, variant = 'body', tone, weight, align, numberOfLines, testID }: TextProps) {
  const theme = useTheme();
  const style = textStyleFor(theme, variant);
  return (
    <NativeText
      testID={testID}
      numberOfLines={numberOfLines}
      style={[
        style,
        weight && fontFor(theme, weight),
        {
          color: textTones(theme.colors)[tone ?? 'default'],
          textAlign: align,
          letterSpacing: (tracking[variant] ?? 0) * style.fontSize,
        },
      ]}
    >
      {children}
    </NativeText>
  );
}
