import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BASE_IMAGE = path.join(
  ROOT,
  'public/assets/calendar-composition/bases/06-long-day-month-base.jpg',
);
const OUTPUT_IMAGE = path.join(
  ROOT,
  'public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png',
);
const SIX_WEEK_IMAGE = path.join(
  ROOT,
  'public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-calendar-panel.jpg',
);
const ASSET_CONFIG = path.join(ROOT, 'src/data/monthCompositionAssets.ts');
const LAYOUT_CONFIG = path.join(ROOT, 'src/data/monthButtonLayoutConfig.ts');
const COMPONENT = path.join(ROOT, 'src/components/MonthCompositionView.tsx');
const GENERATOR_SOURCE = fileURLToPath(import.meta.url);

const EXPECTED_BASE_SHA256 = 'ebe54e33e0e7356b58ddae283edc6ea998ca052b527a97631fa110c88efbfa0f';
const EXPECTED_SIX_WEEK_SHA256 = 'b027474f081f4dfb44581c04789da4faae333f9c120f8222665b5559ab982648';
const FIVE_WEEK_PUBLIC_PATH =
  '/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png';
const SIX_WEEK_PUBLIC_PATH =
  '/assets/calendar-composition/panels-clean/06-aigle-long-day-month-calendar-panel.jpg';

// 颜色值来自对 6 月最终参考图日历区域的人工量色，只保存综合色板参数；
// 生成过程不读取、复制或裁切 final reference。
const PROGRAMMATIC_PANEL_PALETTE = Object.freeze({
  left: [0.49, 0.21, 0.28],
  right: [0.76, 0.65, 0.7],
  centerRose: [0.035, -0.035, 0],
  lowerWarmth: [0.025, 0.018, 0.018],
  rightGlow: [0, 0, 0.015],
});

const fail = (message) => {
  throw new Error(message);
};

const assert = (condition, message) => {
  if (!condition) fail(message);
};

const sha256 = (filePath) =>
  createHash('sha256').update(readFileSync(filePath)).digest('hex');

const magickValue = (args) =>
  execFileSync('magick', args, { encoding: 'utf8' }).trim();

const runMagick = (args) => {
  execFileSync('magick', args, { stdio: 'inherit' });
};

const generateOutput = () => {
  const sourceHashBefore = sha256(BASE_IMAGE);
  const sixWeekHashBefore = sha256(SIX_WEEK_IMAGE);
  const temporaryDirectory = mkdtempSync(path.join(os.tmpdir(), 'omphalos-fiveweek-panel-'));
  const programmaticPanel = path.join(temporaryDirectory, 'programmatic-panel.png');
  const alphaMask = path.join(temporaryDirectory, 'fiveweek-alpha.png');

  try {
    const x = 'i/(w-1)';
    const y = 'j/(h-1)';
    const centerRose = `exp(-pow((${x}-0.52)/0.24,2))`;
    const rightGlow =
      `exp(-(pow((${x}-0.84)/0.20,2)+pow((${y}-0.45)/0.40,2)))`;
    const channelExpression = (channel, exponent) => {
      const left = PROGRAMMATIC_PANEL_PALETTE.left[channel];
      const right = PROGRAMMATIC_PANEL_PALETTE.right[channel];
      const rose = PROGRAMMATIC_PANEL_PALETTE.centerRose[channel];
      const warmth = PROGRAMMATIC_PANEL_PALETTE.lowerWarmth[channel];
      const glow = PROGRAMMATIC_PANEL_PALETTE.rightGlow[channel];

      return (
        `min(max(${left}+${right - left}*pow(${x},${exponent})` +
        `+${rose}*${centerRose}*(0.5+0.5*${y})` +
        `+${warmth}*${y}*(1-${x})+${glow}*${rightGlow},0),1)`
      );
    };

    runMagick([
      '-size',
      '1125x650',
      'xc:black',
      '-channel',
      'R',
      '-fx',
      channelExpression(0, 1.05),
      '-channel',
      'G',
      '-fx',
      channelExpression(1, 1.35),
      '-channel',
      'B',
      '-fx',
      channelExpression(2, 1.2),
      '+channel',
      '-seed',
      '6192026',
      '-attenuate',
      '0.018',
      '+noise',
      'Gaussian',
      '-strip',
      programmaticPanel,
    ]);

    runMagick([
      '-size',
      '1125x650',
      'xc:black',
      '-fx',
      'aa=max(min((i-70)/80,1),0);bb=max(min((1055-i)/80,1),0);cc=max(min((j-70)/90,1),0);dd=max(min((555-j)/55,1),0);0.86*(aa*aa*(3-2*aa))*(bb*bb*(3-2*bb))*(cc*cc*(3-2*cc))*(dd*dd*(3-2*dd))',
      '-strip',
      alphaMask,
    ]);

    runMagick([
      programmaticPanel,
      alphaMask,
      '-alpha',
      'off',
      '-compose',
      'CopyOpacity',
      '-composite',
      '-define',
      'png:color-type=6',
      '-strip',
      OUTPUT_IMAGE,
    ]);
  } finally {
    rmSync(temporaryDirectory, { force: true, recursive: true });
  }

  assert(sha256(BASE_IMAGE) === sourceHashBefore, '生成过程中 6 月正式底图发生变化');
  assert(sha256(SIX_WEEK_IMAGE) === sixWeekHashBefore, '生成过程中旧 sixWeek panel 发生变化');
};

const alphaMaximum = (geometry) =>
  Number(
    magickValue([
      OUTPUT_IMAGE,
      '-alpha',
      'extract',
      '-crop',
      geometry,
      '+repage',
      '-format',
      '%[fx:maxima]',
      'info:',
    ]),
  );

const alphaMinimum = (geometry) =>
  Number(
    magickValue([
      OUTPUT_IMAGE,
      '-alpha',
      'extract',
      '-crop',
      geometry,
      '+repage',
      '-format',
      '%[fx:minima]',
      'info:',
    ]),
  );

const rowLumaMean = (y) =>
  Number(
    magickValue([
      OUTPUT_IMAGE,
      '-alpha',
      'off',
      '-crop',
      `825x1+150+${y}`,
      '+repage',
      '-colorspace',
      'Gray',
      '-format',
      '%[fx:mean]',
      'info:',
    ]),
  );

const checkOutput = () => {
  assert(existsSync(OUTPUT_IMAGE), `缺少 fiveWeek clean panel：${OUTPUT_IMAGE}`);

  const [width, height, channels] = magickValue([
    'identify',
    '-format',
    '%w|%h|%[channels]',
    OUTPUT_IMAGE,
  ]).split('|');
  assert(width === '1125' && height === '650', `输出尺寸错误：${width}×${height}`);
  assert(channels.toLowerCase().includes('a'), `输出必须包含 alpha 通道：${channels}`);

  const alphaStats = magickValue([
    OUTPUT_IMAGE,
    '-alpha',
    'extract',
    '-format',
    '%[fx:minima]|%[fx:maxima]|%k',
    'info:',
  ]).split('|');
  const [alphaMin, alphaMax, alphaColors] = alphaStats.map(Number);
  assert(alphaMin === 0, `alpha 最小值必须为 0，当前 ${alphaMin}`);
  assert(
    alphaMax >= 0.84 && alphaMax <= 0.88,
    `alpha 核心应保持柔和合成强度，当前最大值 ${alphaMax}`,
  );
  assert(alphaColors >= 32, `alpha 渐隐层级不足，当前仅 ${alphaColors} 级`);

  const edgeAlpha = Math.max(
    alphaMaximum('1125x8+0+0'),
    alphaMaximum('1125x8+0+642'),
    alphaMaximum('8x650+0+0'),
    alphaMaximum('8x650+1117+0'),
  );
  assert(edgeAlpha === 0, `PNG 外边缘必须完全透明，当前最大 alpha=${edgeAlpha}`);

  const sixthWeekAlpha = alphaMaximum('1125x90+0+560');
  assert(
    sixthWeekAlpha <= 0.02,
    `第六周备用区域不得被处理，当前最大 alpha=${sixthWeekAlpha}`,
  );

  const topOutsideAlpha = alphaMaximum('825x1+150+70');
  assert(topOutsideAlpha === 0, `顶部渐隐起点必须透明，当前 alpha=${topOutsideAlpha}`);

  const fiveWeekCoreAlpha = alphaMinimum('825x340+150+160');
  assert(
    fiveWeekCoreAlpha >= 0.84 && fiveWeekCoreAlpha <= 0.88,
    `五周日期核心区域必须保持统一柔和 alpha，当前最小值=${fiveWeekCoreAlpha}`,
  );

  const inspectedRows = [160, 180, 300, 480, 500].map(rowLumaMean);
  const adjacentRowDelta = Math.max(
    Math.abs(inspectedRows[1] - inspectedRows[0]),
    Math.abs(inspectedRows[4] - inspectedRows[3]),
  );
  assert(
    adjacentRowDelta <= 0.025,
    `第一排或最后一排附近仍有横向色带，行亮度差=${adjacentRowDelta}`,
  );
};

const checkMappings = () => {
  const assetsSource = readFileSync(ASSET_CONFIG, 'utf8');
  const layoutSource = readFileSync(LAYOUT_CONFIG, 'utf8');
  const componentSource = readFileSync(COMPONENT, 'utf8');

  const escapedFiveWeekPath = FIVE_WEEK_PUBLIC_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const escapedSixWeekPath = SIX_WEEK_PUBLIC_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const mappingPattern = new RegExp(
    `cleanPanelImages:\\s*{\\s*fiveWeek:\\s*['\"]${escapedFiveWeekPath}['\"],\\s*sixWeek:\\s*['\"]${escapedSixWeekPath}['\"]`,
  );

  assert(mappingPattern.test(assetsSource), '6 月 fiveWeek/sixWeek panel 素材映射不正确');
  assert(
    /fiveWeek:\s*{[\s\S]*?panelMaskImage:\s*'none'/.test(layoutSource),
    'fiveWeek 必须关闭额外 CSS mask',
  );
  assert(
    /sixWeek:\s*{[\s\S]*?panelMaskImage:\s*\n?\s*'linear-gradient/.test(layoutSource),
    'sixWeek 必须保留旧 mask',
  );
  assert(
    /assets\.cleanPanelImages\?\.\[layout\.defaultLayout\]\s*\?\?\s*assets\.cleanPanelImage/.test(
      componentSource,
    ),
    '月份合成组件尚未按当前布局选择 panel',
  );
};

const checkSourceIntegrity = () => {
  assert(sha256(BASE_IMAGE) === EXPECTED_BASE_SHA256, '6 月正式底图 SHA-256 已变化');
  assert(sha256(SIX_WEEK_IMAGE) === EXPECTED_SIX_WEEK_SHA256, '旧 sixWeek panel SHA-256 已变化');
};

const checkGenerationStrategy = () => {
  const generatorSource = readFileSync(GENERATOR_SOURCE, 'utf8');
  const generationSection = generatorSource.slice(
    generatorSource.indexOf('const generateOutput'),
    generatorSource.indexOf('const alphaMaximum'),
  );

  assert(
    generationSection.includes('PROGRAMMATIC_PANEL_PALETTE'),
    'fiveWeek panel 必须由程序化综合色板生成',
  );
  assert(
    !generationSection.includes('Median'),
    '禁止继续使用整块 Median 低频采样生成 fiveWeek panel',
  );
  assert(
    !generationSection.includes('6%'),
    '禁止继续使用缩小到 6% 再放大的低频采样生成 fiveWeek panel',
  );
  assert(
    !generationSection.includes('0x20'),
    '禁止继续使用大半径 blur 作为 fiveWeek panel 主生成方式',
  );
  assert(
    !generatorSource.includes('final' + '-reference'),
    '生成脚本不得读取最终参考图目录；参考图只能用于人工量色',
  );
};

const runChecks = () => {
  checkGenerationStrategy();
  checkSourceIntegrity();
  checkOutput();
  checkMappings();
  console.log('fiveWeek clean panel 检查通过：程序化综合色板、尺寸、alpha、五周范围、行色差、素材映射和源文件 hash 均正确。');
};

if (!process.argv.includes('--check')) generateOutput();
runChecks();
