import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [script, markup, styles, adapter] = await Promise.all([
  readFile(new URL('../frontend/public/virtual-gallery/gallery.js', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/index.html', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/gallery.css', import.meta.url), 'utf8'),
  readFile(new URL('../frontend/public/virtual-gallery/product-adapter.js', import.meta.url), 'utf8')
]);

test('virtual gallery loads real storefront artwork images and product metadata', () => {
  assert.match(script, /storefront-index\.json/);
  assert.match(script, /new THREE\.TextureLoader\(\)\.load/);
  assert.match(adapter, /price_irt/);
  assert.match(adapter, /description:/);
});

test('clicking a framed artwork triggers a cinematic camera focus and product panel', () => {
  assert.match(script, /raycaster\.intersectObjects/);
  assert.match(script, /function focusArtwork\(/);
  assert.match(script, /duration: prefersReducedMotion \? 20 : 1250/);
  assert.match(markup, /id="artwork-panel"/);
  assert.match(markup, /id="artwork-panel-close"/);
  assert.match(markup, /id="artwork-panel-details"/);
  assert.match(styles, /\.artwork-panel\.is-open/);
  assert.match(styles, /@media\(max-width:650px\)/);
});

test('Three.js objects are initialized only after the module is loaded', () => {
  assert.match(script, /let moveVector, targetVector, forward, right, raycaster, pointerNdc/);
  assert.match(script, /let cameraTarget, cameraPosition;/);
  assert.doesNotMatch(script.slice(0, script.indexOf('async function enterGallery')), /const camera(?:Target|Position) = new THREE\.Vector3/);
  assert.match(script, /if \(!THREE\) THREE = await import\(THREE_MODULE_URL\);[\s\S]{0,250}if \(!cameraTarget\) \{[\s\S]{0,150}cameraPosition = new THREE\.Vector3/);
});

test('gallery products use an API-ready normalized contract with static JSON as current source', () => {
  assert.match(script, /import\(['"]\.\/product-adapter\.js['"]\)/);
  assert.match(adapter, /export function normalizeGalleryProduct/);
  assert.match(adapter, /id,\s*slug,\s*sku,/);
  assert.match(adapter, /price:\s*\{/);
  assert.match(adapter, /currency:/);
  assert.match(adapter, /availability:/);
  assert.match(adapter, /productsApiUrl/);
  assert.match(adapter, /fallbackUrl/);
  assert.match(adapter, /data\.products/);
});

test('add-to-cart button emits an integration intent without performing a real cart operation', () => {
  assert.match(markup, /id="artwork-panel-cart"/);
  assert.match(markup, /id="artwork-panel-cart-message"/);
  assert.match(markup, /aria-live="polite"/);
  assert.match(script, /gilasart:cart:add/);
  assert.match(script, /quantity: 1/);
  assert.match(script, /اتصال سبد خرید هنوز فعال نشده است/);
  assert.match(styles, /\.artwork-panel__cart/);
});
