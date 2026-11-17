export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type FloatingSide = 'top' | 'bottom';

export type FloatingAlign = 'start' | 'center' | 'end';

/**
 * Where a popover goes next to its anchor: on the preferred side if it fits, else the other side if that
 * fits, else whichever has more room, then kept `margin` inside the viewport
 */
export function placeFloating(
  anchor: Rect,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
  side: FloatingSide = 'bottom',
  align: FloatingAlign = 'start',
  gap = 8,
  margin = 8
) {
  const room = { bottom: viewport.height - (anchor.y + anchor.height) - gap - margin, top: anchor.y - gap - margin };
  const other: FloatingSide = side === 'bottom' ? 'top' : 'bottom';
  const placed = room[side] >= size.height ? side : room[other] >= size.height ? other : room[side] >= room[other] ? side : other;
  const x = align === 'start' ? anchor.x : align === 'end' ? anchor.x + anchor.width - size.width : anchor.x + (anchor.width - size.width) / 2;
  const y = placed === 'bottom' ? anchor.y + anchor.height + gap : anchor.y - gap - size.height;
  const clamp = (value: number, low: number, high: number) => Math.max(low, Math.min(value, Math.max(low, high)));
  return {
    x: clamp(x, margin, viewport.width - margin - size.width),
    y: clamp(y, margin, viewport.height - margin - size.height),
    side: placed,
  };
}
