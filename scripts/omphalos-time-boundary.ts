import { getCurrentOmphalosTime } from '../src/utils/omphalosTime';

type BoundaryCase = {
  time: string;
  periodName: string;
  periodAlias: string | null;
  mark: number;
};

const cases: BoundaryCase[] = [
  { time: '00:00:00', periodName: '门扉时', periodAlias: null, mark: 1 },
  { time: '04:48:00', periodName: '门扉时', periodAlias: null, mark: 5 },
  { time: '04:48:01', periodName: '明晰时', periodAlias: '上升时', mark: 1 },
  { time: '09:36:00', periodName: '明晰时', periodAlias: '上升时', mark: 5 },
  { time: '09:36:01', periodName: '践行时', periodAlias: '下降时', mark: 1 },
  { time: '14:24:00', periodName: '践行时', periodAlias: '下降时', mark: 5 },
  { time: '14:24:01', periodName: '离愁时', periodAlias: null, mark: 1 },
  { time: '19:12:00', periodName: '离愁时', periodAlias: null, mark: 5 },
  { time: '19:12:01', periodName: '幕匿时', periodAlias: null, mark: 1 },
  { time: '23:59:59', periodName: '幕匿时', periodAlias: null, mark: 5 },
];

const createDate = (time: string): Date => new Date(`2026-01-01T${time}`);

const failures: string[] = [];

for (const item of cases) {
  const result = getCurrentOmphalosTime(createDate(item.time));
  const passed =
    result.periodName === item.periodName &&
    result.periodAlias === item.periodAlias &&
    result.mark === item.mark;

  const alias = result.periodAlias ? ` / ${result.periodAlias}` : '';
  const line = `${item.time} -> ${result.periodName}${alias} 第 ${result.mark} 刻，时段进度 ${result.periodProgressPercent}%，当天总进度 ${result.dayProgressPercent}%`;

  if (!passed) {
    failures.push(
      `${line}，预期 ${item.periodName}${item.periodAlias ? ` / ${item.periodAlias}` : ''} 第 ${item.mark} 刻`,
    );
  } else {
    console.log(line);
  }
}

const syncModule = await import('../src/hooks/useCurrentTime').catch(() => null);

if (!syncModule || typeof syncModule.startCurrentTimeSync !== 'function') {
  failures.push('缺少统一的当前时间同步器 startCurrentTimeSync');
} else {
  const observedTimes: Date[] = [];
  const testTimes = [
    new Date('2026-06-21T10:00:00'),
    new Date('2026-06-21T10:00:01'),
    new Date('2026-06-21T10:01:00'),
    new Date('2026-06-21T10:02:00'),
  ];
  let timeIndex = 0;
  let intervalDelay = 0;
  let intervalCallback: (() => void) | null = null;
  let clearedTimer: number | null = null;
  const windowListeners = new Map<string, () => void>();
  const documentListeners = new Map<string, () => void>();
  const fakeWindow = {
    setInterval(callback: () => void, delay: number) {
      intervalCallback = callback;
      intervalDelay = delay;
      return 17;
    },
    clearInterval(timer: number) {
      clearedTimer = timer;
    },
    addEventListener(type: string, listener: () => void) {
      windowListeners.set(type, listener);
    },
    removeEventListener(type: string) {
      windowListeners.delete(type);
    },
  };
  const fakeDocument = {
    hidden: true,
    addEventListener(type: string, listener: () => void) {
      documentListeners.set(type, listener);
    },
    removeEventListener(type: string) {
      documentListeners.delete(type);
    },
  };

  const stopSync = syncModule.startCurrentTimeSync({
    onTick: (date) => observedTimes.push(date),
    getNow: () => testTimes[timeIndex],
    windowTarget: fakeWindow,
    documentTarget: fakeDocument,
  });

  timeIndex = 1;
  intervalCallback?.();
  documentListeners.get('visibilitychange')?.();
  fakeDocument.hidden = false;
  timeIndex = 2;
  documentListeners.get('visibilitychange')?.();
  timeIndex = 3;
  windowListeners.get('focus')?.();

  const syncPassed =
    intervalDelay === 1000 &&
    observedTimes.length === 4 &&
    observedTimes.every((date, index) => date === testTimes[index]);

  stopSync();

  const cleanupPassed =
    clearedTimer === 17 && windowListeners.size === 0 && documentListeners.size === 0;

  if (!syncPassed) {
    failures.push('当前时间同步器未在首次加载、每秒、回到前台和窗口聚焦时重新读取真实时间');
  }
  if (!cleanupPassed) {
    failures.push('当前时间同步器未正确清理 timer 和事件监听');
  }
}

if (failures.length > 0) {
  console.error('翁法罗斯时间边界验证失败：');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  throw new Error(`${failures.length} boundary cases failed`);
}

console.log('翁法罗斯时间边界验证通过。');
