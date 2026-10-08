import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>readFileSync(process.cwd()+'/'+p,'utf8');

test('storefront accessibility baseline does not block browser zoom',()=>{
 const html=read('frontend/src/index.html');
 assert.ok(!html.includes('maximum-scale=1'));
 assert.ok(!html.includes('user-scalable=no'));
 assert.ok(html.includes('viewport-fit=cover'));
});

test('global interaction guard preserves standard print and keyboard behavior',()=>{
 const js=read('frontend/src/app.js');
 assert.ok(!js.includes("['c','x','u','s','p']"));
 assert.ok(!js.includes("beforeprint"));
 assert.ok(js.includes("['u']"));
});

test('route recovery UI has no inline presentation styles',()=>{
 const js=read('frontend/src/app.js');
 assert.ok(js.includes('class="panel route-error-state"'));
 assert.ok(!js.includes('class="panel" style="text-align:center;padding:48px 20px"'));
 assert.ok(!js.includes('class="cart-checkout-bar" style="justify-content:center"'));
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.route-error-state{text-align:center;padding:48px 20px}'));
});

test('public/admin theme architecture remains token-based at key shared controls',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes(':root[data-theme="light"]'));
 assert.ok(css.includes(':root[data-theme="dark"]'));
 assert.ok(css.includes('--ui-bg:'));
 assert.ok(css.includes('--ui-surface:'));
 assert.ok(css.includes('--ui-text:'));
 assert.ok(css.includes('.admin-layout .admin-nav-group a'));
 assert.ok(css.includes('.top .theme-toggle'));
});
