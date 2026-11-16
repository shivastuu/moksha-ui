import type { ReactNode } from 'react';
import { colors, fontFamily, tokens, type ColorScheme, type SemanticColors } from '@shivastu/tokens';

export type NativeFonts = Record<keyof typeof fontFamily.native, string>;

export interface Theme {
  scheme: ColorScheme;
  colors: SemanticColors;
  tokens: typeof tokens;
  nativeFonts?: NativeFonts;
}

export interface ThemeProviderProps {
  /** Color scheme for everything inside the provider @default 'light' */
  colorScheme?: ColorScheme;
  /** React Native only: font family names per weight, loaded by the app (for example with expo-font). Falls back to the system font. */
  fonts?: NativeFonts;
  children: ReactNode;
}

export function createTheme(scheme: ColorScheme, nativeFonts?: NativeFonts): Theme {
  return { scheme, colors: colors[scheme], tokens, nativeFonts };
}
