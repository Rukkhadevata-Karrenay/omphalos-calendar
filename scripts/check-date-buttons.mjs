import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons/06',
);
const NORMALIZED_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-normalized/06',
);
const ASSET_CONFIG = path.join(ROOT, 'src/data/monthCompositionAssets.ts');
const MONTH_CALENDAR = path.join(ROOT, 'src/components/MonthCalendar.tsx');
const MONTH_VIEW = path.join(ROOT, 'src/components/MonthCompositionView.tsx');

const EXPECTED_ORIGINAL_AGGREGATE =
  'd8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124';
const NORMALIZED_PUBLIC_DIR =
  '/assets/calendar-composition/date-buttons-normalized/06/';
const ORIGINAL_PUBLIC_DIR = '/assets/calendar-composition/date-buttons/06/';
const EXPECTED_NORMALIZED_FILES = [
  'blank.png',
  ...Array.from({ length: 31 }, (_, index) => `${index + 1}`.padStart(2, '0') + '.png'),
];

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const listFiles = (directory, extension) =>
  readdirSync(directory)
    .filter((fileName) => fileName.endsWith(extension))
    .sort();

const aggregateOriginalFiles = () => {
  const hash = createHash('sha256');
  for (const fileName of listFiles(ORIGINAL_DIR, '.jpg')) {
    hash.update(fileName);
    hash.update('\0');
    hash.update(readFileSync(path.join(ORIGINAL_DIR, fileName)));
  }
  return hash.digest('hex');
};

const identify = (filePath) =>
  execFileSync(
    'magick',
    ['identify', '-format', '%w|%h|%m', filePath],
    { encoding: 'utf8' },
  ).trim();

const meanColor = (filePath) =>
  execFileSync(
    'magick',
    [
      filePath,
      '-resize',
      '1x1!',
      '-colorspace',
      'sRGB',
      '-format',
      '%[fx:r]|%[fx:g]|%[fx:b]',
      'info:',
    ],
    { encoding: 'utf8' },
  )
    .trim()
    .split('|')
    .map(Number);

const colorSpread = (files) => {
  const colors = files.map(meanColor);
  const means = [0, 1, 2].map(
    (channel) => colors.reduce((sum, color) => sum + color[channel], 0) / colors.length,
  );
  const channelVariances = [0, 1, 2].map(
    (channel) =>
      colors.reduce((sum, color) => sum + (color[channel] - means[channel]) ** 2, 0) /
      colors.length,
  );
  return Math.sqrt(channelVariances.reduce((sum, variance) => sum + variance, 0));
};

const edgeTemplateSignature = (filePath) =>
  sha256(
    execFileSync('magick', [
      filePath,
      '-fill',
      'black',
      '-draw',
      'rectangle 18,10 100,56',
      'rgba:-',
    ]),
  );

const checkFiles = () => {
  assert(existsSync(ORIGINAL_DIR), '6 月原始 date-buttons 目录不存在');
  assert(
    aggregateOriginalFiles() === EXPECTED_ORIGINAL_AGGREGATE,
    '6 月原始 date-buttons 内容发生变化',
  );
  assert(existsSync(NORMALIZED_DIR), '缺少 6 月 normalized 按钮目录');

  const normalizedFiles = listFiles(NORMALIZED_DIR, '.png');
  assert(
    JSON.stringify(normalizedFiles) === JSON.stringify(EXPECTED_NORMALIZED_FILES.sort()),
    `normalized 按钮文件不完整：当前 ${normalizedFiles.length} 个`,
  );

  const normalizedPaths = normalizedFiles.map((fileName) => path.join(NORMALIZED_DIR, fileName));
  for (const filePath of normalizedPaths) {
    assert(identify(filePath) === '118|66|PNG', `normalized 按钮尺寸或格式错误：${filePath}`);
  }

  const blankSignature = edgeTemplateSignature(path.join(NORMALIZED_DIR, 'blank.png'));
  for (const filePath of normalizedPaths) {
    assert(
      edgeTemplateSignature(filePath) === blankSignature,
      `normalized 按钮边框、圆角或阴影不一致：${filePath}`,
    );
  }

  const originalPaths = listFiles(ORIGINAL_DIR, '.jpg').map((fileName) =>
    path.join(ORIGINAL_DIR, fileName),
  );
  const originalSpread = colorSpread(originalPaths);
  const normalizedSpread = colorSpread(normalizedPaths);
  assert(
    normalizedSpread < originalSpread * 0.2,
    `normalized 平均色差改善不足：原始 ${originalSpread.toFixed(6)}，新 ${normalizedSpread.toFixed(6)}`,
  );

  return { normalizedSpread, originalSpread };
};

const checkMappings = () => {
  const assetSource = readFileSync(ASSET_CONFIG, 'utf8');
  const calendarSource = readFileSync(MONTH_CALENDAR, 'utf8');
  const monthViewSource = readFileSync(MONTH_VIEW, 'utf8');

  assert(
    assetSource.includes(`const NORMALIZED_DATE_BUTTON_DIR = '${NORMALIZED_PUBLIC_DIR.slice(0, -3)}';`),
    'normalized 按钮目录常量不正确',
  );
  assert(
    assetSource.includes(`const DATE_BUTTON_DIR = '${ORIGINAL_PUBLIC_DIR.slice(0, -3)}';`),
    '原始按钮目录常量不正确',
  );
  assert(
    assetSource.includes('fiveWeek: `${NORMALIZED_DATE_BUTTON_DIR}06/`') &&
      assetSource.includes('sixWeek: `${DATE_BUTTON_DIR}06/`'),
    '6 月 fiveWeek/sixWeek 按钮目录映射不正确',
  );
  assert(
    /dateButtonExtensions:\s*{[\s\S]*?fiveWeek:\s*['"]png['"][\s\S]*?sixWeek:\s*['"]jpg['"]/.test(
      assetSource,
    ),
    '6 月 fiveWeek/sixWeek 按钮扩展名映射不正确',
  );
  assert(
    calendarSource.includes('compositionAssets.dateButtonDirs?.[compositionLayout.defaultLayout]'),
    '月份组件没有按当前布局选择按钮目录',
  );
  assert(
    !calendarSource.includes('finalReferenceImage') && !monthViewSource.includes('finalReferenceImage'),
    '正式月份组件禁止读取 finalReferenceImage',
  );
};

const spreads = checkFiles();
checkMappings();

console.log(
  `6 月日期按钮检查通过：原始 RGB 离散度 ${spreads.originalSpread.toFixed(6)}，` +
    `normalized ${spreads.normalizedSpread.toFixed(6)}，降低 ${(
      (1 - spreads.normalizedSpread / spreads.originalSpread) *
      100
    ).toFixed(2)}%。`,
);
