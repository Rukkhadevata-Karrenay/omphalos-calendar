import type { CSSProperties } from 'react';
import { OMPHALOS_TIME_WIDGET_IMAGES } from '../data/omphalosMonths';
import type { CalendarEvent } from '../types/event';
import { getCurrentOmphalosTime } from '../utils/omphalosTime';

type OmphalosClockProps = {
  now: Date;
  todayEvents?: CalendarEvent[];
};

const timeToDayPercent = (time: string): number | null => {
  const match = time.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return null;
  }
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) {
    return null;
  }
  return ((hours * 60 + minutes) / (24 * 60)) * 100;
};

const getHighlightedEvent = (events: CalendarEvent[] = []): CalendarEvent | null =>
  events.find((event) => timeToDayPercent(event.startTime) !== null && timeToDayPercent(event.endTime) !== null) ?? null;

const getAnalogHandDegrees = (date: Date): number => {
  const hours = date.getHours() % 12;
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return ((hours * 60 * 60 + minutes * 60 + seconds) / (12 * 60 * 60)) * 360;
};

const isAfterOmphalosSunset = (date: Date): boolean => {
  const seconds = date.getHours() * 60 * 60 + date.getMinutes() * 60 + date.getSeconds();
  return seconds > 19 * 60 * 60 + 12 * 60;
};

export const OmphalosClock = ({ now, todayEvents = [] }: OmphalosClockProps) => {
  const clock = getCurrentOmphalosTime(now);
  const highlightedEvent = getHighlightedEvent(todayEvents);
  const eventStart = highlightedEvent ? timeToDayPercent(highlightedEvent.startTime) : null;
  const eventEnd = highlightedEvent ? timeToDayPercent(highlightedEvent.endTime) : null;
  const skyImage = isAfterOmphalosSunset(now)
    ? OMPHALOS_TIME_WIDGET_IMAGES.skyNight
    : OMPHALOS_TIME_WIDGET_IMAGES.skyDay;
  const clockStyle = {
    '--period-progress': `${clock.periodProgressPercent}%`,
    '--day-progress': `${clock.dayProgressPercent}%`,
    '--hand-rotation': `${getAnalogHandDegrees(now)}deg`,
    '--event-start': `${eventStart ?? Math.max(0, clock.dayProgressPercent - 3)}%`,
    '--event-end': `${eventEnd ?? Math.min(100, clock.dayProgressPercent + 3)}%`,
    '--time-dial-image': `url(${OMPHALOS_TIME_WIDGET_IMAGES.dialClean})`,
    '--time-hand-image': `url(${OMPHALOS_TIME_WIDGET_IMAGES.hand})`,
    '--time-sky-image': `url(${skyImage})`,
  } as CSSProperties;

  return (
    <section className="clock-panel" aria-label="翁法罗斯时钟" style={clockStyle}>
      <div className="time-orbit-widget">
        <div className="orbit-note">
          <span>{highlightedEvent ? '今日待办' : '当前几时'}</span>
          <strong>{highlightedEvent ? `${highlightedEvent.startTime}-${highlightedEvent.endTime}` : clock.realTimeLabel}</strong>
        </div>
        <div className="orbit-constellation" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="falling-petals" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <div className="orbit-dial" aria-label={`当天总进度 ${clock.dayProgressPercent}%`}>
          <div className="orbit-event-arc" />
          <div className="orbit-progress-arc" />
          <div className="orbit-dial-image" />
          <div className="orbit-hand" />
          <div className="orbit-core">
            <span>第 {clock.mark} 刻</span>
            <strong>{clock.periodName}</strong>
          </div>
        </div>
      </div>
      <div className="clock-copy">
        <span className="eyebrow">当前时段</span>
        <h2>
          {clock.periodName}
          {clock.periodAlias ? <small> / {clock.periodAlias}</small> : null}
        </h2>
        <p>{clock.period.description}</p>
      </div>
      <div className="clock-stats">
        <span>时段进度 {clock.periodProgressPercent}%</span>
        <span>当天总进度 {clock.dayProgressPercent}%</span>
        <span>全天第 {clock.markInDay} 刻</span>
      </div>
    </section>
  );
};
