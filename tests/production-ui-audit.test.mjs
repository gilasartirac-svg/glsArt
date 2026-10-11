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
 assert.ok(css.includes('.route-error-state{text-align:center;padding:3rem 1.25rem}'));
});

test('public/admin theme architecture remains token-based at key shared controls',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes(':root{'));
 assert.ok(css.includes(':root[data-theme="dark"]'));
 assert.equal((css.match(/:root\[data-theme="dark"\]\{/g)||[]).length,1);
 assert.ok(css.includes('--ui-bg:'));
 assert.ok(css.includes('--ui-surface:'));
 assert.ok(css.includes('--ui-text:'));
 assert.ok(css.includes('.admin-layout .admin-nav-group a'));
 assert.ok(css.includes('.ga-header-theme-toggle{')); assert.ok(css.includes('.ga-header-primary-nav#main-menu.is-open'));
});


test('mobile storefront header and menu provide contextual icons without changing desktop nav semantics',()=>{
 const js=read('frontend/src/app.js');
 for(const key of ['shop','about','contact','news','articles','rewards']) assert.ok(js.includes('data-menu-icon="'+key+'"'),key+' menu icon marker missing');
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.ga-header-primary-nav .ga-header-nav-item[data-menu-icon="shop"]::before'));
 assert.ok(css.includes('.ga-header-primary-nav#main-menu.is-open'));
 assert.ok(css.includes('overscroll-behavior:contain'));
 assert.ok(css.includes('env(safe-area-inset-bottom'));
 assert.ok(js.includes("e.target?.closest?.('.ga-header-menu-toggle,.mobile-menu-toggle')"),'outside-click handler must not intercept the actual header toggle');
 assert.ok(js.includes("window.addEventListener('resize',()=>{if(window.innerWidth>1023&&document.querySelector('#main-menu.is-open'))window.GilasArtMobileMenu?.close()"),'desktop resize must release the mobile navigation overlay');
});


test('final public responsive contract covers desktop tablet mobile and narrow-phone storefront states',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('Final production UI contract — public storefront'));
 assert.ok(css.includes('@media (min-width:1024px)'));
 assert.ok(css.includes('@media (min-width:768px) and (max-width:1023px)'));
 assert.ok(css.includes('@media (max-width:767px)'));
 assert.ok(css.includes('@media (max-width:359px)'));
 assert.ok(!css.includes('@media (max-width:380px)'));
 assert.ok(css.includes('.shop-page .product-stream'));
 assert.ok(css.includes('env(safe-area-inset-bottom'));
 assert.ok(css.includes('prefers-reduced-motion:reduce'));
 assert.ok(css.includes('focus-visible'));
});


test('admin stylesheet lifecycle is isolated from public route rendering',()=>{
 const js=read('frontend/src/app.js');
 assert.ok(js.includes('document.querySelectorAll(\'link[data-gilasart-admin-css]\').forEach(link=>link.remove())'));
 assert.ok(js.includes('function isCurrentAdminRoute()'));
 assert.ok(js.includes('if(!isCurrentAdminRoute())'));
 assert.ok(js.includes('stale async admin render re-injects admin CSS into the public storefront')===false);
});
 
test('public home route cleans admin stylesheet state before rendering',()=>{
 const js=read('frontend/src/app.js');
 const cleanupIndex=js.indexOf("if(p[0]!=='admin')cleanupAdminStyles();");
 const homeIndex=js.indexOf('if(!p[0])return home();');
 assert.ok(cleanupIndex>=0,'public-route admin cleanup is missing');
 assert.ok(homeIndex>cleanupIndex,'Home route can return before admin cleanup');
});
 
test('storefront header uses an isolated component namespace',()=>{
 const js=read('frontend/src/app.js');
 const css=read('frontend/src/styles.css');
 for(const cls of [
  'ga-header-shell','ga-header-container','ga-header-brand','ga-header-brand-name',
  'ga-header-primary-nav','ga-header-nav-item','ga-header-actions',
  'ga-header-theme-toggle','ga-header-cart','ga-header-cart-link','ga-header-cart-count',
  'ga-header-rewards','ga-header-account','ga-header-menu-toggle'
 ]) assert.ok(js.includes(cls)||css.includes('.'+cls),cls+' missing');
 assert.ok(js.includes('class="ga-header-shell"'));
 assert.ok(js.includes('class="ga-header-primary-nav"'));
 assert.ok(css.includes('.ga-header-shell{'));
 assert.ok(css.includes('.ga-header-primary-nav{'));
 assert.ok(css.includes('.ga-header-menu-toggle{'));
 assert.ok(!js.includes('class="top"'));
 assert.ok(!js.includes('class="wrap nav"'));
 assert.ok(!js.includes('class="brand"'));
 assert.ok(!js.includes('class="links"'));
});


test('header responsive ownership stays namespaced',()=>{
 const css=read('frontend/src/styles.css');
 const responsive=read('frontend/src/styles.css');
 assert.ok(css.includes('.ga-header-shell{'));
 assert.ok(css.includes('.ga-header-primary-nav#main-menu'));
 assert.ok(css.includes('@media(max-width:1023px)'));
 assert.ok(css.includes('@media(max-width:520px)'));
 assert.ok(!responsive.includes('.top .wrap.nav'));
 assert.ok(!responsive.includes('.top .header-actions'));
 assert.ok(!responsive.includes('.top .mobile-menu-toggle'));
});

test('shop production grid is deterministic across desktop tablet mobile and narrow phone',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.shop-page .product-stream{'));
 assert.ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))'));
 assert.ok(css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'));
 assert.ok(css.includes('grid-template-columns:1fr'));
 assert.ok(css.includes('.shop-page .product-art-frame{'));
 assert.ok(css.includes('aspect-ratio:1 / 1'));
 assert.ok(css.includes('object-fit:contain'));
 assert.ok(css.includes('-webkit-line-clamp:2'));
 assert.ok(css.includes('.shop-page .product-card-body{'));
 assert.ok(css.includes('.shop-page .product-card-footer{'));
 assert.ok(css.includes('margin-top:auto'));
 assert.ok(css.includes('.shop-page .shop-control-bar{'));
});


test('product cards display prices in تومان without changing stored rial fields',()=>{
 const js=read('frontend/src/app.js');
 assert.ok(js.includes('const shownIrt=hasFlashPrice?Number(p.flash_sale_price_irt):Number(p.price_irt||0);'));
 assert.ok(js.includes('Math.round(shownIrt/10)'));
 assert.ok(js.includes("t('product.toman')"));
 assert.ok(!js.includes("t('product.rial')</small></strong>"));
});


test('virtual gallery link uses native navigation to its standalone static entry page',()=>{
 const js=read('frontend/src/app.js');
 const html=read('frontend/public/virtual-gallery/index.html');
 const clickStart=js.indexOf("document.addEventListener('click',e=>{",js.indexOf('async function router()'));
 const clickEnd=js.indexOf("},{capture:true});",clickStart);
 const handler=js.slice(clickStart,clickEnd);
 const bypass=handler.indexOf("u.pathname.replace(/\\/+$/,'')||'/')==='/virtual-gallery'");
 const pathIndex=handler.indexOf(' const path=',bypass);
 const prevent=handler.lastIndexOf('e.preventDefault();',pathIndex);
 assert.ok(bypass>=0,'gallery route must bypass SPA interception');
 assert.ok(prevent>bypass,'gallery native navigation guard must run before SPA preventDefault');
 assert.ok(html.includes('<main id="gallery-app">'),'standalone gallery entry page is present');
 assert.ok(html.includes('id="enter-gallery"'),'gallery entry control is present');
 assert.ok(html.includes('type="module" src="./gallery.js'),'gallery runtime module is linked');
});


test('homepage product cards have dedicated mobile and tablet responsive layouts',()=>{
 const css=read('frontend/src/styles.css');
 const js=read('frontend/src/app.js');
 assert.ok(js.includes("const latestSection='<section class=\"wrap section home-latest\""));
 assert.ok(js.includes("state.products.slice(0,8).map(productCard).join('')"));
 assert.ok(css.includes('.home-latest .product-card-link{'));
 assert.ok(css.includes('grid-template-columns:minmax(0,1fr);'));
 assert.ok(css.includes('grid-template-columns:minmax(108px,34%) minmax(0,1fr);'));
 assert.ok(css.includes('@media (min-width:768px) and (max-width:1023px)'));
 assert.ok(css.includes('@media (max-width:359px)'));
 assert.ok(css.includes('.home-latest .product-card:focus-within'));
 assert.ok(css.includes('object-fit:contain!important'));
});


test('homepage mobile product cards prioritize readable title and price without changing shop cards',()=>{
 const css=read('frontend/src/styles.css');
 const marker='Homepage mobile readability fix — intentionally does not affect Shop or desktop.';
 const i=css.lastIndexOf(marker);
 assert.ok(i>=0,'homepage-only mobile readability patch is missing');
 const mobile=css.slice(i);
 assert.ok(mobile.includes('@media (max-width:767px)'));
 assert.ok(mobile.includes('.home-latest .product-card-link{\n    display:flex;\n    flex-direction:column;'));
 assert.ok(mobile.includes('font-size:1.0625rem!important;'));
 assert.ok(mobile.includes('font-size:clamp(1.25rem,5.4vw,1.5rem)!important;'));
 assert.ok(mobile.includes('.home-latest .product-sku{display:none}'));
 assert.ok(!mobile.includes('.shop-page .product-card'));
});


test('homepage mobile product card does not reserve an empty second grid column',()=>{
 const css=read('frontend/src/styles.css');
 const marker='Final mobile fix: product card itself must not reserve a phantom second grid column.';
 const i=css.lastIndexOf(marker);
 assert.ok(i>=0,'mobile card grid fix is missing');
 const mobile=css.slice(i);
 assert.ok(mobile.includes('@media (max-width:767px)'));
 assert.ok(mobile.includes('.home-latest .product-card{\n    display:block!important;'));
 assert.ok(mobile.includes('grid-template-columns:minmax(0,1fr)!important;'));
 assert.ok(mobile.includes('.home-latest .product-card-link{\n    display:flex!important;'));
});


test('desktop Shop results span the workspace after the legacy filter sidebar was removed',()=>{
 const css=read('frontend/src/styles.css');
 assert.ok(css.includes('.shop-page .gallery-workspace{display:block!important;'));
 assert.ok(css.includes('.shop-page .gallery-results{'));
 assert.ok(css.includes('grid-template-columns:repeat(3,minmax(0,1fr))!important'));
});
