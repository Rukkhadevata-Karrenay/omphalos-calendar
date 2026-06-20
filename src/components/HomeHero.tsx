import { OMPHALOS_HOME_IMAGE } from '../data/omphalosMonths';
import { getOracleBackground } from '../data/oracleBackgrounds';
import type { CalendarEvent } from '../types/event';
import { formatDateTime, getOmphalosDate, toDateKey } from '../utils/date';
import { getDailyQuote } from '../utils/dailyQuote';
import { getCurrentOmphalosTime } from '../utils/omphalosTime';
import { EventList } from './EventList';
import { OmphalosClock } from './OmphalosClock';

type HomeHeroProps = {
  now: Date;
  todayEvents: CalendarEvent[];
  onOpenYear: () => void;
  onOpenCurrentMonth: () => void;
};

export const HomeHero = ({ now, todayEvents, onOpenYear, onOpenCurrentMonth }: HomeHeroProps) => {
  const omphalosDate = getOmphalosDate(now);
  const dailyQuote = getDailyQuote(now, omphalosDate.month.order);
  const omphalosTime = getCurrentOmphalosTime(now);
  const oracleBackground = getOracleBackground(dailyQuote.speaker, `${toDateKey(now)}:${dailyQuote.id}`);

  return (
    <main className="home-layout">
      <section className="hero" style={{ '--hero-image': `url(${OMPHALOS_HOME_IMAGE})` } as React.CSSProperties}>
        <img className="hero-complete-image" src={OMPHALOS_HOME_IMAGE} alt="翁法罗斯一年历封面" />
        <div className="hero-copy">
          <span className="eyebrow">Omphalos Mimetic Time System</span>
          <h1>翁法罗斯一年历</h1>
          <p>以现实日期为锚点，映射翁法罗斯的月份、季节、时段与刻。</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={onOpenYear} aria-label="查看一年历">
              查看一年历
            </button>
            <button type="button" className="ghost-button" onClick={onOpenCurrentMonth} aria-label="进入本月">
              进入本月
            </button>
          </div>
        </div>
      </section>
      <section className="home-grid">
        <article className="glass-panel current-date">
          <span className="eyebrow">现实日期</span>
          <h2>{formatDateTime(now)}</h2>
          <div className="month-badge" style={{ borderColor: omphalosDate.month.color }}>
            <span>{omphalosDate.month.season}</span>
            <strong>{omphalosDate.label}</strong>
            <span>{omphalosDate.month.homeHeroLine ?? `${omphalosDate.month.deity} / ${omphalosDate.month.name}`}</span>
          </div>
        </article>
        <OmphalosClock now={now} todayEvents={todayEvents} />
        <article
          className="glass-panel daily-oracle"
          style={
            {
              '--oracle-bg': `url(${oracleBackground})`,
              borderColor: omphalosDate.month.color,
            } as React.CSSProperties
          }
        >
          <div className="oracle-header">
            <span className="eyebrow">今日神谕</span>
          </div>
          <blockquote>「{dailyQuote.text}」</blockquote>
          <p className="oracle-speaker">——{dailyQuote.speaker}</p>
          <div className="oracle-meta">
            <span>
              翁法罗斯时间：{omphalosDate.month.name} · {omphalosTime.periodName}
            </span>
            {dailyQuote.mood ? <span>{dailyQuote.mood}</span> : null}
          </div>
        </article>
        <article className="glass-panel today-events">
          <span className="eyebrow">今日日程</span>
          <EventList events={todayEvents} emptyText="今日暂无日程。打开本月日期可添加安排。" />
        </article>
      </section>
    </main>
  );
};
