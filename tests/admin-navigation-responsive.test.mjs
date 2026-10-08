import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(process.cwd()+'/'+p,'utf8');
test('admin router resolves hash routes',()=>{
 const s=read('frontend/src/admin/router.js');
 assert.match(s,/location\\.hash\\.startsWith\\('#\\/admin\\/'\\)/);
 assert.match(s,/const page=hashPage\\|\\|pathPage\\|\\|'dashboard'/);
});
test('every sidebar route has an admin router loader',()=>{
 const sidebar=read('frontend/src/admin/components/Sidebar.js');
 const router=read('frontend/src/admin/router.js');
 const routes=[...sidebar.matchAll(/\\['([^']+)'\\s*,/g)].map(m=>m[1]);
 for(const route of routes) assert.ok(router.includes(route+':'),route);
});
test('admin navigation selectors are correctly scoped',()=>{
 const css=read('frontend/src/styles.css');
 assert.match(css,/\\.admin-layout \\.admin-nav-group a:hover \\.admin-nav-icon/);
 assert.match(css,/\\.admin-layout \\.admin-nav-group a\\.active \\.admin-nav-icon/);
 assert.doesNotMatch(css,/a:hover \\.admin-layout \\.admin-nav-icon/);
});
test('responsive admin shell has explicit mobile ownership',()=>{
 const css=read('frontend/src/styles.css');
 assert.match(css,/\\.admin-layout>aside\\{display:block;width:0;min-width:0;flex:0 0 0\\}/);
 assert.match(css,/\\.admin-layout \\.admin-sidebar\\{width:min\\(86vw,320px\\)/);
});