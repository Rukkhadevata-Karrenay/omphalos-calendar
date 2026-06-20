# 6 月统一日期按钮 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 6 月生成一套底板、圆角、边框、阴影和数字风格统一的 118×66 PNG 日期按钮，并只让 fiveWeek 页面使用它们。

**Architecture:** `blank.jpg` 是唯一按钮母版；生成脚本把统一衬线数字写入母版后输出 `blank.png` 和 `01.png..31.png`。素材映射分别保存 fiveWeek normalized 目录和 sixWeek 原始目录，检查脚本量化新旧平均色差、尺寸、边缘模板一致性和页面映射。

**Tech Stack:** Node.js ESM、ImageMagick、React/TypeScript、Vite。

## Global Constraints

- 不修改 clean panel、底图、布局坐标、业务逻辑或其他月份。
- 不覆盖 `public/assets/calendar-composition/date-buttons/06/`。
- 不使用 AI；按钮必须继续是图片素材。
- 最终依次运行 `npm run check:date-buttons`、`npm run check:assets`、`npm run build`。

---

### Task 1: 建立按钮资产检查

**Files:**
- Create: `scripts/check-date-buttons.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: 原始按钮目录、normalized 输出目录、`monthCompositionAssets.ts`。
- Produces: `npm run check:date-buttons`，输出原始与 normalized 的 RGB RMS 离散度。

- [x] 写入检查：要求 32 个 PNG、全部 118×66、边缘模板 hash 一致、normalized 色差低于原始的 20%、fiveWeek/sixWeek 映射正确、原目录 aggregate hash 不变。
- [x] 运行 `npm run check:date-buttons`，确认因 normalized 目录和映射尚不存在而失败。

### Task 2: 生成 normalized 图片

**Files:**
- Create: `scripts/generate-normalized-date-buttons.mjs`
- Create: `public/assets/calendar-composition/date-buttons-normalized/06/blank.png`
- Create: `public/assets/calendar-composition/date-buttons-normalized/06/01.png..31.png`

**Interfaces:**
- Consumes: `date-buttons/06/blank.jpg`、系统 Times New Roman 字体、ImageMagick。
- Produces: 32 张 118×66 PNG；数字使用统一位置、象牙白前景和深色轻阴影。

- [x] 复制母版为 `blank.png`。
- [x] 对 1..31 使用同一母版、字体、字号、阴影和中心坐标写入数字。
- [x] 生成后验证原始按钮 aggregate hash 与 clean panel hash 未变化。

### Task 3: 切换 fiveWeek 素材映射

**Files:**
- Modify: `src/data/monthCompositionAssets.ts`
- Modify: `src/components/MonthCalendar.tsx`

**Interfaces:**
- Consumes: `layout.defaultLayout`。
- Produces: fiveWeek 使用 normalized PNG；sixWeek 保留原始 JPG。

- [x] 在 6 月素材配置中记录 `originalDateButtonDir`、按布局区分的目录和扩展名。
- [x] 组件按当前布局读取目录和扩展名，不改行数、坐标或日期数据。
- [x] 运行 `npm run check:date-buttons`，确认通过。

### Task 4: 浏览器与最终验证

**Files:**
- Modify: `README.md`
- Modify: `docs/assets-check-report.md`
- Modify: `notes/任务记录.md`

**Interfaces:**
- Consumes: `http://localhost:5173/#month-06`。
- Produces: 页面素材路径、35 按钮/35 热区、16 日程、19 today、版权和 DOM 素材检查证据。

- [x] 浏览器确认全部 35 张按钮来自 normalized 目录，空白格使用 `blank.png`，最终参考图不在 DOM。
- [x] 对照截图检查第一排、末排和状态层。
- [x] 更新项目记录和踩坑日志。
- [x] 依次运行 `npm run check:date-buttons`、`npm run check:assets`、`npm run build`。
