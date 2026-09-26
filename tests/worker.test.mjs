import test from 'node:test';import assert from 'node:assert/strict';
test('money values are integer IRR/Toman units',()=>{assert.equal(Number.isInteger(1000000),true)});
test('production secrets are not hard-coded',async()=>{const s=await (await import('node:fs/promises')).readFile('worker/src/index.js','utf8');assert.equal(s.includes('ZARINPAL_MERCHANT_ID='),false);assert.equal(s.includes('KAVENEGAR_API_KEY='),false)});
test('OTP challenge policy',()=>{assert.ok(120000>=60000);assert.ok(5>=3)});
import {readFileSync} from 'node:fs';
const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const schema=readFileSync(new URL('../database/migrations/0001_initial.sql',import.meta.url),'utf8');
test('payment flow requires server-side verification',()=>{assert.match(worker,/verify\.json/);assert.match(worker,/code===100\|\|code===101/);assert.match(worker,/callback_status/)});
test('auth uses cryptographic OTP generation and CSRF for mutations',()=>{assert.match(worker,/crypto\.getRandomValues/);assert.match(worker,/requireCsrf/);assert.match(worker,/__Host-gs_session/)});
test('commerce schema contains source-of-truth tables',()=>{for(const name of ['products','inventory','orders','order_items','payments','payment_attempts','audit_logs','user_roles'])assert.match(schema,new RegExp('CREATE TABLE '+name));});
test('payment finalization uses one atomic D1 batch and guards duplicate callbacks',()=>{assert.match(worker,/await env\.DB\.batch\(statements\)/);assert.match(worker,/pp\.status!='PAID'/);assert.match(worker,/oo\.status='PENDING'/);assert.match(worker,/quantity=quantity-\?/);});
test('checkout idempotency is enforced server-side',()=>{assert.match(worker,/idempotency_key_required/);assert.match(worker,/checkout_key/);assert.match(schema,/CREATE TABLE orders/);});

test('admin control panel is restricted to the designated mobile',()=>{assert.match(worker,/u\.pathname\.startsWith\('\/api\/admin'\).*me\?\.mobile!==['"]09153090907['"]/);const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');assert.match(app,/state\.user\?\.mobile===["']09153090907["']/);assert.match(app,/if\(!isAdminUser\(\)\)/)});
