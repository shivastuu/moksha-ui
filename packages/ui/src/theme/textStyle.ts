import type { FontWeightName, TextStyleName } from '@shivastu/tokens';
import type { Theme } from './theme';

/** React Native font props for a weight: the app's font family when given, otherwise the system font weight */
export function fontFor(theme: Theme, weight: FontWeightName) {
  return theme.nativeFonts
    ? { fontFamily: theme.nativeFonts[weight] }
    : { fontWeight: theme.typography.fontWeight[weight] };
}

/** React Native text props for a text style token */
export function textStyleFor(theme: Theme, name: TextStyleName) {
  const style = theme.typography.textStyles[name];
  return { fontSize: style.fontSize, lineHeight: style.lineHeight, ...fontFor(theme, style.fontWeight) };
}
