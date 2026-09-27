import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const worker=await readFile(new URL('../worker/src/index.js',import.meta.url),'utf8');
const frontend=await readFile(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const deploy=await readFile(new URL('../.github/workflows/worker-deploy.yml',import.meta.url),'utf8');

test('worker has no hard-coded admin mobile or OTP fallback secret',()=>{
  assert.doesNotMatch(worker,/09153090907/);
  assert.doesNotMatch(worker,/OTP_PEPPER\s*\|\|/);
  assert.match(worker,/ADMIN_BOOTSTRAP_MOBILE/);
});

test('frontend does not use a hard-coded admin mobile and escapes dynamic HTML',()=>{
  assert.doesNotMatch(frontend,/09153090907/);
  assert.match(frontend,/function isAdminUser\(\)\{return state\.roles/);
  assert.match(frontend,/function escapeHtml/);
  assert.match(frontend,/escapeHtml\(p\.name\)/);
  assert.match(frontend,/escapeHtml\(r\.body\|\|''\)/);
});

test('production worker deployment is consolidated and uses the bootstrap secret',()=>{
  assert.match(deploy,/d1 migrations apply gilasartdatabase --remote --yes/);
  assert.match(deploy,/wrangler secret put ADMIN_BOOTSTRAP_MOBILE/);
});


test('payment settlement guards stock before marking payment paid',()=>{
  const paymentPos=worker.indexOf("UPDATE payments SET status='PAID'");
  const inventoryPos=worker.indexOf("UPDATE inventory SET quantity=quantity-?");
  assert.ok(paymentPos>0 && inventoryPos>paymentPos);
  const settlement=worker.slice(paymentPos,inventoryPos+500);
  assert.match(settlement,/NOT EXISTS \(SELECT 1 FROM order_items oi LEFT JOIN inventory inv/);
  assert.match(settlement,/inv\.quantity<oi\.quantity/);
  assert.match(settlement,/quantity>=\?/);
});
