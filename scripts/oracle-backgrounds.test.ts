import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { dailyQuotes } from '../src/data/dailyQuotes';
import { OMPHALOS_YEAR_OVERVIEW_IMAGE } from '../src/data/omphalosMonths';
import { getOmphalosDate, toDateKey } from '../src/utils/date';
import { getDailyQuote } from '../src/utils/dailyQuote';

const oracleModule = await import('../src/data/oracleBackgrounds').catch(() => null);
const reactGlobal = globalThis as typeof globalThis & { React: typeof React };
reactGlobal.React = React;
const { YearOverview } = await import('../src/components/YearOverview');

assert.ok(oracleModule, 'oracleBackgrounds 集中配置尚未实现');

const { getOracleBackground, normalizeOracleSpeaker, oracleBackgrounds } = oracleModule;

const aliasCases = [
  ['昔涟，德谬歌，往昔的涟漪', 'cyrene'],
  ['Demiurge', 'cyrene'],
  ['「天空的医师」，雅辛忒丝', 'hyacinthia'],
  ['「无名的英雄」，卡厄斯兰那', 'phainon'],
  ['厄白', 'phainon'],
  ['「死荫的侍女」，遐蝶', 'castorice'],
  ['风堇', 'cerydra'],
  ['「捷足的羁客」，赛法利娅', 'cifera'],
  ['「黄金的织者」，阿格莱雅', 'aglaea'],
  ['「纷争的冠军」，迈德漠斯', 'mydei'],
  ['「理性的学士」，阿那克萨戈拉斯', 'anaxa'],
  ['「奏浪的剑骑」，海列屈拉', 'hysilens'],
  ['「掣地的伏龙」，丹恒·腾荒', 'danHeng'],
  ['「命运的三子」，缇里西庇俄丝', 'janus'],
  ['塔兰顿', 'talanton'],
  ['「隐秘的陌客」，长夜月', 'oronyx'],
  ['开拓者', 'trailblazer'],
  ['无名黄金裔', 'default'],
  ['', 'default'],
] as const;

for (const [speaker, expected] of aliasCases) {
  assert.equal(normalizeOracleSpeaker(speaker), expected, `${speaker || '空 speaker'} 应映射为 ${expected}`);
}

const unexpectedlyDefaulted = [...new Set(
  dailyQuotes
    .filter((quote) => normalizeOracleSpeaker(quote.speaker) === 'default')
    .map((quote) => quote.speaker)
    .filter((speaker) => !speaker.includes('无名黄金裔')),
)];
assert.deepEqual(unexpectedlyDefaulted, [], `dailyQuotes 中存在未映射 speaker：${unexpectedlyDefaulted.join('、')}`);

assert.equal(
  getOracleBackground('无名黄金裔', 'default-seed'),
  '/assets/omphalos/overview/home-omphalos-year-clean.jpg',
);
assert.equal(
  getOracleBackground('艾格勒', 'aigle-seed'),
  '/assets/omphalos/oracle-backgrounds/hyacinthia.jpg',
  '艾格勒应复用 hyacinthia 背景',
);

const trailblazerOptions = oracleBackgrounds.trailblazer;
assert.equal(trailblazerOptions.length, 2, '开拓者应配置两张轮替图');
const trailblazerSelections = new Set(
  Array.from({ length: 32 }, (_, index) => getOracleBackground('开拓者', `seed-${index}`)),
);
assert.deepEqual(new Set(trailblazerOptions), trailblazerSelections, '不同稳定种子应能覆盖两张开拓者图');
assert.equal(
  getOracleBackground('开拓者', 'stable-seed'),
  getOracleBackground('开拓者', 'stable-seed'),
  '同一种子不应在重渲染时切换图片',
);

for (const backgrounds of Object.values(oracleBackgrounds)) {
  for (const publicPath of backgrounds) {
    await access(new URL(`../public${publicPath}`, import.meta.url));
  }
}

const overviewDate = new Date(2026, 5, 21, 12, 0, 0);
const overviewQuote = getDailyQuote(overviewDate, getOmphalosDate(overviewDate).month.order);
const overviewBackground = getOracleBackground(
  overviewQuote.speaker,
  `${toDateKey(overviewDate)}:${overviewQuote.id}`,
);
const overviewMarkup = renderToStaticMarkup(
  React.createElement(YearOverview, {
    year: 2026,
    events: [],
    onSelectMonth: () => undefined,
    now: overviewDate,
  } as Parameters<typeof YearOverview>[0] & { now: Date }),
);

assert.ok(
  overviewMarkup.includes(`--year-overview-image:url(${overviewBackground})`),
  '一年历总览背景应使用当天神谕 speaker 对应的 oracle 图片',
);
assert.ok(
  overviewMarkup.includes(`src="${OMPHALOS_YEAR_OVERVIEW_IMAGE}"`),
  '一年历总览内部图片应恢复为原来的昔涟德谬歌卡片',
);
assert.equal(
  OMPHALOS_YEAR_OVERVIEW_IMAGE,
  '/assets/omphalos/eggs/xilian-demiurge-card.jpg',
  '一年历总览内部图片应使用用户指定的 JPG 图二',
);

console.log('神谕 speaker 别名、默认背景、开拓者轮替和素材完整性检查通过。');
