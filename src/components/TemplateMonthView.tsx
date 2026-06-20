import type { CSSProperties, ReactNode } from 'react';
import type { MonthLayoutConfig } from '../data/monthLayoutConfig';
import type { MonthVisualAssetConfig } from '../data/visualAssetConfig';

type TemplateMonthViewProps = {
  ariaLabel: string;
  className: string;
  debugLayout?: boolean;
  layout: MonthLayoutConfig;
  assets: MonthVisualAssetConfig;
  imageAlt: string;
  children: ReactNode;
};

const TEMPLATE_MONTH_STYLES = `
  .template-month-view .month-template-frame {
    position: relative;
    width: 100%;
    aspect-ratio: var(--month-template-aspect);
    line-height: 0;
  }

  .template-month-view .month-template-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .template-month-view .template-calendar-grid {
    position: absolute;
    z-index: 2;
    min-width: 0;
    margin: 0;
  }

  .template-month-view .calendar-cell {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: 0;
    margin: 0;
    transform: none;
  }

  .template-month-view .calendar-cell:not(.empty):hover,
  .template-month-view .calendar-cell.selected {
    transform: none;
  }

  .template-month-view .calendar-cell.has-event::before,
  .template-month-view .calendar-cell.has-event::after {
    box-sizing: border-box;
  }

  .template-month-view .day-number {
    display: block;
  }

  .template-month-view.debug-layout .template-calendar-grid {
    outline: 2px solid rgba(255, 52, 52, 0.72);
    outline-offset: 0;
  }

  .template-month-view.debug-layout .calendar-cell {
    background-color: rgba(255, 74, 74, 0.16);
    background-blend-mode: screen;
  }
`;

export const TemplateMonthView = ({
  ariaLabel,
  className,
  debugLayout = false,
  layout,
  assets,
  imageAlt,
  children,
}: TemplateMonthViewProps) => {
  const rootStyle = {
    '--month-template-aspect': `${assets.baseWidth} / ${assets.baseHeight}`,
    '--date-button-image': `url(${assets.buttonImage})`,
  } as CSSProperties;

  const gridStyle = {
    left: layout.gridLeft,
    top: layout.gridTop,
    right: 'auto',
    bottom: 'auto',
    width: layout.gridWidth,
    height: layout.gridHeight,
    gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
    columnGap: layout.gridGapX,
    rowGap: layout.gridGapY,
  } as CSSProperties;

  return (
    <section
      aria-label={ariaLabel}
      className={`${className} template-month-view${debugLayout ? ' debug-layout' : ''}`}
      style={rootStyle}
    >
      <style>{TEMPLATE_MONTH_STYLES}</style>
      <div className="month-template-frame">
        <img
          alt={imageAlt}
          className="month-template-image"
          draggable="false"
          src={assets.baseImage}
        />
        <div className="calendar-grid template-calendar-grid" style={gridStyle}>
          {children}
        </div>
      </div>
    </section>
  );
};
