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
const PREVIEW_IMAGE = path.join(ROOT, 'docs/button-uniform-preview-06.png');
const ASSET_CONFIG = path.join(ROOT, 'src/data/monthCompositionAssets.ts');

const EXPECTED_ORIGINAL_AGGREGATE =
  'd8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124';
const EXPECTED_NORMALIZED_AGGREGATE =
  'd5c3d1160421019d9de2a4572672819d75cf08c1d4405f1b3cf615408160aa54';
const EXPECTED_MASTER_SHA256 =
  'd5622f28ff70508596d63885affbbee4f2514f557977140a34dc9b911ec5f1d8';
const EXPECTED_FILES = [
  'blank.png',
  ...Array.from({ length: 31 }, (_, index) => `${index + 1}`.padStart(2, '0') + '.png'),
].sort();

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

const identify = (filePath) =>
  magickValue(['identify', '-format', '%w|%h|%m|%[channels]|%[colorspace]', filePath]);

const edgeDifference = (candidatePath) =>
  Number(
    magickValue([
      '(',
      MASTER_IMAGE,
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

assert(existsSync(MASTER_IMAGE), '缺少已确认的 master-clean.png');
assert(sha256(MASTER_IMAGE) === EXPECTED_MASTER_SHA256, 'master-clean.png 内容发生变化');
assert(
  aggregateDirectory(ORIGINAL_DIR) === EXPECTED_ORIGINAL_AGGREGATE,
  '原始 date-buttons/06 内容发生变化',
);
assert(
  aggregateDirectory(NORMALIZED_DIR) === EXPECTED_NORMALIZED_AGGREGATE,
  'date-buttons-normalized/06 内容发生变化',
);

const files = readdirSync(UNIFORM_DIR)
  .filter((name) => /^(blank|\d{2})\.png$/.test(name))
  .sort();
assert(
  JSON.stringify(files) === JSON.stringify(EXPECTED_FILES),
  `uniform PNG 文件不完整：当前 ${files.length} 个`,
);

const outputPaths = files.map((fileName) => path.join(UNIFORM_DIR, fileName));
for (const filePath of outputPaths) {
  const [width, height, format, channels, colorspace] = identify(filePath).split('|');
  assert(
    width === '118' &&
      height === '66' &&
      format === 'PNG' &&
      channels.toLowerCase().includes('a') &&
      colorspace === 'sRGB',
    `uniform PNG 尺寸、通道或色彩模式错误：${filePath}`,
  );
  assert(edgeDifference(filePath) <= 0.001, `按钮未保持统一母版边缘：${filePath}`);
  assert(topRowJump(filePath) <= 0.05, `按钮顶部重新出现横线或色带：${filePath}`);
}

assert(
  sha256(path.join(UNIFORM_DIR, 'blank.png')) === EXPECTED_MASTER_SHA256,
  'blank.png 必须与 master-clean.png 完全一致',
);
assert(existsSync(PREVIEW_IMAGE), '缺少 docs/button-uniform-preview-06.png');
const assetConfigSource = readFileSync(ASSET_CONFIG, 'utf8');
assert(
  assetConfigSource.includes(
    "const UNIFORM_DATE_BUTTON_DIR = '/assets/calendar-composition/date-buttons-uniform/';",
  ),
  '缺少 uniform 日期按钮目录常量',
);
assert(
  assetConfigSource.includes('fiveWeek: `${UNIFORM_DATE_BUTTON_DIR}06/`'),
  '6 月 fiveWeek 未切换到 uniform 按钮目录',
);
assert(
  assetConfigSource.includes('sixWeek: `${DATE_BUTTON_DIR}06/`'),
  '6 月 sixWeek 必须继续使用原始按钮目录',
);
assert(
  assetConfigSource.includes(
    'const uniformMonthDirectory = `${UNIFORM_DATE_BUTTON_DIR}${monthDirectory}/`',
  ),
  '其他月份应通过通用工厂使用各自的 uniform 按钮目录',
);

console.log(
  `uniform PNG 检查通过：${files.length} 张 118×66 RGBA PNG 全部继承同一母版，` +
    `最大顶部扫描行跳变 ${Math.max(...outputPaths.map(topRowJump)).toFixed(6)}；` +
    '无黑边、无顶部横线，原始与 normalized 目录未变化；6 月 fiveWeek 已切换，sixWeek 未变化。',
);
