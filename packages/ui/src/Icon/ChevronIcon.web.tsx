const paths = { right: 'm9 6 6 6-6 6', down: 'm6 9 6 6 6-6', left: 'm15 6-6 6 6 6' };

/** A thin chevron in the text color: right (a row that opens something), down (a section that expands) or left (back) */
export function ChevronIcon({ direction = 'right', className }: { direction?: keyof typeof paths; className?: string }) {
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
      <path d={paths[direction]} />
    </svg>
  );
}
