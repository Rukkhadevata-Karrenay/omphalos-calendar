export type MonthCompositionAssets = {
  monthId: number;
  monthName: string;
  baseImage: string;
  cleanPanelImage: string;
  cleanPanelImages?: Partial<Record<'fiveWeek' | 'sixWeek', string>>;
  dateButtonDir: string;
  originalDateButtonDir?: string;
  dateButtonDirs?: Partial<Record<'fiveWeek' | 'sixWeek', string>>;
  dateButtonExtensions?: Partial<Record<'fiveWeek' | 'sixWeek', 'jpg' | 'png'>>;
  specialDateButtonImages?: Partial<Record<number, string>>;
  finalReferenceImage: string;
  baseWidth: 1125;
  baseHeight: 2436;
  panelWidth: 1125;
  panelHeight: 650;
};

const BASE_IMAGE_DIR = '/assets/calendar-composition/bases/';
const CLEAN_PANEL_DIR = '/assets/calendar-composition/panels-clean/';
const DATE_BUTTON_DIR = '/assets/calendar-composition/date-buttons/';
const NORMALIZED_DATE_BUTTON_DIR = '/assets/calendar-composition/date-buttons-normalized/';
const UNIFORM_DATE_BUTTON_DIR = '/assets/calendar-composition/date-buttons-uniform/';
const FINAL_REFERENCE_DIR = '/assets/calendar-composition/final-reference/';

const defineMonthComposition = (
  monthId: number,
  monthName: string,
  baseFile: string,
  panelFile: string,
  referenceFile: string,
): MonthCompositionAssets => {
  const monthDirectory = `${monthId}`.padStart(2, '0');
  const originalMonthDirectory = `${DATE_BUTTON_DIR}${monthDirectory}/`;
  const uniformMonthDirectory = `${UNIFORM_DATE_BUTTON_DIR}${monthDirectory}/`;
  const panelImage = `${CLEAN_PANEL_DIR}${panelFile}`;

  return {
    monthId,
    monthName,
    baseImage: `${BASE_IMAGE_DIR}${baseFile}`,
    cleanPanelImage: panelImage,
    cleanPanelImages: {
      fiveWeek: panelImage,
      sixWeek: panelImage,
    },
    dateButtonDir: uniformMonthDirectory,
    originalDateButtonDir: originalMonthDirectory,
    dateButtonDirs: {
      fiveWeek: uniformMonthDirectory,
      sixWeek: uniformMonthDirectory,
    },
    dateButtonExtensions: {
      fiveWeek: 'png',
      sixWeek: 'png',
    },
    finalReferenceImage: `${FINAL_REFERENCE_DIR}${referenceFile}`,
    baseWidth: 1125,
    baseHeight: 2436,
    panelWidth: 1125,
    panelHeight: 650,
  };
};

export const MONTH_COMPOSITION_ASSETS: Record<number, MonthCompositionAssets> = {
  1: defineMonthComposition(1, '门关月', '01-gate-month-base.jpg', '01-janus-gate-month-calendar-panel.jpg', '01-gate-month-template.png'),
  2: defineMonthComposition(2, '平衡月', '02-balance-month-base.jpg', '02-talanton-balance-month-calendar-panel.jpg', '02-balance-month-template.png'),
  3: defineMonthComposition(3, '长夜月', '03-long-night-month-base.jpg', '03-oronyx-long-night-month-calendar-panel.jpg', '03-long-night-month-template.png'),
  4: defineMonthComposition(4, '耕耘月', '04-cultivation-month-base.jpg', '04-georios-cultivation-month-calendar-panel.jpg', '04-cultivation-month-template.png'),
  5: defineMonthComposition(5, '欢喜月', '05-joy-month-base.jpg', '05-phagousa-joy-month-calendar-panel.jpg', '05-joy-month-template.png'),
  6: {
    ...defineMonthComposition(6, '长昼月', '06-long-day-month-base.jpg', '06-aigle-long-day-month-calendar-panel.jpg', '06-long-day-month-template.png'),
    dateButtonDir: `${NORMALIZED_DATE_BUTTON_DIR}06/`,
    originalDateButtonDir: `${DATE_BUTTON_DIR}06/`,
    dateButtonDirs: {
      fiveWeek: `${UNIFORM_DATE_BUTTON_DIR}06/`,
      sixWeek: `${DATE_BUTTON_DIR}06/`,
    },
    dateButtonExtensions: {
      fiveWeek: 'png',
      sixWeek: 'jpg',
    },
    cleanPanelImages: {
      fiveWeek: '/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png',
      sixWeek: '/assets/calendar-composition/panels-clean/06-aigle-long-day-month-calendar-panel.jpg',
    },
  },
  7: defineMonthComposition(7, '自由月', '07-freedom-month-base.jpg', '07-kephale-freedom-month-calendar-panel.jpg', '07-freedom-month-template.png'),
  8: defineMonthComposition(8, '收获月', '08-harvest-month-base.jpg', '08-cerces-harvest-month-calendar-panel.jpg', '08-harvest-month-template.png'),
  9: defineMonthComposition(9, '拾线月', '09-thread-month-base.jpg', '09-mnemosyne-thread-month-calendar-panel.jpg', '09-thread-month-template.png'),
  10: defineMonthComposition(10, '纷争月', '10-strife-month-base.jpg', '10-nikadori-strife-month-calendar-panel.jpg', '10-strife-month-template.png'),
  11: {
    ...defineMonthComposition(11, '哀悼月', '11-mourning-month-base.jpg', '11-thanatos-mourning-month-calendar-panel.jpg', '11-mourning-month-template.png'),
    specialDateButtonImages: {
      12: `${DATE_BUTTON_DIR}11/12.jpg`,
    },
  },
  12: defineMonthComposition(12, '机缘月', '12-chance-month-base.jpg', '12-zagreus-chance-month-calendar-panel.jpg', '12-chance-month-template.png'),
};

export const getMonthCompositionAssets = (monthId: number): MonthCompositionAssets =>
  MONTH_COMPOSITION_ASSETS[monthId] ?? MONTH_COMPOSITION_ASSETS[1];
