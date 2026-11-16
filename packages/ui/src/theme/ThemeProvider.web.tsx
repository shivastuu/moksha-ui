'use client';

import { useContext, useMemo } from 'react';
import { ThemeContext } from './context';
import { componentCss, themeCss, themeId } from './css';
import { buildTheme, type ThemeProviderProps } from './theme';

export function ThemeProvider({ theme, colorScheme = 'light', children }: ThemeProviderProps) {
  const parent = useContext(ThemeContext);
  const definition = theme ?? parent.definition;
  const value = useMemo(() => buildTheme(definition, colorScheme), [definition, colorScheme]);
  const id = useMemo(() => themeId(definition), [definition]);
  const css = useMemo(() => themeCss(definition, id), [definition, id]);

  return (
    <ThemeContext.Provider value={value}>
      <style href="shivastu-ui" precedence="default">
        {componentCss}
      </style>
      <style href={`shivastu-ui-theme-${id}`} precedence="default">
        {css}
      </style>
      <div data-ds-theme={id} data-ds-scheme={colorScheme} style={{ display: 'contents' }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
