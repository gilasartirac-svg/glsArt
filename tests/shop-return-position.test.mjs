import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const app=readFileSync(new URL('../frontend/src/app.js',import.meta.url),'utf8');

test('shop return position is stored locally before leaving the product listing',()=>{
 assert.match(app,/const SHOP_RETURN_STATE_KEY='gilasart:shop-return-state:v1'/);
 assert.match(app,/function saveShopReturnState\(\)/);
 assert.match(app,/url:location\.pathname\+location\.search/);
 assert.match(app,/scrollY:Math\.max\(0,Math\.round\(window\.scrollY\|\|window\.pageYOffset\|\|0\)\)/);
 assert.match(app,/loadedCount:results\.querySelectorAll\('\.product-card'\)\.length/);
 assert.match(app,/if\(isShopRoute\(\)&&!isShopRoute\(targetPath\)\)saveShopReturnState\(\)/);
});

test('return restores enough products before restoring scroll and then clears the one-shot state',()=>{
 assert.match(app,/function getShopReturnState\(\)/);
 assert.match(app,/let pendingRestoreCount=savedReturnState\?Math\.max\(pageSize,Math\.ceil\(savedReturnState\.loadedCount\/pageSize\)\*pageSize\):null/);
 assert.match(app,/offset=Math\.min\(restoreCount===null\?pageSize:restoreCount,filteredItems\.length\)/);
 assert.match(app,/function restoreShopReturnPosition\(saved\)/);
 assert.match(app,/requestAnimationFrame\(\(\)=>requestAnimationFrame\(\(\)=>/);
 assert.match(app,/sessionStorage\.removeItem\(SHOP_RETURN_STATE_KEY\)/);
});

test('shop return is browser-local and does not add a backend route or database dependency',()=>{
 const helper=app.slice(app.indexOf('const SHOP_RETURN_STATE_KEY'),app.indexOf('function navigate'));
 assert.doesNotMatch(helper,/fetch\(|api\(|Cloudflare|worker\/src|d1-usage/i);
 assert.match(app,/window\.addEventListener\('popstate'/);
});
