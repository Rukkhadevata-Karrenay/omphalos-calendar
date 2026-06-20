import type { CSSProperties } from 'react';
import type { OmphalosMonth } from '../data/omphalosMonths';
import type { CalendarEvent } from '../types/event';

type MonthCardProps = {
  month: OmphalosMonth;
  eventCount: number;
  onSelect: (month: OmphalosMonth) => void;
};

export const MonthCard = ({ month, eventCount, onSelect }: MonthCardProps) => (
  <button
    type="button"
    className="month-card"
    onClick={() => onSelect(month)}
    style={{ '--month-color': month.color } as CSSProperties}
  >
    <span className="month-number">{month.order}月</span>
    <img className="month-card-image" src={month.cardImage} alt={`${month.name}月份预览卡`} />
    <div className="month-card-body">
      <span>{month.season}</span>
      <h3>{month.name}</h3>
      <p>{month.deity}</p>
      <small>{eventCount > 0 ? `${eventCount} 个日程` : '暂无日程'}</small>
    </div>
  </button>
);

export const countMonthEvents = (
  events: CalendarEvent[],
  year: number,
  gregorianMonth: number,
): number => {
  const prefix = `${year}-${`${gregorianMonth}`.padStart(2, '0')}-`;
  return events.filter((event) => event.date.startsWith(prefix)).length;
};
