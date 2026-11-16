'use client';

import { createContext, useContext } from 'react';
import { createTheme, type Theme } from './theme';

export const ThemeContext = createContext<Theme>(createTheme('light'));

export function useTheme() {
  return useContext(ThemeContext);
}
