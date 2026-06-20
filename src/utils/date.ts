import { getOmphalosMonthByGregorianMonth } from '../data/omphalosMonths';

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string): Date => {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDateTime = (date: Date): string =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

export const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);

export const getOmphalosDate = (date: Date) => {
  const gregorianMonth = date.getMonth() + 1;
  const month = getOmphalosMonthByGregorianMonth(gregorianMonth);
  return {
    month,
    day: date.getDate(),
    label: `${month.name} 第 ${date.getDate()} 日`,
  };
};

export const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month, 0).getDate();

export type CalendarCell = {
  date: Date | null;
  dateKey: string | null;
  day: number | null;
};

type WeekStart = 'monday' | 'sunday';

export const getCalendarCells = (
  year: number,
  gregorianMonth: number,
  weekStart: WeekStart = 'monday',
  minRows = 0,
): CalendarCell[] => {
  const daysInMonth = getDaysInMonth(year, gregorianMonth);
  const firstDay = new Date(year, gregorianMonth - 1, 1);
  const firstDayIndex = firstDay.getDay();
  const offset = weekStart === 'monday' ? (firstDayIndex + 6) % 7 : firstDayIndex;
  const cells: CalendarCell[] = [];

  for (let index = 0; index < offset; index += 1) {
    cells.push({ date: null, dateKey: null, day: null });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, gregorianMonth - 1, day);
    cells.push({ date, dateKey: toDateKey(date), day });
  }

  while (cells.length % 7 !== 0) {
    cells.push({ date: null, dateKey: null, day: null });
  }

  while (cells.length < minRows * 7) {
    cells.push({ date: null, dateKey: null, day: null });
  }

  return cells;
};
