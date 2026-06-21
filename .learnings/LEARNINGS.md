# Learnings

## [LRN-20260620-004] correction

**Logged**: 2026-06-20T22:00:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
“翁法罗斯之日”需要真正的综合色边框；固定黄紫描边不等于彩色状态。

### Details
为避免综合色背景遮住“∞”图案，上一版改成固定黄色 border 和紫色 outline。用户指出边框仍不是彩色。正确实现必须同时满足“保留内部素材”和“边界多色”。

### Suggested Action
特殊日期使用无背景的 `border-image-source: linear-gradient(...)` 与 `border-image-slice: 1`；浏览器检查 computed border-image，并确认特殊图片仍为原 `11/12.jpg`。

### Metadata
- Source: user_feedback
- Related Files: src/App.css, scripts/check-all-month-uniform-buttons.mjs
- Tags: special-day, border-image, visual-state, omphalos-day

### Resolution
- **Resolved**: 2026-06-20T22:00:00+08:00
- **Notes**: 11 月 12 日显示 8 色边框，原“∞”按钮图未被覆盖。

---

## [LRN-20260621-001] correction

**Logged**: 2026-06-21T01:22:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
首页图下安全面板必须由实际碰撞临界点触发，不能把整个移动端断点都改成图文分离。

### Details
首版把 `max-width: 768px` 全部改为完整图片加独立文字面板，随后又将断点收窄到 480px，但用户提供的高倍缩放截图证明 481–1080px 的有效视口仍可能发生图中文字叠压。浏览器缩放会缩小 CSS 有效视口，因此应让同一响应式规则同时覆盖窄屏与放大场景。

### Suggested Action
响应式视觉修复按有效 CSS 视口而非物理截图尺寸判断。本项目首页在 ≤1080px 使用独立安全面板，其中 ≤480px 使用紧凑背景，1081px 起保留图内叠加。

### Metadata
- Source: user_feedback
- Related Files: src/App.css, scripts/home-hero-responsive.test.ts
- Tags: responsive, breakpoint, hero, progressive-fallback

### Resolution
- **Resolved**: 2026-06-21T01:24:00+08:00
- **Notes**: 390px 使用日历标题卡安全背景，569/768/1024/1080px 使用昔涟卡安全背景，1081/1280px 保留图内叠加。

---

## [LRN-20260618-001] correction

**Logged**: 2026-06-18T15:00:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
月份日期日程状态应使用整格渐变框，不应在按钮内部新增胶囊。

### Details
用户要求日程显示在对应日期按钮中时，项目已有视觉语义是黄紫边框包裹整个日期框。首次实现误用了底部圆角胶囊，虽然位于按钮内部，但不符合“包裹日期框”的目标。

### Suggested Action
日期日程 overlay 默认使用绝对定位的整格框，保持中心透明、日期数字可见，并让 today outline 使用更高层级。

### Metadata
- Source: user_feedback
- Related Files: src/components/MonthCompositionView.tsx, src/App.css
- Tags: calendar, event-overlay, visual-alignment

### Resolution
- **Resolved**: 2026-06-18T15:00:00+08:00
- **Notes**: 改为 `.date-event-frame` 渐变整格框，移除胶囊。

---

## [LRN-20260620-003] correction

**Logged**: 2026-06-20T00:52:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
即使是浅色高光，独立水平线仍会被感知为需要消除的色带。

### Details
移除深色顶部分区后，clean 母版保留了一条浅色高光线；用户在 400% 预览中仍明确识别为横向色带。

### Suggested Action
按钮高光应通过整块底色的低幅连续渐变表达，不画独立水平线；自动检查顶部连续扫描行的最大 RGB 跳变。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-clean-button-master.mjs, scripts/check-clean-button-master.mjs
- Tags: highlight, horizontal-band, scanline-check, button-master

### Resolution
- **Resolved**: 2026-06-20T00:52:00+08:00
- **Notes**: 独立横线已移除，顶部相邻扫描行最大 RGB 跳变降至 0.000635。

---

## [LRN-20260620-002] correction

**Logged**: 2026-06-20T00:45:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
原按钮顶部的整块深色区域是需要清除的脏分区，不能因需求提到“顶部高光条”就保留为深色带。

### Details
首次 clean 母版仍保留了与主体有明显色相差的顶部块。用户指出该区域本身就是问题；高光应是浅色细线，而不是深色整块填充。

### Suggested Action
clean 按钮母版使用统一底色；顶部效果只允许浅色高光线。自动检查顶部与主体的 RGB 距离，防止重新引入分区。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-clean-button-master.mjs, scripts/check-clean-button-master.mjs
- Tags: button-master, dark-band, highlight, visual-qa

### Resolution
- **Resolved**: 2026-06-20T00:45:00+08:00
- **Notes**: 顶部/主体 RGB 距离降为 0，仅保留浅色高光线。

---

## [LRN-20260620-001] correction

**Logged**: 2026-06-20T00:20:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
按钮自动色差指标通过不代表视觉方案可以直接接入；素材切换前必须先交付独立预览供人工确认。

### Details
上一版 normalized 素材虽由单一母版生成并通过 RGB 离散检查，但用户在页面中仍判定视觉不合格。继续直接改页面会增加回退成本。

### Suggested Action
新的按钮管线分两阶段：先生成隔离目录和指定样本预览，保护原始/现用目录 hash；人工确认后才修改素材映射。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-uniform-date-buttons.mjs, docs/button-uniform-preview-06.png
- Tags: asset-preview, approval-gate, date-buttons, visual-qa

### Resolution
- **Resolved**: 2026-06-20T00:20:00+08:00
- **Notes**: uniform 候选已生成但未接入页面。

---

## [LRN-20260619-004] correction

**Logged**: 2026-06-19T22:15:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
合成日历的局部色块不一定来自 clean panel；逐日裁切按钮本身也会携带不同背景色和纹理。

### Details
6 月原始按钮的平均 RGB RMS 离散度达到 `0.119146`；批量同步组件后，其他 11 个月仍使用逐日 JPG，离散度为 `0.044870–0.098515`。继续调整 panel 会掩盖错误层级，无法消除逐格色差。

### Suggested Action
视觉诊断先分别量化 panel 和 button 层；同月按钮使用单一空白母版，把统一数字写入图片，并保留原始素材目录以便回退。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-all-month-uniform-buttons.mjs, scripts/check-all-month-uniform-buttons.mjs
- Tags: date-buttons, asset-normalization, layered-debugging, color-variance
- Recurrence-Count: 2
- Last-Seen: 2026-06-20

### Resolution
- **Resolved**: 2026-06-20T22:00:00+08:00
- **Notes**: 12 个月默认页面均使用同月单一 clean 母版 PNG；新增 11 个月离散度降至 `0.005312–0.006953`。

---

## [LRN-20260619-003] correction

**Logged**: 2026-06-19T21:20:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
整块低频采样即使去掉日期残影，也会形成与底图割裂的灰粉色矩形，不能作为 clean panel 的最终方案。

### Details
上一版通过中值滤波、缩小采样、大模糊和全不透明核心消除了部分硬边，但同时抹平原图综合色差，首末行附近仍显得是独立贴片。用户明确要求停止继续增大 blur 或只调 alpha/mask。

### Suggested Action
布局专用 clean panel 优先使用程序化二维综合色场：人工量取综合色板色彩趋势，运行时不读取最终参考图；加入确定性轻纹理和柔和 alpha 羽化，并用分层浏览器截图验证，而不是只看像素阈值。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-fiveweek-clean-panel.mjs, src/App.css
- Tags: clean-panel, programmatic-gradient, visual-regression, layered-qa

### Resolution
- **Resolved**: 2026-06-19T21:20:00+08:00
- **Notes**: 生成器已移除旧低频管线，改为程序化二维综合色板；日期四类状态同时统一圆角。

---

## [LRN-20260619-002] correction

**Logged**: 2026-06-19T19:45:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
透明 clean panel 的日期核心区必须有明确的全不透明平台，单纯 Gaussian feather 会让原底图痕迹继续透出。

### Details
首版 fiveWeek PNG 虽然外边缘透明，但顶部和底部 Gaussian alpha 尾部侵入日期行，五周核心区最低 alpha 仅约 0.365；同时弱低通保留数字低频影子。结果是首排色带与末排 `28/29/30` 影子仍可见。

### Suggested Action
先对整块背景做强低频采样，再使用“透明过渡—全不透明核心—透明过渡”的分段 alpha；自动检查核心区最小 alpha 和底行高频残留。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-fiveweek-clean-panel.mjs
- Tags: alpha-plateau, low-pass, clean-panel, visual-regression

### Resolution
- **Resolved**: 2026-06-19T19:45:00+08:00
- **Notes**: 五周核心区 alpha=1，顶部105起始透明、140进入全覆盖，底部520后渐隐并在548归零。

---

## [LRN-20260619-001] best_practice

**Logged**: 2026-06-19T11:30:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
源 clean panel 自带硬处理边界时，应生成布局专用 alpha feather 素材，不应继续依赖 CSS mask 掩盖。

### Details
6 月 fiveWeek 复用按共享六行范围处理的 JPG，顶部、底部和右侧硬边属于素材内容。CSS mask 只能减弱，不能消除色差。最终从正式底图直接生成 fiveWeek RGBA PNG，并在素材 alpha 中完成四边渐隐。

### Suggested Action
布局数量不同时分别生成 clean panel；输出前验证 alpha 边界、未处理行范围、布局映射和正式底图 hash。

### Metadata
- Source: user_feedback
- Related Files: scripts/generate-fiveweek-clean-panel.mjs, src/data/monthCompositionAssets.ts
- Tags: clean-panel, alpha-feather, five-week, asset-pipeline

### Resolution
- **Resolved**: 2026-06-19T11:30:00+08:00
- **Notes**: fiveWeek 使用专用 PNG 和 `mask-image: none`，sixWeek 保留旧 JPG 与 mask。

---

## [LRN-20260618-002] correction

**Logged**: 2026-06-18T16:30:00+08:00
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
“包裹整个日期格”在本项目当前验收语义中是整格半透明状态填充，不是空心细边框。

### Details
第一次纠正已移除胶囊，但仍将日程实现为空心渐变框。用户进一步明确：黄紫状态必须覆盖整个日期按钮区域，通过透明度和层级保留素材里的日期数字。

### Suggested Action
日期日程 overlay 使用 `position: absolute; inset: 0` 和半透明连续渐变；today outline 保持独立高层，点击热区置顶。

### Metadata
- Source: user_feedback
- Related Files: src/components/MonthCompositionView.tsx, src/App.css
- Tags: calendar, full-cell-fill, event-overlay

### Resolution
- **Resolved**: 2026-06-18T16:30:00+08:00
- **Notes**: `.date-event-frame` 已改为覆盖整格的半透明黄紫渐变填充。

---
