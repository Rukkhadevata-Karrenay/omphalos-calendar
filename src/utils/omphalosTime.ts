import {
  OMPHALOS_MARKS_PER_PERIOD,
  OMPHALOS_TIME_PERIODS,
  SECONDS_PER_PERIOD,
  SECONDS_PER_MARK,
  type OmphalosTimePeriod,
} from '../data/omphalosTime';

export type CurrentOmphalosTime = {
  period: OmphalosTimePeriod;
  periodName: string;
  periodAlias: string | null;
  mark: number;
  markInDay: number;
  secondsSinceMidnight: number;
  secondsIntoPeriod: number;
  periodProgressPercent: number;
  dayProgressPercent: number;
  realTimeLabel: string;
};

export type OmphalosClockState = CurrentOmphalosTime & {
  progressInPeriod: number;
  progressInDay: number;
};

export const getSecondsSinceMidnight = (date: Date): number =>
  date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();

const getPeriodIndex = (period: OmphalosTimePeriod): number =>
  OMPHALOS_TIME_PERIODS.findIndex((item) => item.id === period.id);

const toPercent = (value: number): number => Math.round(value * 10000) / 100;

const getPeriodProgress = (seconds: number, period: OmphalosTimePeriod): number => {
  const isFinalSecondOfDay = seconds === 24 * 60 * 60 - 1;
  if (seconds >= period.endSecond || isFinalSecondOfDay) {
    return 1;
  }
  return Math.min(1, Math.max(0, (seconds - period.startSecond) / SECONDS_PER_PERIOD));
};

export const getCurrentOmphalosTime = (date: Date): CurrentOmphalosTime => {
  const seconds = getSecondsSinceMidnight(date);
  const period =
    OMPHALOS_TIME_PERIODS.find(
      (item) => seconds >= item.startSecond && seconds <= item.endSecond,
    ) ?? OMPHALOS_TIME_PERIODS[OMPHALOS_TIME_PERIODS.length - 1];
  const secondsIntoPeriod = Math.max(0, seconds - period.startSecond);
  const mark = Math.min(OMPHALOS_MARKS_PER_PERIOD, Math.floor(secondsIntoPeriod / SECONDS_PER_MARK) + 1);
  const periodIndex = getPeriodIndex(period);
  const markInDay = periodIndex * OMPHALOS_MARKS_PER_PERIOD + mark;
  const periodProgress = getPeriodProgress(seconds, period);
  const dayProgress = Math.min(1, seconds / (24 * 60 * 60));
  const realTimeLabel = new Intl.DateTimeFormat('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);

  return {
    period,
    periodName: period.name,
    periodAlias: period.alias ?? null,
    mark,
    markInDay,
    secondsSinceMidnight: seconds,
    secondsIntoPeriod,
    periodProgressPercent: toPercent(periodProgress),
    dayProgressPercent: toPercent(dayProgress),
    realTimeLabel,
  };
};

export const getOmphalosClockState = (date: Date): OmphalosClockState => {
  const current = getCurrentOmphalosTime(date);
  return {
    ...current,
    progressInPeriod: current.periodProgressPercent / 100,
    progressInDay: current.dayProgressPercent / 100,
  };
};
