import type { CSSProperties } from 'react';
import {
  getActiveMonthButtonLayout,
  getMonthButtonLayoutConfig,
  hasMonthButtonLayoutConfig,
} from '../data/monthButtonLayoutConfig';
import { getMonthCompositionAssets } from '../data/monthCompositionAssets';
import { getMonthLayoutConfig } from '../data/monthLayoutConfig';
import type { OmphalosMonth } from '../data/omphalosMonths';
import { isOmphalosDay, OMPHALOS_DAY_TITLE } from '../data/omphalosSpecialDays';
import { getMonthVisualAssets } from '../data/visualAssetConfig';
import type { CalendarEvent } from '../types/event';
import { getCalendarCells, toDateKey } from '../utils/date';
import { getEventBorderColor, isGradientColor } from '../utils/eventColor';
import { MonthCompositionView } from './MonthCompositionView';
import type { MonthCompositionCell } from './MonthCompositionView';
import { TemplateMonthView } from './TemplateMonthView';

type MonthCalendarProps = {
  year: number;
  month: OmphalosMonth;
  eventsByDate: Map<string, CalendarEvent[]>;
  selectedDateKey: string | null;
  onSelectDate: (dateKey: string) => void;
};

const MONTH_COMPOSITION_DEBUG = false;

export const MonthCalendar = ({
  year,
  month,
  eventsByDate,
  selectedDateKey,
  onSelectDate,
}: MonthCalendarProps) => {
  const usesComposition = hasMonthButtonLayoutConfig(month.gregorianMonth);
  const layout = getMonthLayoutConfig(month.gregorianMonth);
  const assets = getMonthVisualAssets(month.gregorianMonth);
  const compositionLayout = usesComposition
    ? getMonthButtonLayoutConfig(month.gregorianMonth)
    : null;
  const rows = compositionLayout
    ? getActiveMonthButtonLayout(compositionLayout).rows
    : layout.rows;
  const cells = getCalendarCells(year, month.gregorianMonth, 'sunday', rows);
  const todayKey = toDateKey(new Date());

  if (usesComposition) {
    const compositionAssets = getMonthCompositionAssets(month.gregorianMonth);
    if (!compositionLayout) {
      return null;
    }
    const dateButtonDir =
      compositionAssets.dateButtonDirs?.[compositionLayout.defaultLayout] ??
      compositionAssets.dateButtonDir;
    const dateButtonExtension =
      compositionAssets.dateButtonExtensions?.[compositionLayout.defaultLayout] ?? 'jpg';
    const compositionCells: MonthCompositionCell[] = cells.map((cell, index) => {
      if (!cell.dateKey || !cell.day) {
        return {
          key: `empty-${index}`,
          dateKey: null,
          imageSrc: `${dateButtonDir}blank.${dateButtonExtension}`,
          stateClassName: 'empty',
        };
      }

      const dayEvents = eventsByDate.get(cell.dateKey) ?? [];
      const isToday = cell.dateKey === todayKey;
      const isSelected = cell.dateKey === selectedDateKey;
      const hasOmphalosDay = isOmphalosDay(month.gregorianMonth, cell.day);
      const specialDateButtonImage = hasOmphalosDay
        ? compositionAssets.specialDateButtonImages?.[cell.day]
        : undefined;

      return {
        key: cell.dateKey,
        dateKey: cell.dateKey,
        imageSrc:
          specialDateButtonImage ??
          `${dateButtonDir}${`${cell.day}`.padStart(2, '0')}.${dateButtonExtension}`,
        ariaLabel: `${month.name} 第 ${cell.day} 日${
          dayEvents.length > 0 ? `，${dayEvents.length} 个日程` : ''
        }${hasOmphalosDay ? `，${OMPHALOS_DAY_TITLE}` : ''}`,
        stateClassName: [
          isToday ? 'today' : '',
          isSelected ? 'selected' : '',
          hasOmphalosDay ? 'omphalos-special-day' : '',
        ].join(' '),
        eventLabel: dayEvents[0]?.title,
        specialLabel: hasOmphalosDay ? OMPHALOS_DAY_TITLE : undefined,
      };
    });

    return (
      <MonthCompositionView
        ariaLabel={`${month.name} 日历网格`}
        assets={compositionAssets}
        cells={compositionCells}
        debugLayout={MONTH_COMPOSITION_DEBUG}
        layout={compositionLayout}
        onSelectDate={onSelectDate}
      />
    );
  }

  return (
    <TemplateMonthView
      ariaLabel={`${month.name} 日历网格`}
      assets={assets}
      className={`calendar-panel image-calendar-panel final-template-calendar month-calendar-${`${month.gregorianMonth}`.padStart(2, '0')}`}
      imageAlt={`${month.name} 月份详情模板`}
      layout={layout}
    >
      {cells.map((cell, index) => {
        if (!cell.dateKey || !cell.day) {
          return <div aria-hidden="true" className="calendar-cell empty" key={`empty-${index}`} />;
        }
        const dayEvents = eventsByDate.get(cell.dateKey) ?? [];
        const isToday = cell.dateKey === todayKey;
        const isSelected = cell.dateKey === selectedDateKey;
        const hasOmphalosDay = isOmphalosDay(month.gregorianMonth, cell.day);
        const primaryEventColor = dayEvents[0]?.color;
        const dateButtonImage =
          hasOmphalosDay && assets.specialButtonImage ? assets.specialButtonImage : assets.buttonImage;
        return (
          <button
            aria-label={`${month.name} 第 ${cell.day} 日${
              dayEvents.length > 0 ? `，${dayEvents.length} 个日程` : ''
            }${hasOmphalosDay ? '，翁法罗斯之日' : ''}`}
            className={[
              'calendar-cell',
              isToday ? 'today' : '',
              isSelected ? 'selected' : '',
              primaryEventColor ? 'has-event' : '',
              primaryEventColor && isGradientColor(primaryEventColor) ? 'has-gradient-event' : '',
              hasOmphalosDay ? 'ripple-egg-date omphalos-special-day' : '',
            ].join(' ')}
            data-date-key={cell.dateKey}
            key={cell.dateKey}
            onClick={() => onSelectDate(cell.dateKey as string)}
            style={
              {
                '--date-button-image': `url(${dateButtonImage})`,
                '--event-accent': primaryEventColor,
                '--event-ring-color': primaryEventColor ? getEventBorderColor(primaryEventColor) : undefined,
              } as CSSProperties
            }
            type="button"
          >
            <span className="calendar-button-label">
              {month.name} 第 {cell.day} 日
            </span>
            <span className="day-number" aria-hidden="true">
              {hasOmphalosDay ? '' : cell.day}
            </span>
          </button>
        );
      })}
    </TemplateMonthView>
  );
};
