import type { CSSProperties } from 'react';
import {
  getActiveMonthButtonLayout,
  type MonthButtonLayoutConfig,
} from '../data/monthButtonLayoutConfig';
import type { MonthCompositionAssets } from '../data/monthCompositionAssets';

export type MonthCompositionCell = {
  key: string;
  dateKey: string | null;
  imageSrc: string;
  ariaLabel?: string;
  stateClassName: string;
  eventLabel?: string;
  specialLabel?: string;
};

type MonthCompositionViewProps = {
  ariaLabel: string;
  assets: MonthCompositionAssets;
  cells: MonthCompositionCell[];
  debugLayout: boolean;
  layout: MonthButtonLayoutConfig;
  onSelectDate: (dateKey: string) => void;
};

export const MonthCompositionView = ({
  ariaLabel,
  assets,
  cells,
  debugLayout,
  layout,
  onSelectDate,
}: MonthCompositionViewProps) => {
  const templateStyle = {
    aspectRatio: `${assets.baseWidth} / ${assets.baseHeight}`,
  } as CSSProperties;

  const activeLayout = getActiveMonthButtonLayout(layout);
  const cleanPanelImage =
    assets.cleanPanelImages?.[layout.defaultLayout] ?? assets.cleanPanelImage;

  const panelStyle = {
    left: activeLayout.panelLeft,
    top: activeLayout.panelTop,
    width: activeLayout.panelWidth,
    height: activeLayout.panelHeight,
  } as CSSProperties;

  const cleanPanelStyle = {
    opacity: activeLayout.panelOpacity,
    mixBlendMode: activeLayout.mixBlendMode,
    maskImage: activeLayout.panelMaskImage,
    WebkitMaskImage: activeLayout.panelMaskImage,
  } as CSSProperties;

  const gridStyle = {
    left: activeLayout.gridLeft,
    top: activeLayout.gridTop,
    width: activeLayout.gridWidth,
    height: activeLayout.gridHeight,
    gridTemplateColumns: `repeat(${activeLayout.columns}, minmax(0, 1fr))`,
    gridTemplateRows: `repeat(${activeLayout.rows}, minmax(0, 1fr))`,
    columnGap: activeLayout.gapX,
    rowGap: activeLayout.gapY,
  } as CSSProperties;

  return (
    <section
      aria-label={ariaLabel}
      className={`calendar-panel image-calendar-panel month-composition-view${debugLayout ? ' debug-layout' : ''}`}
    >
      <div className="month-template" style={templateStyle}>
        <img
          alt={`${assets.monthName}月份正式底图`}
          className="month-base-image"
          draggable="false"
          src={assets.baseImage}
        />
        <div className="calendar-composition-region" style={panelStyle}>
          <img
            alt=""
            aria-hidden="true"
            className="calendar-clean-panel"
            draggable="false"
            src={cleanPanelImage}
            style={cleanPanelStyle}
          />
          <div aria-hidden="true" className="date-buttons-layer" style={gridStyle}>
            {cells.map((cell) => (
              <div className="date-button-cell" key={`image-${cell.key}`}>
                <img
                  alt=""
                  className="date-button-image"
                  draggable="false"
                  src={cell.imageSrc}
                />
                {cell.eventLabel ? (
                  <div className="date-event-frame" data-event-title={cell.eventLabel} />
                ) : null}
                {cell.specialLabel ? (
                  <div
                    aria-hidden="true"
                    className="date-special-frame"
                    data-special-title={cell.specialLabel}
                  />
                ) : null}
              </div>
            ))}
          </div>
          <div className="date-hotspot-layer" style={gridStyle}>
            {cells.map((cell) => {
              if (!cell.dateKey) {
                return <div aria-hidden="true" className="date-hotspot empty" key={`hotspot-${cell.key}`} />;
              }

              const dateKey = cell.dateKey;
              return (
                <button
                  aria-label={cell.ariaLabel}
                  className={`date-hotspot ${cell.stateClassName}`}
                  data-date-key={dateKey}
                  key={`hotspot-${cell.key}`}
                  onClick={() => onSelectDate(dateKey)}
                  type="button"
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
