export const palette = {
  violet: {
    50: '#F4F2FF',
    100: '#E8E4FF',
    200: '#D2CAFF',
    300: '#B1A4FF',
    400: '#8F7BFA',
    500: '#7158EE',
    600: '#5B40DB',
    700: '#4A31B8',
    800: '#3B2992',
    900: '#2C206B',
  },
  slate: {
    0: '#FFFFFF',
    50: '#F7F8FA',
    100: '#EEF0F4',
    200: '#DDE1E8',
    300: '#C3C9D4',
    400: '#98A1B2',
    500: '#6B7487',
    600: '#4E5668',
    700: '#373D4B',
    800: '#232833',
    900: '#14171F',
    950: '#0D0F14',
  },
  green: { 500: '#1F9D57', 300: '#6FD49C' },
  amber: { 500: '#B7791F', 300: '#F2C46D' },
  red: { 500: '#D93636', 300: '#FF8A8A' },
} as const;

export type ColorScheme = 'light' | 'dark';

export interface SemanticColors {
  background: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  primaryPressed: string;
  onPrimary: string;
  primarySubtle: string;
  focus: string;
  success: string;
  warning: string;
  danger: string;
}

export const colors: Record<ColorScheme, SemanticColors> = {
  light: {
    background: palette.slate[0],
    surface: palette.slate[50],
    text: palette.slate[900],
    textMuted: palette.slate[600],
    border: palette.slate[200],
    primary: palette.violet[600],
    primaryPressed: palette.violet[700],
    onPrimary: palette.slate[0],
    primarySubtle: palette.violet[50],
    focus: palette.violet[400],
    success: palette.green[500],
    warning: palette.amber[500],
    danger: palette.red[500],
  },
  dark: {
    background: palette.slate[950],
    surface: palette.slate[900],
    text: palette.slate[50],
    textMuted: palette.slate[400],
    border: palette.slate[700],
    primary: palette.violet[300],
    primaryPressed: palette.violet[200],
    onPrimary: palette.slate[950],
    primarySubtle: palette.violet[900],
    focus: palette.violet[300],
    success: palette.green[300],
    warning: palette.amber[300],
    danger: palette.red[300],
  },
};

export const fontFamily = {
  web: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  native: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
  },
} as const;

export const fontWeight = { regular: '400', medium: '500', semibold: '600' } as const;

export const fontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 } as const;

export const lineHeight = { xs: 16, sm: 20, md: 24, lg: 28, xl: 28, '2xl': 32, '3xl': 38 } as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32 } as const;

export const radius = { sm: 6, md: 10, lg: 14, full: 999 } as const;

export const tokens = { palette, colors, fontFamily, fontWeight, fontSize, lineHeight, space, radius };

export type Tokens = typeof tokens;
