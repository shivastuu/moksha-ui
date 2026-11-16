import { useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { buildTheme, type ThemeProviderProps } from './theme';

export function ThemeProvider({ theme, colorScheme = 'light', fonts, blurView, children }: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const definition = theme ?? parent.definition;
  const nativeFonts = fonts ?? parent.nativeFonts;
  const blur = blurView ?? parent.blurView;
  const value = useMemo(
    () => buildTheme(definition, colorScheme, nativeFonts, blur),
    [definition, colorScheme, nativeFonts, blur]
  );
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
