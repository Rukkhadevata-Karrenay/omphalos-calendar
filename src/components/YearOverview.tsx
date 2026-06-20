import {
  OMPHALOS_MONTHS,
  type OmphalosMonth,
} from '../data/omphalosMonths';
import { getOracleBackground } from '../data/oracleBackgrounds';
import { OMPHALOS_DAY_MONTH } from '../data/omphalosSpecialDays';
import type { CalendarEvent } from '../types/event';
import { getOmphalosDate, toDateKey } from '../utils/date';
import { getDailyQuote } from '../utils/dailyQuote';
import { MonthCard, countMonthEvents } from './MonthCard';

type YearOverviewProps = {
  now: Date;
  year: number;
  events: CalendarEvent[];
  onSelectMonth: (month: OmphalosMonth) => void;
};

export const YearOverview = ({ now, year, events, onSelectMonth }: YearOverviewProps) => {
  const omphalosDate = getOmphalosDate(now);
  const dailyQuote = getDailyQuote(now, omphalosDate.month.order);
  const oracleBackground = getOracleBackground(
    dailyQuote.speaker,
    `${toDateKey(now)}:${dailyQuote.id}`,
  );

  return (
    <main
      className="page-shell year-page"
      style={{ '--year-overview-image': `url(${oracleBackground})` } as React.CSSProperties}
    >
      <section className="section-heading year-hero-panel">
        <img src={oracleBackground} alt={`${dailyQuote.speaker}今日神谕背景`} />
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
};
