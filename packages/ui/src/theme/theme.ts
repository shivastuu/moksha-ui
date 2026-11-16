import type { ComponentType, ReactNode } from 'react';
import {
  defaultTheme,
  resolveTheme,
  type ColorScheme,
  type NativeFonts,
  type ResolvedTheme,
  type ThemeDefinition,
} from '@moksha-ui/tokens';

/**
 * A blur view such as `BlurView` from expo-blur. Glass surfaces render it with
 * `intensity` (0–100), `tint` ('light' | 'dark'), `style`, `testID` and `children`.
 */
export type BlurViewComponent = ComponentType<any>;

export interface Theme extends ResolvedTheme {
  /** The full theme (both color schemes) this resolved theme comes from */
  definition: ThemeDefinition;
  /** React Native only: the font families passed to ThemeProvider */
  nativeFonts?: NativeFonts;
  /** React Native only: the blur view passed to ThemeProvider, used by glass surfaces */
  blurView?: BlurViewComponent;
}

export interface ThemeProviderProps {
  /** A theme from `createTheme()`. Defaults to the parent provider's theme, or the default theme */
  theme?: ThemeDefinition;
  /** Color scheme for everything inside the provider @default 'light' */
  colorScheme?: ColorScheme;
  /** React Native only: font family names per weight, loaded by the app (for example with expo-font). Falls back to the system font. */
  fonts?: NativeFonts;
  /** React Native only: a blur view for glass surfaces, for example `BlurView` from expo-blur. Without it, glass falls back to a solid surface. */
  blurView?: BlurViewComponent;
  children: ReactNode;
}

export function buildTheme(
  definition: ThemeDefinition,
  scheme: ColorScheme,
  nativeFonts?: NativeFonts,
  blurView?: BlurViewComponent
): Theme {
  return { ...resolveTheme(definition, scheme), definition, nativeFonts, blurView };
}

export const fallbackTheme = buildTheme(defaultTheme, 'light');
