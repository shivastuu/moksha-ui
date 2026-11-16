type Rgb = [number, number, number];

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

export type ColorScale = Record<ScaleStep, string>;

export function parseHex(hex: string): Rgb {
  const value = hex.replace('#', '');
  const full = value.length === 3 ? [...value].map((char) => char + char).join('') : value;
  if (!/^[0-9a-f]{6}$/i.test(full)) {
    throw new Error(`Expected a hex color like #3355FF, received "${hex}"`);
  }
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255) as Rgb;
}

export function toHex(rgb: Rgb) {
  return `#${rgb
    .map((channel) =>
      Math.round(Math.min(1, Math.max(0, channel)) * 255)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')
    .toUpperCase()}`;
}

/** A palette color with transparency, as `rgba(r, g, b, opacity)` */
export function alpha(hex: string, opacity: number) {
  const [r, g, b] = parseHex(hex).map((channel) => Math.round(channel * 255));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function toOklab(hex: string) {
  const { l, c, h } = hexToOklch(hex);
  const radians = (h * Math.PI) / 180;
  return { l, a: c * Math.cos(radians), b: c * Math.sin(radians) };
}

/** Mixes `weight` of `a` into `b` in OKLab, like CSS `color-mix(in oklab, a, b)`: 0.1 gives a light tint of `a` */
export function mix(a: string, b: string, weight: number) {
  const x = toOklab(a);
  const y = toOklab(b);
  const lerp = (from: number, to: number) => from * weight + to * (1 - weight);
  const A = lerp(x.a, y.a);
  const B = lerp(x.b, y.b);
  return oklchToHex({ l: lerp(x.l, y.l), c: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI });
}

const toLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);

const toGamma = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToOklch(hex: string): Oklch {
  const [r, g, b] = parseHex(hex).map(toLinear) as Rgb;
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { l: L, c: Math.hypot(A, B), h: (Math.atan2(B, A) * 180) / Math.PI };
}

function oklchToLinear({ l: L, c, h }: Oklch): Rgb {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const inGamut = (rgb: Rgb) => rgb.every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4);

/** Converts to hex, lowering chroma until the color fits in sRGB so the hue and lightness stay */
export function oklchToHex(color: Oklch) {
  let low = 0;
  let high = color.c;
  if (!inGamut(oklchToLinear(color))) {
    for (let i = 0; i < 24; i += 1) {
      const mid = (low + high) / 2;
      if (inGamut(oklchToLinear({ ...color, c: mid }))) {
        low = mid;
      } else {
        high = mid;
      }
    }
    high = low;
  }
  return toHex(oklchToLinear({ ...color, c: high }).map(toGamma) as Rgb);
}

export function luminance(hex: string) {
  const [r, g, b] = parseHex(hex).map(toLinear) as Rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG 2 contrast ratio, from 1 to 21 */
export function contrastRatio(a: string, b: string) {
  const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (high + 0.05) / (low + 0.05);
}

const steps: ScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const lightness: Record<ScaleStep, number> = {
  50: 0.975, 100: 0.945, 200: 0.89, 300: 0.81, 400: 0.71, 500: 0.62, 600: 0.54, 700: 0.46, 800: 0.38, 900: 0.29,
};
const chroma: Record<ScaleStep, number> = {
  50: 0.15, 100: 0.3, 200: 0.55, 300: 0.8, 400: 0.95, 500: 1, 600: 1, 700: 0.9, 800: 0.75, 900: 0.6,
};

/** A 50–900 scale with even perceived steps. The brand color itself replaces the step closest to its lightness. */
export function generateScale(brand: string): ColorScale {
  const base = hexToOklch(brand);
  const closest = steps.reduce((best, step) =>
    Math.abs(lightness[step] - base.l) < Math.abs(lightness[best] - base.l) ? step : best
  );
  return Object.fromEntries(
    steps.map((step) => [
      step,
      step === closest
        ? toHex(parseHex(brand))
        : oklchToHex({ l: lightness[step], c: base.c * chroma[step], h: base.h }),
    ])
  ) as ColorScale;
}
