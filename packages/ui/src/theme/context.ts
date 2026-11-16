'use client';

import { createContext, useContext } from 'react';
import { fallbackTheme, type Theme } from './theme';

export const ThemeContext = createContext<Theme>(fallbackTheme);

/** The resolved theme for the nearest ThemeProvider: colors, shadows, type, space, radius, motion, glass and components */
export function useTheme() {
  return useContext(ThemeContext);
}
