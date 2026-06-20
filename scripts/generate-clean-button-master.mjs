import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
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
const REFERENCE_IMAGE = path.join(ORIGINAL_DIR, 'blank.jpg');
const OUTPUT_DIR = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-uniform/06',
);
const MASTER_IMAGE = path.join(OUTPUT_DIR, 'master-clean.png');
const COMPARE_PREVIEW = path.join(ROOT, 'docs/button-master-clean-preview-06.png');
const ZOOM_PREVIEW = path.join(ROOT, 'docs/button-master-clean-zoom-06.png');
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

const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), 'omphalos-clean-master-'));

try {
  const maskPath = path.join(temporaryDirectory, 'button-mask.png');
  runMagick([
    '-size',
    '118x66',
    'xc:black',
    '-fill',
    'white',
    '-stroke',
    'none',
    '-draw',
    'roundrectangle 2,2 116,64 8,8',
    maskPath,
  ]);

  runMagick([
    '-size',
    '118x66',
    'gradient:#735260-#6d4c5a',
    maskPath,
    '-alpha',
    'off',
    '-compose',
    'CopyOpacity',
    '-composite',
    '-fill',
    'none',
    '-stroke',
    '#ead9c8',
    '-strokewidth',
    '2',
    '-draw',
    'roundrectangle 1.5,1.5 116.5,64.5 8.5,8.5',
    '-stroke',
    'rgba(255,243,230,0.28)',
    '-strokewidth',
    '0.75',
    '-draw',
    'roundrectangle 3.5,3.5 114.5,62.5 6.5,6.5',
    '-define',
    'png:color-type=6',
    '-strip',
    MASTER_IMAGE,
  ]);

  runMagick([
    '-size',
    '1040x350',
    'xc:#1d0f18',
    '-font',
    FONT_FILE,
    '-pointsize',
    '19',
    '-fill',
    '#f4eadc',
    '-gravity',
    'northwest',
    '-annotate',
    '+20+12',
    'original blank.jpg (400%)',
    '-annotate',
    '+548+12',
    'master-clean.png (400%)',
    '(',
    REFERENCE_IMAGE,
    '-filter',
    'point',
    '-resize',
    '472x264!',
    ')',
    '-geometry',
    '+20+50',
    '-compose',
    'over',
    '-composite',
    '(',
    MASTER_IMAGE,
    '-filter',
    'point',
    '-resize',
    '472x264!',
    ')',
    '-geometry',
    '+548+50',
    '-compose',
    'over',
    '-composite',
    '-strip',
    COMPARE_PREVIEW,
  ]);

  const fullZoom = path.join(temporaryDirectory, 'full.png');
  const topZoom = path.join(temporaryDirectory, 'top.png');
  const leftZoom = path.join(temporaryDirectory, 'left.png');
  const rightZoom = path.join(temporaryDirectory, 'right.png');
  const interiorZoom = path.join(temporaryDirectory, 'interior.png');

  runMagick([MASTER_IMAGE, '-filter', 'point', '-resize', '472x264!', fullZoom]);
  runMagick([
    MASTER_IMAGE,
    '-crop',
    '118x24+0+0',
    '+repage',
    '-filter',
    'point',
    '-resize',
    '472x96!',
    topZoom,
  ]);
  runMagick([
    MASTER_IMAGE,
    '-crop',
    '28x28+0+0',
    '+repage',
    '-filter',
    'point',
    '-resize',
    '224x224!',
    leftZoom,
  ]);
  runMagick([
    MASTER_IMAGE,
    '-crop',
    '28x28+90+0',
    '+repage',
    '-filter',
    'point',
    '-resize',
    '224x224!',
    rightZoom,
  ]);
  runMagick([
    MASTER_IMAGE,
    '-crop',
    '58x32+30+24',
    '+repage',
    '-filter',
    'point',
    '-resize',
    '290x160!',
    interiorZoom,
  ]);

  runMagick([
    '-size',
    '1040x640',
    'xc:#1d0f18',
    '-font',
    FONT_FILE,
    '-pointsize',
    '18',
    '-fill',
    '#f4eadc',
    '-gravity',
    'northwest',
    '-annotate',
    '+20+12',
    'full master (400%)',
    '-annotate',
    '+520+12',
    'top edge (400%)',
    '-annotate',
    '+20+340',
    'left corner (800%)',
    '-annotate',
    '+280+340',
    'right corner (800%)',
    '-annotate',
    '+540+340',
    'interior color (500%)',
    fullZoom,
    '-geometry',
    '+20+42',
    '-compose',
    'over',
    '-composite',
    topZoom,
    '-geometry',
    '+520+42',
    '-compose',
    'over',
    '-composite',
    leftZoom,
    '-geometry',
    '+20+372',
    '-compose',
    'over',
    '-composite',
    rightZoom,
    '-geometry',
    '+280+372',
    '-compose',
    'over',
    '-composite',
    interiorZoom,
    '-geometry',
    '+540+372',
    '-compose',
    'over',
    '-composite',
    '-strip',
    ZOOM_PREVIEW,
  ]);
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true });
}

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
  `已生成干净 PNG 母版 ${path.relative(ROOT, MASTER_IMAGE)} 和两张母版预览；` +
    '未批量生成 uniform PNG，未修改页面映射。',
);
