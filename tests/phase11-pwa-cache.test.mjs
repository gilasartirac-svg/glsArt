import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const sw=await readFile('frontend/public/sw.js','utf8');
const build=await readFile('scripts/build-frontend.mjs','utf8');
const app=await readFile('frontend/src/app.js','utf8');
const manifest=await readFile('frontend/public/site.webmanifest','utf8');

test('phase 11: service worker uses release-versioned cache and removes old shell caches',()=>{
 assert.match(sw,/gilasart-shell-__GILASART_VERSION__/);
 assert.match(sw,/k\.startsWith\('gilasart-shell-'\)&&k!==CACHE/);
 assert.match(build,/replaceAll\('__GILASART_VERSION__',buildVersion\)/);
});

test('phase 11: navigation and JSON use network-first with offline cached fallback',()=>{
 assert.match(sw,/if\(req\.mode==='navigate'\)/);
 assert.match(sw,/networkFirst\(req,true\)/);
 assert.match(sw,/if\(\/\\\.json\$/i\.test\(url\.pathname\)\)/);
 assert.match(sw,/fetch\(req,\{cache:'no-store'\}\)/);
 assert.match(sw,/catch\(\)=>cachedFallback\?caches\.match\(req\):Response\.error\(\)/);
});

test('phase 11: service worker updates activate immediately and clients reload once',()=>{
 assert.match(sw,/self\.skipWaiting\(\)/);
 assert.match(app,/registerGilasArtServiceWorker/);
 assert.match(app,/controllerchange/);
 assert.match(app,/location\.reload\(\)/);
});

test('phase 11: locale is persisted and all four locale dictionaries are versioned',async()=>{
 assert.match(app,/gilasart_locale=/);
 assert.match(app,/Max-Age=31536000/);
 for(const locale of ['fa','en','tr','ar']){
  const d=JSON.parse(await readFile('frontend/public/i18n/'+locale+'.json','utf8'));
  assert.equal(d.version,1);
  assert.equal(d.locale,locale);
  assert.ok(d.strings&&Object.keys(d.strings).length>0);
 }
});

test('phase 11: release manifest drives web version comparison and native update links',()=>{
 assert.match(app,/mobile-release\.json/);
 assert.match(app,/GILASART_APP_VERSION/);
 assert.match(app,/d\.web\.version/);
 assert.match(app,/native\?\.available&&native\.url/);
 assert.match(app,/safeUrl\(release\.url\)/);
});

test('phase 11: PWA manifest is standalone and scoped to the deployed application',()=>{
 const m=JSON.parse(manifest);
 assert.equal(m.display,'standalone');
 assert.equal(m.scope,'./');
 assert.equal(m.start_url,'./');
 assert.equal(m.orientation,'portrait');
});