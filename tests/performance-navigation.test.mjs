import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';

const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const build=readFileSync(new URL('../scripts/build-frontend.mjs',import.meta.url),'utf8');
const sw=readFileSync(new URL('../frontend/public/sw.js',import.meta.url),'utf8');
const index=JSON.parse(readFileSync(new URL('../frontend/public/data/storefront-index.json',import.meta.url),'utf8'));
const manifest=JSON.parse(readFileSync(new URL('../frontend/public/data/storefront-manifest.json',import.meta.url),'utf8'));
const home=JSON.parse(readFileSync(new URL('../frontend/public/data/home.json',import.meta.url),'utf8'));

test('split storefront snapshot is lightweight and versioned',()=>{
 assert.equal(index.schemaVersion,2);
 assert.equal(manifest.schemaVersion,2);
 assert.equal(home.schemaVersion,2);
 assert.ok(Array.isArray(index.products)&&index.products.length>0);
 assert.ok(index.products.every(p=>p.id&&p.slug&&p.name&&p.sku&&p.image&&Array.isArray(p.category_ids)));
 assert.ok(statSync(new URL('../frontend/public/data/storefront-index.json',import.meta.url)).size<250000);
 assert.ok(!requireLegacySnapshot());
});

test('SPA router reuses shell and cancels stale route GETs',()=>{
 assert.match(app,/existingMain&&existingHeader&&existingFooter/);
 assert.match(app,/new AbortController\(\)/);
 assert.match(app,/fetchOptions\.signal=routeAbortController\.signal/);
 assert.match(app,/Date\.now\(\)-state\.meLoadedAt<30000/);
 assert.match(app,/storefront-index\.json\?v=/);
});

test('production build minifies JS and CSS and service worker caches shell first',()=>{
 assert.match(build,/from 'esbuild'/);
 assert.match(build,/minify:true/);
 assert.match(sw,/function cacheFirst/);
 assert.match(sw,/if\(req\.mode==='navigate'\)/);
 assert.match(sw,/storefront-index/);
 assert.match(sw,/networkFirst\(req,true\)/);
});

function requireLegacySnapshot(){
 try{readFileSync(new URL('../frontend/public/data/storefront.json',import.meta.url));return true}catch{return false}
}
