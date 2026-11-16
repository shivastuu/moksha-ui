'use client';

import { useMemo } from 'react';
import { ThemeContext } from './context';
import { globalCss } from './css';
import { createTheme, type ThemeProviderProps } from './theme';

export function ThemeProvider({ colorScheme = 'light', children }: ThemeProviderProps) {
  const theme = useMemo(() => createTheme(colorScheme), [colorScheme]);

  return (
    <ThemeContext.Provider value={theme}>
      <style href="shivastu-ui" precedence="default">
        {globalCss}
      </style>
      <div data-ds-scheme={colorScheme} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
