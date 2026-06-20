export type MonthVisualAssetConfig = {
  monthId: number;
  baseImage: string;
  baseWidth: 1125;
  baseHeight: 2436;
  buttonImage: string;
  specialButtonImage?: string;
};

const basePath = (fileName: string) => `/assets/omphalos/month-template-bases/${fileName}`;
const buttonPath = (fileName: string) => `/assets/omphalos/final-month-buttons/${fileName}`;

const defineMonthAsset = (
  monthId: number,
  baseImage: string,
  specialButtonImage?: string,
): MonthVisualAssetConfig => ({
  monthId,
  baseImage: basePath(baseImage),
  baseWidth: 1125,
  baseHeight: 2436,
  buttonImage: buttonPath(`${`${monthId}`.padStart(2, '0')}-blank-button.png`),
  specialButtonImage: specialButtonImage ? buttonPath(specialButtonImage) : undefined,
});

export const MONTH_VISUAL_ASSETS: Record<number, MonthVisualAssetConfig> = {
  1: defineMonthAsset(1, '01-gate-month-base.jpg'),
  2: defineMonthAsset(2, '02-balance-month-base.jpg'),
  3: defineMonthAsset(3, '03-long-night-month-base.jpg'),
  4: defineMonthAsset(4, '04-cultivation-month-base.jpg'),
  5: defineMonthAsset(5, '05-joy-month-base.jpg'),
  6: defineMonthAsset(6, '06-long-day-month-base.jpg'),
  7: defineMonthAsset(7, '07-freedom-month-base.jpg'),
  8: defineMonthAsset(8, '08-harvest-month-base.jpg'),
  9: defineMonthAsset(9, '09-thread-month-base.jpg'),
  10: defineMonthAsset(10, '10-strife-month-base.jpg'),
  11: defineMonthAsset(11, '11-mourning-month-base.jpg', '11-omphalos-day-button.png'),
  12: defineMonthAsset(12, '12-chance-month-base.jpg'),
};

export const getMonthVisualAssets = (monthId: number): MonthVisualAssetConfig =>
  MONTH_VISUAL_ASSETS[monthId] ?? MONTH_VISUAL_ASSETS[1];
