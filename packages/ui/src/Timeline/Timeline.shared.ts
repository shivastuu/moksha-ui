export type TimelineStatus = 'complete' | 'current' | 'upcoming' | 'failed';

export interface TimelineItem {
  title: string;
  description?: string;
  /** Already formatted, like "1:24:03 pm" */
  time?: string;
  status: TimelineStatus;
}

export interface TimelineProps {
  items: TimelineItem[];
  testID?: string;
}

/** Status dot size in px */
export const timelineDot = 20;

/** Spoken before each title, so status never rests on color alone */
export const timelineWords: Record<TimelineStatus, string> = { complete: 'Done', current: 'In progress', upcoming: 'Next', failed: 'Failed' };

/** "Done: Debited from Savings •• 4821, 1:24:05 pm" */
export const timelineLabel = ({ title, description, time, status }: TimelineItem) =>
  [`${timelineWords[status]}: ${title}`, description, time].filter(Boolean).join(', ');
