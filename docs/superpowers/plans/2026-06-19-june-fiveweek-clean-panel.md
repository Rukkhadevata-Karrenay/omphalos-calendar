# 6 月 fiveWeek clean panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 从 6 月 1125×2436 正式底图的 `y=1700..2350` 区域生成 fiveWeek 专用透明 clean panel，并让 fiveWeek/sixWeek 分别引用新旧素材。

**Architecture:** `scripts/generate-fiveweek-clean-panel.mjs` 使用 ImageMagick 做确定性裁切、统计中值柔化、Gaussian blur 和 alpha feather；默认生成后自检，`--check` 只检查。素材映射保留旧 `cleanPanelImage`，为 6 月增加布局专用映射，组件按 `defaultLayout` 选择；fiveWeek 配置关闭 CSS mask，sixWeek 保持旧配置。

**Tech Stack:** Node.js ESM、ImageMagick、React、TypeScript、Vite。

## Global Constraints

- 不使用 AI 生成式重绘，不读取 final reference 作为输入。
- 不修改 6 月正式底图、旧 sixWeek panel、date-buttons 或其他月份素材。
- 新文件固定为 `1125×650` RGBA PNG，透明区域在第六周之前结束。
- 最终运行 `npm run check:fiveweek-panel`、`npm run check:assets` 和 `npm run build`。

---

### Task 1: 建立会失败的素材验收

**Files:**
- Create: `scripts/generate-fiveweek-clean-panel.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: `npm run check:fiveweek-panel`

- [ ] 编写 `--check`：检查输出存在、1125×650 RGBA、外边缘透明、alpha 含中间渐隐值、第六周区域透明、fiveWeek/sixWeek 映射及正式底图 SHA-256。
- [ ] 在输出文件尚不存在、映射尚未修改时运行，确认检查因目标缺失而失败。

### Task 2: 生成 fiveWeek 专用透明 panel

**Files:**
- Modify: `scripts/generate-fiveweek-clean-panel.mjs`
- Create: `public/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png`

**Interfaces:**
- Consumes: `public/assets/calendar-composition/bases/06-long-day-month-base.jpg`
- Produces: 1125×650 RGBA PNG，日期处理核心覆盖五行，alpha 在四边渐隐并在第六周前归零。

- [ ] 从正式底图裁切 `1125x650+0+1700`。
- [ ] 对整张裁片建立确定性中值柔化与 Gaussian blur 版本。
- [ ] 通过圆角矩形 alpha mask 只合成五行区域；四周 feather，不处理第六行。
- [ ] 生成后立即执行相同验收，确认底图 hash 未变化。

### Task 3: 按布局选择素材并验证页面

**Files:**
- Modify: `src/data/monthCompositionAssets.ts`
- Modify: `src/data/monthButtonLayoutConfig.ts`
- Modify: `src/components/MonthCompositionView.tsx`

**Interfaces:**
- fiveWeek: `/assets/calendar-composition/panels-clean/06-aigle-long-day-month-fiveweek-clean-panel.png`
- sixWeek: `/assets/calendar-composition/panels-clean/06-aigle-long-day-month-calendar-panel.jpg`

- [ ] 为 6 月增加布局专用 panel 映射；其他月份继续使用旧字段。
- [ ] 组件使用当前 `defaultLayout` 选择布局专用 panel。
- [ ] fiveWeek 的 `panelMaskImage` 改为 `none`；sixWeek 保持原 mask。
- [ ] 运行素材检查、构建和浏览器 DOM/视觉验收，确认新 src、mask=none、35 格、版权可见、无 final reference。
