import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app = readFileSync('frontend/src/app.js', 'utf8');
const css = readFileSync('frontend/src/styles.css', 'utf8');

const optionStart = app.indexOf('const optionHtml=attributes.map');
const optionEnd = app.indexOf("layout('<section", optionStart);
assert.notEqual(optionStart, -1, 'product option renderer must exist');
assert.notEqual(optionEnd, -1, 'product layout boundary must exist');
const optionRenderer = app.slice(optionStart, optionEnd);
const gridStart = css.indexOf('.product-option-grid{');
const gridEnd = css.indexOf('\n}', gridStart);
assert.notEqual(gridStart, -1, 'canonical option row CSS must exist');
const optionGridRule = css.slice(gridStart, gridEnd);

test('product option renderer keeps price data and radio-group contracts', () => {
  assert.match(optionRenderer, /data-delta=/);
  assert.match(optionRenderer, /data-attribute-id=/);
  assert.match(optionRenderer, /name=\\?"product-option-/);
  assert.match(optionRenderer, /value=\\?"\+escapeHtml\(o\.id\)/);
  assert.match(optionRenderer, /role=\\?"radiogroup\\?"/);
  assert.match(optionRenderer, /product-option-default/);
});

test('product option labels do not render price deltas beside option names', () => {
  assert.doesNotMatch(optionRenderer, /product-option-price|deltaLabel|قیمت پایه/);
  assert.match(app, /function recalc\(/);
  assert.match(app, /product-price-breakdown/);
});

test('option rows remain horizontal and touch-scrollable at every breakpoint', () => {
  for (const rule of ['display:flex', 'flex-flow:row nowrap', 'overflow-x:auto', '-webkit-overflow-scrolling:touch', 'overscroll-behavior-x:contain']) {
    assert.ok(optionGridRule.includes(rule), 'missing option row behavior: ' + rule);
  }
  assert.match(css, /\.product-option-card\{[^}]*flex:0 0 auto/s);
  assert.match(css, /\.product-option-grid::-webkit-scrollbar\{display:none\}/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\s*\.product-option-card-ui\{transition:none\}/);
});

test('option keyboard focus and selected states are visible through theme tokens', () => {
  assert.match(css, /\.product-option-input:focus-visible\s*\+\s*\.product-option-card-ui/);
  assert.match(css, /\.product-option-input:checked\s*\+\s*\.product-option-card-ui/);
  assert.match(css, /color:var\(--ui-gold-strong\)/);
  assert.match(css, /background:color-mix\(in srgb,var\(--ui-surface-2\) 92%,transparent\)/);
});

test('product option component stays scoped to its own component classes', () => {
  assert.match(css, /\.product-options-panel/);
  assert.match(css, /\.product-option-group/);
  assert.match(css, /\.product-option-card/);
});
