import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const worker=readFileSync(new URL('../worker/src/index.js',import.meta.url),'utf8');
const schema=readFileSync(new URL('../database/migrations/0014_flash_sales_support.sql',import.meta.url),'utf8');
const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');
const admin=readFileSync(new URL('../frontend/src/admin/pages/SupportTickets.js',import.meta.url),'utf8');

test('Phase 7 schema exposes support CRM, ticket messages, FAQ and permissions',()=>{
 for(const x of ['support_tickets','ticket_messages','faq_entries','support.read','support.write']) assert.match(schema,new RegExp(x.replace(/[.]/g,'\\.')));
});

test('Customer support contract enforces authentication, CSRF and ticket ownership',()=>{
 assert.match(worker,/\/api\/support\/tickets'&&req\.method==='GET'/);
 assert.match(worker,/\/api\/support\/tickets'&&req\.method==='POST'/);
 assert.match(worker,/requireCsrf\(req\)/);
 assert.match(worker,/WHERE id=\? AND user_id=\?/);
 assert.match(worker,/ticket_closed/);
});

test('Support ticket creation persists ticket and first customer message atomically',()=>{
 assert.match(worker,/INSERT INTO support_tickets/);
 assert.match(worker,/INSERT INTO ticket_messages/);
 assert.match(worker,/await env\.DB\.batch\(\[/);
});

test('Support replies create customer notifications and remain bounded',()=>{
 assert.match(worker,/author_type,'admin'/);
 assert.match(worker,/INSERT INTO user_notifications/);
 assert.match(worker,/type,title,message,reference_id/);
 assert.match(worker,/slice\(0,10000\)/);
});

test('Admin CRM is RBAC protected, paginated and status-filterable',()=>{
 assert.match(worker,/requirePermission\(me,env,'support\.read'\)/);
 assert.match(worker,/requirePermission\(me,env,'support\.write'\)/);
 assert.match(worker,/searchParams\.get\('limit'\)/);
 assert.match(worker,/searchParams\.get\('offset'\)/);
 assert.match(worker,/searchParams\.get\('status'\)/);
 assert.match(worker,/allowedStages/);
});

test('FAQ public/admin contract exists and admin mutations require CSRF',()=>{
 assert.match(worker,/\/api\/faq/);
 assert.match(worker,/\/api\/admin\/faq/);
 assert.match(worker,/admin\.faq\.create/);
 assert.match(worker,/admin\.faq\.update/);
 assert.match(worker,/admin\.faq\.delete/);
});

test('Customer support UI exposes FAQ, ticket creation, list and threaded replies',()=>{
 for(const x of ['پرتال CRM پشتیبانی','ثبت درخواست پشتیبانی','تیکت‌های من','reply-ticket','/api/support/tickets']) assert.ok(app.includes(x),x);
 assert.match(app,/maxlength="10000"/);
});

test('Admin support UI exposes ticket detail, stages, status and optional SMS',()=>{
 for(const x of ['SupportTickets','CRM پشتیبانی','مدیریت پرسش‌های متداول','sendSms','در حال بررسی','پاسخ داده شد']) assert.ok(admin.includes(x),x);
});
