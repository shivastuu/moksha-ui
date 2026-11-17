export interface DatePickerProps {
  label: string;
  /** The chosen day as 'YYYY-MM-DD', or '' for none */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Earliest day that can be chosen, 'YYYY-MM-DD' */
  min?: string;
  /** Latest day that can be chosen, 'YYYY-MM-DD' */
  max?: string;
  /** @default 'Choose a date' */
  placeholder?: string;
  helperText?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  /** 0 is Sunday, India's usual first day; 1 is Monday @default 0 */
  weekStartsOn?: 0 | 1;
  /** What counts as today, 'YYYY-MM-DD'. Defaults to the device's local date */
  today?: string;
  testID?: string;
}

/** A calendar day; month is 1 to 12 */
export interface Day {
  year: number;
  month: number;
  day: number;
}

export const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Day math runs in UTC, so a time zone or a DST change can never move a day
const utc = ({ year, month, day }: Day) => new Date(Date.UTC(year, month - 1, day));
const fromUtc = (date: Date): Day => ({ year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() });

export function parseDay(text: string | undefined): Day | undefined {
  const match = text?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return undefined;
  }
  const day = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]) };
  const check = fromUtc(utc(day));
  // Rejects days that don't exist, like 2026-02-30
  return check.year === day.year && check.month === day.month && check.day === day.day ? day : undefined;
}

const pad = (value: number) => String(value).padStart(2, '0');

export const dayText = ({ year, month, day }: Day) => `${year}-${pad(month)}-${pad(day)}`;

export const sameDay = (a?: Day, b?: Day) => !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day;

export const compareDays = (a: Day, b: Day) => utc(a).getTime() - utc(b).getTime();

export const addDays = (day: Day, count: number) => fromUtc(new Date(utc(day).getTime() + count * 86_400_000));

export const daysInMonth = (year: number, month: number) => new Date(Date.UTC(year, month, 0)).getUTCDate();

/** The same day `count` months away, pulled back to the month's last day when it's shorter (31 Jan + 1 → 28 Feb) */
export function addMonths({ year, month, day }: Day, count: number): Day {
  const index = year * 12 + (month - 1) + count;
  const next = { year: Math.floor(index / 12), month: (index % 12) + 1 };
  return { ...next, day: Math.min(day, daysInMonth(next.year, next.month)) };
}

export const weekdayOf = (day: Day) => utc(day).getUTCDay();

/** Months counted from year 0, for comparing months */
export const monthIndex = ({ year, month }: Day) => year * 12 + month;

/** The 42 days (6 weeks) shown for a month, starting on `weekStartsOn` */
export function monthGrid(year: number, month: number, weekStartsOn: 0 | 1): Day[] {
  const first = { year, month, day: 1 };
  const start = addDays(first, -((weekdayOf(first) - weekStartsOn + 7) % 7));
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export const inRange = (day: Day, min?: Day, max?: Day) => (!min || compareDays(day, min) >= 0) && (!max || compareDays(day, max) <= 0);

/** "17 Nov 2026" in the field */
export const shortDay = ({ year, month, day }: Day) => `${day} ${monthNames[month - 1]!.slice(0, 3)} ${year}`;

/** "Tuesday, 17 November 2026" for screen readers */
export const spokenDay = (day: Day) => `${weekdayNames[weekdayOf(day)]}, ${day.day} ${monthNames[day.month - 1]} ${day.year}`;

/** Where a key moves the focused day in the grid (WAI-ARIA date picker keys), or null for other keys */
export function moveDay(key: string, day: Day, weekStartsOn: 0 | 1): Day | null {
  const intoWeek = (weekdayOf(day) - weekStartsOn + 7) % 7;
  const moves: Record<string, () => Day> = {
    ArrowLeft: () => addDays(day, -1),
    ArrowRight: () => addDays(day, 1),
    ArrowUp: () => addDays(day, -7),
    ArrowDown: () => addDays(day, 7),
    PageUp: () => addMonths(day, -1),
    PageDown: () => addMonths(day, 1),
    Home: () => addDays(day, -intoWeek),
    End: () => addDays(day, 6 - intoWeek),
  };
  return moves[key]?.() ?? null;
}

/** Today on this device, as a Day */
export function localToday(): Day {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
}

/** The day the calendar opens on: the chosen one, else today, kept inside min and max */
export function startDay(selected: Day | undefined, today: Day, min?: Day, max?: Day) {
  const day = selected ?? today;
  return min && compareDays(day, min) < 0 ? min : max && compareDays(day, max) > 0 ? max : day;
}
