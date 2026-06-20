import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
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
const ORIGINAL_ROOT = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons',
);
const UNIFORM_ROOT = path.join(
  ROOT,
  'public/assets/calendar-composition/date-buttons-uniform',
);
const PREVIEW_IMAGE = path.join(ROOT, 'docs/button-uniform-preview-all-months.png');
const FONT_FILE = '/System/Library/Fonts/Supplemental/Times New Roman.ttf';
const TARGET_MONTHS = [1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12];
const OUTPUT_FILES = [
  'blank.png',
  ...Array.from({ length: 31 }, (_, index) => `${index + 1}`.padStart(2, '0') + '.png'),
];
const PROTECTED_FILES = [
  path.join(ROOT, 'src/data/monthCompositionAssets.ts'),
  path.join(ROOT, 'src/data/monthButtonLayoutConfig.ts'),
  path.join(ROOT, 'src/components/MonthCalendar.tsx'),
  path.join(ROOT, 'src/components/MonthCompositionView.tsx'),
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

const magickValue = (args) =>
  execFileSync('magick', args, { encoding: 'utf8' }).trim();

const toHex = (channels) =>
  `#${channels
    .map((channel) =>
      Math.max(0, Math.min(255, Math.round(channel * 255)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;

const mix = (channels, target, amount) =>
  channels.map((channel) => channel * (1 - amount) + target * amount);

const sampleBodyColor = (blankImage) =>
  magickValue([
    blankImage,
    '-crop',
    '70x30+24+22',
    '+repage',
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

assert(readdirSync(UNIFORM_ROOT).includes('06'), '缺少已验收的 6 月 uniform 目录');
const sourceHashes = new Map(
  Array.from({ length: 12 }, (_, index) => index + 1).map((monthId) => {
    const monthDirectory = `${monthId}`.padStart(2, '0');
    const directory = path.join(ORIGINAL_ROOT, monthDirectory);
    return [directory, aggregateDirectory(directory)];
  }),
);
const juneUniformHash = aggregateDirectory(path.join(UNIFORM_ROOT, '06'));
const protectedHashes = new Map(
  PROTECTED_FILES.map((filePath) => [filePath, sha256(filePath)]),
);

const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), 'omphalos-all-uniform-buttons-'));
const maskPath = path.join(temporaryDirectory, 'button-mask.png');

try {
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

  for (const monthId of TARGET_MONTHS) {
    const monthDirectory = `${monthId}`.padStart(2, '0');
    const originalDirectory = path.join(ORIGINAL_ROOT, monthDirectory);
    const blankImage = path.join(originalDirectory, 'blank.jpg');
    const outputDirectory = path.join(UNIFORM_ROOT, monthDirectory);
    const masterImage = path.join(outputDirectory, 'master-clean.png');
    const baseColor = sampleBodyColor(blankImage);
    const topColor = toHex(mix(baseColor, 1, 0.035));
    const bottomColor = toHex(mix(baseColor, 0, 0.03));

    mkdirSync(outputDirectory, { recursive: true });
    for (const fileName of ['master-clean.png', ...OUTPUT_FILES]) {
      rmSync(path.join(outputDirectory, fileName), { force: true });
    }

    runMagick([
      '-size',
      '118x66',
      `gradient:${topColor}-${bottomColor}`,
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
      masterImage,
    ]);

    copyFileSync(masterImage, path.join(outputDirectory, 'blank.png'));
    for (let day = 1; day <= 31; day += 1) {
      const fileName = `${day}`.padStart(2, '0') + '.png';
      runMagick([
        masterImage,
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
        path.join(outputDirectory, fileName),
      ]);
    }
  }

  const rowImages = [];
  for (let monthId = 1; monthId <= 12; monthId += 1) {
    const monthDirectory = `${monthId}`.padStart(2, '0');
    const uniformDirectory = path.join(UNIFORM_ROOT, monthDirectory);
    const sampleNames = ['blank.png', '01.png', '16.png', '30.png'];
    const tiles = sampleNames.map((fileName, index) => {
      const tilePath = path.join(temporaryDirectory, `${monthDirectory}-${index}.png`);
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
        `${monthDirectory} ${fileName.replace('.png', '')}`,
        path.join(uniformDirectory, fileName),
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
    const rowPath = path.join(temporaryDirectory, `${monthDirectory}-row.png`);
    runMagick([...tiles, '+append', rowPath]);
    rowImages.push(rowPath);
  }
  runMagick([...rowImages, '-append', '-strip', PREVIEW_IMAGE]);
} finally {
  rmSync(temporaryDirectory, { force: true, recursive: true });
}

for (const [directory, expectedHash] of sourceHashes) {
  assert(aggregateDirectory(directory) === expectedHash, `原始素材目录发生变化：${directory}`);
}
assert(
  aggregateDirectory(path.join(UNIFORM_ROOT, '06')) === juneUniformHash,
  '已验收的 6 月 uniform 素材发生变化',
);
for (const [filePath, expectedHash] of protectedHashes) {
  assert(sha256(filePath) === expectedHash, `生成过程中受保护文件发生变化：${filePath}`);
}

console.log(
  `已为 ${TARGET_MONTHS.length} 个月生成统一母版和 352 张 uniform PNG；` +
    `6 月未修改，预览：${path.relative(ROOT, PREVIEW_IMAGE)}。`,
);
