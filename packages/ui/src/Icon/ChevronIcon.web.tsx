/** A thin chevron in the text color, pointing right (a row that opens something) or down (a section that expands) */
export function ChevronIcon({ direction = 'right', className }: { direction?: 'right' | 'down'; className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'right' ? 'm9 6 6 6-6 6' : 'm6 9 6 6 6-6'} />
    </svg>
  );
}
