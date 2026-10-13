import { readFile, writeFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = 'frontend/public/data';
const indexPath = root + '/storefront-index.json';
const detailsPath = root + '/storefront-attributes.json';
const homePath = root + '/home.json';
const manifestPath = root + '/storefront-manifest.json';

const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const index = await readJson(indexPath);
if (Number(index?.schemaVersion) !== 2 || !Array.isArray(index.products) || !index.products.length) {
  throw new Error('Invalid existing offline storefront index; refusing to replace it.');
}

let details = { schemaVersion: 1, generatedAt: index.generatedAt || new Date().toISOString(), byProductId: {} };
try {
  const prior = await readJson(detailsPath);
  if (Number(prior?.schemaVersion) === 1 && prior.byProductId && typeof prior.byProductId === 'object') details = prior;
} catch {}

const byProductId = { ...details.byProductId };
let extracted = 0;
for (const product of index.products) {
  if (!product || product.id === undefined || product.id === null) throw new Error('Product missing id; refusing split.');
  const key = String(product.id);
  const hasInlineDetails = ['attributes', 'images', 'categories', 'reviews'].some(field => Array.isArray(product[field]));
  if (hasInlineDetails) {
    byProductId[key] = {
      attributes: Array.isArray(product.attributes) ? product.attributes : [],
      images: Array.isArray(product.images) ? product.images : [],
      categories: Array.isArray(product.categories) ? product.categories : [],
      reviews: Array.isArray(product.reviews) ? product.reviews : [],
      description: product.description || '',
      seo_title: product.seo_title || '',
      seo_description: product.seo_description || '',
      video_url: product.video_url || ''
    };
    extracted++;
  }
}
if (!Object.keys(byProductId).length) throw new Error('No product details found in either the current index or prior details file.');

const missing = index.products.filter(p => !byProductId[String(p.id)]);
if (missing.length) throw new Error('Missing linked product details: ' + missing.map(p => p.sku || p.id).join(', '));
details = {
  schemaVersion: 1,
  generatedAt: index.generatedAt || details.generatedAt || new Date().toISOString(),
  keyField: 'productId',
  byProductId
};

for (const product of index.products) {
  delete product.attributes;
  delete product.images;
  delete product.categories;
  delete product.reviews;
  delete product.description;
  delete product.seo_title;
  delete product.seo_description;
  delete product.video_url;
}
index.generatedAt = index.generatedAt || details.generatedAt;
await writeFile(indexPath, JSON.stringify(index) + '\n');
await writeFile(detailsPath, JSON.stringify(details) + '\n');

let home = null;
try { home = await readJson(homePath); } catch {}
if (home && Array.isArray(home.products)) {
  for (const product of home.products) {
    if (!product || product.id === undefined || product.id === null) continue;
    const linked = byProductId[String(product.id)];
    if (!linked) continue;
    product.attributes = linked.attributes;
    product.images = linked.images;
    product.categories = linked.categories;
    product.reviews = linked.reviews;
  }
  await writeFile(homePath, JSON.stringify(home) + '\n');
}

const bytes = {
  index: (await stat(indexPath)).size,
  attributes: (await stat(detailsPath)).size,
  home: (await stat(homePath)).size
};
if (bytes.index >= 250000) throw new Error('Product index still exceeds 250000-byte performance budget: ' + bytes.index);
const version = createHash('sha256').update(await readFile(indexPath)).update(await readFile(detailsPath)).update(home ? await readFile(homePath) : '').digest('hex').slice(0, 16);
const priorManifest = await readJson(manifestPath).catch(() => ({}));
const manifest = {
  ...priorManifest,
  schemaVersion: 2,
  version,
  generatedAt: index.generatedAt,
  productCount: index.products.length,
  attributesFile: 'storefront-attributes.json',
  detailProductCount: Object.keys(byProductId).length,
  indexBytes: bytes.index,
  attributesBytes: bytes.attributes,
  homeBytes: bytes.home
};
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

const finalIndex = await readJson(indexPath);
const finalDetails = await readJson(detailsPath);
if (finalIndex.products.some(p => ['attributes', 'images', 'categories', 'reviews'].some(k => k in p))) {
  throw new Error('Product index still embeds detail arrays.');
}
for (const p of finalIndex.products) {
  const linked = finalDetails.byProductId[String(p.id)];
  if (!linked || !Array.isArray(linked.attributes) || !Array.isArray(linked.images) || !Array.isArray(linked.categories) || !Array.isArray(linked.reviews)) {
    throw new Error('Broken product details key: ' + p.id);
  }
}
console.log(JSON.stringify({ products: finalIndex.products.length, extractedFromInline: extracted, bytes, version }, null, 2));
