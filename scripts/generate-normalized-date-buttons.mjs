import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons/06',
);
const MASTER_IMAGE = path.join(ORIGINAL_DIR, 'blank.jpg');
const OUTPUT_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-normalized/06',
);
const FONT_FILE = '/System/Library/Fonts/Supplemental/Times New Roman.ttf';
const CLEAN_PANEL = path.join(
  ROOT,
  'public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png',
);

const EXPECTED_ORIGINAL_AGGREGATE =
  'd8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124';
const EXPECTED_CLEAN_PANEL_SHA256 =
  'f2eeb6d42a8d6740d54ccdc5d5b6911afcd7d36dea79a731ce12c1f2107e2bfa';

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const sha256 = (filePath) =>
  createHash('sha256').update(readFileSync(filePath)).digest('hex');

const aggregateOriginalFiles = () => {
  const hash = createHash('sha256');
  const fileNames = readdirSync(ORIGINAL_DIR)
    .filter((fileName) => fileName.endsWith('.jpg'))
    .sort();

  for (const fileName of fileNames) {
    hash.update(fileName);
    hash.update('\0');
    hash.update(readFileSync(path.join(ORIGINAL_DIR, fileName)));
  }
  return hash.digest('hex');
};

const runMagick = (args) => {
  execFileSync('magick', args, { stdio: 'inherit' });
};

assert(existsSync(MASTER_IMAGE), `缺少 6 月按钮母版：${MASTER_IMAGE}`);
assert(existsSync(FONT_FILE), `缺少统一数字字体：${FONT_FILE}`);
assert(
  aggregateOriginalFiles() === EXPECTED_ORIGINAL_AGGREGATE,
  '生成前 6 月原始 date-buttons 内容已变化',
);
assert(
  sha256(CLEAN_PANEL) === EXPECTED_CLEAN_PANEL_SHA256,
  '生成前 fiveWeek clean panel 内容已变化',
);

rmSync(OUTPUT_DIR, { force: true, recursive: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

runMagick([
  MASTER_IMAGE,
  '-define',
  'png:color-type=2',
  '-strip',
  path.join(OUTPUT_DIR, 'blank.png'),
]);

for (let day = 1; day <= 31; day += 1) {
  const fileName = `${day}`.padStart(2, '0') + '.png';
  runMagick([
    MASTER_IMAGE,
    '-font',
    FONT_FILE,
    '-pointsize',
    '28',
    '-gravity',
    'center',
    '-fill',
    'rgba(36,13,27,0.66)',
    '-annotate',
    '+1+2',
    `${day}`,
    '-fill',
    '#f4eadc',
    '-annotate',
    '+0+0',
    `${day}`,
    '-define',
    'png:color-type=2',
    '-strip',
    path.join(OUTPUT_DIR, fileName),
  ]);
}

assert(
  aggregateOriginalFiles() === EXPECTED_ORIGINAL_AGGREGATE,
  '生成过程中 6 月原始 date-buttons 被修改',
);
assert(
  sha256(CLEAN_PANEL) === EXPECTED_CLEAN_PANEL_SHA256,
  '生成过程中 fiveWeek clean panel 被修改',
);

console.log(
  `已使用 ${path.relative(ROOT, MASTER_IMAGE)} 生成 32 张统一按钮到 ${path.relative(ROOT, OUTPUT_DIR)}。`,
);
