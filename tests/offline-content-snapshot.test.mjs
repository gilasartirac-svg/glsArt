import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const worker=read('worker/src/index.js');
const app=read('frontend/src/app.js');
const page=read('frontend/src/admin/pages/StorefrontSnapshot.js');
const workflow=read('.github/workflows/content-pages-snapshot.yml');
const router=read('frontend/src/admin/router.js');
const adminApp=read('frontend/src/admin/AdminApp.js');

test('About and Contact have a D1 snapshot endpoint scoped to one CMS section',()=>{
 const start=worker.indexOf("u.pathname==='/api/content-snapshot'");
 assert.notEqual(start,-1);
 const route=worker.slice(start,worker.indexOf("if(u.pathname==='/api/storefront-snapshot'",start));
 assert.match(route,/\['about','contact'\]/);
 assert.match(route,/FROM cms_entries WHERE active=1 AND section=\?/);
 assert.doesNotMatch(route,/FROM products|product_images|product_attribute/);
});

test('content-only workflow writes and commits only the selected page JSON',()=>{
 assert.match(workflow,/workflow_dispatch:/);
 assert.match(workflow,/options:\s*\n\s*- about\s*\n\s*- contact/);
 assert.match(workflow,/SNAPSHOT_URL\\?section=\\$SECTION/);
 assert.match(workflow,/frontend\/public\/data\/\$SECTION\.json/);
 assert.doesNotMatch(workflow,/storefront-index\.json|home\.json|storefront-attributes\.json/);
});

test('About and Contact requests prefer their independent offline JSON without loading the catalog',()=>{
 const start=app.indexOf('async function snapshotApi(path)');
 const end=app.indexOf('\nasync function api(',start);
 const fn=app.slice(start,end);
 assert.match(fn,/dataRoot\(\)\+contentSection\+'\.json'/);
 assert.ok(fn.indexOf("fetch(dataRoot()+contentSection+'.json'")<fn.indexOf('const d=await loadStorefrontIndex()'));
 assert.match(fn,/contentPath\[2\]/);
 assert.match(fn,/contentPath\.slice\(3\)/);
});

test('publishing center exposes three independent controls and preserves the catalog workflow',()=>{
 assert.match(page,/id:'catalog'/);
 assert.match(page,/id:'about'/);
 assert.match(page,/id:'contact'/);
 assert.match(page,/JSON\.stringify\(\{scope\}\)/);
 assert.match(router,/StorefrontSnapshot\.js\?v=20261015-independent-pages/);
 assert.match(adminApp,/20261015-publishing-center/);
});

test('Worker dispatch routes only the selected section to the content workflow',()=>{
 const start=worker.indexOf("u.pathname==='/api/admin/storefront-snapshot/trigger'");
 const end=worker.indexOf("if(u.pathname.startsWith('/api/admin'))",start);
 const route=worker.slice(start,end);
 assert.match(route,/\['catalog','about','contact'\]/);
 assert.match(route,/scope==='catalog'\?'storefront-snapshot\.yml':'content-pages-snapshot\.yml'/);
 assert.match(route,/dispatch\.inputs=\{section:scope\}/);
});
