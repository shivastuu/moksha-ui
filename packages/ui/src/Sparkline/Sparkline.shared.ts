import type { SemanticColors } from '@moksha-ui/tokens';
import { controlColors } from '../utils/controls';
import { textTones } from '../utils/tones';

export type SparklineTone = 'auto' | 'primary' | 'success' | 'danger' | 'neutral';

export interface SparklineProps {
  data: number[];
  /** What it shows, like "Spending this week, ₹1,200 rising to ₹1,840" */
  accessibilityLabel: string;
  /** @default 120 */
  width?: number;
  /** @default 36 */
  height?: number;
  /** `auto` is green when the last point is at or above the first, red when below @default 'auto' */
  tone?: SparklineTone;
  /** For `auto`: whether going up is good news, like savings (true) or bad, like spending (false) @default true */
  upIsGood?: boolean;
  testID?: string;
}

export type Point = [number, number];

/** Room left at the edges so the stroke and the end dot aren't clipped, in px */
export const sparkPad = 4;

/** Data to points in a width × height box, highest value at the top */
export function sparkPoints(data: number[], width: number, height: number): Point[] {
  const low = Math.min(...data);
  const high = Math.max(...data);
  const span = high - low || 1;
  const step = data.length > 1 ? (width - sparkPad * 2) / (data.length - 1) : 0;
  return data.map((value, index) => [sparkPad + index * step, high === low ? height / 2 : sparkPad + ((high - value) / span) * (height - sparkPad * 2)]);
}

const sign = (value: number) => (value < 0 ? -1 : 1);

/** Tangent at the middle point of three, kept from overshooting (d3's monotoneX, after Steffen 1990) */
function slope3([x0, y0]: Point, [x1, y1]: Point, [x2, y2]: Point) {
  const h0 = x1 - x0;
  const h1 = x2 - x1;
  const s0 = (y1 - y0) / h0;
  const s1 = (y2 - y1) / h1;
  const p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

/** Tangent at an end point, from its neighbour's */
const slope2 = ([x0, y0]: Point, [x1, y1]: Point, t: number) => (x1 - x0 ? (3 * (y1 - y0)) / (x1 - x0) - t : t) / 2;

/**
 * Cubic Bézier segments through every point, as [start, control, control, end]. A monotone curve: it never
 * rises above or dips below its neighbours, so it shows no peak that isn't in the data
 */
export function monotoneSegments(points: Point[]): [Point, Point, Point, Point][] {
  if (points.length < 2) {
    return [];
  }
  const tangents = points.map((point, index) => (index > 0 && index < points.length - 1 ? slope3(points[index - 1]!, point, points[index + 1]!) : 0));
  if (points.length > 2) {
    tangents[0] = slope2(points[0]!, points[1]!, tangents[1]!);
    tangents[points.length - 1] = slope2(points[points.length - 2]!, points[points.length - 1]!, tangents[points.length - 2]!);
  } else {
    tangents[0] = tangents[1] = (points[1]![1] - points[0]![1]) / (points[1]![0] - points[0]![0]);
  }
  return points.slice(1).map((end, index) => {
    const start = points[index]!;
    const dx = (end[0] - start[0]) / 3;
    return [start, [start[0] + dx, start[1] + dx * tangents[index]!], [end[0] - dx, end[1] - dx * tangents[index + 1]!], end];
  });
}

const fixed = ([x, y]: Point) => `${Number(x.toFixed(2))} ${Number(y.toFixed(2))}`;

/** SVG path of the curve */
export function sparkPath(points: Point[]) {
  const segments = monotoneSegments(points);
  return segments.length ? `M${fixed(points[0]!)}${segments.map(([, c1, c2, end]) => `C${fixed(c1)} ${fixed(c2)} ${fixed(end)}`).join('')}` : '';
}

/** Points along the curve, `perSegment` per segment, for drawing it without SVG */
export function sampleCurve(points: Point[], perSegment = 8): Point[] {
  const segments = monotoneSegments(points);
  if (!segments.length) {
    return points;
  }
  const at = ([p0, p1, p2, p3]: [Point, Point, Point, Point], t: number): Point => {
    const u = 1 - t;
    return [0, 1].map((axis) => u * u * u * p0[axis]! + 3 * u * u * t * p1[axis]! + 3 * u * t * t * p2[axis]! + t * t * t * p3[axis]!) as Point;
  };
  return [points[0]!, ...segments.flatMap((segment) => Array.from({ length: perSegment }, (_, step) => at(segment, (step + 1) / perSegment)))];
}

/** The line color: AA-adjusted tones, so a thin line still reads */
export function sparkColor(colors: SemanticColors, data: number[], tone: SparklineTone, upIsGood = true) {
  const tones = textTones(colors);
  if (tone === 'primary') {
    return controlColors(colors).indicator;
  }
  if (tone === 'neutral') {
    return colors.textMuted;
  }
  if (tone === 'success' || tone === 'danger') {
    return tones[tone];
  }
  const up = (data[data.length - 1] ?? 0) >= (data[0] ?? 0);
  return up === upIsGood ? tones.success : tones.danger;
}
