import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL_DIR = path.join(ROOT, 'public/assets/calendar-composition/date-buttons/06');
const NORMALIZED_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-normalized/06',
);
const UNIFORM_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-uniform/06',
);
const MASTER_IMAGE = path.join(UNIFORM_DIR, 'master-clean.png');
const COMPARE_PREVIEW = path.join(ROOT, 'docs/button-master-clean-preview-06.png');
const ZOOM_PREVIEW = path.join(ROOT, 'docs/button-master-clean-zoom-06.png');
const ASSET_CONFIG = path.join(ROOT, 'src/data/monthCompositionAssets.ts');

const EXPECTED_ORIGINAL_AGGREGATE =
  'd8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124';
const EXPECTED_NORMALIZED_AGGREGATE =
  'd5c3d1160421019d9de2a4572672819d75cf08c1d4405f1b3cf615408160aa54';
const EXPECTED_CLEAN_PANEL_SHA256 =
  'f2eeb6d42a8d6740d54ccdc5d5b6911afcd7d36dea79a731ce12c1f2107e2bfa';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const sha256 = (filePath) =>
  createHash('sha256').update(readFileSync(filePath)).digest('hex');

const aggregateDirectory = (directory) => {
  const hash = createHash('sha256');
  for (const fileName of readdirSync(directory).filter((name) => /\.(jpg|png)$/i.test(name)).sort()) {
    hash.update(fileName);
    hash.update('\0');
    hash.update(readFileSync(path.join(directory, fileName)));
  }
  return hash.digest('hex');
};

const magickValue = (args) =>
  execFileSync('magick', args, { encoding: 'utf8' }).trim();

assert(existsSync(MASTER_IMAGE), '缺少 master-clean.png');
const [masterWidth, masterHeight, masterFormat, masterChannels] = magickValue([
  'identify',
  '-format',
  '%w|%h|%m|%[channels]',
  MASTER_IMAGE,
]).split('|');
assert(
  masterWidth === '118' &&
    masterHeight === '66' &&
    masterFormat === 'PNG' &&
    masterChannels.toLowerCase().includes('a'),
  'master-clean.png 必须是 118×66 RGBA PNG',
);

const cornerAlpha = Number(
  magickValue([
    MASTER_IMAGE,
    '-alpha',
    'extract',
    '-crop',
    '1x1+0+0',
    '+repage',
    '-format',
    '%[fx:maxima]',
    'info:',
  ]),
);
assert(cornerAlpha === 0, `左上角必须透明，当前 alpha=${cornerAlpha}`);

const flattenedMinimum = Number(
  magickValue([
    MASTER_IMAGE,
    '-background',
    'white',
    '-alpha',
    'remove',
    '-colorspace',
    'Gray',
    '-format',
    '%[fx:minima]',
    'info:',
  ]),
);
assert(flattenedMinimum >= 0.12, `母版仍存在近黑色像素，最低亮度=${flattenedMinimum}`);

const interiorDeviation = Number(
  magickValue([
    MASTER_IMAGE,
    '-crop',
    '96x32+11+25',
    '+repage',
    '-alpha',
    'off',
    '-colorspace',
    'Gray',
    '-format',
    '%[fx:standard_deviation]',
    'info:',
  ]),
);
assert(interiorDeviation <= 0.04, `内部底色不够平滑，标准差=${interiorDeviation}`);

const meanColor = (geometry) =>
  magickValue([
    MASTER_IMAGE,
    '-crop',
    geometry,
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
const topColor = meanColor('100x10+9+8');
const upperBodyColor = meanColor('100x10+9+22');
const topBodyColorDistance = Math.sqrt(
  topColor.reduce(
    (sum, channel, index) => sum + (channel - upperBodyColor[index]) ** 2,
    0,
  ),
);
assert(
  topBodyColorDistance <= 0.025,
  `顶部仍形成独立深色分区，顶部与主体 RGB 距离=${topBodyColorDistance}`,
);

const topRows = Array.from({ length: 8 }, (_, index) => meanColor(`90x1+14+${index + 5}`));
const topRowJump = Math.max(
  ...topRows.slice(1).map((row, index) =>
    Math.sqrt(
      row.reduce(
        (sum, channel, channelIndex) =>
          sum + (channel - topRows[index][channelIndex]) ** 2,
        0,
      ),
    ),
  ),
);
assert(
  topRowJump <= 0.05,
  `顶部仍存在横向色带或横线，相邻扫描行最大 RGB 跳变=${topRowJump}`,
);

assert(existsSync(COMPARE_PREVIEW), '缺少 button-master-clean-preview-06.png');
assert(existsSync(ZOOM_PREVIEW), '缺少 button-master-clean-zoom-06.png');
assert(
  !readdirSync(UNIFORM_DIR).some((name) => /^(blank|\d{2})\.png$/.test(name)),
  '母版确认前禁止批量生成 uniform PNG',
);
assert(
  aggregateDirectory(ORIGINAL_DIR) === EXPECTED_ORIGINAL_AGGREGATE,
  '原始 date-buttons/06 内容发生变化',
);
assert(
  aggregateDirectory(NORMALIZED_DIR) === EXPECTED_NORMALIZED_AGGREGATE,
  'date-buttons-normalized/06 内容发生变化',
);
assert(
  sha256(
    path.join(
      ROOT,
      'public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png',
    ),
  ) === EXPECTED_CLEAN_PANEL_SHA256,
  'fiveWeek clean panel 内容发生变化',
);
assert(
  !readFileSync(ASSET_CONFIG, 'utf8').includes('date-buttons-uniform'),
  '本阶段禁止切换页面到 uniform 目录',
);

console.log(
  `clean 母版检查通过：118×66 RGBA PNG，最低合成亮度 ${flattenedMinimum.toFixed(6)}，` +
    `内部标准差 ${interiorDeviation.toFixed(6)}，顶部/主体 RGB 距离 ${topBodyColorDistance.toFixed(6)}；` +
    `顶部相邻行最大跳变 ${topRowJump.toFixed(6)}；未生成 uniform PNG，页面映射未切换。`,
);
