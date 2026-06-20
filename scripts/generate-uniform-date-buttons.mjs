import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ORIGINAL_DIR = path.join(ROOT, 'public/assets/calendar-composition/date-buttons/06');
const NORMALIZED_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-normalized/06',
);
const OUTPUT_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-uniform/06',
);
const MASTER_IMAGE = path.join(OUTPUT_DIR, 'master-clean.png');
const PREVIEW_IMAGE = path.join(ROOT, 'docs/button-uniform-preview-06.png');
const FONT_FILE = '/System/Library/Fonts/Supplemental/Times New Roman.ttf';
const PROTECTED_FILES = [
  path.join(
    ROOT,
    'public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png',
  ),
  path.join(ROOT, 'src/data/monthButtonLayoutConfig.ts'),
  path.join(ROOT, 'src/data/monthCompositionAssets.ts'),
  path.join(ROOT, 'src/components/MonthCalendar.tsx'),
];

const EXPECTED_ORIGINAL_AGGREGATE =
  'd8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124';
const EXPECTED_NORMALIZED_AGGREGATE =
  'd5c3d1160421019d9de2a4572672819d75cf08c1d4405f1b3cf615408160aa54';
const EXPECTED_MASTER_SHA256 =
  'd5622f28ff70508596d63885affbbee4f2514f557977140a34dc9b911ec5f1d8';
const OUTPUT_FILES = [
  'blank.png',
  ...Array.from({ length: 31 }, (_, index) => `${index + 1}`.padStart(2, '0') + '.png'),
];

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

const runMagick = (args) => {
  execFileSync('magick', args, { stdio: 'inherit' });
};

assert(existsSync(MASTER_IMAGE), `缺少已确认母版：${MASTER_IMAGE}`);
assert(sha256(MASTER_IMAGE) === EXPECTED_MASTER_SHA256, 'master-clean.png 内容发生变化');
assert(existsSync(FONT_FILE), `缺少统一数字字体：${FONT_FILE}`);
assert(
  aggregateDirectory(ORIGINAL_DIR) === EXPECTED_ORIGINAL_AGGREGATE,
  '生成前原始 date-buttons/06 内容已变化',
);
assert(
  aggregateDirectory(NORMALIZED_DIR) === EXPECTED_NORMALIZED_AGGREGATE,
  '生成前 normalized 目录内容已变化',
);

const protectedHashes = new Map(
  PROTECTED_FILES.map((filePath) => [filePath, sha256(filePath)]),
);
mkdirSync(OUTPUT_DIR, { recursive: true });
for (const fileName of OUTPUT_FILES) {
  rmSync(path.join(OUTPUT_DIR, fileName), { force: true });
}

copyFileSync(MASTER_IMAGE, path.join(OUTPUT_DIR, 'blank.png'));

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
    'png:color-type=6',
    '-strip',
    path.join(OUTPUT_DIR, fileName),
  ]);
}

const previewItems = [
  ['blank', 'blank.png'],
  ['01', '01.png'],
  ['02', '02.png'],
  ['16', '16.png'],
  ['18', '18.png'],
  ['19', '19.png'],
  ['30', '30.png'],
];
const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), 'omphalos-uniform-png-preview-'));

try {
  const tiles = previewItems.map(([label, fileName], index) => {
    const tilePath = path.join(temporaryDirectory, `${index}.png`);
    runMagick([
      '-size',
      '134x96',
      'xc:#1d0f18',
      '-font',
      FONT_FILE,
      '-pointsize',
      '13',
      '-gravity',
      'north',
      '-fill',
      '#f4eadc',
      '-annotate',
      '+0+3',
      label,
      path.join(OUTPUT_DIR, fileName),
      '-geometry',
      '+8+24',
      '-gravity',
      'northwest',
      '-compose',
      'over',
      '-composite',
      tilePath,
    ]);
    return tilePath;
  });
  runMagick([...tiles, '+append', '-strip', PREVIEW_IMAGE]);
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true });
}

assert(sha256(MASTER_IMAGE) === EXPECTED_MASTER_SHA256, '生成过程中 master-clean.png 被修改');
assert(
  aggregateDirectory(ORIGINAL_DIR) === EXPECTED_ORIGINAL_AGGREGATE,
  '生成过程中原始 date-buttons/06 被修改',
);
assert(
  aggregateDirectory(NORMALIZED_DIR) === EXPECTED_NORMALIZED_AGGREGATE,
  '生成过程中 normalized 目录被修改',
);
for (const [filePath, expectedHash] of protectedHashes) {
  assert(sha256(filePath) === expectedHash, `生成过程中受保护文件发生变化：${filePath}`);
}

console.log(
  `已从 ${path.relative(ROOT, MASTER_IMAGE)} 生成 32 张 uniform RGBA PNG，` +
    `预览图：${path.relative(ROOT, PREVIEW_IMAGE)}；页面映射未修改。`,
);
