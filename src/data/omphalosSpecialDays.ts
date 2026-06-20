import type { CalendarEvent } from '../types/event';

export const OMPHALOS_DAY_MONTH = 11;
export const OMPHALOS_DAY_DAY = 12;
export const OMPHALOS_DAY_TITLE = '翁法罗斯之日';

export const OMPHALOS_DAY_COLOR =
  'linear-gradient(125deg, #ff4858 0%, #ffb84f 15%, #ffe66d 27%, #4aa7ff 43%, #8f5cff 58%, #50df82 73%, #ff73c7 88%, #4ff4ff 100%)';

export const isOmphalosDay = (gregorianMonth: number, day: number): boolean =>
  gregorianMonth === OMPHALOS_DAY_MONTH && day === OMPHALOS_DAY_DAY;

export const getOmphalosDayDateKey = (year: number): string => `${year}-11-12`;

export const getOmphalosDayEvent = (year: number): CalendarEvent => ({
  id: `omphalos-day-${year}`,
  title: OMPHALOS_DAY_TITLE,
  date: getOmphalosDayDateKey(year),
  startTime: '00:00',
  endTime: '23:59',
  notes: '「你好，世界」',
  color: OMPHALOS_DAY_COLOR,
});
