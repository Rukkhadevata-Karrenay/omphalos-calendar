export type OmphalosMonth = {
  order: number;
  gregorianMonth: number;
  name: string;
  deity: string;
  season: string;
  motto: string;
  homeHeroLine?: string;
  intro: string[];
  color: string;
  detailImage: string;
  upperImage: string;
  calendarImage: string;
  cardImage: string;
};

const monthAssetPath = (fileName: string) => `/assets/omphalos/months/${fileName}`;
const upperAssetPath = (fileName: string) => `/assets/omphalos/upper-panels/${fileName}`;
const calendarAssetPath = (fileName: string) => `/assets/omphalos/calendar-panels-clean/${fileName}`;
const cardAssetPath = (fileName: string) => `/assets/omphalos/year-cards/${fileName}`;

export const OMPHALOS_PREVIEW_REFERENCES = [
  '/assets/omphalos/preview/month-preview-reference-01.jpg',
  '/assets/omphalos/preview/month-preview-reference-02.jpg',
  '/assets/omphalos/preview/month-preview-reference-03.jpg',
  '/assets/omphalos/preview/month-preview-reference-04.jpg',
  '/assets/omphalos/preview/month-preview-reference-05.jpg',
];

export const OMPHALOS_HOME_IMAGE = '/assets/omphalos/overview/home-omphalos-year-original.jpg';
export const OMPHALOS_YEAR_OVERVIEW_IMAGE = '/assets/omphalos/eggs/xilian-demiurge-card.jpg';
export const OMPHALOS_TIME_PERIOD_IMAGE = '/assets/omphalos/overview/time-periods.jpg';

export const OMPHALOS_TIME_WIDGET_IMAGES = {
  dialLarge: '/assets/omphalos/time-widget/omphalos-time-dial-large.jpg',
  dialPink: '/assets/omphalos/time-widget/omphalos-time-dial-pink.jpg',
  dialHighlight: '/assets/omphalos/time-widget/omphalos-time-dial-highlight.jpg',
  dialClean: '/assets/omphalos/time-widget/omphalos-time-dial-orbit.png',
  hand: '/assets/omphalos/time-widget/omphalos-time-hand-ivory.png',
  skyDay: '/assets/omphalos/time-widget/omphalos-time-sky-day.jpg',
  skyNight: '/assets/omphalos/time-widget/omphalos-time-sky-night.jpg',
};

export const OMPHALOS_MONTHS: OmphalosMonth[] = [
  {
    order: 1,
    gregorianMonth: 1,
    name: '门关月',
    deity: '「万径之门」雅努斯',
    season: '命运季',
    motto: '门扉开启，命运落笔。',
    intro: [
      '作为除旧迎新的第一月，雅努斯将关上代表过去的旧门，打开代表未来的新门。它既是门，亦是把守门关的锁链，如一柄利斧劈开了前与后。',
      '在这一月，人们会抛弃带来羁绊之物，如旧恋人或已逝亲人的信物，宣告斩断过去、直面未来。这一行为是完全自愿的。',
    ],
    color: '#b8945f',
    detailImage: monthAssetPath('01-janus-gate-month.jpg'),
    upperImage: upperAssetPath('01-janus-gate-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('01-janus-gate-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('01-janus-gate-month-card.png'),
  },
  {
    order: 2,
    gregorianMonth: 2,
    name: '平衡月',
    deity: '「公正之秤」塔兰顿',
    season: '命运季',
    motto: '秤盘两端，皆有回响。',
    intro: [
      '最具规律的一月，刻法勒正是以此为尺度测定了月份。在这一月，人们的作息会变得规律，性情平和，因而也更乐于在这一月发起裁决、签订契约。',
      '据说在过去还有日夜之分时，平衡月是唯一一个昼夜等长的月份，因为塔兰顿调停了欧洛尼斯和艾格勒的争端。',
    ],
    color: '#8f9ec8',
    detailImage: monthAssetPath('02-talanton-balance-month.jpg'),
    upperImage: upperAssetPath('02-talanton-balance-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('02-talanton-balance-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('02-talanton-balance-month-card.png'),
  },
  {
    order: 3,
    gregorianMonth: 3,
    name: '长夜月',
    deity: '「永夜之帷」欧洛尼斯',
    season: '命运季',
    motto: '长夜凝望，星轨未眠。',
    intro: [
      '太阳光照比平常稍显暗淡的月份。人们更频繁地感到瞌睡，直觉与感性替代了思考与理性，因而难以完成过于精细的工作。',
      '据说在过去，这一月的夜比昼长，因为欧洛尼斯在关于天空所有权的争斗中胜过了艾格勒。',
    ],
    color: '#6358a5',
    detailImage: monthAssetPath('03-oronyx-long-night-month.jpg'),
    upperImage: upperAssetPath('03-oronyx-long-night-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('03-oronyx-long-night-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('03-oronyx-long-night-month-card.png'),
  },
  {
    order: 4,
    gregorianMonth: 4,
    name: '耕耘月',
    deity: '「磐岩之脊」吉奥里亚',
    season: '支柱季',
    motto: '耕土生根，支柱成形。',
    intro: [
      '春耕开始的月份，也是最为忙碌的月份。在这一月，大地恢复到最适合耕种的状态，人们翻动土地、播下种子，将劳动作为祭品献给大地。',
      '大地兽们也会加倍感到活力。',
    ],
    color: '#7f9a64',
    detailImage: monthAssetPath('04-georios-cultivation-month.jpg'),
    upperImage: upperAssetPath('04-georios-cultivation-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('04-georios-cultivation-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('04-georios-cultivation-month-card.png'),
  },
  {
    order: 5,
    gregorianMonth: 5,
    name: '欢喜月',
    deity: '「满溢之杯」法吉娜',
    season: '支柱季',
    motto: '欢宴与馈赠，在枝叶间流转。',
    intro: [
      '春耕结束的月份。在这一月，泉水流淌、渔业兴盛。一年中最繁重的工作已经于上一月完成，人们沉浸在喜庆的氛围中。',
      '这是酿造和举办庆典最好的月份，人们经常揉着发懵的脑袋醒来，又摇摇头重新睡去。',
    ],
    color: '#c27f93',
    detailImage: monthAssetPath('05-phagousa-joy-month.jpg'),
    upperImage: upperAssetPath('05-phagousa-joy-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('05-phagousa-joy-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('05-phagousa-joy-month-card.png'),
  },
  {
    order: 6,
    gregorianMonth: 6,
    name: '长昼月',
    deity: '「晨昏之眼」艾格勒',
    season: '支柱季',
    motto: '长昼照耀，万物显明。',
    homeHeroLine: '「晨昏之眼」艾格勒 /「天空的医师」雅辛忒丝',
    intro: [
      '热力最旺盛的月份，黎明机器比平常更加闪耀，大地上的植物也卖力吸纳它的能量，让人们得以在之后收获。',
      '沐浴这光的人们会感到精神饱满，活力充沛。据说在过去，这一月的昼比夜长，因为艾格勒在关于天空所有权的争斗中胜过了欧洛尼斯。',
    ],
    color: '#d0a34d',
    detailImage: monthAssetPath('06-aigle-long-day-month.jpg'),
    upperImage: upperAssetPath('06-aigle-long-day-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('06-aigle-long-day-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('06-aigle-long-day-month-card.png'),
  },
  {
    order: 7,
    gregorianMonth: 7,
    name: '自由月',
    deity: '「全世之座」刻法勒',
    season: '创生季',
    motto: '自由之翼，越过既定边界。',
    intro: [
      '平淡祥和的月份。没有什么大的节日要参与，也没有什么大的任务要去完成。',
      '人们可以在这一月发展爱好、追求理想，做自己想做的任何事。正如刻法勒创造了世界，又任由人们在它的庭院中玩耍。',
    ],
    color: '#6bb4bd',
    detailImage: monthAssetPath('07-kephale-freedom-month.jpg'),
    upperImage: upperAssetPath('07-kephale-freedom-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('07-kephale-freedom-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('07-kephale-freedom-month-card.png'),
  },
  {
    order: 8,
    gregorianMonth: 8,
    name: '收获月',
    deity: '「裂分之枝」瑟希斯',
    season: '创生季',
    motto: '果实垂落，创生有声。',
    intro: [
      '秋收开始的月份。作物们吸收了长昼月的光照，成长到最为饱满的状态。',
      '同耕耘月一样，人们在这一月格外忙碌。',
    ],
    color: '#c08a4b',
    detailImage: monthAssetPath('08-cerces-harvest-month.jpg'),
    upperImage: upperAssetPath('08-cerces-harvest-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('08-cerces-harvest-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('08-cerces-harvest-month-card.png'),
  },
  {
    order: 9,
    gregorianMonth: 9,
    name: '拾线月',
    deity: '「黄金之茧」墨涅塔',
    season: '创生季',
    motto: '拾起丝线，织回因果。',
    intro: [
      '秋收完成的月份。在这个月，人们会回顾自己一年来的经历。墨涅塔将一切在此收拢，编织成记忆的金线。',
      '这是陪伴家人、享受爱与美好的一月。得闲的人们会在家中织布，有关纺织的节日也会在此举办。',
    ],
    color: '#9b79c8',
    detailImage: monthAssetPath('09-mnemosyne-thread-month.jpg'),
    upperImage: upperAssetPath('09-mnemosyne-thread-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('09-mnemosyne-thread-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('09-mnemosyne-thread-month-card.png'),
  },
  {
    order: 10,
    gregorianMonth: 10,
    name: '纷争月',
    deity: '「天谴之矛」尼卡多利',
    season: '灾厄季',
    motto: '纷争燃起，锋芒自见。',
    intro: [
      '生产活动完成后的第一个月份。人们从每年最为重要的工作中解放，社会因而多出了额外的劳力。',
      '在过去，各城邦经常于这一月约定战争。这一月也是处决囚犯、烧毁祭品以祀神明的时期。',
    ],
    color: '#bc6554',
    detailImage: monthAssetPath('10-nikadori-strife-month.jpg'),
    upperImage: upperAssetPath('10-nikadori-strife-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('10-nikadori-strife-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('10-nikadori-strife-month-card.png'),
  },
  {
    order: 11,
    gregorianMonth: 11,
    name: '哀悼月',
    deity: '「灰黯之手」塞纳托斯',
    season: '灾厄季',
    motto: '悼词低回，仍向明日。',
    intro: [
      '城邦逐渐归于沉寂的月份，战争一般在这个月接近尾声。人们从战场上拖回尸体，埋葬死者、安抚生者。',
      '祭司们在这个月最为忙碌，因为他们需要为死者祈福。哀悼月给人以肃杀的气氛，人们在这个月开始会逐渐减少活动，仿佛沉眠。',
    ],
    color: '#718098',
    detailImage: monthAssetPath('11-thanatos-mourning-month.jpg'),
    upperImage: upperAssetPath('11-thanatos-mourning-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('11-thanatos-mourning-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('11-thanatos-mourning-month-card.png'),
  },
  {
    order: 12,
    gregorianMonth: 12,
    name: '机缘月',
    deity: '「翻飞之币」扎格列斯',
    season: '灾厄季',
    motto: '机缘如骰，掷向终幕。',
    intro: [
      '一年最末尾的月份，于上月沉寂的众生再次活跃，好事和坏事都会更加频繁地发生。赌徒们相信这一月会为他们带去好手气，投机商人期待着暴富；窃贼往往也用光了积蓄，开始摩拳擦掌。',
      '由于扎格列斯难以捉摸的性情，这一月究竟有多少天是不能确定的。有时，本应翻页的日历末尾会多出幽灵般的一日，闰日。人们将有这一日的机缘月称为「红月」，没有这一日的称为「金月」。',
    ],
    color: '#9a7652',
    detailImage: monthAssetPath('12-zagreus-chance-month.jpg'),
    upperImage: upperAssetPath('12-zagreus-chance-month-upper-panel.jpg'),
    calendarImage: calendarAssetPath('12-zagreus-chance-month-calendar-panel.jpg'),
    cardImage: cardAssetPath('12-zagreus-chance-month-card.png'),
  },
];

export const getOmphalosMonthByGregorianMonth = (month: number): OmphalosMonth => {
  const found = OMPHALOS_MONTHS.find((item) => item.gregorianMonth === month);
  if (!found) {
    throw new Error(`Invalid Gregorian month: ${month}`);
  }
  return found;
};
