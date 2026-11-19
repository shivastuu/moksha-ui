export interface PaginationProps {
  /** The current page, from 1 */
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  pageCount: number;
  /** What is paged, for screen readers @default 'Pagination' */
  accessibilityLabel?: string;
  testID?: string;
}

export type PageItem = number | 'start-ellipsis' | 'end-ellipsis';

/** Width two arrows and 7 slots of 36px with 4px gaps need. Narrower, the list drops to 5 slots (1 … 5 … 12) */
export const compactBelow = 9 * 36 + 8 * 4;

const range = (start: number, end: number) => Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);

/**
 * The buttons to show: first and last page, the current page with one on each side, and ellipses for the
 * gaps. Past 7 pages there are always 7 slots, so buttons don't jump as you page (MUI's usePagination rule)
 */
export function pageItems(page: number, count: number, siblings = 1): PageItem[] {
  const boundary = 1;
  const start = range(1, Math.min(boundary, count));
  const end = range(Math.max(count - boundary + 1, boundary + 1), count);
  const from = Math.max(Math.min(page - siblings, count - boundary - siblings * 2 - 1), boundary + 2);
  const to = Math.min(Math.max(page + siblings, boundary + siblings * 2 + 2), count - boundary - 1);
  return [
    ...start,
    ...(from > boundary + 2 ? (['start-ellipsis'] as const) : boundary + 1 < count - boundary ? [boundary + 1] : []),
    ...range(from, to),
    ...(to < count - boundary - 1 ? (['end-ellipsis'] as const) : count - boundary > boundary ? [count - boundary] : []),
    ...end,
  ];
}
