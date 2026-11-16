/**
 * The single source of truth for the design system.
 *
 * - `palette`: raw color scales. Components never use these directly.
 * - `foundations`: values that are the same in light and dark (type, space, radius, motion, glass, ...).
 * - `themes.light` / `themes.dark`: semantic colors and shadows for each color scheme.
 * - `components`: component-level decisions built from the values above.
 * - `createTheme(options)`: your own theme from a brand color and any overrides.
 * - `getTheme(scheme)` / `resolveTheme(theme, scheme)`: everything resolved for one color scheme.
 */

import { alpha, contrastRatio, generateScale, parseHex, toHex, type ColorScale, type ScaleStep } from './color.ts';
import type { Spring } from './spring.ts';

export type ColorScheme = 'light' | 'dark';

/* -------------------------------------------------------------------- types */

export type FontWeightName = 'regular' | 'medium' | 'semibold';
export type FontSizeToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type TextStyleName = 'display' | 'heading' | 'title' | 'body' | 'bodySmall' | 'label' | 'caption';
export type SpaceToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
export type RadiusToken = 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ShadowName = 'sm' | 'md' | 'lg';
export type BlurToken = 'sm' | 'md' | 'lg';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface TextStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: FontWeightName;
}

export type NativeFonts = Record<FontWeightName, string>;

export interface Typography {
  fontFamily: {
    /** CSS font stack for the web */
    web: string;
    /** One family per weight on React Native, as loaded with expo-font (Android does not synthesize weights) */
    native: NativeFonts;
  };
  /** CSS / React Native font weight per name */
  fontWeight: Record<FontWeightName, '400' | '500' | '600' | '700'>;
  /** Font sizes in px */
  fontSize: Record<FontSizeToken, number>;
  /** Line heights in px */
  lineHeight: Record<FontSizeToken, number>;
  /** Letter spacing in px */
  letterSpacing: { tight: number; normal: number; wide: number };
  /** Ready-made combinations for headings, body text and labels */
  textStyles: Record<TextStyleName, TextStyle>;
}

export interface Foundations {
  typography: Typography;
  /** Spacing scale in px (4-point grid) */
  space: Record<SpaceToken, number>;
  /** Corner radius in px */
  radius: Record<RadiusToken, number>;
  /** Border widths in px */
  borderWidth: { thin: number; thick: number };
  opacity: { disabled: number; muted: number };
  /** Keyboard focus indicator, in px */
  focusRing: { width: number; offset: number };
  motion: {
    /** Durations in ms */
    duration: { fast: number; normal: number; slow: number };
    /** CSS easing curves */
    easing: { standard: string; enter: string; exit: string };
    /** How far things move when they enter or shake, in px */
    distance: { sm: number; md: number; lg: number };
    /** Scale factors: pressed buttons, entering elements, OTP digits popping in */
    scale: { pressed: number; enter: number; pop: number };
    /** Delay between items of a staggered list, in ms */
    stagger: number;
    /** Physical springs: `snappy` for taps and toggles, `smooth` for movement, `bouncy` for playful moments */
    spring: { snappy: Spring; smooth: Spring; bouncy: Spring };
  };
  /** Frosted glass: backdrop blur radius in px, and color saturation behind the glass */
  glass: { blur: Record<BlurToken, number>; saturation: number };
  zIndex: { base: number; dropdown: number; overlay: number; modal: number; toast: number };
  /** Min widths in px */
  breakpoints: { sm: number; md: number; lg: number; xl: number };
}

export interface SemanticColors {
  /** Page background */
  background: string;
  /** Cards, sections and inputs on top of the background */
  surface: string;
  /** Floating layers: sheets, menus, dialogs (pair with a shadow) */
  surfaceRaised: string;
  /** Dark-on-light (or light-on-dark) layer such as a snackbar */
  surfaceInverse: string;
  /** Translucent fill for glass surfaces (shown over a backdrop blur) */
  glassSurface: string;
  /** Hairline edge that makes glass surfaces readable */
  glassBorder: string;
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

export interface SchemeTokens {
  scheme: ColorScheme;
  colors: SemanticColors;
  /** CSS box-shadow values, used as is on the web and as `boxShadow` on React Native (0.76+) */
  shadows: Record<ShadowName, string>;
}

export interface Components {
  button: {
    radius: number;
    borderWidth: number;
    gap: number;
    fontWeight: FontWeightName;
    sizes: Record<ComponentSize, { height: number; paddingX: number; fontSize: number }>;
  };
  /** Text inputs: TextField and everything built on it */
  field: {
    radius: number;
    borderWidth: number;
    /** Space between prefix, input and suffix */
    gap: number;
    /** Space between the label and the input */
    labelGap: number;
    /** Space between the input and the helper or error text */
    messageGap: number;
    labelStyle: TextStyleName;
    messageStyle: TextStyleName;
    sizes: Record<'md' | 'lg', { height: number; paddingX: number; fontSize: number }>;
  };
  /** OTP and PIN cells */
  otp: { cellSize: number; gap: number; radius: number; fontSize: number };
  /** Dialog and BottomSheet */
  modal: {
    radius: number;
    padding: number;
    dialogMaxWidth: number;
    sheetMaxWidth: number;
    handleWidth: number;
    handleHeight: number;
  };
  snackbar: {
    radius: number;
    padding: number;
    maxWidth: number;
    /** Distance from the bottom of the screen */
    offset: number;
    /** How long a snackbar stays, in ms */
    duration: number;
  };
  banner: {
    radius: number;
    padding: number;
    gap: number;
    iconSize: number;
    /** How much of the tone color tints the background and the border, 0 to 1 */
    tint: { background: number; border: number };
  };
  /** Offer and announcement cards */
  promo: { radius: number; padding: number; minHeight: number };
  /** Round icon-only buttons */
  iconButton: { sizes: Record<'sm' | 'md' | 'lg', number> };
  /** The 3D payment card */
  bankCard: {
    radius: number;
    padding: number;
    maxWidth: number;
    /** Largest tilt toward the pointer or finger, in degrees */
    tilt: number;
  };
}

/** A complete theme: what `createTheme` returns and `ThemeProvider` accepts */
export interface ThemeDefinition {
  foundations: Foundations;
  components: Components;
  themes: Record<ColorScheme, SchemeTokens>;
}

/** Everything for one color scheme, as returned by `useTheme()` */
export type ResolvedTheme = Foundations & SchemeTokens & { components: Components };

/* ------------------------------------------------------------------ palette */

export const palette = {
  /** Brand: Cobalt #3355FF (step 600), generated in OKLCH with generateScale */
  brand: {
    50: '#F3F7FF',
    100: '#E5EDFF',
    200: '#CBDAFF',
    300: '#A6BFFF',
    400: '#789CFF',
    500: '#5179FF',
    600: '#3355FF',
    700: '#253ED4',
    800: '#1A2EA5',
    900: '#0E1A75',
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

const fontSize: Record<FontSizeToken, number> = { xs: 12, sm: 14, md: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30 };
const lineHeight: Record<FontSizeToken, number> = { xs: 16, sm: 20, md: 24, lg: 28, xl: 28, '2xl': 32, '3xl': 38 };

export const typography: Typography = {
  fontFamily: {
    web: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    native: {
      regular: 'Inter_400Regular',
      medium: 'Inter_500Medium',
      semibold: 'Inter_600SemiBold',
    },
  },
  fontWeight: { regular: '400', medium: '500', semibold: '600' },
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
};

export const foundations: Foundations = {
  typography,
  space: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, '2xl': 32, '3xl': 48 },
  radius: { sm: 6, md: 10, lg: 14, xl: 20, full: 999 },
  borderWidth: { thin: 1, thick: 2 },
  opacity: { disabled: 0.5, muted: 0.7 },
  focusRing: { width: 2, offset: 2 },
  motion: {
    duration: { fast: 150, normal: 250, slow: 350 },
    easing: {
      standard: 'cubic-bezier(0.2, 0, 0, 1)',
      enter: 'cubic-bezier(0, 0, 0, 1)',
      exit: 'cubic-bezier(0.3, 0, 1, 1)',
    },
    distance: { sm: 4, md: 8, lg: 24 },
    scale: { pressed: 0.97, enter: 0.96, pop: 1.15 },
    stagger: 50,
    spring: {
      snappy: { stiffness: 400, damping: 30, mass: 1 },
      smooth: { stiffness: 170, damping: 26, mass: 1 },
      bouncy: { stiffness: 300, damping: 16, mass: 1 },
    },
  },
  glass: { blur: { sm: 12, md: 24, lg: 40 }, saturation: 1.8 },
  zIndex: { base: 0, dropdown: 1000, overlay: 1100, modal: 1200, toast: 1300 },
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280 },
};

/* ------------------------------------------------------------ color schemes */

export const themes: Record<ColorScheme, SchemeTokens> = {
  light: {
    scheme: 'light',
    colors: {
      background: palette.slate[0],
      surface: palette.slate[50],
      surfaceRaised: palette.slate[0],
      surfaceInverse: palette.slate[900],
      glassSurface: alpha(palette.slate[0], 0.6),
      glassBorder: alpha(palette.slate[0], 0.7),
      text: palette.slate[900],
      textMuted: palette.slate[600],
      textOnPrimary: palette.slate[0],
      textInverse: palette.slate[50],
      border: palette.slate[200],
      primary: palette.brand[600],
      primaryPressed: palette.brand[700],
      primarySubtle: palette.brand[50],
      success: palette.green[500],
      warning: palette.amber[500],
      danger: palette.red[500],
      focusRing: palette.brand[500],
      overlay: alpha(palette.slate[950], 0.5),
    },
    shadows: {
      sm: `0px 1px 2px ${alpha(palette.slate[900], 0.08)}`,
      md: `0px 4px 12px ${alpha(palette.slate[900], 0.12)}`,
      lg: `0px 12px 32px ${alpha(palette.slate[900], 0.16)}`,
    },
  },
  dark: {
    scheme: 'dark',
    colors: {
      background: palette.slate[950],
      surface: palette.slate[900],
      surfaceRaised: palette.slate[800],
      surfaceInverse: palette.slate[50],
      glassSurface: alpha(palette.slate[800], 0.55),
      glassBorder: alpha(palette.slate[0], 0.12),
      text: palette.slate[50],
      textMuted: palette.slate[400],
      textOnPrimary: palette.slate[950],
      textInverse: palette.slate[900],
      border: palette.slate[700],
      primary: palette.brand[300],
      primaryPressed: palette.brand[200],
      primarySubtle: palette.brand[900],
      success: palette.green[300],
      warning: palette.amber[300],
      danger: palette.red[300],
      focusRing: palette.brand[300],
      overlay: alpha(palette.slate[950], 0.7),
    },
    shadows: {
      sm: `0px 1px 2px ${alpha(palette.slate[950], 0.4)}`,
      md: `0px 4px 12px ${alpha(palette.slate[950], 0.5)}`,
      lg: `0px 12px 32px ${alpha(palette.slate[950], 0.6)}`,
    },
  },
};

/* --------------------------------------------------------------- components */

export const components: Components = {
  button: {
    // Pills: the shape people read as a tappable, premium button
    radius: foundations.radius.full,
    borderWidth: foundations.borderWidth.thin,
    gap: foundations.space.sm,
    fontWeight: 'semibold',
    sizes: {
      sm: { height: 36, paddingX: foundations.space.md, fontSize: fontSize.sm },
      md: { height: 44, paddingX: foundations.space.lg, fontSize: fontSize.md },
      lg: { height: 52, paddingX: 20, fontSize: fontSize.lg },
    },
  },
  field: {
    radius: foundations.radius.md,
    borderWidth: foundations.borderWidth.thin,
    gap: foundations.space.sm,
    labelGap: foundations.space.sm,
    messageGap: foundations.space.xs,
    labelStyle: 'label',
    messageStyle: 'caption',
    sizes: {
      md: { height: 48, paddingX: foundations.space.md, fontSize: fontSize.md },
      lg: { height: 56, paddingX: foundations.space.lg, fontSize: fontSize.lg },
    },
  },
  otp: { cellSize: 48, gap: foundations.space.sm, radius: foundations.radius.md, fontSize: fontSize.xl },
  modal: {
    radius: foundations.radius.xl,
    padding: foundations.space.xl,
    dialogMaxWidth: 440,
    sheetMaxWidth: 560,
    handleWidth: 40,
    handleHeight: 4,
  },
  snackbar: {
    radius: foundations.radius.md,
    padding: foundations.space.md,
    maxWidth: 560,
    offset: foundations.space.lg,
    duration: 4000,
  },
  banner: {
    radius: foundations.radius.lg,
    padding: foundations.space.md,
    gap: foundations.space.md,
    iconSize: 32,
    tint: { background: 0.1, border: 0.3 },
  },
  promo: { radius: foundations.radius.xl, padding: foundations.space.xl, minHeight: 152 },
  iconButton: { sizes: { sm: 32, md: 40, lg: 52 } },
  bankCard: { radius: 18, padding: foundations.space.xl, maxWidth: 360, tilt: 14 },
};

export const defaultTheme: ThemeDefinition = { foundations, components, themes };

/* -------------------------------------------------------------- customising */

export type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };

export interface ThemeOptions {
  /** Your brand color. Generates the primary scale and every primary token for light and dark, kept WCAG AA */
  brandColor?: string;
  /** Override any semantic color per scheme. Overriding `primary` alone recomputes `textOnPrimary` */
  colors?: Partial<Record<ColorScheme, Partial<SemanticColors>>>;
  shadows?: Partial<Record<ColorScheme, Partial<Record<ShadowName, string>>>>;
  /** Override any foundation value: fonts, space, radius, motion, glass, ... */
  foundations?: DeepPartial<Foundations>;
  /** Override component decisions, for example button heights */
  components?: DeepPartial<Components>;
}

function merge<T extends object>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) {
    return base;
  }
  const result = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(override)) {
    const current = (base as Record<string, unknown>)[key];
    result[key] =
      value && typeof value === 'object' && current && typeof current === 'object'
        ? merge(current, value as DeepPartial<typeof current>)
        : value;
  }
  return result as T;
}

/** White or near-black, whichever reads better on `background` */
export function readableTextOn(background: string) {
  return contrastRatio(palette.slate[0], background) >= contrastRatio(palette.slate[950], background)
    ? palette.slate[0]
    : palette.slate[950];
}

function primaryTokens(scale: ColorScale, scheme: ColorScheme, background: string, brandStep?: ScaleStep) {
  const fallbacks: ScaleStep[] = scheme === 'light' ? [600, 700, 800, 900] : [300, 200, 400, 100];
  const candidates = brandStep ? [brandStep, ...fallbacks.filter((step) => step !== brandStep)] : fallbacks;
  const steps: ScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const pressedOf = (step: ScaleStep): ScaleStep => {
    const index = steps.indexOf(step);
    const next = scheme === 'light' ? index + 1 : index - 1;
    return steps[next] ?? steps[scheme === 'light' ? index - 1 : index + 1]!;
  };
  const subtle = scheme === 'light' ? scale[50] : scale[900];

  const pick =
    candidates.find((step) => {
      const primary = scale[step];
      const text = readableTextOn(primary);
      return (
        contrastRatio(primary, background) >= 4.5 &&
        contrastRatio(primary, subtle) >= 4.5 &&
        contrastRatio(text, primary) >= 4.5 &&
        contrastRatio(text, scale[pressedOf(step)]) >= 4.5
      );
    }) ?? candidates[candidates.length - 1]!;

  const focusSteps: ScaleStep[] = scheme === 'light' ? [400, 500, 600, 700] : [300, 400, 200];
  const focus = focusSteps.find((step) => contrastRatio(scale[step], background) >= 3) ?? pick;

  return {
    primary: scale[pick],
    primaryPressed: scale[pressedOf(pick)],
    primarySubtle: subtle,
    textOnPrimary: readableTextOn(scale[pick]),
    focusRing: scale[focus],
  };
}

/**
 * Builds a theme from a brand color and any overrides.
 *
 * @example
 * const theme = createTheme({ brandColor: '#0E7C66', foundations: { radius: { md: 12 } } });
 * <ThemeProvider theme={theme} colorScheme="dark">…</ThemeProvider>
 */
export function createTheme(options: ThemeOptions = {}): ThemeDefinition {
  const scale = options.brandColor ? generateScale(options.brandColor) : undefined;
  const brandHex = options.brandColor ? toHex(parseHex(options.brandColor)) : undefined;
  const brandStep = scale
    ? (Object.keys(scale).map(Number) as ScaleStep[]).find((step) => scale[step] === brandHex)
    : undefined;

  const schemeTokens = (scheme: ColorScheme): SchemeTokens => {
    const base = themes[scheme];
    const brand = scale ? primaryTokens(scale, scheme, base.colors.background, brandStep) : {};
    const overrides = options.colors?.[scheme] ?? {};
    const colors = { ...base.colors, ...brand, ...overrides };
    if (overrides.primary && !overrides.textOnPrimary) {
      colors.textOnPrimary = readableTextOn(overrides.primary);
    }
    return { scheme, colors, shadows: { ...base.shadows, ...options.shadows?.[scheme] } };
  };

  return {
    foundations: merge(foundations, options.foundations),
    components: merge(components, options.components),
    themes: { light: schemeTokens('light'), dark: schemeTokens('dark') },
  };
}

/** Everything in `theme` for one color scheme */
export function resolveTheme(theme: ThemeDefinition, scheme: ColorScheme): ResolvedTheme {
  return { ...theme.foundations, components: theme.components, ...theme.themes[scheme] };
}

/** The default theme for one color scheme */
export function getTheme(scheme: ColorScheme): ResolvedTheme {
  return resolveTheme(defaultTheme, scheme);
}
