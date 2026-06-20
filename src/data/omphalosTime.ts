export type OmphalosTimePeriod = {
  id: string;
  name: string;
  alias?: string;
  startLabel: string;
  endLabel: string;
  startSecond: number;
  endSecond: number;
  description: string;
};

export const SECONDS_PER_PERIOD = 4 * 60 * 60 + 48 * 60;
export const OMPHALOS_MARKS_PER_PERIOD = 5;
export const SECONDS_PER_MARK = SECONDS_PER_PERIOD / OMPHALOS_MARKS_PER_PERIOD;

export const OMPHALOS_TIME_PERIODS: OmphalosTimePeriod[] = [
  {
    id: 'gate',
    name: '门扉时',
    startLabel: '00:00:00',
    endLabel: '04:48:00',
    startSecond: 0,
    endSecond: 4 * 60 * 60 + 48 * 60,
    description: '万象静候开启，适合记录计划与梦境。',
  },
  {
    id: 'clarity',
    name: '明晰时',
    alias: '上升时',
    startLabel: '04:48:01',
    endLabel: '09:36:00',
    startSecond: 4 * 60 * 60 + 48 * 60 + 1,
    endSecond: 9 * 60 * 60 + 36 * 60,
    description: '光线上升，适合启动今日最重要的任务。',
  },
  {
    id: 'practice',
    name: '践行时',
    alias: '下降时',
    startLabel: '09:36:01',
    endLabel: '14:24:00',
    startSecond: 9 * 60 * 60 + 36 * 60 + 1,
    endSecond: 14 * 60 * 60 + 24 * 60,
    description: '行动与兑现的时刻，适合推进深度工作。',
  },
  {
    id: 'parting',
    name: '离愁时',
    startLabel: '14:24:01',
    endLabel: '19:12:00',
    startSecond: 14 * 60 * 60 + 24 * 60 + 1,
    endSecond: 19 * 60 * 60 + 12 * 60,
    description: '白昼渐退，适合复盘、沟通与收束。',
  },
  {
    id: 'curtain',
    name: '幕匿时',
    startLabel: '19:12:01',
    endLabel: '24:00:00',
    startSecond: 19 * 60 * 60 + 12 * 60 + 1,
    endSecond: 24 * 60 * 60,
    description: '夜幕合拢，适合整理日程与准备明日。',
  },
];
