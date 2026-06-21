import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/App.css', import.meta.url), 'utf8');
const appSource = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');

const largeSafeStart = css.lastIndexOf('@media (max-width: 1080px)');
const smallSafeStart = css.lastIndexOf('@media (max-width: 480px)');
const largeSafeBlock = css.slice(largeSafeStart, smallSafeStart);
const smallSafeBlock = css.slice(smallSafeStart);

assert.ok(
  largeSafeStart >= 0 && largeSafeBlock.includes('.hero {') && largeSafeBlock.includes('display: block;'),
  '图下安全面板应在 1080px 及以下启用，以覆盖窄屏和浏览器放大场景',
);
assert.ok(
  largeSafeBlock.includes("/assets/omphalos/overview/home-safe-cyrene.png"),
  '较大的独立安全模块应使用昔涟卡片背景',
);
assert.ok(
  smallSafeStart >= 0 && smallSafeBlock.includes("/assets/omphalos/overview/home-safe-calendar-title.png"),
  '更小的独立安全模块应使用日历标题卡背景',
);
assert.ok(css.includes('var(--app-background-image'), '页面最底层背景应读取当天 oracle CSS 变量');
assert.ok(appSource.includes("'--app-background-image'"), 'App 应注入当天 oracle 背景变量');

await access(new URL('../public/assets/omphalos/overview/home-safe-cyrene.png', import.meta.url));
await access(new URL('../public/assets/omphalos/overview/home-safe-calendar-title.png', import.meta.url));

console.log('首页封面响应式安全断点检查通过。');
