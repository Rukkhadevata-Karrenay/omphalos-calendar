export type MonthLayoutConfig = {
  monthId: number;
  gridLeft: string;
  gridTop: string;
  gridWidth: string;
  gridHeight: string;
  gridGapX: string;
  gridGapY: string;
  columns: 7;
  rows: 5 | 6;
};

/**
 * 坐标均以完整的 1125 x 2436 月份底图为基准。
 * gap 百分比相对于日期网格自身宽高，而不是整张底图。
 */
const COMMON_LAYOUT = {
  gridLeft: '12.41%',
  gridTop: '75.195%',
  gridWidth: '76.5%',
  gridHeight: '19.4%',
  gridGapX: '2.75%',
  gridGapY: '3%',
  columns: 7 as const,
  rows: 6 as const,
};

/**
 * 长昼月已按 1125 x 2436 模板逐列、逐行校准。
 * 6 月模板只有 5 行日期；15.86% 的高度可保持按钮原始宽高比，
 * 并让第 5 行的 30 号与尾部空白格落在模板日期区域内。
 */
export const JUNE_LAYOUT: MonthLayoutConfig = {
  monthId: 6,
  gridLeft: '12.41%',
  gridTop: '75.195%',
  gridWidth: '76.5%',
  gridHeight: '15.86%',
  gridGapX: '2.75%',
  gridGapY: '3%',
  columns: 7,
  rows: 5,
};

export const MONTH_LAYOUT_CONFIGS: Record<number, MonthLayoutConfig> = Object.fromEntries(
  Array.from({ length: 12 }, (_, index) => {
    const monthId = index + 1;
    return [monthId, monthId === 6 ? JUNE_LAYOUT : { monthId, ...COMMON_LAYOUT }];
  }),
) as Record<number, MonthLayoutConfig>;

export const getMonthLayoutConfig = (monthId: number): MonthLayoutConfig =>
  MONTH_LAYOUT_CONFIGS[monthId] ?? MONTH_LAYOUT_CONFIGS[1];
