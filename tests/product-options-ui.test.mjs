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
  assert.match(optionRenderer, /name=/);
  assert.match(optionRenderer, /value=/);
  assert.match(optionRenderer, /escapeHtml\(o\.id\)/);
  assert.match(optionRenderer, /role=/);
  assert.match(optionRenderer, /radiogroup/);
  assert.match(optionRenderer, /product-option-default/);
});

test('product option labels do not render price deltas beside option names', () => {
  assert.doesNotMatch(optionRenderer, /product-option-price|deltaLabel|قیمت پایه/);
  assert.match(app, /const recalc=/);
  assert.match(app, /product-price-breakdown/);
});

test('each attribute group occupies its own row while its options scroll horizontally', () => {
  assert.match(css, /\.product-options\{display:grid;grid-template-columns:minmax\(0,1fr\);gap:0\.625rem\}/);
  assert.doesNotMatch(css, /\.product-options\{display:grid;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
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


test('light theme keeps clear borders and a persistent selected option highlight', () => {
  assert.match(css, /:root\[data-theme="light"\] \.product-option-card-ui\{[^}]*border:1px solid #C8BDAA/s);
  assert.match(css, /:root\[data-theme="light"\] \.product-option-input:checked \+ \.product-option-card-ui/);
  assert.match(css, /border:2px solid #9B742D/);
  assert.match(css, /background:#F4E8CE/);
  assert.match(css, /:root\[data-theme="light"\] \.product-option-card\.selected \.product-option-card-ui/);
});


test('final selected product price is visually larger on desktop, tablet, and mobile', () => {
  assert.match(css, /#product-live-price\.product-live-price\{[^}]*font-size:clamp\(1\.875rem,3vw,2\.375rem\)/s);
  assert.match(css, /@media\(min-width:621px\) and \(max-width:1024px\)\{\s*#product-live-price\.product-live-price\{font-size:2\.125rem\}/);
  assert.match(css, /@media\(max-width:620px\)\{\s*#product-live-price\.product-live-price\{font-size:1\.875rem/);
});

test('product page hides the price delta breakdown and redundant purchase disclaimer', () => {
  assert.match(app, /id="product-price-breakdown" hidden/);
  assert.doesNotMatch(app, /تغییر ویژگی‌ها<\/span>/);
  assert.match(app, /class="product-purchase-messages" id="product-purchase-messages" hidden/);
  assert.doesNotMatch(app, /اطلاعات سفارش و قیمت نهایی بر اساس انتخاب ویژگی‌ها و موجودی واقعی محصول محاسبه می‌شود/);
  assert.match(css, /#product-price-breakdown\[hidden\]\{display:none!important\}/);
});

test('stock messaging never reveals exact inventory above three and highlights low stock', () => {
  assert.match(app, /stock<=3\)stockEl\.innerHTML=.*product-stock-remaining/s);
  assert.match(app, /تنها '\+fa\(stock\)\+' عدد در انبار باقی مانده است/);
  assert.match(app, /موجودی: بیش از <strong>۳<\\/strong> عدد/);
  assert.match(css, /\.product-stock-remaining\{[^}]*border:1px solid/s);
  assert.match(css, /\.product-stock-fire\{[^}]*font-size:1\.125rem/s);
});

test('light theme quantity discount panel has a refined border without changing dark theme', () => {
  assert.match(css, /:root\[data-theme="light"\] \.quantity-discount-card\{[^}]*border:1px solid #C6A96B/s);
  assert.doesNotMatch(css, /:root\[data-theme="dark"\] \.quantity-discount-card\{/);
});


test('final price is prominent on desktop, tablet, and mobile in both themes', () => {
  assert.match(css, /#product-live-price\.product-live-price\{[^}]*font-size:clamp\(1\.875rem,3vw,2\.375rem\)/s);
  assert.match(css, /@media\(min-width:621px\) and \(max-width:1024px\)\{\s*#product-live-price\.product-live-price\{font-size:2\.125rem\}/);
  assert.match(css, /@media\(max-width:620px\)\{\s*#product-live-price\.product-live-price\{font-size:1\.875rem/);
  assert.doesNotMatch(css, /:root\[data-theme="dark"\] #product-live-price/);
  assert.doesNotMatch(css, /:root\[data-theme="light"\] #product-live-price/);
});
