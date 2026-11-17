'use client';

import { useId } from 'react';
import { useTheme } from '../theme/context';
import { sparkColor, sparkPad, sparkPath, sparkPoints, type SparklineProps } from './Sparkline.shared';

/** A small trend line with a soft fill under it and a dot on the latest value. It draws itself in on mount */
export function Sparkline({ data, accessibilityLabel, width = 120, height = 36, tone = 'auto', upIsGood = true, testID }: SparklineProps) {
  const { colors } = useTheme();
  const id = useId();
  if (!data.length) {
    return null;
  }
  const points = sparkPoints(data, width, height);
  const line = sparkPath(points);
  const color = sparkColor(colors, data, tone, upIsGood);
  const [lastX, lastY] = points[points.length - 1]!;
  return (
    <svg className="ds-sparkline" role="img" aria-label={accessibilityLabel} width={width} height={height} viewBox={`0 0 ${width} ${height}`} data-testid={testID}>
      <defs>
        <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.22" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {line && <path className="ds-sparkline__area" d={`${line}L${lastX} ${height}L${sparkPad} ${height}Z`} fill={`url(#${id}-fill)`} />}
      {line && <path className="ds-sparkline__line" d={line} pathLength={1} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />}
      <circle className="ds-sparkline__dot" cx={lastX} cy={lastY} r="3" fill={color} stroke={colors.background} strokeWidth="1.5" />
    </svg>
  );
}
