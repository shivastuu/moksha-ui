import type { ReactNode } from 'react';
import { getTheme, type ColorScheme, type NativeFonts, type ResolvedTheme } from '@shivastu/tokens';

export interface Theme extends ResolvedTheme {
  /** React Native only: the font families passed to ThemeProvider */
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
  return { ...getTheme(scheme), nativeFonts };
}
