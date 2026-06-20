# 发布前冻结与 Vercel 部署准备计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use verification-before-completion and control-in-app-browser. 用户要求当前会话直接执行；不提交、不推送、不部署。

**Goal:** 将当前 React + Vite + TypeScript 项目整理为可提交 GitHub 并由 Vercel 构建部署的冻结版本。

**Architecture:** 不修改 UI、业务逻辑、素材和路由。只检查并在必要时修正发布元数据、忽略规则、README/NOTICE，随后验证素材、TypeScript/Vite 构建和本地生产预览。

**Tech Stack:** React 19、Vite 7、TypeScript 5、npm、Git、Vercel。

## Global Constraints

- 不修改 `src/` 页面逻辑、localStorage 结构、路由或任何图片素材。
- 不新增 PWA、桌面打包、GitHub Pages base 或部署依赖。
- Vercel 使用根路径，`base` 保持 `/` 或不设置。
- 不执行 git init/add/commit/push；只输出用户后续命令。

---

### Task 1: 根目录、配置和 Git 边界

**Files:**
- Inspect: `package.json`, `vite.config.ts`, `.gitignore`, Git metadata

- [x] 确认根目录包含 `package.json`、`src/`、`public/`、`vite.config.ts`。
- [x] 检查必需 npm scripts、Vite base、Git 根、分支、remote、tracked node_modules/dist 和大文件。

### Task 2: 发布文档和忽略规则

**Files:**
- Modify only if required: `.gitignore`, `README.md`
- Create if missing: `NOTICE.md`

- [x] 确保 `.gitignore` 包含 node_modules、dist、macOS 文件和 env 文件，且不忽略正式 public assets、README、NOTICE、scripts。
- [x] README 包含项目简介、功能、运行、构建、Vercel 占位、技术栈及非官方/版权声明。
- [x] NOTICE.md 包含非官方、无隶属、非商业、权利归属和代码用途声明。

### Task 3: 自动检查与生产构建

**Files:**
- No production source changes expected

- [x] 运行 `npm run check:assets`，要求退出码 0。
- [x] 运行 `npm run build`，要求退出码 0 且生成 `dist/index.html`。

### Task 4: 本地生产预览

**Files:**
- No file changes

- [x] 运行 `npm run preview`，通过 `http://localhost:4173/` 验收。
- [x] 检查首页、12 个月、6 月 uniform、today、高亮、11 月 12 日、素材加载、final reference、控制台和刷新。
- [x] 检查 localStorage key 可读取且刷新前后状态不丢失，不修改数据结构。

### Task 5: 发布报告

**Files:**
- Modify: `README.md`, `notes/任务记录.md` only for durable release status

- [x] 记录检查结果、Git 边界、待人工确认项、Git 命令和 Vercel 配置。
- [x] 最终重新运行 `npm run check:assets` 与 `npm run build` 后再报告通过。
