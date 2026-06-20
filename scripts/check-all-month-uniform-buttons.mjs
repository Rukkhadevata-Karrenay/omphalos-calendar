import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL_ROOT = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons',
);
const UNIFORM_ROOT = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-uniform',
);
const ASSET_CONFIG = path.join(ROOT, 'src/data/monthCompositionAssets.ts');
const MONTH_CALENDAR = path.join(ROOT, 'src/components/MonthCalendar.tsx');
const APP_CSS = path.join(ROOT, 'src/App.css');
const PREVIEW_IMAGE = path.join(ROOT, 'docs/button-uniform-preview-all-months.png');
const TARGET_MONTHS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];
const EXPECTED_FILES = [
  'blank.png',
  ...Array.from({ length: 31 }, (_, index) => `${index + 1}`.padStart(2, '0') + '.png'),
].sort();

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const magickValue = (args) =>
  execFileSync('magick', args, { encoding: 'utf8' }).trim();

const identify = (filePath) =>
  magickValue(['identify', '-format', '%w|%h|%m|%[channels]|%[colorspace]', filePath]);

const meanColor = (filePath) =>
  magickValue([
    filePath,
    '-resize',
    '1x1!',
    '-colorspace',
    'sRGB',
    '-format',
    '%[fx:r]|%[fx:g]|%[fx:b]',
    'info:',
  ])
    .split('|')
    .map(Number);

const colorSpread = (files) => {
  const colors = files.map(meanColor);
  const means = [0, 1, 2].map(
    (channel) => colors.reduce((sum, color) => sum + color[channel], 0) / colors.length,
  );
  const variances = [0, 1, 2].map(
    (channel) =>
      colors.reduce((sum, color) => sum + (color[channel] - means[channel]) ** 2, 0) /
      colors.length,
  );
  return Math.sqrt(variances.reduce((sum, variance) => sum + variance, 0));
};

const edgeDifference = (masterPath, candidatePath) =>
  Number(
    magickValue([
      '(',
      masterPath,
      '-background',
      'white',
      '-alpha',
      'remove',
      ')',
      '(',
      candidatePath,
      '-background',
      'white',
      '-alpha',
      'remove',
      ')',
      '-compose',
      'difference',
      '-composite',
      '-fill',
      'black',
      '-draw',
      'rectangle 24,6 94,60',
      '-alpha',
      'off',
      '-format',
      '%[fx:maxima]',
      'info:',
    ]),
  );

const rowColor = (filePath, y) =>
  magickValue([
    filePath,
    '-crop',
    `90x1+14+${y}`,
    '+repage',
    '-alpha',
    'off',
    '-resize',
    '1x1!',
    '-colorspace',
    'sRGB',
    '-format',
    '%[fx:r]|%[fx:g]|%[fx:b]',
    'info:',
  ])
    .split('|')
    .map(Number);

const topRowJump = (filePath) => {
  const rows = Array.from({ length: 8 }, (_, index) => rowColor(filePath, index + 5));
  return Math.max(
    ...rows.slice(1).map((row, index) =>
      Math.sqrt(
        row.reduce(
          (sum, channel, channelIndex) =>
            sum + (channel - rows[index][channelIndex]) ** 2,
          0,
        ),
      ),
    ),
  );
};

const results = [];

for (const monthId of TARGET_MONTHS) {
  const monthDirectory = `${monthId}`.padStart(2, '0');
  const originalDirectory = path.join(ORIGINAL_ROOT, monthDirectory);
  const uniformDirectory = path.join(UNIFORM_ROOT, monthDirectory);
  const masterImage = path.join(uniformDirectory, 'master-clean.png');

  assert(existsSync(masterImage), `${monthDirectory} 月缺少 master-clean.png`);
  const files = readdirSync(uniformDirectory)
    .filter((name) => /^(blank|\d{2})\.png$/.test(name))
    .sort();
  assert(
    JSON.stringify(files) === JSON.stringify(EXPECTED_FILES),
    `${monthDirectory} 月 uniform PNG 不完整：当前 ${files.length} 张`,
  );

  const outputPaths = files.map((fileName) => path.join(uniformDirectory, fileName));
  for (const filePath of [masterImage, ...outputPaths]) {
    const [width, height, format, channels, colorspace] = identify(filePath).split('|');
    assert(
      width === '118' &&
        height === '66' &&
        format === 'PNG' &&
        channels.toLowerCase().includes('a') &&
        colorspace === 'sRGB',
      `${monthDirectory} 月按钮尺寸、通道或格式错误：${filePath}`,
    );
    assert(topRowJump(filePath) <= 0.05, `${monthDirectory} 月按钮出现顶部横向色带`);
  }
  for (const filePath of outputPaths) {
    assert(
      edgeDifference(masterImage, filePath) <= 0.001,
      `${monthDirectory} 月按钮未保持同一母版边缘：${filePath}`,
    );
  }

  const originalPaths = readdirSync(originalDirectory)
    .filter((name) => name.endsWith('.jpg'))
    .map((name) => path.join(originalDirectory, name));
  const originalSpread = colorSpread(originalPaths);
  const uniformSpread = colorSpread(outputPaths);
  assert(
    uniformSpread < originalSpread * 0.2,
    `${monthDirectory} 月色差改善不足：原始 ${originalSpread.toFixed(6)}，uniform ${uniformSpread.toFixed(6)}`,
  );
  results.push({ monthDirectory, originalSpread, uniformSpread });
}

assert(existsSync(PREVIEW_IMAGE), '缺少全部月份 uniform 按钮预览图');

const assetSource = readFileSync(ASSET_CONFIG, 'utf8');
const calendarSource = readFileSync(MONTH_CALENDAR, 'utf8');
const cssSource = readFileSync(APP_CSS, 'utf8');
assert(
  assetSource.includes('const uniformMonthDirectory = `${UNIFORM_DATE_BUTTON_DIR}${monthDirectory}/`;'),
  '通用月份素材工厂未使用 uniform 目录',
);
assert(
  assetSource.includes('fiveWeek: uniformMonthDirectory') &&
    assetSource.includes('sixWeek: uniformMonthDirectory'),
  '通用月份 fiveWeek/sixWeek 未统一读取 uniform PNG',
);
assert(
  assetSource.includes("fiveWeek: 'png'") && assetSource.includes("sixWeek: 'png'"),
  '通用月份按钮扩展名未切换为 PNG',
);
assert(
  assetSource.includes("12: `${DATE_BUTTON_DIR}11/12.jpg`"),
  '11 月 12 日必须继续使用原“∞”特殊按钮图片',
);
assert(
  calendarSource.includes('compositionAssets.specialDateButtonImages?.[cell.day]'),
  'MonthCalendar 未按集中配置选择特殊日期按钮图片',
);
const specialFrameRule =
  cssSource.match(/\.month-composition-view \.date-special-frame\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
assert(
  specialFrameRule.includes('border-image-source: linear-gradient(') &&
    specialFrameRule.includes('border-image-slice: 1'),
  '11 月“翁法罗斯之日”没有使用综合色边框',
);
assert(!specialFrameRule.includes('background:'), '特殊日期综合色边框不得遮挡按钮图案');

console.log('全部月份 uniform 按钮检查通过：');
for (const { monthDirectory, originalSpread, uniformSpread } of results) {
  console.log(
    `- ${monthDirectory} 月：原始 ${originalSpread.toFixed(6)}，uniform ${uniformSpread.toFixed(6)}`,
  );
}
console.log('11 月 12 日保留原“∞”按钮图，并使用独立综合色 border-image。');
