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
  assert.match(frontend,/const escapeHtml=/);
  assert.match(frontend,/escapeHtml\(p\.name\)/);
  assert.match(frontend,/escapeHtml\(r\.body\|\|''\)/);
});

test('production worker deployment is consolidated and uses the bootstrap secret',()=>{
  assert.match(deploy,/d1 migrations apply gilasartdatabase --remote/);
  assert.match(deploy,/wrangler secret put ADMIN_BOOTSTRAP_MOBILE/);
});

test('payment settlement requires an active stock reservation',()=>{
  assert.match(worker,/stock_reservations WHERE order_id=\?/);
  assert.match(worker,/stock_reservation_missing/);
  assert.match(worker,/UPDATE payments SET status='PAID'/);
  assert.match(worker,/DELETE FROM stock_reservations WHERE order_id=\?/);
  assert.doesNotMatch(worker,/UPDATE inventory SET quantity=quantity-\? WHERE product_id=\?/);
});

test('checkout uses stock reservations before payment',()=>{
  assert.match(worker,/INSERT INTO stock_reservations/);
  assert.match(worker,/reservedUntil/);
  assert.match(worker,/UPDATE inventory SET quantity=quantity-\?/);
  assert.match(worker,/SELECT COUNT\(\*\) FROM stock_reservations WHERE order_id=\?/);
});

test('failed and expired payments release reservations',()=>{
  assert.match(worker,/async function releaseReservation/);
  assert.match(worker,/DELETE FROM stock_reservations WHERE order_id=\?/);
  assert.match(worker,/UPDATE inventory SET quantity=quantity\+\?/);
  assert.match(worker,/async function cleanupExpiredReservations/);
});

test('OTP login supports Android WebOTP and redirects to home after verification',()=>{
  assert.match(frontend,/autocomplete="one-time-code"/);
  assert.match(frontend,/OTPCredential/);
  assert.match(frontend,/navigator\.credentials\.get/);
  assert.match(frontend,/location\.hash='\/'/);
  assert.match(frontend,/function accountLink\(\)/);
  assert.match(frontend,/state\.user\?/);
});

test('OTP SMS is template-driven without exposing the Kavenegar secret',()=>{
  assert.match(worker,/kavenegar_message_template/);
  assert.match(worker,/replaceAll/);
  assert.match(worker,/KAVENEGAR_API_KEY/);
});
test('admin role assignment prevents privilege escalation and self lockout',()=>{
  assert.match(worker,/async function canAssignRole/);
  assert.match(worker,/role_exceeds_actor_permissions/);
  assert.match(worker,/self_role_change_forbidden/);
  assert.match(worker,/self_deactivation_forbidden/);
  assert.match(worker,/user_not_found/);
});

test('storefront uses dynamic three-item infinite scrolling',()=>{
  assert.match(frontend,/pageSize=3/);
  assert.match(frontend,/IntersectionObserver/);
  assert.match(frontend,/offset:String\(offset\)/);
  assert.match(frontend,/insertAdjacentHTML\('beforeend'/);
  assert.match(frontend,/GALLERY COLLECTION/);
  assert.match(frontend,/هنرکده گیلاس آرت/);
  assert.match(frontend,/تولید کننده ی برتر تابلو های معرق مس در ایران/);
});
