/**
 * The single source of truth for the design system.
 *
 * - `palette`: raw color scales. Components never use these directly.
 * - `foundations`: values that are the same in light and dark (type, space, radius, motion, ...).
 * - `themes.light` / `themes.dark`: semantic colors and shadows for each color scheme.
 * - `components`: component-level decisions built from the values above.
 * - `getTheme(scheme)`: everything above, resolved for one color scheme.
 */

export type ColorScheme = 'light' | 'dark';

/* ------------------------------------------------------------------ palette */

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
  green: { 300: '#6FD49C', 500: '#1F9D57' },
  amber: { 300: '#F2C46D', 500: '#B7791F' },
  red: { 300: '#FF8A8A', 500: '#D93636' },
} as const;

/* -------------------------------------------------------------- foundations */

const fontSize = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 } as const;
const lineHeight = { xs: 16, sm: 20, md: 24, lg: 28, xl: 28, '2xl': 32, '3xl': 38 } as const;
const fontWeight = { regular: '400', medium: '500', semibold: '600' } as const;

export const typography = {
  fontFamily: {
    /** CSS font stack for the web */
    web: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    /** One family per weight on React Native, as loaded with expo-font (Android does not synthesize weights) */
    native: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
    },
  },
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing: { tight: -0.2, normal: 0, wide: 0.6 },
  textStyles: {
    display: { fontSize: fontSize['3xl'], lineHeight: lineHeight['3xl'], fontWeight: 'semibold' },
    heading: { fontSize: fontSize['2xl'], lineHeight: lineHeight['2xl'], fontWeight: 'semibold' },
    title: { fontSize: fontSize.xl, lineHeight: lineHeight.xl, fontWeight: 'semibold' },
    body: { fontSize: fontSize.md, lineHeight: lineHeight.md, fontWeight: 'regular' },
    bodySmall: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: 'regular' },
    label: { fontSize: fontSize.sm, lineHeight: lineHeight.sm, fontWeight: 'medium' },
    caption: { fontSize: fontSize.xs, lineHeight: lineHeight.xs, fontWeight: 'regular' },
  },
} as const;

export type NativeFonts = Record<keyof typeof typography.fontFamily.native, string>;

export type TextStyleName = keyof typeof typography.textStyles;

export const foundations = {
  typography,
  /** Spacing scale in px (4-point grid) */
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  /** Corner radius in px */
  radius: { sm: 6, md: 10, lg: 14, xl: 20, full: 999 },
  /** Border widths in px */
  borderWidth: { thin: 1, thick: 2 },
  opacity: { disabled: 0.5, muted: 0.7 },
  /** Keyboard focus indicator, in px */
  focusRing: { width: 2, offset: 2 },
  motion: {
    /** Durations in ms */
    duration: { fast: 150, normal: 250, slow: 350 },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      enter: 'cubic-bezier(0, 0, 0, 1)',
      exit: 'cubic-bezier(0.3, 0, 1, 1)',
    },
  },
  zIndex: { base: 0, dropdown: 1000, overlay: 1100, modal: 1200, toast: 1300 },
  /** Min widths in px */
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
} as const;

/* ------------------------------------------------------------ color schemes */

export interface SemanticColors {
  /** Page background */
  background: string;
  /** Cards, sections and inputs on top of the background */
  surface: string;
  /** Floating layers: sheets, menus, dialogs (pair with a shadow) */
  surfaceRaised: string;
  /** Dark-on-light (or light-on-dark) layer such as a snackbar */
  surfaceInverse: string;
  /** Main text */
  text: string;
  /** Secondary text: hints, captions, placeholders */
  textMuted: string;
  /** Text and icons placed on `primary` */
  textOnPrimary: string;
  /** Text and icons placed on `surfaceInverse` */
  textInverse: string;
  /** Dividers and input borders */
  border: string;
  /** Brand color: primary buttons, links, selected states */
  primary: string;
  /** `primary` while pressed or hovered */
  primaryPressed: string;
  /** Tinted background for secondary and ghost states */
  primarySubtle: string;
  /** Positive status */
  success: string;
  /** Needs attention */
  warning: string;
  /** Errors and destructive actions */
  danger: string;
  /** Keyboard focus outline */
  focusRing: string;
  /** Backdrop behind modals and sheets */
  overlay: string;
}

export type ShadowName = 'sm' | 'md' | 'lg';

export interface SchemeTokens {
  scheme: ColorScheme;
  colors: SemanticColors;
  /** CSS box-shadow values, used as is on the web and as `boxShadow` on React Native (0.76+) */
  shadows: Record<ShadowName, string>;
}

export const themes: Record<ColorScheme, SchemeTokens> = {
  light: {
    scheme: 'light',
    colors: {
      background: palette.slate[0],
      surface: palette.slate[50],
      surfaceRaised: palette.slate[0],
      surfaceInverse: palette.slate[900],
      text: palette.slate[900],
      textMuted: palette.slate[600],
      textOnPrimary: palette.slate[0],
      textInverse: palette.slate[50],
      border: palette.slate[200],
      primary: palette.violet[600],
      primaryPressed: palette.violet[700],
      primarySubtle: palette.violet[50],
      success: palette.green[500],
      warning: palette.amber[500],
      danger: palette.red[500],
      focusRing: palette.violet[400],
      overlay: 'rgba(13, 15, 20, 0.5)',
    },
    shadows: {
      sm: '0px 1px 2px rgba(20, 23, 31, 0.08)',
      md: '0px 4px 12px rgba(20, 23, 31, 0.12)',
      lg: '0px 12px 32px rgba(20, 23, 31, 0.16)',
    },
  },
  dark: {
    scheme: 'dark',
    colors: {
      background: palette.slate[950],
      surface: palette.slate[900],
      surfaceRaised: palette.slate[800],
      surfaceInverse: palette.slate[50],
      text: palette.slate[50],
      textMuted: palette.slate[400],
      textOnPrimary: palette.slate[950],
      textInverse: palette.slate[900],
      border: palette.slate[700],
      primary: palette.violet[300],
      primaryPressed: palette.violet[200],
      primarySubtle: palette.violet[900],
      success: palette.green[300],
      warning: palette.amber[300],
      danger: palette.red[300],
      focusRing: palette.violet[300],
      overlay: 'rgba(0, 0, 0, 0.6)',
    },
    shadows: {
      sm: '0px 1px 2px rgba(0, 0, 0, 0.4)',
      md: '0px 4px 12px rgba(0, 0, 0, 0.5)',
      lg: '0px 12px 32px rgba(0, 0, 0, 0.6)',
    },
  },
};

/* --------------------------------------------------------------- components */

export const components = {
  button: {
    radius: foundations.radius.md,
    borderWidth: foundations.borderWidth.thin,
    gap: foundations.space.sm,
    fontWeight: typography.fontWeight.semibold,
    sizes: {
      sm: { height: 36, paddingX: foundations.space.md, fontSize: fontSize.sm },
      md: { height: 44, paddingX: foundations.space.lg, fontSize: fontSize.md },
      lg: { height: 52, paddingX: 20, fontSize: fontSize.lg },
    },
  },
} as const;

/* ------------------------------------------------------------------ resolve */

export function getTheme(scheme: ColorScheme) {
  return { ...foundations, components, ...themes[scheme] };
}

export type ResolvedTheme = ReturnType<typeof getTheme>;
