# 翁法罗斯一年历

一个以《崩坏：星穹铁道》翁法罗斯一年历为主题的本地网页日历软件。它是一个“翁法罗斯拟态时间系统”：现实月份映射为翁法罗斯月份，现实时间映射为 5 个时段与 25 刻。

## 作者与署名

- 网站作者 / 设计与开发：Karrenay Rukkhadevata（GitHub: `Rukkhadevata-Karrenay`）
- 一年历总览图来源：Ankiiy_Nymity（全平台同名）
- 总览图仅用于本非商业粉丝项目的学习、展示与个人使用；未经原作者允许，请勿二次使用、转载或商用。

## 版权与用途说明

- 本项目为非官方粉丝作品，仅用于学习、展示与个人使用。
- 本项目不隶属于 HoYoverse / miHoYo。
- 本项目不用于商业用途。
- 网站代码、页面组织与交互实现由 Karrenay Rukkhadevata 制作。
- 一年历总览图来源为 Ankiiy_Nymity（全平台同名），请勿脱离本项目二次使用。
- 游戏相关名称、设定、角色与原始素材版权归原权利方所有。

## 技术栈

- React
- Vite
- TypeScript
- CSS
- 浏览器 `localStorage`

## 运行方式

```bash
cd /Users/Karrenay/Codex_Workspace/Project_00_Inbox_待整理/翁法罗斯一年历
npm install
npm run dev
```

构建检查：

```bash
npm run check:assets
npm run build
npm run preview
```

`npm run preview` 默认提供本地生产预览地址 `http://localhost:4173/`。

## 线上预览

Vercel: https://omphalos-calendar.vercel.app

翁法罗斯时间边界示例：

```bash
npm run test:time
```

## 功能

- 首页显示现实日期时间、当前翁法罗斯月份、当前时段与刻、今日日程。
- 一年历总览展示 12 个翁法罗斯月份。
- 月份详情页展示对应月份主题图、现实月日历网格与当月日程。
- 日期详情弹窗支持添加、编辑、删除日程。
- 日程保存在浏览器 `localStorage`，刷新页面后不丢失。

## 时间映射规则

- 现实公历 1-12 月直接对应翁法罗斯 12 个月份。
- 现实日期的日号作为翁法罗斯日期。
- 一天分为 5 个时段，每个时段 5 刻。
- 每刻约 57 分 36 秒。

## 素材来源、署名与用途

素材来自本机目录：

```text
/Users/Karrenay/Desktop/翁法罗斯一年历-素材/
```

公开署名信息：

```text
网站作者 / 设计与开发：Karrenay Rukkhadevata
一年历总览图来源：Ankiiy_Nymity（全平台同名）
```

项目内素材目录：

```text
public/assets/omphalos/
├─ original/   原图备份，保留 IMG_* 原文件名与高清抠图包
├─ overview/   首页与时间称呼参考
├─ preview/    月份预览界面风格参考
├─ months/     12 个月份详情主题图
├─ upper-panels/ 从月份详情图裁出的上部角色区域
├─ calendar-panels/ 从月份详情图裁出的原图日历面板，保留备查
├─ calendar-panels-clean/ 清理旧日期数字后的日历面板，作为交互日历底图
├─ date-buttons/ 由 clean 面板生成的 1-31 日期按钮块与 blank 空日期块
├─ calendar-composition/ 月份详情页工程化合成素材（bases、panels-clean、date-buttons、final-reference）
├─ year-cards/ 从月份预览图裁出的 12 张总览卡片
├─ time-widget/ 当前时段表参考与圆盘素材
└─ eggs/ 彩蛋参考素材备份
```

业务代码只引用语义文件名，不直接引用 `IMG_*.jpg`。

主要映射：

- `overview/time-periods.jpg`：翁法罗斯历法与一天内时间称呼参考。
- `overview/home-omphalos-year.jpg`：首页原始视觉参考；一年历总览图来源为 Ankiiy_Nymity（全平台同名）。
- `overview/home-omphalos-year-clean.jpg`：首页实际使用封面，底部原图文字与按钮区域通过模糊方式弱化，React 负责叠加真实文案和按钮；一年历总览图来源为 Ankiiy_Nymity（全平台同名）。
- `eggs/xilian-demiurge-card.png`：一年历总览顶部的昔涟 / 德谬歌完整卡图。
- `preview/month-preview-reference-01.jpg` 到 `month-preview-reference-05.jpg`：一年历总览页的月份预览风格参考。
- `months/01-janus-gate-month.jpg` 到 `months/12-zagreus-chance-month.jpg`：12 个月份详情页主题图。
- `upper-panels/*-upper-panel.jpg`：从月份详情图顶部裁出的角色区域，用于月份详情中的沉浸式日历海报。
- `calendar-panels/*-calendar-panel.jpg`：从月份详情图裁出的原始日期区域，用作重新生成资源的源图。
- `calendar-panels-clean/*-calendar-panel.jpg`：由 `scripts/generate-date-button-assets.py` 生成，清理旧日期数字后作为页面底图。
- `date-buttons/<month>/<day>.jpg` 与 `date-buttons/<month>/blank.jpg`：由脚本按统一 7x6 坐标生成的日期按钮块，页面按当前年份动态排布。
- `calendar-composition/bases/`：月份详情页正式底图。
- `calendar-composition/panels-clean/`：覆盖底图原日期区域的 clean panel。
- `calendar-composition/date-buttons/`：包含日期数字的 1-31 和 `blank.jpg` 按钮素材。
- `calendar-composition/final-reference/`：仅用于人工验收，正式页面禁止引用。
- `year-cards/*-month-card.png`：一年历总览页使用的高清月份预览卡片图。当前版本来自 `omphalos_cutouts_high_quality.zip`，并用真实图片完整显示，不再通过固定比例背景图裁切。
- `time-widget/omphalos-time-dial-orbit.png`：按当前时段表盘参考图裁出的圆盘底图，保留中间竖立 `∞`，不包含静态指针。
- `time-widget/omphalos-time-hand-ivory.png`：按指针参考重绘的透明动态指针，头部为黑桃形，尾部圆仅略大于中间轴心。
- `time-widget/omphalos-time-sky-day.jpg` / `omphalos-time-sky-night.jpg`：去掉上下黑边后的昼夜表盘背景，日落前使用昼图，日落后使用夜图。

月份详情页统一采用“正式底图 + clean panel + 日期按钮图片 + 透明点击热区”合成。1–12 月素材映射位于 `src/data/monthCompositionAssets.ts`，坐标和周数位于 `src/data/monthButtonLayoutConfig.ts`。2026 年 5 月、8 月默认使用 `sixWeek` 的 6×7 共 42 格，其余月份默认使用 `fiveWeek` 的 5×7 共 35 格；每个月都保留另一套布局备用，`.debug-layout` 样式代码保留但默认关闭。

`fiveWeek` 与 `sixWeek` 各自保存完整 panel 和 grid 坐标；6 月五周行中心按参考图校准到 panel 内约 `165/245/325/405/485px`，其他月份先复用该几何结构并保留旧 JPG panel 的边缘 mask。所有月份的日程状态都以 `.date-event-frame` 整格半透明黄紫渐变覆盖对应日期按钮，不再显示胶囊、细边框或底部独立“本月日程”卡。

6 月 fiveWeek 使用 `06-aigle-long-day-month-fiveweek-clean-panel.png`：`scripts/generate-fiveweek-clean-panel.mjs` 以人工量取的综合色板参数生成左深红、中央玫红、右淡紫的二维渐变，叠加固定种子的轻微纹理与四边 smoothstep alpha 羽化，输出 1125×650 RGBA PNG。生成时不读取最终参考图、不裁切或模糊旧日历区域，正式底图和旧 sixWeek panel 只做 hash 完整性校验；fiveWeek 的 `panelMaskImage` 为 `none`，sixWeek 继续使用旧 JPG 和原双轴 mask。

所有月份日期格统一由 `--date-cell-radius` 控制圆角；`.date-button-cell` 负责圆角裁切，按钮图片与整格日程层继承该圆角，today/选中热区读取同一变量。普通日期、空白格、日程格与今日格不会因状态切换改变形状。11 月 12 日由 `src/data/omphalosSpecialDays.ts` 集中定义，在 `MonthCompositionView` 中以 `.date-special-frame` 的综合色 `border-image` overlay 显示，并保留原按钮的“∞”图案。

1–5 月、7–12 月的 fiveWeek 与 sixWeek 日期按钮均来自各自的 `calendar-composition/date-buttons-uniform/MM/`；每个月使用单一 clean PNG 母版生成 32 张按钮，原始 JPG 全部保留。6 月保持已验收配置：fiveWeek 使用 uniform PNG，sixWeek 仍指向原始 `calendar-composition/date-buttons/06/`。使用 `npm run check:date-buttons` 检查 12 个月输出、尺寸、母版边缘、顶部连续性、平均色差和素材映射。

此前的 uniform JPG 候选已被否决且不再沿用。当前已从人工确认的 118×66 RGBA `date-buttons-uniform/06/master-clean.png` 生成 `blank.png`、`01.png` 至 `31.png` 共 32 张 uniform PNG：所有按钮共享同一母版，只叠加统一数字，不使用独立顶部横线，也不复制 `blank.jpg` 的深色顶部分区、噪点或 JPEG 黑边。6 月 fiveWeek 已接入该目录；批量预览入口为 `docs/button-uniform-preview-06.png`。

其他 11 个月由 `scripts/generate-all-month-uniform-buttons.mjs` 从各月原始 blank 的主体区域只采样主题色，再程序化重建无横向色带的 RGBA clean 母版并叠加统一数字；不会复制原始 JPG 的顶部深色分区。全部月份预览入口为 `docs/button-uniform-preview-all-months.png`。

所有月份素材合成外层和 `.month-template` 均按正式底图 `1125 / 2436` 比例显示；外层不得继承旧版 `1125 / 2350` 裁切比例，也不得用 `overflow: hidden` 截掉底部版权区。clean panel 只覆盖原图前 2350px 的日期区域，最后 86px 版权区保持可见。

首页当前月份人物行优先读取月份数据的可选 `homeHeroLine`；未配置的月份继续显示原来的“泰坦 / 月份名”。月份详情页仍独立读取 `deity` 与 `motto`，不会被首页专用文案影响。

素材引用检查：

```bash
npm run check:assets
npm run check:fiveweek-panel
```

日期按钮资源可通过以下命令重新生成：

```bash
python3 scripts/generate-date-button-assets.py
```

每日激励语素材整理自：

```text
/Users/Karrenay/Desktop/翁法罗斯一年历-素材/每日激励语句.rtf
```

代码入口为 `src/data/dailyQuotes.ts`。首页会按当前日期和翁法罗斯月份稳定选择一条语句；同一天刷新不变，第二天自动更换。通用黄金裔语句统一署名为“无名黄金裔”，首页不显示类型标签。

待办颜色入口为 `src/data/eventColors.ts`。日程仍使用 `CalendarEvent.color` 字符串保存，不迁移旧 localStorage 数据；黄紫选项使用左上黄、右下紫的整格渐变。

## 鸣谢

- 感谢 Ankiiy_Nymity 提供一年历总览图授权与视觉参考支持。
- 本项目为个人学习与非商业展示作品，若任何素材署名、授权范围或展示方式需要调整，请联系项目作者处理。

## 关键目录

```text
src/
├─ components/       页面与交互组件
├─ data/             翁法罗斯月份、时段、素材路径映射
├─ hooks/            localStorage 日程状态
├─ types/            类型定义
└─ utils/            日期与时间换算
```
