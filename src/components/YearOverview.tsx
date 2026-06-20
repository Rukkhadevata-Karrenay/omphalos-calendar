import {
  OMPHALOS_MONTHS,
  OMPHALOS_YEAR_OVERVIEW_IMAGE,
  type OmphalosMonth,
} from '../data/omphalosMonths';
import { OMPHALOS_DAY_MONTH } from '../data/omphalosSpecialDays';
import type { CalendarEvent } from '../types/event';
import { MonthCard, countMonthEvents } from './MonthCard';

type YearOverviewProps = {
  year: number;
  events: CalendarEvent[];
  onSelectMonth: (month: OmphalosMonth) => void;
};

export const YearOverview = ({ year, events, onSelectMonth }: YearOverviewProps) => (
  <main
    className="page-shell year-page"
    style={{ '--year-overview-image': `url(${OMPHALOS_YEAR_OVERVIEW_IMAGE})` } as React.CSSProperties}
  >
    <section className="section-heading year-hero-panel">
      <img src={OMPHALOS_YEAR_OVERVIEW_IMAGE} alt="德谬歌月份预览卡" />
      <div>
        <span className="eyebrow">Year Overview</span>
        <h1>翁法罗斯一年历总览</h1>
        <span className="year-caption">{year}</span>
      </div>
    </section>
    <section className="month-grid">
      {OMPHALOS_MONTHS.map((month) => (
        <MonthCard
          eventCount={
            countMonthEvents(events, year, month.gregorianMonth) +
            (month.gregorianMonth === OMPHALOS_DAY_MONTH ? 1 : 0)
          }
          key={month.order}
          month={month}
          onSelect={onSelectMonth}
        />
      ))}
    </section>
  </main>
);
