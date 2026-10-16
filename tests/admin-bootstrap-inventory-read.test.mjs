import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const start=worker.indexOf('async function ensureAdminBootstrap');
const end=worker.indexOf('\nasync function rate(',start);
const bootstrap=worker.slice(start,end);

test('ready admin bootstrap marker is checked before catalog-wide inventory backfill',()=>{
 const marker=bootstrap.indexOf("const marker=await env.DB.prepare(\"SELECT value FROM site_settings WHERE key='admin_bootstrap_v1' LIMIT 1\")");
 const ready=bootstrap.indexOf("if(marker?.value==='ready') return true;");
 const backfill=bootstrap.indexOf('INSERT OR IGNORE INTO inventory(product_id,quantity,updated_at) SELECT p.id,200');
 assert.notEqual(marker,-1);
 assert.notEqual(ready,-1);
 assert.notEqual(backfill,-1);
 assert.ok(marker<ready&&ready<backfill,'the ready marker must return before the expensive inventory backfill');
});
