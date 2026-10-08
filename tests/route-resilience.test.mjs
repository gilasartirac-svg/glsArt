import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const snapshotWorkflow=readFileSync(new URL('../.github/workflows/storefront-snapshot.yml',import.meta.url),'utf8');

test('public route contract is complete and Persian-only URLs stay unprefixed',()=>{
  for(const route of ['shop','cart','account','rewards','checkout','about','contact','news','articles','terms','support','payment','admin']){
    assert.ok(app.includes("p[0]==='"+route+"'"),route);
  }
  assert.ok(app.includes("return base+(parts.length?'/'+parts.join('/'):'')||'/';"));
});

test('content snapshot is eligible for API fallback and detail slugs are decoded safely',()=>{
  assert.match(app,/site-rules\|content/);
  assert.match(app,/String\(x\.slug\|\|'\'\)\.normalize\('NFC'\)/);
  assert.match(app,/encodeURIComponent\(section\).*encodeURIComponent\(slug\)/);
  assert.match(worker,/for\(let i=0;i<2;i\+\+\)/);
  assert.match(worker,/normalize\('NFC'\)/);
});

test('product detail distinguishes 404 from service failure and offers recovery',()=>{
  assert.match(app,/اثر پیدا نشد/);
  assert.match(app,/جزئیات اثر موقتاً در دسترس نیست/);
  assert.match(app,/id="product-retry"/);
  assert.match(app,/product_detail_backend_failed/);
});

test('public snapshot carries CMS fallback content for about/contact/news/articles',()=>{
  assert.match(snapshotWorkflow,/const publicContent=x=>/);
  assert.match(snapshotWorkflow,/const about=/);
  assert.match(snapshotWorkflow,/const contact=/);
  assert.match(snapshotWorkflow,/body:x\.body\|\|''/);
  assert.match(snapshotWorkflow,/index missing public content/);
});

test('legacy monolithic storefront snapshot is not restored',()=>{
  assert.doesNotMatch(app,/data\/storefront\.json/);
  assert.doesNotMatch(snapshotWorkflow,/writeFileSync\(['"]frontend\/public\/data\/storefront\.json/);
});
