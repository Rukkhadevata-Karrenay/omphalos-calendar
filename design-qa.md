# 6 月五周日历视觉 QA

- Source visual truth: `/Users/Karrenay/Downloads/6BD7EDA1-3C05-4971-95AE-D89DEEED4811.PNG`
- Implementation screenshot: `/tmp/omphalos-june-after-full.png`
- Base-only screenshot: `/tmp/omphalos-june-after-base-only.png`
- Base + clean panel screenshot: `/tmp/omphalos-june-after-base-panel.png`
- Route: `http://localhost:5173/#month-06`
- Viewport: in-app browser mobile viewport；日历海报实际截图区域 470 × 1018 px
- State: 2026 年 6 月；19 号为今天；16 号存在日程

## Full-view comparison evidence

- 正式底图保持 1125×2436 完整比例，人物、月份标题、日历边框和底部版权均完整显示。
- fiveWeek 网格按参考图测量值重新定位：首行顶部约为 panel 内 132px，末行底部约为 518px，不再使用 sixWeek 的前五行坐标。
- SUN 至 SAT 与七列按钮中心一致，五行按钮等宽等高，底部留白和参考图接近。

## Focused region comparison evidence

- 参考图五行按钮中心约为 panel 内 `165/245/325/405/485px`；实现对应使用 `gridTop=20.31%`、`gridHeight=59.38%`、`gapY=3.63%`。
- 16 号日程状态位于对应 `.date-button-cell` 内，使用 `inset: 0` 的绝对定位半透明黄紫渐变填充覆盖整个日期按钮；未改变按钮或网格尺寸。
- 18 号 today outline 位于更高层，完整包住按钮；日程框与 today 状态可共存。
- fiveWeek clean panel 使用素材自身的四边 alpha 渐隐，页面计算样式为 `mask-image: none`；右侧装饰边框附近与底部不再叠加旧 sixWeek 处理矩形，底部版权仍可见。
- 第一排上方由透明到不透明的过渡限定在 `y=105..140`，进入按钮区域前已完全不透明；最后一排及空白格区域保持完整覆盖到 `y=520`，无旧日期残影。

## Required fidelity surfaces

- Fonts and typography: 日期数字继续来自原始按钮图片；日程状态不再叠加胶囊文字，不遮挡日期数字。
- Spacing and layout rhythm: 七列、五行、横纵间距与参考图测量值一致；无第六行占位。
- Colors and visual tokens: clean panel 保持原素材色彩；日程状态使用左上黄、右下紫的整格半透明连续渐变填充。
- Image quality and asset fidelity: base、date-buttons 均使用正式原图素材；fiveWeek clean panel 由正式底图确定性裁切和柔化生成，未使用 AI 或 final reference，原底图 hash 未变化。
- Copy and content: 16 号显示现有日程状态框；正式页面未引用 final reference。

## Findings

- 无 P0/P1/P2 问题。
- 无剩余 P3。

## Patches made

- 将 5 周和 6 周的 panel、grid、行数与总格数改为两套独立配置。
- 将 fiveWeek 纵向坐标改为参考图测量值。
- 将日程渲染为包裹日期按钮的内部渐变框，移除胶囊和 6 月下方独立日程卡。
- 以 fiveWeek 专用 RGBA PNG 替换 fiveWeek 对旧 sixWeek JPG 的复用；新素材自带 alpha feather，sixWeek 仍保留旧 JPG 与双轴 mask。
- 将 panel 背景处理升级为整块低频采样，并用明确的上下 alpha 平台替代 Gaussian mask 尾部，消除首排色带和末排数字/色块透出。
- 保留 today outline、透明点击热区和 sixWeek 备用配置。

final result: passed
