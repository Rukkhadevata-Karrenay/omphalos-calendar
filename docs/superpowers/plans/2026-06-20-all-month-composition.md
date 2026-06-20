# 12 个月素材合成同步实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use test-driven-development and verification-before-completion. 本任务继续在用户当前工作区执行，不创建分支、不提交、不改素材。

**Goal:** 以已验收的 6 月合成页面为唯一实现模板，让 1–12 月统一使用正式底图、clean panel、日期按钮图片和交互 overlay。

**Architecture:** 保留单一 `MonthCalendar` + `MonthCompositionView` 渲染链路。月份差异只存放在 `monthCompositionAssets.ts` 和 `monthButtonLayoutConfig.ts`；11 月 12 日继续由 `omphalosSpecialDays.ts` 提供集中数据，并在合成日期格内以独立 overlay 显示。

**Tech Stack:** React 19、TypeScript、Vite、Node.js 素材检查脚本。

## Global Constraints

- 不修改任何图片素材、localStorage、路由、首页整体布局或 6 月已验收配置。
- 正式页面不得读取 `finalReferenceImage`，不得使用 `object-fit: cover`。
- 2026 年默认布局：5 月、8 月为 `sixWeek`；其余月份为 `fiveWeek`。
- 每个月同时保留 fiveWeek 35 格与 sixWeek 42 格配置。
- 其他月份先共享 6 月已确认的几何坐标；旧 JPG clean panel 两种布局均保留边缘 mask，后续按人工截图逐月微调。

---

### Task 1: 扩充自动验收

**Files:**
- Modify: `scripts/check-assets-usage.mjs`

**Produces:** `npm run check:assets` 会检查 12 个月映射、12 个月双布局、统一组件入口、11 月特殊日 overlay、素材文件存在及禁止正式引用最终参考图。

- [x] 先添加上述断言并运行 `npm run check:assets`，确认因只配置 6 月而失败。
- [x] 完成后再次运行，要求退出码为 0。

### Task 2: 补齐素材与布局配置

**Files:**
- Modify: `src/data/monthCompositionAssets.ts`
- Modify: `src/data/monthButtonLayoutConfig.ts`

**Produces:** 12 个月都有 base/panel/button/final-reference 映射和独立 fiveWeek/sixWeek 配置；6 月继续使用 fiveWeek 专用 PNG panel 与 uniform PNG 按钮。

- [x] 让通用素材工厂同时生成 two-layout 映射，6 月保留现有 override。
- [x] 用共享布局工厂生成 1–5、7–12 月配置，保持 `JUNE_BUTTON_LAYOUT` 数值不变。
- [x] 设置 5 月、8 月默认 `sixWeek`，其余默认 `fiveWeek`。

### Task 3: 统一 12 个月渲染与特殊日 overlay

**Files:**
- Modify: `src/components/MonthCalendar.tsx`
- Modify: `src/components/MonthCompositionView.tsx`
- Modify: `src/data/omphalosSpecialDays.ts`
- Modify: `src/App.tsx`
- Modify: `src/App.css`

**Produces:** 所有月份走 `MonthCompositionView`；普通日程、today、selected 和 11 月 12 日特殊层互不改变日期格尺寸。

- [x] 用配置存在性判断统一启用合成视图，并让 App 的内容容器使用同一判断。
- [x] 将“翁法罗斯之日”标题导出为集中常量，日期 cell 增加 `specialLabel`。
- [x] 在图片层内渲染 `.date-special-frame`，使用绝对定位与继承圆角；热点层保持最高交互层。
- [x] 让 1–12 月全部命中统一组件，同时保留不影响正式月份的旧 fallback；不修改首页或详情文案字段。

### Task 4: 验证与记录

**Files:**
- Modify: `README.md`
- Modify: `notes/任务记录.md`
- Modify: `docs/assets-check-report.md`

**Produces:** 可复用的 12 月份映射、默认周数和人工微调清单。

- [x] 运行 `npm run check:assets`。
- [x] 运行 `npm run build`。
- [x] 在 `http://localhost:5173/#month-01` 至 `#month-12` 做 DOM 结构抽查，重点确认 11 月 12 日、6 月 uniform、5/8 月 42 格及其余 35 格。
- [x] 记录结构完成情况与需要人工视觉微调的月份。
