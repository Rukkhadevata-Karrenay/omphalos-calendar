import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.join(rootDir, 'src');
const sourceExtensions = new Set(['.ts', '.tsx', '.css']);
const assetMapPath = path.join(srcDir, 'data', 'monthCompositionAssets.ts');
const layoutMapPath = path.join(srcDir, 'data', 'monthButtonLayoutConfig.ts');
const monthCalendarPath = path.join(srcDir, 'components', 'MonthCalendar.tsx');
const monthCompositionViewPath = path.join(srcDir, 'components', 'MonthCompositionView.tsx');
const specialDaysPath = path.join(srcDir, 'data', 'omphalosSpecialDays.ts');
const appPath = path.join(srcDir, 'App.tsx');
const appCssPath = path.join(srcDir, 'App.css');

const collectSourceFiles = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return collectSourceFiles(entryPath);
      }
      return sourceExtensions.has(path.extname(entry.name)) ? [entryPath] : [];
    }),
  );
  return files.flat();
};

const sourceFiles = await collectSourceFiles(srcDir);
const sources = await Promise.all(
  sourceFiles.map(async (filePath) => ({
    filePath,
    relativePath: path.relative(rootDir, filePath),
    content: await readFile(filePath, 'utf8'),
  })),
);

const errors = [];
const productionSources = sources.filter(({ filePath }) => filePath !== assetMapPath);
const forbiddenPatterns = ['final-reference', 'final-month-templates'];
const sourceContent = (filePath) =>
  sources.find((source) => source.filePath === filePath)?.content ?? '';

for (const source of productionSources) {
  for (const pattern of forbiddenPatterns) {
    if (source.content.includes(pattern)) {
      errors.push(`${source.relativePath} 禁止引用 ${pattern}`);
    }
  }
  if (source.content.includes('finalReferenceImage')) {
    errors.push(`${source.relativePath} 禁止在正式页面读取 finalReferenceImage`);
  }
}

const combinedSource = sources.map(({ content }) => content).join('\n');
const requiredProductionPaths = [
  '/assets/calendar-composition/bases/',
  '/assets/calendar-composition/panels-clean/',
  '/assets/calendar-composition/date-buttons/',
];

for (const requiredPath of requiredProductionPaths) {
  if (!combinedSource.includes(requiredPath)) {
    errors.push(`src/ 缺少正式素材引用：${requiredPath}`);
  }
}

const requiredLayerClasses = [
  'month-template',
  'month-base-image',
  'calendar-clean-panel',
  'date-buttons-layer',
  'date-hotspot-layer',
];

for (const className of requiredLayerClasses) {
  if (!combinedSource.includes(className)) {
    errors.push(`月份详情页缺少合成层：.${className}`);
  }
}

const appCss = sources.find(({ filePath }) => filePath === appCssPath)?.content ?? '';
const assetMap = sourceContent(assetMapPath);
const layoutMap = sourceContent(layoutMapPath);
const monthCalendar = sourceContent(monthCalendarPath);
const monthCompositionView = sourceContent(monthCompositionViewPath);
const specialDays = sourceContent(specialDaysPath);
const appSource = sourceContent(appPath);

const monthAssets = [
  ['01-gate-month-base.jpg', '01-janus-gate-month-calendar-panel.jpg', '01-gate-month-template.png'],
  ['02-balance-month-base.jpg', '02-talanton-balance-month-calendar-panel.jpg', '02-balance-month-template.png'],
  ['03-long-night-month-base.jpg', '03-oronyx-long-night-month-calendar-panel.jpg', '03-long-night-month-template.png'],
  ['04-cultivation-month-base.jpg', '04-georios-cultivation-month-calendar-panel.jpg', '04-cultivation-month-template.png'],
  ['05-joy-month-base.jpg', '05-phagousa-joy-month-calendar-panel.jpg', '05-joy-month-template.png'],
  ['06-long-day-month-base.jpg', '06-aigle-long-day-month-calendar-panel.jpg', '06-long-day-month-template.png'],
  ['07-freedom-month-base.jpg', '07-kephale-freedom-month-calendar-panel.jpg', '07-freedom-month-template.png'],
  ['08-harvest-month-base.jpg', '08-cerces-harvest-month-calendar-panel.jpg', '08-harvest-month-template.png'],
  ['09-thread-month-base.jpg', '09-mnemosyne-thread-month-calendar-panel.jpg', '09-thread-month-template.png'],
  ['10-strife-month-base.jpg', '10-nikadori-strife-month-calendar-panel.jpg', '10-strife-month-template.png'],
  ['11-mourning-month-base.jpg', '11-thanatos-mourning-month-calendar-panel.jpg', '11-mourning-month-template.png'],
  ['12-chance-month-base.jpg', '12-zagreus-chance-month-calendar-panel.jpg', '12-chance-month-template.png'],
];

for (const [index, [baseFile, panelFile, referenceFile]] of monthAssets.entries()) {
  const monthId = index + 1;
  if (!assetMap.includes(`defineMonthComposition(${monthId},`)) {
    errors.push(`${monthId} 月缺少 monthCompositionAssets 映射`);
  }
  for (const [directory, fileName] of [
    ['bases', baseFile],
    ['panels-clean', panelFile],
    ['final-reference', referenceFile],
  ]) {
    try {
      await access(path.join(rootDir, 'public/assets/calendar-composition', directory, fileName));
    } catch {
      errors.push(`${monthId} 月缺少素材文件：${directory}/${fileName}`);
    }
  }
  try {
    await access(
      path.join(
        rootDir,
        'public/assets/calendar-composition/date-buttons',
        `${monthId}`.padStart(2, '0'),
        'blank.jpg',
      ),
    );
  } catch {
    errors.push(`${monthId} 月缺少原始 blank 日期按钮`);
  }
}

for (const monthId of [1, 2, 3, 4, 7, 9, 10, 11, 12]) {
  if (!layoutMap.includes(`${monthId}: createSharedMonthButtonLayout(${monthId}, 'fiveWeek')`)) {
    errors.push(`${monthId} 月缺少 fiveWeek 默认布局及 sixWeek 备用配置`);
  }
}

for (const monthId of [5, 8]) {
  if (!layoutMap.includes(`${monthId}: createSharedMonthButtonLayout(${monthId}, 'sixWeek')`)) {
    errors.push(`${monthId} 月缺少 sixWeek 默认布局及 fiveWeek 备用配置`);
  }
}

if (!layoutMap.includes('6: JUNE_BUTTON_LAYOUT')) {
  errors.push('6 月验收布局未作为独立配置保留');
}
if (!layoutMap.includes('Record<number, MonthButtonLayoutConfig>')) {
  errors.push('monthButtonLayoutConfig 未声明完整 12 月配置');
}
if (!monthCalendar.includes('hasMonthButtonLayoutConfig(month.gregorianMonth)')) {
  errors.push('MonthCalendar 仍未按配置为全部月份启用合成视图');
}
if (monthCalendar.includes('month.gregorianMonth === 6')) {
  errors.push('MonthCalendar 仍将合成视图写死为 6 月');
}
if (!appSource.includes('hasMonthButtonLayoutConfig(currentMonth.gregorianMonth)')) {
  errors.push('App 仍未按月份配置启用合成页面容器');
}
if (appSource.includes('currentMonth.gregorianMonth === 6')) {
  errors.push('App 仍将合成页面容器写死为 6 月');
}
if (!specialDays.includes("export const OMPHALOS_DAY_TITLE = '翁法罗斯之日'")) {
  errors.push('11 月 12 日特殊日期标题未集中导出');
}
if (!monthCalendar.includes('specialLabel: hasOmphalosDay ? OMPHALOS_DAY_TITLE : undefined')) {
  errors.push('MonthCalendar 未把 11 月 12 日特殊日期传入合成日期格');
}
if (!monthCompositionView.includes('className="date-special-frame"')) {
  errors.push('MonthCompositionView 缺少特殊日期独立 overlay');
}
if (!appCss.includes('.month-composition-view .date-special-frame')) {
  errors.push('合成月份视图缺少特殊日期 overlay 样式');
}
const specialFrameRule =
  appCss.match(/\.month-composition-view \.date-special-frame\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
if (specialFrameRule.includes('background:')) {
  errors.push('特殊日期 overlay 不得用背景填充遮挡日期按钮图片');
}
if (!specialFrameRule.includes('border:') || !specialFrameRule.includes('box-shadow:')) {
  errors.push('特殊日期 overlay 必须以不改变尺寸的描边和发光显示');
}
const requiredRoundedCellRules = [
  ['统一圆角变量', /\.month-composition-view\s*{[\s\S]*?--date-cell-radius:/],
  [
    '日期 cell 圆角与裁切',
    /\.month-composition-view \.date-button-cell\s*{[\s\S]*?overflow: hidden;[\s\S]*?border-radius: var\(--date-cell-radius\);/,
  ],
  [
    '日期图片圆角继承',
    /\.month-composition-view \.date-button-image\s*{[\s\S]*?border-radius: inherit;/,
  ],
  [
    '日程覆盖层圆角继承',
    /\.month-composition-view \.date-event-frame\s*{[\s\S]*?inset: 0;[\s\S]*?border-radius: inherit;/,
  ],
  [
    '热区统一圆角',
    /\.month-composition-view \.date-hotspot\s*{[\s\S]*?border-radius: var\(--date-cell-radius\);/,
  ],
];

for (const [label, pattern] of requiredRoundedCellRules) {
  if (!pattern.test(appCss)) {
    errors.push(`月份详情页缺少${label}规则`);
  }
}

console.log(`已扫描 ${sourceFiles.length} 个 src 下的 TypeScript/CSS 文件。`);

if (errors.length > 0) {
  console.error('素材引用检查失败：');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log('素材引用检查通过：正式页面使用 bases、panels-clean、date-buttons，未引用最终参考图。');
}
