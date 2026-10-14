import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../frontend/public/', import.meta.url);
const adapter = readFileSync(new URL('virtual-gallery/product-adapter.js', root), 'utf8');
const gallery = readFileSync(new URL('virtual-gallery/gallery.js', root), 'utf8');
const index = JSON.parse(readFileSync(new URL('data/storefront-index.json', root), 'utf8'));
const manifest = JSON.parse(readFileSync(new URL('data/storefront-manifest.json', root), 'utf8'));
const details = JSON.parse(readFileSync(new URL('data/storefront-attributes.json', root), 'utf8'));

test('virtual gallery reads the split offline product index and keyed attributes file', () => {
  assert.equal(index.schemaVersion, 2);
  assert.equal(details.schemaVersion, 1);
  assert.equal(details.keyField, 'productId');
  assert.equal(manifest.attributesFile, 'storefront-attributes.json');
  assert.ok(index.products.length > 0);
  assert.ok(index.products.every(product => !('attributes' in product) && !('description' in product)));
  assert.equal(index.products.length, Number(manifest.productCount));
  assert.ok(index.products.every(product => details.byProductId[String(product.id)]));
  assert.match(adapter, /storefront-manifest\.json/);
  assert.match(adapter, /manifest\?\.attributesFile/);
  assert.match(adapter, /detailSnapshot\.byProductId\[key\]/);
  assert.match(adapter, /attributes: Array\.isArray\(details\.attributes\)/);
});

test('virtual gallery uses offline attributes for cart options but retains server-side cart validation', () => {
  assert.match(gallery, /fallbackUrl: root \+ 'data\/storefront-index\.json'/);
  assert.match(gallery, /Array\.isArray\(product\.attributes\)/);
  assert.doesNotMatch(gallery, /request\('\/api\/products\/'/);
  assert.match(gallery, /request\('\/api\/cart'/);
  assert.match(gallery, /request\('\/api\/me'/);
});
