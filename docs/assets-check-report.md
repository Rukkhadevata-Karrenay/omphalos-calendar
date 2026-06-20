# 月份模板素材检查报告

检查日期：2026-06-18

## 本次范围

本次只检查 6 月长昼月，不对其他 11 个月作视觉验收或坐标调整。

| 素材 | 路径 | 已验证尺寸 | 格式 | 使用方式 |
|---|---|---:|---|---|
| 6 月正式底图 | `public/assets/calendar-composition/bases/06-long-day-month-base.jpg` | 1125 × 2436 | JPEG | 正式页面底图，完整显示 |
| 6 月 fiveWeek clean panel | `public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png` | 1125 × 650 | RGBA PNG | 当前正式五周页面；素材自身 alpha 渐隐 |
| 6 月 sixWeek clean panel | `public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-calendar-panel.jpg` | 1125 × 650 | JPEG | 42 格备用；保留原 CSS mask |
| 6 月日期按钮 | `public/assets/calendar-composition/date-buttons/06/*.jpg` | 118 × 66 | JPEG | 当前 35 格视觉层，空格使用 `blank.jpg`；42 格能力保留 |
| 6 月最终参考 | `public/assets/calendar-composition/final-reference/06-long-day-month-template.png` | 852 × 1846 | PNG | 仅人工对照，正式 DOM 禁止引用 |

## 检查结论

- `bases/` 和 `final-reference/` 各 12 个文件；`panels-clean/` 为 12 个旧 JPG 加 1 个 6 月 fiveWeek PNG；`date-buttons/` 共 378 个文件。
- clean panel 与底图未模糊边缘匹配出的原始纵坐标为 `y=1700`，不是初始估算的 73.3%。
- 6 月默认渲染 35 张按钮图：30 张日期图、5 张 `blank.jpg`；`sixWeek` 配置与素材仍可渲染 42 格。
- 按钮层与点击热区 DOM 尺寸逐格一致，按钮显示比例为 1.7864，源图比例为 1.7879，`object-fit: contain` 保证不变形。
- 正式 DOM 中未出现 `final-reference` 或 `final-month-templates` 路径。
- 未修改任何图片素材。

## 6 月坐标来源

坐标集中在 `src/data/monthButtonLayoutConfig.ts` 的 `JUNE_BUTTON_LAYOUT`。当前校准值：

| 变量 | 当前值 | 作用 |
|---|---:|---|
| `panelLeft` | `0%` | clean panel 左边界 |
| `panelTop` | `69.7865%` | clean panel 在底图中的原始纵坐标 |
| `panelWidth` | `100%` | clean panel 宽度 |
| `panelHeight` | `26.6831%` | 650 / 2436 的原始高度比例 |
| `gridLeft` | `11.69%` | 按钮网格在 panel 内的左边界 |
| `gridTop` | `20.31%` | fiveWeek 按参考图测量的上边界 |
| `gridWidth` | `77.91%` | 七列总宽度 |
| `gridHeight` | `59.38%` | fiveWeek 五行总高度，不保留第六行占位 |
| `gapX` | `0.96%` | 列间距 |
| `gapY` | `3.63%` | fiveWeek 纵向间距 |
| `defaultLayout` | `fiveWeek` | 默认选择完整五周配置 |

fiveWeek 的 `panelMaskImage` 当前为 `none`，使用新 PNG 自带的 alpha 渐隐。sixWeek 仍保留原双轴 mask：水平方向在左右边界外渐隐，垂直方向在顶部 `12%–19%`、底部 `78%–90%` 过渡。

`sixWeek` 继续保留原值：`gridHeight=66.77%`、`gapY=1.75%`、`rows=6`。后续微调只修改对应布局内变量，不在组件或 CSS 中增加独立偏移值。

## 2026-06-18 正式显示复核

- `.debug-layout` 默认关闭；红框、蓝框和黄色热区背景均未出现在正式页。
- 浏览器在 `http://localhost:5173/#month-06` 实测为 35 张按钮图、35 个热区、30 个交互日期和 5 个空白图。
- 6 月不再显示底部独立“本月日程”卡；有日程的日期使用 `.date-event-frame` 整格半透明黄紫渐变填充覆盖整个按钮，日期数字仍来自按钮图片。
- 正式 DOM 仍未引用 `final-reference` 或 `final-month-templates`。
- `npm run check:assets` 与 `npm run build` 均通过。

## 2026-06-18 底图完整性修复

- 页面实际底图为 `/assets/calendar-composition/bases/06-long-day-month-base.jpg`，与 `dist/assets/omphalos/month-template-bases/06-long-day-month-base.jpg` 的 SHA-256 完全一致。
- 文件实际尺寸为 1125×2436，原图自身包含底部 `Copyright © miHoYo. All Rights Reserved.`。
- 原因是外层 `.image-calendar-panel` 仍使用旧比例 `1125 / 2350` 且 `overflow: hidden`，刚好裁掉最后 86px 版权区；不是底图文件错误，也不是 overlay 覆盖。
- 6 月专用 `.month-composition-view` 已覆盖为 `aspect-ratio: 1125 / 2436` 和 `overflow: visible`。
- 浏览器复核：底图和模板完整位于外层容器内；clean panel 在版权区前结束；日程模块从底图容器外部开始；正式 DOM 无最终参考图路径。

## 2026-06-18 面板接缝与整格日程状态复核（已被 2026-06-19 fiveWeek 专用素材替代）

- clean panel 使用水平与垂直两层 `mask-image` 相交，右侧和底部由实色逐渐过渡到底图，未修改 panel 素材。
- 16 号 `.date-event-frame` 与对应 `.date-button-cell` 的外接矩形一致，使用 `inset: 0` 整格填充；18 号 today outline 位于独立高层，两者不改变按钮尺寸。
- 浏览器实测仍为 7 列 × 5 行、35 张按钮图和 35 个热区；底部版权可见，正式 DOM 无 `final-reference` 或 `final-month-templates`。

## 2026-06-19 fiveWeek 专用 clean panel

- `scripts/generate-fiveweek-clean-panel.mjs` 从正式底图裁切 `1125x650+0+1700`，使用 41×41 中值滤波、6% 低频采样、还原尺寸和 `0x20` Gaussian blur 去除五行日期痕迹，再用明确的四边分段 alpha 渐隐合成。
- 新 PNG 的外圈 alpha 为 0，alpha 含连续渐隐层级；`y=550..649` 第六周备用区域最大 alpha 不超过 `0.02`。
- 正式底图 SHA-256 保持 `ebe54e33e0e7356b58ddae283edc6ea998ca052b527a97631fa110c88efbfa0f`；旧 sixWeek panel SHA-256 保持 `b027474f081f4dfb44581c04789da4faae333f9c120f8222665b5559ab982648`。
- 浏览器 DOM 实测 fiveWeek src 为新 PNG、`mask-image: none`、35 张按钮和 35 个热区；版权可见，正式 DOM 无 final reference。

## 2026-06-19 clean panel 内部均匀度复核

- 分层检查确认旧产物底部仍有 `28/29/30` 的低频影子；其原因是 RGB 柔化不足，同时 alpha 在顶部 `y=105` 仍为 `0.121569`、五周核心区最低仅 `0.364706`，导致原底图继续透出。
- 新 alpha 在顶部 `y=105` 为 0、`y=140..520` 五周核心区为 1、`y=548` 归零；第六周区域保持透明。
- 专项检查新增五周核心区最小 alpha 和底行高频残留阈值，防止后续重新出现数字影子、顶部色带或末行局部色块。
- 修复后浏览器三层截图：`/tmp/omphalos-june-after-base-only.png`、`/tmp/omphalos-june-after-base-panel.png`、`/tmp/omphalos-june-after-full.png`；临时显隐均已恢复。

## 2026-06-19 程序化综合色板与统一日期圆角（当前）

- 上一版“中值滤波 + 6% 低频采样 + 大模糊 + alpha=1 核心”虽然减少旧痕迹，但会把日期区整体平均成灰粉色矩形，已停止使用。
- 当前生成器不读取正式底图像素、旧 panel 或最终参考图；只使用人工量取后写入脚本的颜色参数，程序化生成左深红、中央玫红、右淡紫的二维色场，并叠加固定种子轻纹理。
- PNG 仍为 1125×650 RGBA；四边使用 smoothstep 羽化，五周核心 alpha 为约 `0.86`，第六周范围保持透明。fiveWeek 继续关闭额外 CSS mask，sixWeek 映射和 mask 未变。
- 分层截图为 `/tmp/omphalos-june-programmatic-base-only.png`、`/tmp/omphalos-june-programmatic-base-panel.png`、`/tmp/omphalos-june-programmatic-full.png`；首排和末排没有新增横向色带，30 号后空白格上方无旧六周分界，临时显隐已恢复。
- 浏览器实测 35 张日期按钮、35 个热区、1 个整格日程层，today 为 19 号；按钮图片全部来自 `date-buttons/06/`，正式 DOM 无最终参考图。
- `.date-button-cell`、按钮图片、`.date-event-frame` 与 `.date-hotspot` 统一读取 `--date-cell-radius`；普通格、空白格、16 号日程格和 19 号 today 格计算圆角一致。

## 2026-06-19 6 月 normalized 日期按钮

- 根因量化：原始 `date-buttons/06/*.jpg` 的整图平均 RGB RMS 离散度为 `0.119146`；不同日期裁片携带不同底色、亮度和纹理。
- 以 `date-buttons/06/blank.jpg` 为唯一母版生成 `date-buttons-normalized/06/blank.png` 与 `01.png..31.png`，全部为 118×66 PNG；边框、圆角、阴影和背景像素一致，数字统一居中写入图片。
- normalized 平均 RGB RMS 离散度为 `0.005542`，较原始素材降低 `95.35%`。原始按钮 aggregate hash 保持 `d8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124`。
- fiveWeek 映射使用 normalized PNG；sixWeek 明确保留原始 JPG。clean panel、生成器和布局配置 hash 均未变化。
- 浏览器实测 35/35 图片来自 normalized 目录、5 个空格使用 `blank.png`、16 号日程与 19 号 today 状态保持、版权可见、正式 DOM 无最终参考图。

## 2026-06-20 6 月 uniform 日期按钮候选（尚未接入）

- 只使用原始 `date-buttons/06/blank.jpg` 母版生成 `date-buttons-uniform/06/blank.jpg` 与 `01.jpg..31.jpg`，未对任何日期单独调色。
- 32 张输出均为 118×66 sRGB JPEG；屏蔽数字区域后，背景 RGB 最大通道范围为 `0.000000`，边框和圆角区域逐像素一致。
- 预览图为 `docs/button-uniform-preview-06.png`，顺序包含 blank、01、02、16、18、19、30。
- 原始目录 aggregate hash 仍为 `d8e3beb84b0f290f4a2862e705b2f2b544bb74bacc9cdd9cb2e80cdb2f0e4124`；normalized 目录 hash 也未变化。
- 当前素材映射仍指向 `date-buttons-normalized/06/`，等待用户人工确认预览后再决定是否接入。

## 2026-06-20 clean PNG 母版（当前候选）

- uniform JPG 路线已被用户否决；旧 JPG 候选不再作为后续输入。
- `date-buttons-uniform/06/master-clean.png` 为 118×66 RGBA PNG，由连续柔和的粉紫底色、圆角 alpha mask、2px 浅色外描边和细内描边构成；没有独立顶部横线，不复制原 blank 的深色顶部分区、噪点、暗角或 JPEG 边缘。
- 自动检查：合成到白底后的最低亮度 `0.330972`，内部灰度标准差 `0.003342`，顶部/主体 RGB 距离 `0.008778`，顶部相邻扫描行最大 RGB 跳变 `0.000635`，透明左上角 alpha=0；未发现近黑边缘像素、顶部横线或色带。
- 对比入口：`docs/button-master-clean-preview-06.png`；放大入口：`docs/button-master-clean-zoom-06.png`。
- 尚未生成 `blank.png` 或日期 uniform PNG，页面映射仍未切换。

## 2026-06-20 1–12 月统一素材合成

- 12 个月均通过 `MonthCalendar` → `MonthCompositionView` 渲染正式底图、对应 clean panel、日期按钮图片和透明热区；旧自由模板分支不再被 1–12 月使用。
- `monthCompositionAssets.ts` 已为每个月提供 fiveWeek/sixWeek 的 panel、按钮目录和扩展名映射；6 月 fiveWeek 保持专用 clean PNG 与 uniform PNG，sixWeek 保持原始 JPG。
- `monthButtonLayoutConfig.ts` 已补齐 12 个月双布局。2026 年 5 月、8 月默认 sixWeek（42 格），其余月份默认 fiveWeek（35 格）；6 月已验收坐标未改。
- 浏览器逐月实测：每页恰有 1 个 `.month-composition-view`、对应 35/42 张日期图和同数热区、0 个 debug 类、0 个 legacy calendar cell、0 个 final reference DOM 引用；所有 base 为 1125×2436，panel 为 1125×650。
- 11 月 12 日继续由 `src/data/omphalosSpecialDays.ts` 定义；`MonthCalendar` 传入 `specialLabel`，`MonthCompositionView` 渲染与 cell 等尺寸的 `.date-special-frame`，原 `date-buttons/11/12.jpg` 的“∞”图案保持可见。
- 人工视觉微调清单：1–5 月、7–12 月尚未像 6 月一样逐月做像素级 panel/网格校准；当前结构、列行、素材和版权均正确，后续只应修改对应月份集中配置，不改统一组件。

## 2026-06-20 全月份按钮色差与翁法罗斯之日彩框修复

- 根因复核：除 6 月外仍映射到逐日 JPG，原始按钮整图 RGB 离散度为 `0.044870–0.098515`；相邻格子的底色、亮度和顶部纹理不一致。
- 新增 `generate-all-month-uniform-buttons.mjs`：为 1–5、7–12 月从各自 blank 主体区采样主题色，程序化生成 118×66 RGBA clean 母版，再生成 blank 和 01..31 共 32 张 PNG；不修改原始 JPG、6 月素材、panel 或坐标。
- 新增预览 `docs/button-uniform-preview-all-months.png`；各月 blank/01/16/30 使用相同背景、描边和圆角，不存在独立顶部横线。
- 新增 `check-all-month-uniform-buttons.mjs`，检查数量、尺寸、RGBA、统一边缘、顶部连续性、色差改善和页面映射。新增月份的 uniform RGB 离散度为 `0.005312–0.006953`。
- 11 月 12 日继续使用原始 `/date-buttons/11/12.jpg` 的“∞”图案；`.date-special-frame` 改用综合色 `border-image`，只绘制边框，不填充或遮挡按钮内部。
- 浏览器逐月实测：除 11 月特殊按钮外，所有日期图均来自对应 uniform 目录；11 月特殊层与 cell 等尺寸，computed border-image 包含完整 8 色渐变；0 个 final reference，0 个控制台错误。
