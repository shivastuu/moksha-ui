export interface Crumb {
  label: string;
  /** A link on the web */
  href?: string;
  onPress?: () => void;
}

export interface BreadcrumbsProps {
  /** From the top level down to the current page, which is the last item */
  items: Crumb[];
  /** Past this many, the middle collapses behind a "…" button @default 4 */
  maxItems?: number;
  testID?: string;
}

/** The items to show: all of them, or the first and the last few with a gap for "…" (null) */
export function visibleCrumbs<T>(items: T[], maxItems: number, expanded: boolean): (T | null)[] {
  if (expanded || items.length <= maxItems) {
    return items;
  }
  return [items[0]!, null, ...items.slice(-(maxItems - 2))];
}
