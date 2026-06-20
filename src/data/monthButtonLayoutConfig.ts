export type MonthButtonLayoutName = 'fiveWeek' | 'sixWeek';

export type MonthButtonGridLayout = {
  panelLeft: string;
  panelTop: string;
  panelWidth: string;
  panelHeight: string;
  panelOpacity: number;
  mixBlendMode: 'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light';
  panelMaskImage: string;
  gridLeft: string;
  gridTop: string;
  gridWidth: string;
  gridHeight: string;
  columns: 7;
  rows: 5 | 6;
  totalCells: 35 | 42;
  gapX: string;
  gapY: string;
};

export type MonthButtonLayoutConfig = {
  monthId: number;
  defaultLayout: MonthButtonLayoutName;
  layouts: {
    fiveWeek: MonthButtonGridLayout & { rows: 5; totalCells: 35 };
    sixWeek: MonthButtonGridLayout & { rows: 6; totalCells: 42 };
  };
};

/**
 * 6 月坐标来自 1125 x 650 clean panel 的统一裁片网格：
 * 首格中心 (190.5, 132)，末格中心 (949, 500)，按钮尺寸 118 x 66。
 */
export const JUNE_BUTTON_LAYOUT: MonthButtonLayoutConfig = {
  monthId: 6,
  defaultLayout: 'fiveWeek',
  layouts: {
    fiveWeek: {
      panelLeft: '0%',
      panelTop: '69.7865%',
      panelWidth: '100%',
      panelHeight: '26.6831%',
      panelOpacity: 1,
      mixBlendMode: 'normal',
      panelMaskImage: 'none',
      gridLeft: '11.69%',
      gridTop: '20.31%',
      gridWidth: '77.91%',
      gridHeight: '59.38%',
      columns: 7,
      rows: 5,
      totalCells: 35,
      gapX: '0.96%',
      gapY: '3.63%',
    },
    sixWeek: {
      panelLeft: '0%',
      panelTop: '69.7865%',
      panelWidth: '100%',
      panelHeight: '26.6831%',
      panelOpacity: 1,
      mixBlendMode: 'normal',
      panelMaskImage:
        'linear-gradient(to right, transparent 0%, transparent 7.5%, #000 12%, #000 86%, transparent 94%, transparent 100%), linear-gradient(to bottom, transparent 0%, transparent 12%, #000 19%, #000 78%, transparent 90%, transparent 100%)',
      gridLeft: '11.69%',
      gridTop: '15.23%',
      gridWidth: '77.91%',
      gridHeight: '66.77%',
      columns: 7,
      rows: 6,
      totalCells: 42,
      gapX: '0.96%',
      gapY: '1.75%',
    },
  },
};

const createSharedMonthButtonLayout = (
  monthId: number,
  defaultLayout: MonthButtonLayoutName,
): MonthButtonLayoutConfig => ({
  monthId,
  defaultLayout,
  layouts: {
    fiveWeek: {
      ...JUNE_BUTTON_LAYOUT.layouts.fiveWeek,
      panelMaskImage: JUNE_BUTTON_LAYOUT.layouts.sixWeek.panelMaskImage,
    },
    sixWeek: {
      ...JUNE_BUTTON_LAYOUT.layouts.sixWeek,
    },
  },
});

export const MONTH_BUTTON_LAYOUT_CONFIGS: Record<number, MonthButtonLayoutConfig> = {
  1: createSharedMonthButtonLayout(1, 'fiveWeek'),
  2: createSharedMonthButtonLayout(2, 'fiveWeek'),
  3: createSharedMonthButtonLayout(3, 'fiveWeek'),
  4: createSharedMonthButtonLayout(4, 'fiveWeek'),
  5: createSharedMonthButtonLayout(5, 'sixWeek'),
  6: JUNE_BUTTON_LAYOUT,
  7: createSharedMonthButtonLayout(7, 'fiveWeek'),
  8: createSharedMonthButtonLayout(8, 'sixWeek'),
  9: createSharedMonthButtonLayout(9, 'fiveWeek'),
  10: createSharedMonthButtonLayout(10, 'fiveWeek'),
  11: createSharedMonthButtonLayout(11, 'fiveWeek'),
  12: createSharedMonthButtonLayout(12, 'fiveWeek'),
};

export const hasMonthButtonLayoutConfig = (monthId: number): boolean =>
  Boolean(MONTH_BUTTON_LAYOUT_CONFIGS[monthId]);

export const getMonthButtonLayoutConfig = (monthId: number): MonthButtonLayoutConfig => {
  const layout = MONTH_BUTTON_LAYOUT_CONFIGS[monthId];
  if (!layout) {
    throw new Error(`月份 ${monthId} 尚未配置素材合成坐标`);
  }
  return layout;
};

export const getActiveMonthButtonLayout = (
  layout: MonthButtonLayoutConfig,
): MonthButtonGridLayout => layout.layouts[layout.defaultLayout];
