import { useMemo } from 'react';
import { ThemeContext } from './context';
import { createTheme, type ThemeProviderProps } from './theme';

export function ThemeProvider({ colorScheme = 'light', fonts, children }: ThemeProviderProps) {
  const theme = useMemo(() => createTheme(colorScheme, fonts), [colorScheme, fonts]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}
