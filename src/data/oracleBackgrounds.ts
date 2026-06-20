export type OracleSpeakerKey =
  | 'cyrene'
  | 'aigle'
  | 'hyacinthia'
  | 'phainon'
  | 'castorice'
  | 'cerydra'
  | 'cifera'
  | 'aglaea'
  | 'mydei'
  | 'anaxa'
  | 'hysilens'
  | 'danHeng'
  | 'janus'
  | 'talanton'
  | 'oronyx'
  | 'trailblazer'
  | 'default';

export const DEFAULT_ORACLE_BACKGROUND = '/assets/omphalos/overview/home-omphalos-year-clean.jpg';

export const oracleBackgrounds: Record<OracleSpeakerKey, readonly string[]> = {
  cyrene: ['/assets/omphalos/oracle-backgrounds/cyrene.jpg'],
  aigle: ['/assets/omphalos/oracle-backgrounds/hyacinthia.jpg'],
  hyacinthia: ['/assets/omphalos/oracle-backgrounds/hyacinthia.jpg'],
  phainon: ['/assets/omphalos/oracle-backgrounds/phainon.jpg'],
  castorice: ['/assets/omphalos/oracle-backgrounds/castorice.jpg'],
  cerydra: ['/assets/omphalos/oracle-backgrounds/cerydra.jpg'],
  cifera: ['/assets/omphalos/oracle-backgrounds/cifera.jpg'],
  aglaea: ['/assets/omphalos/oracle-backgrounds/aglaea.jpg'],
  mydei: ['/assets/omphalos/oracle-backgrounds/mydei.jpg'],
  anaxa: ['/assets/omphalos/oracle-backgrounds/anaxa.jpg'],
  hysilens: ['/assets/omphalos/oracle-backgrounds/hysilens.jpg'],
  danHeng: ['/assets/omphalos/oracle-backgrounds/dan-heng.jpg'],
  janus: ['/assets/omphalos/oracle-backgrounds/janus-tribbie.jpg'],
  talanton: ['/assets/omphalos/oracle-backgrounds/cerydra.jpg'],
  oronyx: ['/assets/omphalos/oracle-backgrounds/oronyx-evernight.jpg'],
  trailblazer: [
    '/assets/omphalos/oracle-backgrounds/trailblazer-stelle.jpg',
    '/assets/omphalos/oracle-backgrounds/trailblazer-caelus.jpg',
  ],
  default: [DEFAULT_ORACLE_BACKGROUND],
};

const speakerAliases: ReadonlyArray<readonly [OracleSpeakerKey, readonly string[]]> = [
  ['cyrene', ['昔涟', '德谬歌', '往昔的涟漪', 'cyrene', 'demiurge']],
  ['aigle', ['艾格勒', '晨昏之眼', 'aigle']],
  ['hyacinthia', ['雅辛忒丝', '天空的医师', 'hyacinthia', 'hyacine']],
  [
    'phainon',
    ['厄白', '白厄', 'phainon', 'phaino', 'khaslana', '卡斯兰娜', '卡厄斯兰那', '至黑之剑', '盗火行者'],
  ],
  ['castorice', ['遐蝶', 'castorice', '塞纳托斯', 'thanatos']],
  ['cerydra', ['风堇', 'cerydra', 'cerdra', '瑟德拉', '刻律德菈']],
  ['cifera', ['赛飞儿', 'cifera', '赛法利娅', '扎格列斯', 'zagreus']],
  ['aglaea', ['阿格莱雅', 'aglaea', '墨涅塔', 'mnemosyne']],
  ['mydei', ['万敌', 'mydei', 'mydeimos', '迈德漠斯', '尼卡多利', 'nikadori']],
  ['anaxa', ['那刻夏', 'anaxa', '阿那克萨戈拉斯', 'anaxagoras', '瑟希斯', 'cerces']],
  ['hysilens', ['海瑟音', 'hysilens', 'helektra', '海列屈拉', '法吉娜', 'phagousa']],
  ['danHeng', ['丹恒', 'dan heng', 'danheng', '吉奥里亚', 'georios']],
  [
    'janus',
    ['雅努斯', 'janus', 'tribios', '特里比俄斯', '缇里西庇俄丝', '缇安', '缇宁', '缇宝', '缇宋', '缇宙', '缇宇', '缇家', '门关月'],
  ],
  ['talanton', ['塔兰顿', 'talanton', '平衡月']],
  ['oronyx', ['欧洛尼斯', 'oronyx', 'evernight', '长夜月']],
  ['trailblazer', ['开拓者', 'trailblazer']],
];

const normalizeAliasText = (value: string): string => value.trim().toLocaleLowerCase().replace(/\s+/g, '');

export const normalizeOracleSpeaker = (speaker?: string): OracleSpeakerKey => {
  const raw = normalizeAliasText(speaker ?? '');
  if (!raw || ['无名黄金裔', '黄金裔', '未知'].some((alias) => raw.includes(alias))) {
    return 'default';
  }

  for (const [speakerKey, aliases] of speakerAliases) {
    if (aliases.some((alias) => raw.includes(normalizeAliasText(alias)))) {
      return speakerKey;
    }
  }

  return 'default';
};

const hashText = (text: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const getOracleBackground = (speaker?: string, stableSeed = ''): string => {
  const speakerKey = normalizeOracleSpeaker(speaker);
  const backgrounds = oracleBackgrounds[speakerKey];
  const index = backgrounds.length > 1 ? hashText(`${speakerKey}:${stableSeed}`) % backgrounds.length : 0;
  return backgrounds[index] ?? DEFAULT_ORACLE_BACKGROUND;
};
