import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const root=process.cwd();
const read=p=>readFileSync(root+'/'+p,'utf8');

function topLevelRules(css){
  const out=[];
  let depth=0,quote='',comment=false,start=0;
  for(let i=0;i<css.length;i++){
    const ch=css[i], nx=css[i+1];
    if(comment){if(ch==='*'&&nx==='/'){comment=false;i++;}continue}
    if(quote){if(ch==='\\')i++;else if(ch===quote)quote='';continue}
    if(ch==='/'&&nx==='*'){comment=true;i++;continue}
    if(ch==='"'||ch==="'"){quote=ch;continue}
    if(ch==='{'){
      if(depth===0){let j=i-1;while(j>=0&&/\s/.test(css[j]))j--;let k=j;while(k>=0&&css[k]!=='}'&&css[k]!==';')k--;start=k+1;while(start<i&&/\s/.test(css[start]))start++}
      depth++;
    }else if(ch==='}'){
      depth--;
      if(depth===0)out.push(css.slice(start,i+1));
    }
  }
  return out;
}
function duplicateCount(css){
  const seen=new Set();let duplicates=0;
  for(const rule of topLevelRules(css)){if(seen.has(rule))duplicates++;else seen.add(rule)}
  return duplicates;
}

test('styles.css has no exact duplicate top-level rules',()=>{
  const css=read('frontend/src/styles.css');
  assert.equal(duplicateCount(css),0);
});
test('admin-ui.css has no exact duplicate top-level rules',()=>{
  const css=read('frontend/src/admin/admin-ui.css');
  assert.equal(duplicateCount(css),0);
});
test('legacy generic responsive block is removed from the shared stylesheet',()=>{
  const css=read('frontend/src/styles.css');
  assert.doesNotMatch(css,/\\@media\(max-width:900px\)\{\.grid\{grid-template-columns:repeat\(2,1fr\)\}/);
  assert.doesNotMatch(css,/\\@media\(max-width:520px\)\{\.grid\{grid-template-columns:1fr\}/);
});
test('canonical responsive contract owns the base viewport bands',()=>{
  const css=read('frontend/src/styles.css');
  for(const token of ['@media (min-width:1024px)','@media (min-width:768px) and (max-width:1023px)','@media (max-width:767px)','@media (max-width:359px)']){
    assert.match(css,new RegExp(token.replace(/[.*+?^$()|[\]\\]/g,'\\$&')));
  }
});
test('admin stylesheet keeps every component selector scoped to the control panel',()=>{
  const css=read('frontend/src/admin/admin-ui.css');
  for(const selector of ['.admin-product-modal-head','.admin-product-modal-foot','.products-admin-table-wrap','.faq-manager-body','.ticket-thread']){
    const re=new RegExp('(?:^|})\\s*'+selector.replace('.','\\.')+'\\b');
    assert.doesNotMatch(css,re,selector+' leaked without .admin-layout scope');
  }
});

test('public stylesheet keeps admin component selectors scoped',()=>{
  const css=read('frontend/src/styles.css');
  for(const selector of ['.admin-table','.admin-page','.admin-header','.admin-sidebar','.admin-nav-group']){
    const re=new RegExp('(?:^|})\\s*'+selector.replace('.','\\.')+'\\b');
    assert.doesNotMatch(css,re,selector+' leaked without .admin-layout scope');
  }
});


test('responsive-production.css is removed after responsive source merge',()=>{
  assert.equal(existsSync(root+'/frontend/src/responsive-production.css'),false);
});
test('storefront uses one canonical product card class',()=>{
  const css=read('frontend/src/styles.css');
  const js=read('frontend/src/app.js');
  assert.equal((css.match(/product-showcase/g)||[]).length,0);
  assert.equal((css.match(/product-item/g)||[]).length,0);
  assert.equal((js.match(/product-showcase/g)||[]).length,0);
  assert.equal((js.match(/product-item/g)||[]).length,0);
});
test('responsive typography and spacing tokens are defined in the canonical root token block',()=>{
  const css=read('frontend/src/styles.css');
  for(const token of ['--font-family-base:','--content-max:','--page-gutter:','--section-gap:','--control-min-height:']){
    assert.equal((css.match(new RegExp(token.replace(/[.*+?^$()|[\]\\]/g,'\\$&'),'g'))||[]).length,1,token+' must have one canonical definition');
  }
});



test('day and night palettes have one canonical token definition per theme',()=>{
  const css=read('frontend/src/styles.css');
  const tokens=['--ui-bg','--ui-surface','--ui-surface-2','--ui-surface-3','--ui-text','--ui-muted','--ui-line','--ui-gold','--ui-gold-strong','--ui-copper','--ui-success','--ui-danger','--ui-warning','--ui-control','--ui-control-strong','--ui-field','--ui-hover','--ui-media','--ui-overlay','--ui-on-gold','--ui-inverse','--ui-code','--ui-focus','--ui-shadow','--ui-shadow-soft'];
  for(const token of tokens){
    assert.equal((css.match(new RegExp(token+'\\s*:','g'))||[]).length,2,token+' must be defined only in the canonical light and dark palettes');
  }
  assert.ok(css.includes(':root[data-theme="dark"]{'));
  assert.doesNotMatch(css,/html\[data-theme="dark"\]\s*\{\s*--ui-bg:/);
});

test('first-time visitors default to dark while saved theme and metadata stay synchronized',()=>{
  const html=read('frontend/src/index.html');
  const app=read('frontend/src/app.js');
  assert.equal((html.match(/<meta name="theme-color"/g)||[]).length,1);
  assert.ok(html.includes('if(t!=="light"&&t!=="dark")t="dark";'));
  assert.ok(!html.includes('prefers-color-scheme'));
  assert.ok(html.includes('meta[name="theme-color"]'));
  assert.ok(app.includes("const THEME_COLORS={light:'#f5f2ec',dark:'#0b0d11'};"));
  assert.ok(app.includes("meta.setAttribute('content',THEME_COLORS[t])"));
});

test('responsive viewport bands do not redefine the shared theme palette',()=>{
  const css=read('frontend/src/styles.css');
  for(const token of ['--ui-bg','--ui-surface','--ui-text','--ui-muted','--ui-gold','--ui-danger']){
    assert.equal((css.match(new RegExp(token+'\\s*:','g'))||[]).length,2,token+' must remain consistent across desktop, tablet and mobile');
  }
});


test('theme accent text meets WCAG AA contrast on its surfaces',()=>{
  const css=read('frontend/src/styles.css');
  const light=css.match(/:root\s*\{([^}]+)\}/)?.[1]||'';
  const dark=css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)?.[1]||'';
  const value=(block,token)=>{
    const match=block.match(new RegExp(token+':\\s*(#[0-9a-fA-F]{6})'));
    assert.ok(match,token+' must be a literal six-digit theme color');
    return match[1];
  };
  const luminance=hex=>{
    const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:Math.pow((c+0.055)/1.055,2.4));
    return 0.2126*rgb[0]+0.7152*rgb[1]+0.0722*rgb[2];
  };
  const ratio=(a,b)=>{
    const values=[luminance(a),luminance(b)].sort((x,y)=>y-x);
    return (values[0]+0.05)/(values[1]+0.05);
  };
  for(const token of ['--ui-muted','--ui-gold','--ui-gold-strong','--ui-copper','--ui-warning']){
    const foreground=value(light,token);
    for(const surface of ['--ui-bg','--ui-surface','--ui-surface-2']){
      assert.ok(ratio(foreground,value(light,surface))>=4.5,token+' lacks 4.5:1 contrast on '+surface);
    }
  }
  const lightButtonText=value(light,'--ui-on-gold');
  assert.ok(ratio(lightButtonText,value(light,'--ui-gold'))>=4.5);
  assert.ok(ratio(lightButtonText,value(light,'--ui-gold-strong'))>=4.5);
  for(const token of ['--ui-text','--ui-muted','--ui-gold','--ui-gold-strong','--ui-success','--ui-danger','--ui-warning']){
    const foreground=value(dark,token);
    for(const surface of ['--ui-bg','--ui-surface','--ui-surface-2']){
      assert.ok(ratio(foreground,value(dark,surface))>=4.5,token+' lacks 4.5:1 contrast on dark '+surface);
    }
  }
});


test('account and authentication components use scoped theme-aware responsive styles',()=>{
  const css=read('frontend/src/styles.css');
  const app=read('frontend/src/app.js');
  for(const selector of ['.account-page>.profile-panel','.account-page .customer-order-card','.account-page .customer-order-timeline','.auth-page .login-panel','.auth-page .otp-digit']){
    assert.ok(css.includes(selector),selector+' must have dedicated account-page styling');
  }
  for(const token of ['var(--ui-bg)','var(--ui-surface)','var(--ui-surface-2)','var(--ui-text)','var(--ui-muted)','var(--ui-line)','var(--ui-gold)','var(--ui-focus)']){
    assert.ok(css.includes(token),'account UI should use shared theme token '+token);
  }
  for(const viewport of ['@media(max-width:850px)','@media(max-width:600px)','@media(max-width:359px)','@media(prefers-reduced-motion:reduce)']){
    assert.ok(css.includes(viewport),'account responsive/accessibility rule missing: '+viewport);
  }
  assert.ok(app.includes('class="wrap page account-page"'));
  assert.ok(app.includes('class="wrap page auth-page"'));
  assert.ok(app.includes('class="customer-order-card"'));
});


test('cart UI uses scoped theme-aware responsive checkout styling',()=>{
  const css=read('frontend/src/styles.css');
  const app=read('frontend/src/app.js');
  for(const selector of ['.cart-page .cart-hero','.cart-page .cart-items-panel','.cart-page .cart-product-thumb','.cart-page .cart-qty-btn','.cart-page .cart-address-grid','.cart-page .cart-checkout-bar','.cart-page .cart-trust']){
    assert.ok(css.includes(selector),selector+' must have dedicated cart styling');
  }
  for(const token of ['var(--ui-surface)','var(--ui-surface-2)','var(--ui-text)','var(--ui-muted)','var(--ui-line)','var(--ui-gold-strong)','var(--ui-focus)']){
    assert.ok(css.includes(token),'cart UI should use shared theme token '+token);
  }
  for(const viewport of ['@media(max-width:900px)','@media(max-width:600px)','@media(max-width:359px)','@media(prefers-reduced-motion:reduce)']){
    assert.ok(css.includes(viewport),'cart responsive/accessibility rule missing: '+viewport);
  }
  assert.ok(app.includes('class="wrap page cart-page"'));
  assert.ok(app.includes('class="cartline"'));
  assert.ok(app.includes('class="cart-checkout-bar"'));
  assert.ok(app.includes('class="payment-method-list"'));
});


test('current mobile navigation drawer stays above backdrop and opens at scrolled positions',()=>{
  const css=read('frontend/src/styles.css');
  const app=read('frontend/src/app.js');
  assert.ok(css.includes('.ga-header-shell .ga-header-primary-nav#main-menu.is-open'));
  assert.ok(css.includes('z-index:1100'));
  assert.ok(css.includes('z-index:1102'));
  assert.ok(css.includes('.ga-header-shell:has(.ga-header-menu-toggle[aria-expanded="true"])'));
  assert.ok(css.includes('z-index:1101!important'));
  assert.ok(css.includes('body.mobile-nav-open::before'));
  assert.ok(css.includes('pointer-events:auto'));
  assert.ok(css.includes('overscroll-behavior:contain'));
  assert.ok(app.includes('window.GilasArtMobileMenu.toggle(this)'));
  assert.ok(app.includes("document.body.classList.toggle('mobile-nav-open',open)"));
  assert.ok(app.includes("document.body.classList.remove('mobile-nav-open')"));
});
