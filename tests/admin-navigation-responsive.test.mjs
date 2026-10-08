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
  assert.ok(router.includes(route),route+' missing from router');
 }
});
test('admin navigation selectors are correctly scoped',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.admin-layout .admin-nav-group a:hover .admin-nav-icon'));
 assert.ok(css.includes('.admin-layout .admin-nav-group a.active .admin-nav-icon'));
 assert.ok(!css.includes('a:hover .admin-layout .admin-nav-icon'));
});

test('admin mobile drawer has one authoritative responsive contract',()=>{
 const css=read('frontend/src/styles.css');
 const final=css.indexOf('ADMIN MOBILE DRAWER — FINAL AUTHORITY');
 assert.ok(final>0,'final admin drawer contract missing');
 assert.equal((css.match(/\.admin-layout \.admin-sidebar\[id="admin-mobile-drawer"\]\{\s*display:flex!important/g)||[]).length,1,'duplicate drawer display contracts remain');
 assert.ok(!css.includes('background:#101013!important'),'legacy hard-coded admin drawer background remains');
 assert.ok(!css.includes('color:#f7f3eb!important'),'legacy hard-coded admin drawer text color remains');
});
test('admin mobile drawer accessibility state is synchronized',()=>{
 const js=read('frontend/src/admin/AdminApp.js');
 assert.ok(js.includes("o.setAttribute('aria-hidden','false')"));
 assert.ok(js.includes("o.setAttribute('aria-hidden','true')"));
 assert.ok(js.includes("b.setAttribute('aria-label','بستن منوی مدیریت')"));
});

test('shop responsive contract is scoped and unified',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.shop-page .product-stream{display:grid'));
 assert.ok(css.includes('.shop-page .shop-control-panel{max-height:min(62vh,520px)'));
 assert.ok(css.includes('.shop-page .filter-chip'));
 assert.ok(css.includes('@media (min-width:1024px)'));
 assert.ok(css.includes('@media (min-width:768px) and (max-width:1023px)'));
 assert.ok(css.includes('@media (max-width:767px)'));
 assert.ok(css.includes('@media (max-width:359px)'));
 assert.ok(!css.includes('@media (max-width:380px)'));
 const legacy=read('frontend/src/styles.css');
 assert.ok(!legacy.includes('/* Shop search control — keep the search trigger'));
 assert.ok(!legacy.includes('/* Shop gallery — visual-first responsive sizing'));
});
