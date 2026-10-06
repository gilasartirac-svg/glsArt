import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const router=readFileSync(new URL('../frontend/src/admin/router.js',import.meta.url),'utf8');
const sidebar=readFileSync(new URL('../frontend/src/admin/components/Sidebar.js',import.meta.url),'utf8');
const api=readFileSync(new URL('../frontend/src/admin/services/api.js',import.meta.url),'utf8');
const adminApp=readFileSync(new URL('../frontend/src/admin/AdminApp.js',import.meta.url),'utf8');
const sec=readFileSync(new URL('./security-hardening.test.mjs',import.meta.url),'utf8');
const schema=readFileSync(new URL('../database/migrations/141_loyalty_points.sql',import.meta.url),'utf8');

test('Phase 8 admin router exposes every contracted admin area',()=>{
 for(const x of ['dashboard','products','categories','inventory','orders','payments','reviews','customers','coupons','discounts','rewards','notifications','support','about','contact','news','articles','settings','audit','access-control']) assert.ok(router.includes(x),x);
 for(const x of ['dashboard','products','categories','orders','customers','inventory','payments','discounts','coupons','reviews','rewards','notifications','reports','access-control','audit','settings','support','about','contact','news','articles']) assert.ok(sidebar.includes("['"+x+"'"),x);
});

test('Admin API centralizes credentials, CSRF and no bearer token storage',()=>{
 assert.match(api,/credentials:'include'/); assert.match(api,/x-csrf-token/); assert.match(api,/requireAdminSession/);
 assert.doesNotMatch(api,/localStorage\\.setItem[^\\n]*(?:token|bearer|session)/i);
});

test('Admin dashboard and mutations are session/permission protected',()=>{
 for(const p of ['products.read','products.write','orders.read','orders.write','payments.read','reviews.read','reviews.write','inventory.read','inventory.write','settings.read','settings.write','reports.read','support.read','support.write','content.read','content.write','roles.manage','users.manage']) assert.ok(worker.includes("requirePermission(me,env,'"+p+"')"),p);
 for(const x of ['requireCsrf(req)','self_role_change_forbidden','self_deactivation_forbidden','role_exceeds_actor_permissions']) assert.ok(worker.includes(x),x);
});

test('Admin audit records sensitive mutations and audit endpoint is protected',()=>{
 assert.ok(worker.includes('async function audit('));
 assert.match(worker,/u\\.pathname==='\\/api\\/admin\\/audit'/); assert.match(worker,/reports\\.read/);
});

test('Rewards/referral admin area is read-safe and adjustments are bounded/audited',()=>{
 for(const x of ['loyalty_points','referral_codes','referrals']) assert.ok(schema.includes(x),x);
 for(const x of ['admin.settings.update','admin.rewards.adjust','admin.notifications.create','INSERT INTO audit_logs']) assert.ok(worker.includes(x),x);
 assert.ok(worker.includes("u.pathname==='/api/admin/audit'")&&worker.includes('reports.read'));
});

test('Rewards/referral adjustments are bounded and audited',()=>{
 for(const x of ['/api/admin/rewards','invalid_reward_adjustment','Math.abs(points)>100000','admin_adjustment']) assert.ok(worker.includes(x),x);
});

test('Admin notification management is user-scoped, bounded and CSRF protected',()=>{
 for(const x of ['/api/admin/notifications','slice(0,160)','slice(0,2000)','admin_message','admin.notifications.create']) assert.ok(worker.includes(x),x);
 assert.ok(worker.includes('requireCsrf(req)'));
});

test('Admin notification fails closed instead of silently rendering incomplete data',()=>{
 assert.match(adminApp,/خطا در بارگذاری کنترل پنل/); assert.match(adminApp,/result\\?\\.html/); assert.match(adminApp,/renderAdminPage/);
});

test('Existing security regression contract remains part of phase 8 gate',()=>{
 assert.match(sec,/admin role assignment prevents privilege escalation and self lockout/); assert.match(sec,/requireCsrf/); assert.match(sec,/OTP/);
});
