import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(process.cwd()+'/'+p,'utf8');
test('admin router resolves hash routes',()=>{
 const s=read('frontend/src/admin/router.js');
 assert.ok(s.includes("location.hash.startsWith('#/admin/')"));
 assert.ok(s.includes("const page=hashPage||pathPage||'dashboard'"));
});
test('every sidebar route has an admin router loader',()=>{
 const sidebar=read('frontend/src/admin/components/Sidebar.js');
 const router=read('frontend/src/admin/router.js');
 const routes=['dashboard','products','categories','orders','site-rules','customers','inventory','payments','discounts','coupons','reviews','rewards','notifications','reports','access-control','audit','settings','invoice-settings','sms','payment','visitors','storefront-snapshot','support','about','contact','news','articles'];
 for(const route of routes){
  assert.ok(sidebar.includes("['"+route+"',"),route+' missing from sidebar');
  assert.ok(router.includes(route+':'),route+' missing from router');
 }
});
test('admin navigation selectors are correctly scoped',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.admin-layout .admin-nav-group a:hover .admin-nav-icon'));
 assert.ok(css.includes('.admin-layout .admin-nav-group a.active .admin-nav-icon'));
 assert.ok(!css.includes('a:hover .admin-layout .admin-nav-icon'));
});
