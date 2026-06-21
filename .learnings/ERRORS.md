# Errors

## [ERR-20260620-004] vercel-docs-network

**Logged**: 2026-06-20T22:40:00+08:00
**Priority**: low
**Status**: pending
**Area**: infra

### Summary
发布前检查期间无法从当前环境读取 Vercel 官方限制页面。

### Error
`curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to vercel.com:443`

### Context
- 尝试核实约 311 MB 的生产构建产物是否符合 Vercel 当前部署限额。
- GitHub 官方文档可访问，但 Vercel 官方页面连接失败。

### Suggested Fix
部署前在用户浏览器中检查 Vercel 当前套餐的部署大小限制；若平台拒绝构建，再单独制定不修改正式素材的发布资产裁剪方案。

### Metadata
- Reproducible: unknown
- Related Files: `dist/`, `public/assets/`

---

## [ERR-20260621-004] browser-plugin-version-and-metadata

**Logged**: 2026-06-21T03:18:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
浏览器插件缓存版本再次变化，更新路径后应用内浏览器又因缺少 sandboxPolicy 元数据无法启动。

### Error
`No such file or directory: browser/26.616.32156/...`；`missing field sandboxPolicy`

### Suggested Fix
每轮从当前缓存定位浏览器插件版本；若浏览器 MCP 后端元数据缺失，在完成强制技能检查后改用本地 Playwright CLI 验收。

### Metadata
- Reproducible: environment-dependent
- Related Files: browser plugin runtime

### Resolution
- **Resolved**: 2026-06-21T03:20:00+08:00
- **Notes**: 使用当前插件说明并切换到本地 Playwright CLI，完成同等 DOM 与截图验收。

---

## [ERR-20260621-005] playwright-cli-run-code-shape

**Logged**: 2026-06-21T03:22:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
Playwright CLI `run-code` 参数需要是接收 page 的函数，直接传语句或顶层 await 会解析失败。

### Error
`SyntaxError: Unexpected token 'const'`；`ReferenceError: await is not defined`

### Suggested Fix
统一传入 `async (page) => { ... }`，需要读取结果时显式 return。

### Metadata
- Reproducible: yes
- Related Files: Playwright CLI validation command

### Resolution
- **Resolved**: 2026-06-21T03:23:00+08:00
- **Notes**: 改为异步函数后完成七个响应式宽度批量检查。

---

## [ERR-20260621-002] tsx-react-server-render

**Logged**: 2026-06-21T01:18:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tests

### Summary
直接用 tsx 服务端渲染现有 JSX 组件时，组件依赖的经典 React 全局未注入。

### Error
`ReferenceError: React is not defined`

### Suggested Fix
回归脚本先显式注入 React，再动态导入 JSX 组件，确保失败落在业务断言而不是测试装载。

### Metadata
- Reproducible: yes
- Related Files: scripts/oracle-backgrounds.test.ts

### Resolution
- **Resolved**: 2026-06-21T01:19:00+08:00
- **Notes**: 动态导入后测试正确捕获旧总览图问题。

---

## [ERR-20260621-003] browser-evaluate-template-escaping

**Logged**: 2026-06-21T01:25:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
浏览器求值代码嵌入外层模板字符串时再次使用反引号，导致验证脚本解析失败。

### Error
`SyntaxError: Unexpected identifier 'url'`

### Suggested Fix
嵌套浏览器求值代码避免反引号，字符串比较使用普通拼接。

### Metadata
- Reproducible: yes
- Related Files: browser validation snippet

### Resolution
- **Resolved**: 2026-06-21T01:26:00+08:00
- **Notes**: 改为 `"url(" + src + ")"` 后完成背景一致性检查。

---

## [ERR-20260621-001] browser-networkidle

**Logged**: 2026-06-21T01:07:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
应用内浏览器文档列出 `networkidle`，但当前运行时不支持该等待状态。

### Error
`playwright_wait_for_load_state does not support networkidle`

### Context
- 在本地 Vite 首页响应式验收前等待页面完成加载。
- 页面本身已正常打开，错误只来自浏览器自动化等待参数。

### Suggested Fix
本地静态/Vite 页面使用 `load`，再用目标 DOM、图片 naturalWidth 与控制台日志做定向就绪检查。

### Metadata
- Reproducible: yes
- Related Files: browser plugin runtime

### Resolution
- **Resolved**: 2026-06-21T01:08:00+08:00
- **Notes**: 改用 `load` 后完成 390/414/430/768/1280px 验收。

---

## [ERR-20260620-005] release-preview-sandbox-and-browser-scope

**Logged**: 2026-06-20T22:55:00+08:00
**Priority**: low
**Status**: resolved
**Area**: infra

### Summary
生产预览端口在默认沙箱中被拒绝，浏览器只读 evaluate 也未暴露 localStorage。

### Error
`Error: listen EPERM: operation not permitted 127.0.0.1:4173`；`TypeError: Cannot read properties of undefined (reading 'getItem')`

### Context
- `npm run preview` 需要监听本地端口。
- Browser Plugin 的只读 Playwright evaluate 使用受限页面作用域，不保证暴露全部浏览器全局。

### Suggested Fix
本地生产预览直接申请限定为 `npm run preview` 的端口权限；localStorage 只读检查使用 CDP `Runtime.evaluate`，不改页面状态。

### Metadata
- Reproducible: yes
- Related Files: `package.json`, `src/hooks/useEvents.ts`

### Resolution
- **Resolved**: 2026-06-20T22:55:00+08:00
- **Notes**: 生产预览在 4173 启动，CDP 验证 localStorage 刷新前后保持一致。

---

## [ERR-20260618-001] apply_patch

**Logged**: 2026-06-18T15:00:00+08:00
**Priority**: medium
**Status**: resolved
**Area**: docs

### Summary
合并修改代码和 QA 文档时，补丁因文档原文不匹配而整体失败。

### Error
`apply_patch verification failed: Failed to find expected lines in design-qa.md`

### Context
- 在未重新读取 `design-qa.md` 精确文本时同时提交多文件补丁。

### Suggested Fix
补丁上下文失败后先用 `rg` 读取当前文本，再用精确上下文重试。

### Metadata
- Reproducible: yes
- Related Files: design-qa.md

### Resolution
- **Resolved**: 2026-06-18T15:00:00+08:00
- **Notes**: 重新读取准确行后补丁成功。

---

## [ERR-20260620-001] imagemagick-alpha-maxima

**Logged**: 2026-06-20T00:15:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
ImageMagick difference 检查读取 `%[fx:maxima]` 时包含恒为 1 的 alpha 通道，误报边框差异为 1。

### Error
`01.jpg 与 blank.jpg 的背景或边框差异过大：1`

### Suggested Fix
比较 RGB 像素差异前显式添加 `-alpha off`，避免透明度通道进入 maxima。

### Resolution
- **Resolved**: 2026-06-20T00:15:00+08:00
- **Notes**: 关闭 alpha 后外部边框差异为 0，检查通过。

---

## [ERR-20260619-003] imagemagick-fx-symbol

**Logged**: 2026-06-19T21:05:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
ImageMagick `-fx` 中误用保留符号 `a` 保存 alpha 过渡变量，导致程序化 mask 原型失败。

### Error
`Attempted assignment to non-UserSymbol 'a'`

### Context
- `a` 在 ImageMagick FX 中代表 alpha 通道，不能作为用户变量赋值。

### Suggested Fix
复杂 FX 表达式使用 `aa`、`bb` 等非保留变量；alpha 通道仍通过 `CopyOpacity` 合成。

### Metadata
- Reproducible: yes
- Related Files: scripts/generate-fiveweek-clean-panel.mjs

### Resolution
- **Resolved**: 2026-06-19T21:05:00+08:00
- **Notes**: 改用 `aa/bb/cc/dd` 后生成成功，并加入脚本检查。

---

## [ERR-20260619-002] image-diagnostics

**Logged**: 2026-06-19T19:35:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
图像诊断中出现一次 JavaScript 正则转义错误和一次 ImageMagick FX 像素语法错误。

### Error
`Invalid regular expression: Unterminated group`；`Expected operator at '.p{190,165}'`

### Context
- 解析 ImageMagick `txt:-` 输出时过度转义正则。
- 读取像素时误用 `a.p{x,y}`，而当前 ImageMagick 应使用 `%[pixel:p{x,y}]`。

### Suggested Fix
自由格式 JavaScript 中直接使用标准正则转义；ImageMagick 像素采样统一使用 `%[pixel:p{x,y}]`。

### Metadata
- Reproducible: yes
- Related Files: scripts/generate-fiveweek-clean-panel.mjs

### Resolution
- **Resolved**: 2026-06-19T19:35:00+08:00
- **Notes**: 使用正确正则和 pixel 属性完成 alpha、行亮度及残影诊断。

---

## [ERR-20260619-001] browser-runtime-reuse

**Logged**: 2026-06-19T11:35:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
浏览器运行时已跨轮次保留时，重复声明初始化变量和临时结果变量会触发重复标识符错误。

### Error
`Identifier 'setupBrowserRuntime' has already been declared`；`Identifier 'restored' has already been declared`

### Context
- 浏览器连接和顶层变量仍存在，但验收流程再次执行初始化及同名 `const`。

### Suggested Fix
先复用现有 `browser`/`tab`；可重复执行的临时结果使用唯一变量名或可重声明的 `var`，不要重置有效会话。

### Metadata
- Reproducible: yes
- Related Files: design-qa.md

### Resolution
- **Resolved**: 2026-06-19T11:35:00+08:00
- **Notes**: 复用现有连接并使用唯一变量名完成 DOM 和视觉验收，临时显隐已恢复。

---

## [ERR-20260618-002] browser-evaluate

**Logged**: 2026-06-18T16:20:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
浏览器只读求值环境不提供全局 `parseFloat`。

### Error
`ReferenceError: parseFloat is not defined`

### Context
- 在页面几何验收脚本中使用 `parseFloat` 读取 CSS 百分比值。

### Suggested Fix
该浏览器求值环境中使用数值乘法强制转换或先读取已计算像素值，不依赖未声明的全局函数。

### Metadata
- Reproducible: yes
- Related Files: src/data/monthButtonLayoutConfig.ts

### Resolution
- **Resolved**: 2026-06-18T16:20:00+08:00
- **Notes**: 改用算术强制转换后完成 35 格、图层尺寸和素材路径复核。

---
## [ERR-20260620-002] imagemagick-montage-font

**Logged**: 2026-06-20T21:00:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
ImageMagick montage 在没有可用默认字体时仍尝试渲染图片标签并失败。

### Error
`montage: unable to read font '' @ error/annotate.c/RenderFreetype/1660.`

### Context
- 为 12 个月 blank 按钮制作临时只读对比图。
- 即使未主动设置 label，输入图像的标签元数据仍会触发字体渲染。

### Suggested Fix
montage 即使使用空 label 仍可能初始化字体；固定显式传入可用字体文件，例如 `/System/Library/Fonts/Supplemental/Times New Roman.ttf`。

### Metadata
- Reproducible: yes
- Related Files: `public/assets/calendar-composition/date-buttons/*/blank.jpg`

### Resolution
- **Resolved**: 2026-06-20T21:02:00+08:00
- **Notes**: 显式传入字体文件后成功生成临时对比图。

---

## [ERR-20260620-003] browser-plugin-bootstrap

**Logged**: 2026-06-20T22:05:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
浏览器插件缓存版本变化且本轮运行时未初始化，旧路径和直接读取 `browser` 均失败。

### Error
`No such file or directory: browser/26.611.62324/.../SKILL.md`；`browser is not defined`

### Suggested Fix
每轮从当前 skills 列表或目标目录定位实际插件版本；仅在确认 `browser` 已初始化后复用，否则按当前版本重新 bootstrap。

### Metadata
- Reproducible: yes
- Related Files: browser plugin runtime

### Resolution
- **Resolved**: 2026-06-20T22:06:00+08:00
- **Notes**: 使用当前插件路径重新初始化并读取完整文档。

---

## [ERR-20260620-004] local-vite-preview

**Logged**: 2026-06-20T22:10:00+08:00
**Priority**: low
**Status**: resolved
**Area**: tooling

### Summary
受限环境无法直接监听 localhost，且失败后的 data 错误标签不能重新导航到本地页面。

### Error
`listen EPERM: operation not permitted ::1:5173`；`Blocked browser navigation by Browser Use URL policy: data:text/html...`

### Suggested Fix
经授权用 `--host 0.0.0.0` 启动 Vite；内部 data 错误页不复用，创建新标签打开 `http://localhost:5173/`。

### Metadata
- Reproducible: yes
- Related Files: package.json

### Resolution
- **Resolved**: 2026-06-20T22:12:00+08:00
- **Notes**: 新服务和新标签成功打开 localhost 并完成逐月验收。

---
