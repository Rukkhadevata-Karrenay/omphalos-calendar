import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../src/App.css', import.meta.url), 'utf8');

assert.match(
  css,
  /@media \(max-width: 480px\)\s*\{\s*\.hero\s*\{\s*display:\s*block;/,
  '图下安全面板应只在 480px 及以下启用',
);
assert.doesNotMatch(
  css,
  /@media \(max-width: 768px\)\s*\{\s*\.hero\s*\{\s*display:\s*block;/,
  '不应在 768px 范围内全局启用图下安全面板',
);

console.log('首页封面响应式安全断点检查通过。');
