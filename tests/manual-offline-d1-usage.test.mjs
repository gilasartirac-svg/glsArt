import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const workflow=read('.github/workflows/storefront-snapshot.yml');
const contentWorkflow=read('.github/workflows/content-pages-snapshot.yml');
const worker=read('worker/src/index.js');
const app=read('frontend/src/app.js');
const adminPage=read('frontend/src/admin/pages/D1Usage.js');
const router=read('frontend/src/admin/router.js');
const sidebar=read('frontend/src/admin/components/Sidebar.js');

test('offline snapshots run only through manual dispatch',()=>{
 assert.match(workflow,/workflow_dispatch:/);
 assert.doesNotMatch(workflow,/schedule:/);
 assert.doesNotMatch(workflow,/^\s+push:/m);
 assert.match(contentWorkflow,/workflow_dispatch:/);
 assert.doesNotMatch(contentWorkflow,/schedule:/);
});

test('site rules have a dedicated snapshot and do not depend on catalog JSON',()=>{
 assert.match(worker,/section==='site-rules'/);
 assert.match(contentWorkflow,/- site-rules/);
 assert.match(app,/dataRoot\(\)\+'site-rules\.json'/);
 assert.match(app,/u\.pathname==='\/api\/site-rules'\?'site-rules'/);
});

test('D1 usage page displays analytics-derived reads and remaining quota',()=>{
 assert.match(worker,/\/api\/admin\/d1-usage/);
 assert.match(worker,/d1QueriesAdaptive/);
 assert.match(worker,/rowsRead/);
 assert.match(adminPage,/d1-usage-read/);
 assert.match(adminPage,/d1-usage-remaining/);
 assert.match(adminPage,/CLOUDFLARE_API_TOKEN/);
 assert.match(router,/d1-usage/);
 assert.match(sidebar,/d1-usage/);
});
