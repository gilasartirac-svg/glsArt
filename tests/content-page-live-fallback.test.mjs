import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const start=app.indexOf('async function snapshotApi(path)');
const end=app.indexOf('\nasync function api(',start);
const fn=app.slice(start,end);

test('missing or invalid site-rules offline file falls back to live API',()=>{
 const rules=fn.indexOf("if(contentSection==='site-rules')");
 const fallback=fn.indexOf('return null;',rules);
 const catalog=fn.indexOf('const d=await loadStorefrontIndex()',rules);
 assert.notEqual(rules,-1);
 assert.ok(fallback>rules&&fallback<catalog);
 assert.match(fn,/independent offline file is absent or invalid/);
});

test('missing About and Contact snapshots never synthesize empty CMS content from catalog',()=>{
 const cms=fn.indexOf("if(['about','contact'].includes(contentSection))");
 const fallback=fn.indexOf('return null;',cms);
 const catalog=fn.indexOf('const d=await loadStorefrontIndex()',cms);
 assert.notEqual(cms,-1);
 assert.ok(fallback>cms&&fallback<catalog);
 assert.match(fn,/Missing About\/Contact snapshots must fall back to the CMS API/);
});

test('published independent snapshots remain preferred when valid',()=>{
 assert.match(fn,/page.section==='site-rules'&&page.item/);
 assert.match(fn,/page.section===contentSection&&Array.isArray\(page.items\)/);
 assert.match(fn,/dataRoot\(\)\+contentSection\+'\.json'/);
});
