import { useEffect, useMemo, useState } from 'react';
import './App.css';
import { DayDetailDrawer } from './components/DayDetailDrawer';
import { EventList } from './components/EventList';
import { HomeHero } from './components/HomeHero';
import { MonthCalendar } from './components/MonthCalendar';
import { YearOverview } from './components/YearOverview';
import {
  OMPHALOS_MONTHS,
  getOmphalosMonthByGregorianMonth,
  type OmphalosMonth,
} from './data/omphalosMonths';
import { hasMonthButtonLayoutConfig } from './data/monthButtonLayoutConfig';
import {
  OMPHALOS_DAY_MONTH,
  getOmphalosDayDateKey,
  getOmphalosDayEvent,
} from './data/omphalosSpecialDays';
import { useEvents } from './hooks/useEvents';
import { useCurrentTime } from './hooks/useCurrentTime';
import { formatDate, getOmphalosDate, toDateKey } from './utils/date';

type Route =
  | { view: 'home' }
  | { view: 'year' }
  | { view: 'month'; monthOrder: number };

const parseRoute = (): Route => {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'year') {
    return { view: 'year' };
  }
  const monthMatch = hash.match(/^month-(\d{1,2})$/);
  if (monthMatch) {
    const monthOrder = Number(monthMatch[1]);
    if (monthOrder >= 1 && monthOrder <= 12) {
      return { view: 'month', monthOrder };
    }
  }
  return { view: 'home' };
};

const setRoute = (route: Route) => {
  if (route.view === 'home') {
    window.location.hash = '';
    return;
  }
  if (route.view === 'year') {
    window.location.hash = 'year';
    return;
  }
  window.location.hash = `month-${`${route.monthOrder}`.padStart(2, '0')}`;
};

const getRouteMonth = (route: Route, now: Date): OmphalosMonth => {
  if (route.view === 'month') {
    return OMPHALOS_MONTHS[route.monthOrder - 1];
  }
  return getOmphalosMonthByGregorianMonth(now.getMonth() + 1);
};

export default function App() {
  const [route, setCurrentRoute] = useState<Route>(() => parseRoute());
  const now = useCurrentTime();
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const { events, eventsByDate, addEvent, updateEvent, deleteEvent } = useEvents();

  useEffect(() => {
    const onHashChange = () => setCurrentRoute(parseRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const year = now.getFullYear();
  const todayKey = toDateKey(now);
  const omphalosDayEvent = useMemo(() => getOmphalosDayEvent(year), [year]);
  const omphalosDayDateKey = useMemo(() => getOmphalosDayDateKey(year), [year]);
  const todayEvents = eventsByDate.get(todayKey) ?? [];
  const todayEventsWithSpecial =
    todayKey === omphalosDayDateKey ? [omphalosDayEvent, ...todayEvents] : todayEvents;
  const selectedDayEvents = selectedDateKey ? eventsByDate.get(selectedDateKey) ?? [] : [];
  const selectedSpecialEvents =
    selectedDateKey === omphalosDayDateKey ? [omphalosDayEvent] : [];

  const currentMonth = getRouteMonth(route, now);
  const monthEvents = useMemo(() => {
    const monthPrefix = `${year}-${`${currentMonth.gregorianMonth}`.padStart(2, '0')}-`;
    return events.filter((event) => event.date.startsWith(monthPrefix));
  }, [currentMonth.gregorianMonth, events, year]);
  const monthEventsWithSpecial = useMemo(() => {
    if (currentMonth.gregorianMonth !== OMPHALOS_DAY_MONTH) {
      return monthEvents;
    }
    return [...monthEvents, omphalosDayEvent].sort((a, b) => {
      if (a.date !== b.date) {
        return a.date.localeCompare(b.date);
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [currentMonth.gregorianMonth, monthEvents, omphalosDayEvent]);

  const omphalosDate = getOmphalosDate(now);
  const usesComposedMonthLayout = hasMonthButtonLayoutConfig(currentMonth.gregorianMonth);

  return (
    <div className="app">
      <header className="topbar">
        <button type="button" className="brand-button" onClick={() => setRoute({ view: 'home' })}>
          <span>翁法罗斯一年历</span>
          <small>{omphalosDate.month.name}</small>
        </button>
        <nav aria-label="主要导航">
          <button
            type="button"
            className={route.view === 'home' ? 'nav-button active' : 'nav-button'}
            onClick={() => setRoute({ view: 'home' })}
          >
            首页
          </button>
          <button
            type="button"
            className={route.view === 'year' ? 'nav-button active' : 'nav-button'}
            onClick={() => setRoute({ view: 'year' })}
          >
            一年历
          </button>
          <button
            type="button"
            className={route.view === 'month' ? 'nav-button active' : 'nav-button'}
            onClick={() => setRoute({ view: 'month', monthOrder: omphalosDate.month.order })}
          >
            本月
          </button>
        </nav>
      </header>

      {route.view === 'home' ? (
        <HomeHero
          now={now}
          todayEvents={todayEventsWithSpecial}
          onOpenYear={() => setRoute({ view: 'year' })}
          onOpenCurrentMonth={() => setRoute({ view: 'month', monthOrder: omphalosDate.month.order })}
        />
      ) : null}

      {route.view === 'year' ? (
        <YearOverview
          now={now}
          year={year}
          events={events}
          onSelectMonth={(month) => setRoute({ view: 'month', monthOrder: month.order })}
        />
      ) : null}

      {route.view === 'month' ? (
        <main
          className="month-detail"
          style={
            {
              '--month-color': currentMonth.color,
            } as React.CSSProperties
          }
        >
          <section className="month-chapter glass-panel">
            <div className="month-chapter-copy">
              <span className="eyebrow">{currentMonth.season}</span>
              <h1>{currentMonth.name}</h1>
              <p>
                {currentMonth.deity} / {currentMonth.motto}
              </p>
              <div className="month-intro">
                {currentMonth.intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <span>{formatDate(new Date(year, currentMonth.gregorianMonth - 1, 1))}</span>
            </div>
            <div className="month-chapter-mark" aria-hidden="true">
              {`${currentMonth.order}`.padStart(2, '0')}
            </div>
          </section>

          <section
            className={`month-content ritual-month-content${
              usesComposedMonthLayout ? ' composition-month-content' : ''
            }`}
          >
            <MonthCalendar
              year={year}
              month={currentMonth}
              eventsByDate={eventsByDate}
              selectedDateKey={selectedDateKey}
              onSelectDate={setSelectedDateKey}
            />
            {!usesComposedMonthLayout ? (
              <aside className="month-events glass-panel">
                <span className="eyebrow">本月日程</span>
                <h2>{currentMonth.name}</h2>
                <EventList events={monthEventsWithSpecial} emptyText="本月暂无日程。点击日期可添加。" />
              </aside>
            ) : null}
          </section>
        </main>
      ) : null}

      <DayDetailDrawer
        dateKey={selectedDateKey}
        now={now}
        events={selectedDayEvents}
        specialEvents={selectedSpecialEvents}
        onClose={() => setSelectedDateKey(null)}
        onAdd={addEvent}
        onUpdate={updateEvent}
        onDelete={deleteEvent}
      />
    </div>
  );
}
