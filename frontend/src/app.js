const API=window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev';
const app=document.querySelector('#app');
if(app&&!app.innerHTML.trim())app.innerHTML='<main class="welcome-screen" aria-label="در حال آماده‌سازی فروشگاه گیلاس آرت"><div class="welcome-glow"></div><div class="welcome-card"><img class="welcome-logo" src="/glsArt/invoice/logo.svg" alt="گیلاس آرت" width="180" height="90" decoding="async" fetchpriority="high"><div class="welcome-brand">GILAS ART</div><h1>فروشگاه گیلاس آرت</h1><p>در حال آماده سازی گالری ...</p><div class="welcome-progress" role="progressbar" aria-label="در حال بارگذاری فروشگاه"><span></span></div><small>هنر، انتخابی برای ماندن.</small></div></main>';
const visitorSessionKey=(()=>{try{let k=localStorage.getItem('GilasArtVisitorSession');if(!k){const a=new Uint8Array(24);crypto.getRandomValues(a);k=Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('GilasArtVisitorSession',k)}return k}catch{return ''}})();
async function visitorHeartbeat(){if(!visitorSessionKey)return;try{await fetch(API+'/api/visitors/heartbeat',{method:'POST',credentials:'include',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({sessionKey:visitorSessionKey})})}catch{}}
visitorHeartbeat();setInterval(visitorHeartbeat,60000);

let csrfToken='';
let state={products:[],categories:[],user:null,roles:[],permissions:[],cart:null,cartCount:0,points:0,rewards:null,settings:{}};
const icon=n=>({cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H7"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/> </svg>',user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 4 18 8-18 8 3-8-3-8Z"/><path d="M6 12h9"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',support:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5.5 5V15A2.5 2.5 0 0 1 3 12.5v-7Z"/><path d="M7 8h10M7 11h6"/></svg>',plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 16H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/></svg>'}[n]||'');
const fa=n=>new Intl.NumberFormat('fa-IR').format(Number(n||0));
const escapeHtml=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
const safeUrl=v=>{try{const u=new URL(String(v||''),location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
const THEME_KEY='gilasart-theme';
function applyTheme(theme){const t=theme==='light'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem(THEME_KEY,t)}catch{}}
function initTheme(){let t='';try{t=localStorage.getItem(THEME_KEY)||''}catch{}applyTheme(t||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'))}
window.GilasArtTheme={toggle(){applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light')},set:applyTheme};
window.GilasArtMobileMenu={toggle(button){const menu=document.querySelector('#main-menu');if(!menu)return;const open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);button?.setAttribute('aria-expanded',String(open));button?.setAttribute('aria-label',open?'بستن منوی اصلی':'باز کردن منوی اصلی')},close(){const menu=document.querySelector('#main-menu'),button=document.querySelector('.mobile-menu-toggle');menu?.classList.remove('is-open');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label','باز کردن منوی اصلی')}};
document.addEventListener('click',e=>{const link=e.target?.closest?.('#main-menu a');if(link)window.GilasArtMobileMenu?.close()},{capture:true});
initTheme();
let progressRequests=0,progressTimer=null,progressHideTimer=null,progressValue=0;
function progressPaint(bar){const value=Math.max(0,Math.min(100,progressValue));const span=bar?.querySelector('span');if(span)span.style.width=value+'%'}
function progressStart(){
  let bar=document.querySelector('#global-progress');
  if(!bar){bar=document.createElement('div');bar.id='global-progress';bar.innerHTML='<span></span>';document.body.prepend(bar)}
  clearTimeout(progressHideTimer);
  progressRequests++;
  bar.hidden=false;
  if(progressRequests===1){progressValue=Math.max(progressValue,3);progressPaint(bar)}
  if(!progressTimer){
    progressTimer=setInterval(()=>{
      if(progressRequests<=0)return;
      if(progressValue<88)progressValue=Math.min(88,progressValue+Math.max(.12,(88-progressValue)*.025));
      progressPaint(bar);
    },140);
  }
}
function progressEnd(){
  progressRequests=Math.max(0,progressRequests-1);
  if(progressRequests)return;
  clearInterval(progressTimer);progressTimer=null;
  const bar=document.querySelector('#global-progress');
  if(!bar)return;
  const startValue=progressValue,started=performance.now();
  const finish=now=>{
    if(progressRequests>0)return;
    const t=Math.min(1,(now-started)/280);
    progressValue=startValue+(100-startValue)*(1-Math.pow(1-t,3));
    progressPaint(bar);
    if(t<1)requestAnimationFrame(finish);
    else{progressValue=100;progressPaint(bar);progressHideTimer=setTimeout(()=>{if(progressRequests===0)bar.hidden=true},220)}
  };
  requestAnimationFrame(finish);
}
window.GilasArtProgress={start:progressStart,end:progressEnd};window.GilasArtMobile={
 platform:()=>{try{if(window.Capacitor?.getPlatform)return window.Capacitor.getPlatform();}catch{}const u=navigator.userAgent||'';return /iPad|iPhone|iPod/.test(u)?'ios':/Android/i.test(u)?'android':'web'},
 async checkRelease(){
  try{
   const root=location.pathname.includes('/glsArt')?'/glsArt/':'/';
   const r=await fetch(root+'mobile-release.json?t='+Date.now(),{cache:'no-store'});if(!r.ok)return null;
   const d=await r.json();if(!d||typeof d!=='object'||!d.web)return null;
   const current=String(window.GILASART_APP_VERSION||'');const latest=String(d.web.version||'');
   if(current&&latest&&current!==latest)this.showWebUpdate(latest);
   const p=this.platform(),native=d[p];
   if(native?.available&&native.url)this.showNativeUpdate(p,native);
   return d;
  }catch{return null}
 },
 showWebUpdate(version){
  if(document.querySelector('#mobile-update-hint'))return;
  const el=document.createElement('aside');el.id='mobile-update-hint';el.className='mobile-update-hint';el.setAttribute('role','status');el.innerHTML='<div><strong>نسخه جدید گیلاس آرت آماده است</strong><span>برای دریافت آخرین بهبودها، نسخه جدید را بارگذاری کنید.</span></div><button type="button" class="btn primary" data-action="reload">به‌روزرسانی</button><button type="button" class="mobile-update-close" aria-label="بستن">×</button>';
  document.body.appendChild(el);el.querySelector('[data-action="reload"]').onclick=()=>location.reload();el.querySelector('.mobile-update-close').onclick=()=>el.remove();
 },
 showNativeUpdate(platform,release){
  if(document.querySelector('#native-update-hint'))return;
  const label=platform==='android'?'اندروید':'iOS';const el=document.createElement('aside');el.id='native-update-hint';el.className='mobile-update-hint native-update-hint';el.setAttribute('role','alert');el.innerHTML='<div><strong>نسخه جدید اپلیکیشن گیلاس آرت آماده است</strong><span>نسخه '+escapeHtml(release.latestVersion||'جدید')+' برای '+label+' منتشر شده است.</span></div><a class="btn primary" href="'+escapeHtml(safeUrl(release.url))+'" target="_blank" rel="noopener noreferrer">به‌روزرسانی</a><button type="button" class="mobile-update-close" aria-label="بستن">×</button>';document.body.appendChild(el);el.querySelector('.mobile-update-close').onclick=()=>el.remove();
 }
};
async function registerGilasArtServiceWorker(){
 if(!('serviceWorker' in navigator))return;
 try{
  const root=location.pathname.includes('/glsArt')?'/glsArt/':'/';
  const reg=await navigator.serviceWorker.register(root+'sw.js',{scope:root});
  reg.addEventListener('updatefound',()=>{const w=reg.installing;if(!w)return;w.addEventListener('statechange',()=>{if(w.state==='installed'&&navigator.serviceWorker.controller){w.postMessage({type:'SKIP_WAITING'})}})});
  let refreshing=false;navigator.serviceWorker.addEventListener('controllerchange',()=>{if(refreshing)return;refreshing=true;location.reload()});
 }catch(e){console.warn('service_worker_registration_failed',e)}
}
registerGilasArtServiceWorker();
setTimeout(()=>window.GilasArtMobile?.checkRelease(),1800);
setInterval(()=>{if(navigator.onLine)window.GilasArtMobile?.checkRelease()},15*60*1000);

let storefrontSnapshotPromise=null;
const storefrontSnapshotUrl=()=>((location.pathname.includes('/glsArt')?'/glsArt':'')+'/data/storefront-manifest.json');

async function loadStorefrontSnapshot(){
 if(storefrontSnapshotPromise)return storefrontSnapshotPromise;
 storefrontSnapshotPromise=(async()=>{
  try{
   const mr=await fetch(storefrontSnapshotUrl(),{cache:'no-store',credentials:'same-origin'});
   if(!mr.ok)return null;
   const manifest=await mr.json();
   if(Number(manifest?.schemaVersion)!==1||!manifest?.generatedAt)return null;
   const base=(location.pathname.includes('/glsArt')?'/glsArt':'')+'/data/storefront.json';
   const sr=await fetch(base+'?v='+encodeURIComponent(manifest.generatedAt),{cache:'no-store',credentials:'same-origin'});
   if(!sr.ok)return null;
   const d=await sr.json();
   if(Number(d?.meta?.schemaVersion)!==1||!Array.isArray(d.products)||!Array.isArray(d.categories)||!d.settings)return null;
   return d;
  }catch{return null}
 })();
 const d=await storefrontSnapshotPromise;
 if(!d)storefrontSnapshotPromise=null;
 return d;
}
function snapshotCore(p){
 const image=(p?.images||[]).find(x=>Number(x.is_primary)===1)?.path||(p?.images||[0])?.path||'';
 return {id:p.id,slug:p.slug,sku:p.sku,name:p.name,description:p.description,price_irt:Number(p.price_irt||0),category_id:p.category_id,flash_sale_active:p.flash_sale_active,flash_sale_ends_at:p.flash_sale_ends_at,flash_sale_price_irt:p.flash_sale_price_irt,video_url:p.video_url,view_count:Number(p.view_count||0),rating_avg:Number(p.rating_avg||0),review_count:Number(p.review_count||0),favorite_count:Number(p.favorite_count||0),sold_count:Number(p.sold_count||0),seo_title:p.seo_title,seo_description:p.seo_description,image};
}
function snapshotSort(items,sort){
 const a=[...items],s=String(sort||'newest');
 const textDesc=(x,y)=>String(y).localeCompare(String(x));
 return a.sort((x,y)=>{
  if(s==='price_asc')return Number(x.price_irt)-Number(y.price_irt)||textDesc(x.id,y.id);
  if(s==='price_desc')return Number(y.price_irt)-Number(x.price_irt)||textDesc(x.id,y.id);
  if(s==='rating')return Number(y.rating_avg)-Number(x.rating_avg)||Number(y.review_count)-Number(x.review_count)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
  if(s==='reviews')return Number(y.review_count)-Number(x.review_count)||Number(y.rating_avg)-Number(x.rating_avg)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
  if(s==='popular')return Number(y.favorite_count)-Number(x.favorite_count)||Number(y.view_count)-Number(x.view_count)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
  if(s==='best_selling')return Number(y.sold_count)-Number(x.sold_count)||Number(y.review_count)-Number(x.review_count)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
  if(s==='views')return Number(y.view_count)-Number(x.view_count)||Number(y.favorite_count)-Number(x.favorite_count)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
  return textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id);
 });
}
async function snapshotApi(path){
 if(!/^\/api\/(home|products|categories|flash-sales|content|site-rules|faq)(?:[/?]|$)/.test(path))return null;
 const d=await loadStorefrontSnapshot();if(!d)return null;
 const u=new URL(path,'https://snapshot.local');
 if(u.pathname==='/api/home'){
  const items=snapshotSort(d.products,'newest').slice(0,8).map(snapshotCore);
  const flash=(d.products||[]).filter(p=>Number(p.flash_sale_active)===1&&p.flash_sale_ends_at&&new Date(p.flash_sale_ends_at).getTime()>Date.now()).sort((a,b)=>String(a.flash_sale_ends_at).localeCompare(String(b.flash_sale_ends_at))).slice(0,20).map(snapshotCore);
  return {products:{items},categories:{items:d.categories},settings:{settings:d.settings},flash:{items:flash}};
 }
 if(u.pathname==='/api/categories')return {items:d.categories};
 if(u.pathname==='/api/settings')return {settings:d.settings};
 if(u.pathname==='/api/site-rules')return {item:{title:d.settings.site_rules_title||'قوانین سایت',body:d.settings.site_rules_body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.',updated_at:d.meta.generatedAt}};
 if(u.pathname==='/api/faq')return {items:d.faq||[]};
 if(u.pathname==='/api/flash-sales'){
  const items=(d.products||[]).filter(p=>Number(p.flash_sale_active)===1&&p.flash_sale_ends_at&&new Date(p.flash_sale_ends_at).getTime()>Date.now()).sort((a,b)=>String(a.flash_sale_ends_at).localeCompare(String(b.flash_sale_ends_at))).slice(0,20).map(snapshotCore);
  return {items};
 }
 if(u.pathname==='/api/products'){
  let items=[...(d.products||[])];
  const q=(u.searchParams.get('q')||'').trim().toLowerCase(),cat=u.searchParams.get('category')||'',sort=u.searchParams.get('sort')||'newest';
  if(q)items=items.filter(p=>[p.name,p.description,p.sku].some(v=>String(v||'').toLowerCase().includes(q)));
  if(cat)items=items.filter(p=>Array.isArray(p.category_ids)&&p.category_ids.includes(cat));
  items=snapshotSort(items,sort);
  const limit=Math.min(60,Math.max(1,Number(u.searchParams.get('limit')||12))),offset=Math.max(0,Math.min(10000,Number(u.searchParams.get('offset')||0)));
  return {items:items.slice(offset,offset+limit).map(snapshotCore),limit,offset,sort};
 }
 const parts=u.pathname.split('/').filter(Boolean);
 if(parts[1]==='products'&&parts.length===3){
  const slug=decodeURIComponent(parts[2]),p=(d.products||[]).find(x=>x.slug===slug);if(!p)return null;
  return {product:{...p,category_name:p.categories?.[0]?.name||'',image:snapshotCore(p).image},images:p.images||[],attributes:p.attributes||[],reviews:p.reviews||[],categories:p.categories||[],quantityDiscountTiers:[{min:1,percent:0},{min:2,percent:2},{min:3,percent:4},{min:4,percent:6},{min:5,percent:8},{min:6,percent:10},{min:8,percent:12},{min:10,percent:15},{min:15,percent:17},{min:20,percent:20}]};
 }
 if(u.pathname.startsWith('/api/content/')){
  const parts2=u.pathname.split('/').filter(Boolean),section=parts2[2],slug=decodeURIComponent(parts2.slice(3).join('/'));const item=(d[section]||[]).find(x=>x.slug===slug);return item?{item}:null;
 }
 if(u.pathname==='/api/content'){
  const section=(u.searchParams.get('section')||'').trim().toLowerCase();if(!['about','contact','news','articles'].includes(section))return null;
  let items=[...(d[section]||[])];const q=(u.searchParams.get('q')||'').trim().toLowerCase();if(q)items=items.filter(x=>[x.title,x.summary,x.body].some(v=>String(v||'').toLowerCase().includes(q)));
  const limit=Math.min(20,Math.max(1,Number(u.searchParams.get('limit')||8))),offset=Math.max(0,Number(u.searchParams.get('offset')||0));
  items.sort((a,b)=>String(b.published_at||b.created_at||'').localeCompare(String(a.published_at||a.created_at||'')));
  return {items:items.slice(offset,offset+limit),limit,offset,hasMore:items.length>offset+limit};
 }
 return null;
}

async function api(path,opt={}){
 progressStart();
 const headers={...(opt.headers||{})};
 if(opt.body)headers['content-type']='application/json';
 try{
  if((opt.method||'GET').toUpperCase()==='GET'){
   const local=await snapshotApi(path);
   if(local)return local;
  }
  const r=await fetch(API+path,{credentials:'include',cache:'no-store',headers,...opt});
  const raw=await r.text();
  let d={};try{d=raw?JSON.parse(raw):{}}catch{}
  if(!r.ok)throw new Error(d.error||d.message||'خطا در ارتباط با سرویس');
  const requiredShape=path=>{
   if(path==='/api/health')return d&&d.ok===true&&d.db===true;
   if(/^\/api\/products\?/.test(path)||path==='/api/products')return Array.isArray(d?.items);
   if(path==='/api/categories'||path==='/api/flash-sales')return Array.isArray(d?.items);
   if(path.startsWith('/api/products/')&&path.endsWith('/view'))return d?.ok===true;
   if(path.startsWith('/api/products/')&&!path.includes('/reviews'))return d?.product&&Array.isArray(d.images)&&Array.isArray(d.attributes)&&Array.isArray(d.categories)&&Array.isArray(d.reviews);
   if(path.startsWith('/api/content?'))return Array.isArray(d?.items);
   if(path.startsWith('/api/content/'))return d?.item&&typeof d.item==='object';
   if(path==='/api/settings')return d?.settings&&typeof d.settings==='object';
   if(path==='/api/site-rules')return d?.item&&typeof d.item==='object';
   if(path==='/api/notifications')return Array.isArray(d?.items);
   return true;
  };
  if(!requiredShape(path))throw new Error('داده ناقص از سرویس اصلی دریافت شد');
  return d;
 }finally{progressEnd()}
}
function csrf(){return csrfToken||''}
function setSeo({title,description,image,type='website',jsonLd}={}){if(title){document.title=title;let t=document.querySelector('meta[name="description"]');if(!t){t=document.createElement('meta');t.name='description';document.head.appendChild(t)}t.content=description||'';const og=document.querySelector('meta[property="og:title"]');if(og)og.content=title;const od=document.querySelector('meta[property="og:description"]');if(od)od.content=description||'';if(image){let oi=document.querySelector('meta[property="og:image"]');if(!oi){oi=document.createElement('meta');oi.setAttribute('property','og:image');document.head.appendChild(oi)}oi.content=image}}document.querySelectorAll('script[data-gilasart-jsonld]').forEach(x=>x.remove());if(jsonLd){const s=document.createElement('script');s.type='application/ld+json';s.dataset.gilasartJsonld='1';s.textContent=JSON.stringify(jsonLd).replace(/</g,'\\u003c');document.head.appendChild(s)}}
function isAdminUser(){return state.roles?.includes("admin")||state.roles?.includes("super_admin")||state.roles?.includes("administrator")||state.roles?.includes("admin-role")}
function accountLink(){return state.user?'<a class="iconbtn profile-link" href="#/account" title="پروفایل کاربر">'+icon('user')+'<span>پروفایل</span></a>':'<a class="iconbtn" href="#/account">'+icon('user')+'<span>ورود</span></a>'}
function footerSocialLinks(){
 try{const x=JSON.parse(String(state.settings?.footer_social_links||'[]'));return Array.isArray(x)?x.filter(v=>v&&v.active!==false&&/^https:\/\//i.test(String(v.url||''))).sort((a,b)=>Number(a.sort||0)-Number(b.sort||0)).slice(0,12):[]}catch{return []}
}
function footerIconPath(id){return '/glsArt/assets/social/'+(['telegram','instagram','aparat','whatsapp','youtube','linkedin','other'].includes(id)?id:'other')+'.svg'}
function renderFooter(){
 const socials=footerSocialLinks();
 const socialMarkup=socials.map(x=>'<a class="footer-social-link" href="'+escapeHtml(x.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+escapeHtml(x.label)+'"><span class="footer-social-icon"><img src="'+footerIconPath(x.id)+'" alt="" loading="lazy" decoding="async"></span><span>'+escapeHtml(x.label)+'</span></a>').join('');
 const enamad="<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=22286&Code=u04bawyWrXOcWNwCSK6B'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=22286&Code=u04bawyWrXOcWNwCSK6B' alt='' style='cursor:pointer' code='u04bawyWrXOcWNwCSK6B'></a>";
 return '<footer class="footer"><div class="wrap footer-grid footer-grid-refined"><section class="footer-brand"><strong>گیلاس آرت</strong><p>هنر، انتخابی برای ماندن.</p><span class="footer-caption">گالری و فروشگاه آنلاین آثار هنری گیلاس آرت</span></section><nav aria-label="پیوندهای خدمات" class="footer-links"><strong>دسترسی سریع</strong><a href="#/terms">قوانین سایت</a><a href="#/rewards">باشگاه امتیاز</a><a href="#/support">تیکت پشتیبانی</a><a href="#/contact">تماس با ما</a></nav><section class="footer-socials"><strong>شبکه‌های اجتماعی</strong><div class="footer-social-list">'+(socialMarkup||'<span class="muted">به‌زودی</span>')+'</div></section><section class="footer-trust"><strong>نماد اعتماد و پرداخت</strong><div class="trust-badges">'+enamad+'<span>درگاه امن</span></div></section></div><div class="wrap footer-bottom"><span>© گیلاس آرت</span><span>تمامی حقوق محفوظ است.</span></div></footer>';
}
function updateCartBadge(count){const n=Math.max(0,Number(count)||0);state.cartCount=n;document.querySelectorAll('.cart-count-badge').forEach(el=>{el.textContent=n>99?'۹۹+':fa(n);el.hidden=n<=0;el.setAttribute('aria-label',n+' تابلو در سبد خرید')})}
async function syncCartBadge(){if(!state.user){updateCartBadge(0);return}try{const d=await api('/api/cart');const count=(d.items||[]).reduce((sum,x)=>sum+Math.max(0,Number(x.quantity)||0),0);updateCartBadge(count)}catch{updateCartBadge(0)}}
function layout(content){
 app.innerHTML=`<header class="top"><div class="wrap nav"><a class="brand" href="#/" aria-label="گیلاس آرت، صفحه اصلی">گیلاس آرت<small>GILAS ART</small></a><nav class="links" id="main-menu" aria-label="منوی اصلی"><a href="#/shop">فروشگاه</a><a href="#/about">درباره ما</a><a href="#/contact">تماس با ما</a><a href="#/news">اخبار</a><a href="#/articles">مقالات</a><a href="#/rewards" class="rewards-nav-link">باشگاه امتیاز</a>${isAdminUser()?'<a class="admin-link" href="#/admin">کنترل پنل</a>':''}</nav><div class="spacer"></div><button class="theme-toggle" type="button" aria-label="تغییر حالت نمایش" title="روز / شب" onclick="window.GilasArtTheme&&window.GilasArtTheme.toggle()">◐ <span>روز/شب</span></button><a class="iconbtn cart-link" href="#/cart" aria-label="سبد خرید"><div class="cart-icon-wrap">${icon('cart')}<b class="cart-count-badge" aria-label="${state.cartCount} تابلو در سبد خرید"${state.cartCount>0?'':' hidden'}>${state.cartCount>99?'۹۹+':fa(state.cartCount)}</b></div><span>سبد خرید</span></a>${state.user?'<a class="points-badge" href="#/rewards" title="امتیازهای من">★ '+fa(state.points)+' امتیاز</a>':''}${accountLink()}<button class="mobile-menu-toggle" type="button" aria-label="باز کردن منوی اصلی" aria-expanded="false" aria-controls="main-menu" onclick="window.GilasArtMobileMenu&&window.GilasArtMobileMenu.toggle(this)"><span></span><span></span><span></span></button></div></header><div class="rewards-promo"><div class="wrap rewards-promo-inner">${state.user?'<span>امتیاز شما: <b>'+fa(state.points)+'</b></span><span>از امتیازهایتان کوپن تا ۲۰٪ تخفیف بسازید.</span><a href="#/rewards">تبدیل امتیاز به کوپن ←</a>':'<span>عضویت در گیلاس آرت = <b>۱۰ امتیاز هدیه</b></span><a href="#/account">عضو شوید و امتیاز بگیرید ←</a>'}</div></div><main id="main-content" tabindex="-1">${content}</main>${renderFooter()}`;
}
function productUrl(slug){const s=String(slug||'').trim();if(!s)return '#/shop';const base=location.pathname.includes('/glsArt')?'/glsArt':'';return base+'/'+encodeURIComponent(s)}
function productCard(p){
 const image=safeUrl(p.image),flash=Number(p.flash_sale_active||p.flashSaleActive)===1&&p.flash_sale_ends_at;
 const hasFlashPrice=flash&&p.flash_sale_price_irt!==null&&p.flash_sale_price_irt!==undefined;
 const shown=hasFlashPrice?Number(p.flash_sale_price_irt):Number(p.price_irt||0);
 const name=escapeHtml(p.name||"اثر هنری"),sku=escapeHtml(p.sku||""),href=productUrl(p.slug);
 return `<article class="card product-card product-showcase"><a class="product-card-link" href="${href}" aria-label="مشاهده ${name}"><div class="product-card-media"><div class="product-art-frame">${image?`<img src="${escapeHtml(image)}" alt="${name}" loading="lazy" decoding="async">`:'<div class="product-image-empty" aria-hidden="true">اثر هنری</div>'} </div><div class="product-card-overlay" aria-hidden="true"><span>مشاهده اثر</span><span>←</span></div><div class="product-card-badges"><span class="product-art-badge">اثر هنری</span>${flash?`<span class="flash-badge">${icon("clock")} پیشنهاد شگفت‌انگیز</span>`:""}</div></div><div class="cardbody product-card-body"><div class="product-card-heading"><h3>${name}</h3>${sku?`<span class="product-sku" dir="ltr">${sku}</span>`:""}</div>${flash?`<div class="flash-timer product-card-timer" data-flash-end="${escapeHtml(p.flash_sale_ends_at)}" aria-label="زمان باقی‌مانده"></div>`:""}<div class="product-card-footer"><div class="product-price-group"><span class="product-price-label">${hasFlashPrice?"قیمت ویژه":"قیمت اثر"}</span><strong class="price product-card-price">${fa(shown)} <small>ریال</small></strong>${hasFlashPrice?`<span class="muted flash-old">${fa(p.price_irt)} ریال</span>`:""}</div><span class="product-card-arrow" aria-hidden="true">←</span></div></div></a></article>`;
}
function jalaliDate(v){try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(new Date(v))}catch{return ''}}
function startFlashTimers(root=document){root.querySelectorAll('.flash-timer[data-flash-end]').forEach(el=>{const end=new Date(el.dataset.flashEnd).getTime();const tick=()=>{const left=Math.max(0,end-Date.now());if(left<=0){el.textContent='پایان پیشنهاد';el.closest('.card')?.classList.add('flash-ended');return}const secTotal=Math.floor(left/1000),days=Math.floor(secTotal/86400),hours=Math.floor(secTotal%86400/3600),minutes=Math.floor(secTotal%3600/60),seconds=secTotal%60;el.textContent=`${days?days+' روز ':''}${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`};tick();const id=setInterval(()=>{if(!document.body.contains(el)){clearInterval(id);return}tick()},1000)})}
function renderFaq(items){return (items||[]).map((x,i)=>`<details class="faq-item" ${i===0?'open':''}><summary>${escapeHtml(x.question)}</summary><div>${escapeHtml(x.answer)}</div></details>`).join('')}
function startSkyAnimation(){
 const canvas=document.querySelector('#sky-canvas');if(!canvas)return;
 const ctx=canvas.getContext('2d');let raf=0,t=0;
 const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,r.width*d);canvas.height=Math.max(1,r.height*d);ctx.setTransform(d,0,0,d,0,0)};
 const stars=Array.from({length:55},(_,i)=>({x:(i*83)%100,y:(i*47)%72,r:i%3===0?1.4:.8,a:.25+(i%5)*.1}));
 const frame={x:62,y:51,w:210,h:150};
 function draw(){
  t+=.004;const r=canvas.getBoundingClientRect(),w=r.width,h=r.height;ctx.clearRect(0,0,w,h);
  const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#081525');sky.addColorStop(.58,'#17395a');sky.addColorStop(1,'#d6a875');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
  for(const s of stars){ctx.globalAlpha=s.a*(.65+.35*Math.sin(t*5+s.x));ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x/100*w,s.y/100*h,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
  for(let i=0;i<4;i++){const x=((i*280-w*.15)+(t*35)% (w+420))-210,y=35+i*48;ctx.fillStyle='rgba(255,255,255,.10)';ctx.beginPath();ctx.ellipse(x,y,120,22,0,0,Math.PI*2);ctx.ellipse(x+80,y+4,95,18,0,0,Math.PI*2);ctx.fill()}
  const drift=Math.sin(t*1.7)*18;ctx.save();ctx.translate(w*.52+drift,h*.46+Math.sin(t*1.2)*8);ctx.rotate(Math.sin(t)*.025);
  ctx.strokeStyle='rgba(255,245,220,.9)';ctx.lineWidth=2;ctx.shadowBlur=24;ctx.shadowColor='rgba(255,225,160,.3)';ctx.strokeRect(-frame.w/2,-frame.h/2,frame.w,frame.h);ctx.shadowBlur=0;
  ctx.fillStyle='rgba(255,255,255,.035)';ctx.fillRect(-frame.w/2+8,-frame.h/2+8,frame.w-16,frame.h-16);ctx.restore();
  raf=requestAnimationFrame(draw)
 }
 resize();addEventListener('resize',resize,{passive:true});draw();canvas._cancel=()=>cancelAnimationFrame(raf)
}
async function home(){const [d,s,fs,c]=await Promise.allSettled([api('/api/products?limit=8'),api('/api/settings'),api('/api/flash-sales'),api('/api/categories')]);const products=d.status==='fulfilled'?d.value:{items:[]},settings=s.status==='fulfilled'?s.value:{settings:{}},flashData=fs.status==='fulfilled'?fs.value:{items:[]},categoryData=c.status==='fulfilled'?c.value:{items:[]};state.products=products.items||[];state.categories=categoryData.items||[];const ss=settings.settings||{},flash=flashData.items||[];state.settings=ss;const heroProduct=state.products[0]||null,heroImage=heroProduct?safeUrl(heroProduct.image):'';setSeo({title:ss.seo_title||'گیلاس آرت | خرید تابلو و آثار هنری',description:ss.seo_description||ss.site_description,image:heroImage||undefined});const categorySection=state.categories.length?'<section class="wrap home-categories section"><div class="sectionhead"><div><span class="eyebrow">CURATED COLLECTIONS</span><h2>مجموعه‌های گالری</h2><p class="muted">هر مجموعه، مسیری برای رسیدن به اثر مناسب شماست.</p></div><a class="muted" href="#/shop">مشاهده همه ←</a></div><div class="category-grid">'+state.categories.slice(0,6).map((cat,i)=>'<a class="category-card" href="#/shop?category='+encodeURIComponent(cat.id)+'"><span class="category-index">0'+(i+1)+'</span><span class="category-mark" aria-hidden="true"></span><strong>'+escapeHtml(cat.name)+'</strong><small>مشاهده آثار این مجموعه</small><span class="category-arrow" aria-hidden="true">←</span></a>').join('')+'</div></section>':' ';const flashSection=flash.length?'<section class="wrap flash-section"><div class="flash-head"><div><span class="eyebrow">LIMITED TIME</span><h2>پیشنهاد شگفت‌انگیز</h2><p>فرصت محدود برای انتخاب آثار منتخب</p></div><div class="flash-controls"><button class="icon-circle" id="flash-prev" aria-label="قبلی">‹</button><button class="icon-circle" id="flash-next" aria-label="بعدی">›</button></div></div><div id="flash-track" class="flash-track">'+flash.map(productCard).join('')+'</div></section>':'';const heroMedia=heroImage?'<a class="home-hero-art" href="'+productUrl(heroProduct.slug)+'" aria-label="مشاهده '+escapeHtml(heroProduct.name)+'"><img src="'+escapeHtml(heroImage)+'" alt="'+escapeHtml(heroProduct.name)+'" fetchpriority="high" decoding="async"><span class="home-hero-art-caption"><span>اثر منتخب</span><strong>'+escapeHtml(heroProduct.name)+'</strong></span></a>':'<div class="home-hero-art home-hero-art-empty" aria-label="گالری آثار گیلاس آرت"><span>GILAS ART</span><strong>اثر هنری</strong></div>';layout('<section class="wrap hero home-hero"><div class="hero-copy"><div class="eyebrow">LUXURY IRANIAN ART GALLERY</div><h1>آثاری برای خانه‌هایی که داستان دارند.</h1><p>گیلاس آرت فضایی برای کشف، انتخاب و خرید آثار هنری است؛ با تمرکز بر جزئیات اثر، انتخاب‌های شخصی و تجربه‌ای آرام و روشن.</p><div class="toolbar"><a class="btn primary" href="#/shop">مشاهده آثار</a><a class="btn ghost" href="#/about">درباره گیلاس آرت</a></div><div class="home-hero-note"><span class="pill">GILAS ART</span><span>اثر هنری، نقطه شروع فضاست.</span></div></div>'+heroMedia+'</section><section class="wrap home-intro"><div class="home-intro-mark" aria-hidden="true">✦</div><div><span class="eyebrow">THE GALLERY APPROACH</span><h2>انتخاب اثر، بخشی از زیبایی آن است.</h2><p>از تصویر و جزئیات اثر تا انتخاب ابعاد و قاب، مسیر خرید باید به اندازه خود اثر ساده، دقیق و خوشایند باشد.</p></div><a class="btn ghost" href="#/shop">ورود به گالری</a></section>'+categorySection+flashSection+'<section class="wrap section home-latest"><div class="sectionhead"><div><span class="eyebrow">LATEST ARTWORKS</span><h2>آخرین آثار</h2><p class="muted">تازه‌ترین آثار فعال فروشگاه را ببینید.</p></div><a class="muted" href="#/shop">همه آثار ←</a></div><div class="grid">'+(state.products.slice(0,8).map(productCard).join('')||'<div class="panel">هنوز محصول فعالی منتشر نشده است.</div>')+'</div></section><section class="wrap home-process"><div class="sectionhead"><div><span class="eyebrow">A QUIET JOURNEY</span><h2>هنرکده گیلاس آرت</h2><p>تولید کننده ی برتر تابلو های معرق مس در ایران</p></div></div><div class="process-grid"><div><span>01</span><strong>کشف</strong><p>آثار و مجموعه‌های مختلف را مرور کنید.</p></div><div><span>02</span><strong>انتخاب</strong><p>جزئیات اثر، ابعاد و گزینه‌های موجود را بررسی کنید.</p></div><div><span>03</span><strong>سفارش</strong><p>اطلاعات تحویل را ثبت کرده و سفارش را تکمیل کنید.</p></div></div></section>');startFlashTimers();const track=document.querySelector('#flash-track');if(track){const step=()=>{const first=track.querySelector('.card');return first?first.getBoundingClientRect().width+18:280};document.querySelector('#flash-prev').onclick=()=>track.scrollBy({left:-step(),behavior:'smooth'});document.querySelector('#flash-next').onclick=()=>track.scrollBy({left:step(),behavior:'smooth'});let timer=setInterval(()=>{if(!document.body.contains(track)){clearInterval(timer);return}const max=track.scrollWidth-track.clientWidth;if(track.scrollLeft>=max-10)track.scrollTo({left:0,behavior:'smooth'});else track.scrollBy({left:step(),behavior:'smooth'})},5000)}}async function shop(){
 const pageSize=3;let offset=0,loading=false,done=false,query='',category='',sort='newest',requestSeq=0,controller=null,sentinel,observer;
 const hashParams=new URLSearchParams((location.hash.split('?')[1]||''));category=hashParams.get('category')||'';sort=hashParams.get('sort')||'newest';
 const [cats,featured]=await Promise.all([api('/api/categories'),api('/api/products?limit=1&sort=newest')]);state.categories=cats.items||[];
 const featuredProduct=(featured.items||[])[0]||null,featuredImage=featuredProduct?safeUrl(featuredProduct.image):'';
 const sortOptions=[['newest','جدیدترین آثار'],['price_asc','قیمت: کم به زیاد'],['price_desc','قیمت: زیاد به کم'],['rating','بالاترین امتیاز خریداران'],['reviews','بیشترین نظر خریداران'],['popular','محبوب‌ترین'],['best_selling','پرفروش‌ترین'],['views','پربازدیدترین']];
 const sortMarkup=sortOptions.map(([v,l])=>'<option value="'+v+'" '+(sort===v?'selected':'')+'>'+l+'</option>').join('');
 const categoryMarkup=state.categories.map(c=>'<label class="check-option"><input class="cat-check" type="checkbox" data-id="'+escapeHtml(c.id)+'" '+((c.id===category)?'checked':'')+'><span class="check-box" aria-hidden="true"></span><span>'+escapeHtml(c.name)+'</span></label>').join('');
 const loadMore=async(reset=false)=>{
  if(reset){requestSeq++;controller?.abort();controller=new AbortController();offset=0;done=false;loading=false;document.querySelector('#results')?.replaceChildren()}
  if(loading||done)return;
  loading=true;const token=requestSeq,localController=controller||new AbortController();controller=localController;
  const status=document.querySelector('#load-status'),more=document.querySelector('#load-more');
  if(status)status.textContent=reset?'در حال به‌روزرسانی گالری…':'در حال دریافت آثار بیشتر…';
  if(more){more.disabled=true;more.setAttribute('aria-busy','true')}
  try{
   const qs=new URLSearchParams({limit:String(pageSize),offset:String(offset),sort});if(query)qs.set('q',query);if(category)qs.set('category',category);
   const d=await api('/api/products?'+qs.toString(),{signal:localController.signal});if(token!==requestSeq)return;
   const items=Array.isArray(d.items)?d.items:[];const html=items.map(productCard).join('');
   if(reset)document.querySelector('#results')?.replaceChildren();
   if(html)document.querySelector('#results')?.insertAdjacentHTML('beforeend',html);
   offset+=items.length;done=items.length<pageSize;
   const count=document.querySelector('#results-count');if(count)count.textContent=fa(offset)+' اثر بارگذاری شده';
   const empty=document.querySelector('#empty');if(empty)empty.hidden=offset!==0;
   if(status)status.textContent=done?(offset?'همه آثار این فهرست نمایش داده شد.':'نتیجه‌ای پیدا نشد.'):'با اسکرول ادامه دهید یا از دکمه «نمایش صفحه بعدی» استفاده کنید.';
   if(more)more.hidden=done;
   startFlashTimers(document.querySelector('#results'));
  }catch(e){if(e?.name==='AbortError')return;if(status)status.textContent=e.message||'خطا در دریافت آثار.';throw e}
  finally{if(token===requestSeq){loading=false;if(more){more.disabled=false;more.removeAttribute('aria-busy')}}}
 };
 const hero=featuredImage?'<a class="shop-page-visual" href="'+productUrl(featuredProduct.slug)+'" aria-label="مشاهده اثر '+escapeHtml(featuredProduct.name)+'"><img src="'+escapeHtml(featuredImage)+'" alt="'+escapeHtml(featuredProduct.name)+'" fetchpriority="high" decoding="async"><span><small>اثر منتخب</small><strong>'+escapeHtml(featuredProduct.name)+'</strong></span></a>':'<div class="shop-page-visual shop-page-visual-empty"><span>GILAS ART</span><strong>گالری آثار</strong></div>';
 layout('<section class="wrap page shop-page"><header class="page-masthead"><div class="page-masthead-copy"><span class="eyebrow">GILAS ART • COPPER INLAY</span><h1>گالری آثار</h1><p>مجموعه‌ای منظم برای تماشای آثار، جستجو و انتخاب دقیق.</p></div>'+hero+'</header><section class="gallery-workspace" aria-label="جستجو، فیلتر و مرتب‌سازی آثار"><aside class="filter-panel"><div class="filter-panel-head"><div><span class="eyebrow">FILTER & SORT</span><h2>فیلتر و مرتب‌سازی</h2></div><button class="filter-reset" id="filter-reset" type="button">پاک کردن</button></div><label class="search-field"><span>جستجو</span><input id="q" class="search" type="search" placeholder="نام یا کد محصول" autocomplete="off" enterkeyhint="search"></label><label class="sort-field" for="sort-products"><span>مرتب‌سازی آثار</span><select id="sort-products" aria-label="مرتب‌سازی آثار">'+sortMarkup+'</select></label><fieldset class="filter-group"><legend>دسته‌بندی</legend><label class="check-option"><input class="cat-check" type="checkbox" data-id="" '+(!category?'checked':'')+'><span class="check-box" aria-hidden="true"></span><span>همه آثار</span></label>'+categoryMarkup+'</fieldset><div class="filter-help">جستجو، دسته‌بندی و مرتب‌سازی همگی همزمان روی گالری اعمال می‌شوند.</div></aside><div class="gallery-results"><div class="results-head"><div><span class="eyebrow">GALLERY COLLECTION</span><h2>آثار موجود</h2></div><span class="results-count" id="results-count" aria-live="polite"></span></div><div id="results" class="grid product-stream" aria-live="polite"></div><div id="sentinel" class="infinite-sentinel" aria-hidden="true"></div><div class="load-more-wrap"><button id="load-more" class="btn ghost load-more-button" type="button">نمایش صفحه بعدی</button><div id="load-status" class="load-status" role="status" aria-live="polite">در حال آماده سازی گالری ...</div></div><div id="empty" class="panel empty-state" hidden>نتیجه‌ای پیدا نشد.</div></div></section></section>');
 sentinel=document.querySelector('#sentinel');
 observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadMore(false)}, {rootMargin:'650px 0px'});observer.observe(sentinel);
 const rerun=()=>{clearTimeout(window.__gaSearchTimer);window.__gaSearchTimer=setTimeout(()=>loadMore(true).catch(()=>{}),220)}; document.querySelector('#q').addEventListener('input',()=>{query=document.querySelector('#q').value.trim();rerun()});
 document.querySelector('#q').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();query=document.querySelector('#q').value.trim();clearTimeout(window.__gaSearchTimer);loadMore(true).catch(()=>{})}});
 document.querySelector('#sort-products').addEventListener('change',e=>{sort=e.target.value;rerun()});
 document.querySelectorAll('.cat-check').forEach(x=>x.addEventListener('change',()=>{if(x.checked){category=x.dataset.id||'';document.querySelectorAll('.cat-check').forEach(y=>{if(y!==x)y.checked=false});rerun()}else if(!document.querySelector('.cat-check:checked')){category='';rerun()}}));
 document.querySelector('#filter-reset').onclick=()=>{query='';category='';sort='newest';document.querySelector('#q').value='';document.querySelector('#sort-products').value=sort;document.querySelectorAll('.cat-check').forEach(x=>x.checked=false);document.querySelector('.cat-check[data-id=""]')?.click();loadMore(true).catch(()=>{})};
 document.querySelector('#load-more').onclick=()=>loadMore(false).catch(()=>{});
 await loadMore(true);
}
async function product(slug){
 const d=await api('/api/products/'+encodeURIComponent(slug)),p=d.product||{},images=d.images||[],attributes=d.attributes||[],categories=d.categories||[];
 try{const key='GilasArtViewed:'+String(p.id||slug);if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');api('/api/products/'+encodeURIComponent(slug)+'/view',{method:'POST'}).catch(()=>{})}}catch{}
 const image=safeUrl(p.image);
 setSeo({title:p.seo_title||p.name+' | گیلاس آرت',description:p.seo_description||p.description,image:image||undefined,jsonLd:{'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description||'',sku:p.sku,image:images.map(x=>safeUrl(x.path)).filter(Boolean),offers:{'@type':'Offer',priceCurrency:'IRR',price:String(p.price_irt),availability:'https://schema.org/InStock',url:location.href}}});
 const mediaItems=images.map((x,i)=>({type:'image',src:safeUrl(x.path),alt:x.alt_text||p.name,index:i})).filter(x=>x.src);
 if(p.video_url)mediaItems.push({type:'video',src:safeUrl(p.video_url),alt:'ویدئوی محصول',index:mediaItems.length});
 const first=mediaItems[0]||null;
 const mediaHtml=item=>item?.type==='video'?'<video class="product-video-player" controls playsinline preload="metadata" src="'+escapeHtml(item.src)+'"><p>مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.</p></video>':item?.src?'<img src="'+escapeHtml(item.src)+'" alt="'+escapeHtml(item.alt||p.name)+'">':'<div class="product-media-empty">اثر هنری</div>';
 const optionHtml=attributes.map(a=>'<label class="product-option"><span>'+escapeHtml(a.name)+'</span><select data-attribute-id="'+escapeHtml(a.id)+'">'+a.options.map(o=>'<option value="'+escapeHtml(o.id)+'" data-delta="'+Number(o.price_delta_irt||0)+'" '+(o.is_default?'selected':'')+'>'+escapeHtml(o.name)+(Number(o.price_delta_irt||0)?' (+'+fa(o.price_delta_irt)+' ریال)':'')+'</option>').join('')+'</select></label>').join('');
 layout('<section class="wrap page product"><div class="product-gallery"><div id="product-media" class="product-media">'+mediaHtml(first)+'</div><div class="product-thumbs">'+mediaItems.map((x,i)=>x.type==='video'?'<button class="product-thumb video-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش ویدئوی محصول"><span>▶</span><small>ویدئو</small></button>':'<button class="product-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش تصویر '+(i+1)+'"><img src="'+escapeHtml(x.src)+'" alt=""></button>').join('')+'</div></div><div class="product-info"><div class="product-category-pills">'+(categories.length?categories:[{name:p.category_name||'اثر هنری'}]).map(x=>'<span class="pill">'+escapeHtml(x.name)+'</span>').join('')+'</div><h1>'+escapeHtml(p.name)+'</h1><p class="muted">'+escapeHtml(p.description||'')+'</p>'+(optionHtml?'<div class="panel product-options-panel"><h3>انتخاب ویژگی‌ها</h3><div class="product-options">'+optionHtml+'</div></div>':'')+'<div class="price product-live-price" id="product-live-price" style="font-size:24px;margin:24px 0">'+fa(p.price_irt)+' ریال</div><div class="muted" id="product-price-breakdown"></div><div class="toolbar"><div class="product-cart-control" id="product-cart-control" aria-live="polite"><button class="btn primary product-add-btn" id="add" type="button">افزودن به سبد</button></div><button class="btn ghost" id="fav">ذخیره</button></div><div class="quantity-discount-card" id="quantity-discount-card"></div><div class="panel"><h3>نظر خریداران</h3>'+((d.reviews||[]).map(r=>'<article class="review-card" data-review-id="'+escapeHtml(r.id)+'"><div class="review-head"><div><b>'+escapeHtml(r.name||'خریدار')+'</b><div class="review-stars" aria-label="امتیاز '+Number(r.rating||0)+' از 5">'+('★'.repeat(Math.max(0,Math.min(5,Number(r.rating)||0))))+'</div></div><time class="muted">'+escapeHtml(jalaliDate(r.created_at)||'')+'</time></div><p class="review-body">'+escapeHtml(r.body||'')+'</p><div class="review-reactions"><button type="button" class="review-reaction" data-reaction="like" aria-label="پسندیدن نظر">👍 <span>'+fa(r.like_count||0)+'</span></button><button type="button" class="review-reaction" data-reaction="dislike" aria-label="نپسندیدن نظر">👎 <span>'+fa(r.dislike_count||0)+'</span></button></div></article>').join('')||'<span class="muted">هنوز نظری ثبت نشده است.</span>')+'<div class="panel"><h3>ثبت نظر</h3><form id="review-form" class="form"><label>امتیاز<select name="rating"><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select></label><label>نظر شما<textarea name="body" maxlength="1000" required placeholder="نظر خود درباره این اثر را بنویسید"></textarea></label><button class="btn primary" type="submit">ثبت نظر</button><div id="review-msg" aria-live="polite"></div></form></div></div></div></section>');
 document.querySelectorAll('.review-reaction').forEach(btn=>btn.addEventListener('click',async()=>{
   const card=btn.closest('.review-card'),reviewId=card?.dataset.reviewId,reaction=btn.dataset.reaction;
   if(!reviewId||!reaction)return;
   try{
     await ensureLogin();
     const result=await api('/api/reviews/'+encodeURIComponent(reviewId)+'/reaction',{method:'POST',body:JSON.stringify({reaction}),headers:{'x-csrf-token':csrf()}});
     const buttons=card.querySelectorAll('.review-reaction');
     buttons.forEach(b=>{
       const n=b.dataset.reaction==='like'?result.like_count:result.dislike_count;
       b.querySelector('span').textContent=fa(n);
       b.classList.toggle('active',b.dataset.reaction===result.my_reaction);
     });
   }catch(err){alert(err.message||'ثبت واکنش انجام نشد.')}
  }));
 const showMedia=(index)=>{const i=Math.max(0,Math.min(mediaItems.length-1,index));const item=mediaItems[i];const media=document.querySelector('#product-media');if(media)media.innerHTML=mediaHtml(item);document.querySelectorAll('.product-thumb').forEach(x=>x.classList.toggle('active',Number(x.dataset.index)===i));return i};
 document.querySelectorAll('.product-thumb').forEach(b=>b.onclick=()=>showMedia(Number(b.dataset.index)));
 const media=document.querySelector('#product-media');
 if(media){
   media.tabIndex=0;
   media.setAttribute('role','region');
   media.setAttribute('aria-label','گالری تصاویر محصول');
 }
 if(media&&mediaItems.length>1){
   let touchStartX=0,touchStartY=0;
   media.addEventListener('touchstart',e=>{const t=e.changedTouches[0];touchStartX=t.clientX;touchStartY=t.clientY},{passive:true});
   media.addEventListener('touchend',e=>{const t=e.changedTouches[0],dx=t.clientX-touchStartX,dy=t.clientY-touchStartY;if(Math.abs(dx)<45||Math.abs(dx)<Math.abs(dy))return;const active=Number(document.querySelector('.product-thumb.active')?.dataset.index||0);showMedia(active+(dx<0?1:-1))},{passive:true});
   media.addEventListener('keydown',e=>{if(e.key!=='ArrowLeft'&&e.key!=='ArrowRight')return;e.preventDefault();const active=Number(document.querySelector('.product-thumb.active')?.dataset.index||0);showMedia(active+(e.key==='ArrowLeft'?-1:1))});
 }
 const selections=()=>[...document.querySelectorAll('.product-option select')].map(x=>({attributeId:x.dataset.attributeId,optionId:x.value}));
 const recalc=()=>{let delta=0;document.querySelectorAll('.product-option option:checked').forEach(o=>delta+=Number(o.dataset.delta||0));const total=Number(p.price_irt||0)+delta;document.querySelector('#product-live-price').textContent=fa(total)+' ریال';document.querySelector('#product-price-breakdown').textContent=delta?'قیمت پایه: '+fa(p.price_irt)+' ریال + افزایش ویژگی‌ها: '+fa(delta)+' ریال':'';return total};
 const productCartControl=document.querySelector('#product-cart-control');
 let productCartQuantity=0;
 const renderProductCartControl=qty=>{
   productCartQuantity=Math.max(0,Math.min(99,Number(qty)||0));
   if(!productCartControl)return;
   if(productCartQuantity<=0){
     productCartControl.innerHTML='<button class="btn primary product-add-btn" id="add" type="button">افزودن به سبد</button>';
     document.querySelector('#add').onclick=async()=>{try{const btn=document.querySelector('#add');if(btn?.disabled)return;btn?.setAttribute('disabled','disabled');const meData=await loadMe();if(!meData?.user)await ensureLogin();const token=csrf();if(!token)throw new Error('جلسه خرید منقضی شده است؛ لطفاً دوباره وارد حساب شوید.');await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:1,options:selections()}),headers:{'x-csrf-token':token}});await syncCartBadge();renderProductCartControl(1);alert('به سبد خرید اضافه شد')}catch(e){const msg=String(e?.message||'');alert(msg==='cart_add_failed'?'افزودن به سبد خرید در حال حاضر انجام نشد؛ لطفاً دوباره تلاش کنید.':msg||'افزودن به سبد خرید انجام نشد.')}finally{document.querySelector('#add')?.removeAttribute('disabled')}};
     return;
   }
   productCartControl.innerHTML='<div class="product-qty-control" role="group" aria-label="تعداد این تابلو در سبد خرید"><button class="product-qty-btn product-qty-minus" id="product-qty-minus" type="button" aria-label="کاهش تعداد">−</button><div class="product-qty-summary"><span>افزودن به سبد</span><strong>'+fa(productCartQuantity)+'</strong><small>تعداد انتخاب‌شده</small></div><button class="product-qty-btn product-qty-plus" id="product-qty-plus" type="button" aria-label="افزایش تعداد">+</button></div>';
   const changeQuantity=async next=>{
     const target=Math.max(0,Math.min(99,Number(next)||0));
     const buttons=productCartControl.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);
     try{
       if(target===0){
         await api('/api/cart?productId='+encodeURIComponent(p.id),{method:'DELETE',headers:{'x-csrf-token':csrf()}});
       }else{
         await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:target}),headers:{'x-csrf-token':csrf()}});
       }
       await syncCartBadge();
       renderProductCartControl(target);
     }catch(e){
       buttons.forEach(b=>b.disabled=false);
       alert(e.message||'تغییر تعداد انجام نشد.');
     }
   };
   document.querySelector('#product-qty-minus').onclick=()=>changeQuantity(productCartQuantity-1);
   document.querySelector('#product-qty-plus').onclick=()=>changeQuantity(productCartQuantity+1);
 };
 const loadProductCartQuantity=async()=>{
   if(!state.user){renderProductCartControl(0);return}
   try{
     const cartData=await api('/api/cart');
     const line=(cartData.items||[]).find(x=>String(x.product_id)===String(p.id));
     renderProductCartControl(line?Number(line.quantity):0);
   }catch(e){renderProductCartControl(-1);console.warn('cart_quantity_unavailable',e)}
 };
 const quantityTiers=Array.isArray(d.quantityDiscountTiers)?d.quantityDiscountTiers.filter(x=>Number(x.min)>1&&Number(x.percent)>0):[]; const quantityDiscountCard=document.querySelector('#quantity-discount-card'); if(quantityDiscountCard&&quantityTiers.length){const next=quantityTiers[0];quantityDiscountCard.innerHTML='<div class="quantity-discount-head"><span class="quantity-discount-icon">٪</span><div><strong>با خرید چندتایی، بیشتر صرفه‌جویی کنید</strong><small>تخفیف تعدادی فقط برای همین محصول و بر اساس تعداد سفارش محاسبه می‌شود.</small></div></div><div class="quantity-discount-tiers">'+quantityTiers.map(x=>'<span><b>'+fa(x.min)+' عدد</b><em>'+fa(x.percent)+'٪</em></span>').join('')+'</div><div class="quantity-discount-note">از '+fa(next.min)+' عدد، '+fa(next.percent)+'٪ تخفیف خودکار در سبد خرید اعمال می‌شود.</div></div>'}
 document.querySelectorAll('.product-option select').forEach(x=>x.addEventListener('change',recalc));recalc();loadProductCartQuantity();
  document.querySelector('#fav').onclick=async()=>{
    try{
      await ensureLogin();
      await api('/api/favorites',{method:'POST',body:JSON.stringify({productId:p.id}),headers:{'x-csrf-token':csrf()}});
      alert('ذخیره شد');
    }catch(e){alert(e.message)}
  };
  document.querySelector('#review-form')?.addEventListener('submit',async e=>{
    e.preventDefault();
    const f=new FormData(e.target),m=document.querySelector('#review-msg');
    try{      await ensureLogin();
      await api('/api/products/'+encodeURIComponent(slug)+'/reviews',{method:'POST',body:JSON.stringify({rating:Number(f.get('rating')),body:f.get('body')}),headers:{'x-csrf-token':csrf()}});
      m.innerHTML='<span class="ok">نظر شما ثبت شد و پس از بررسی منتشر می‌شود.</span>';
      e.target.reset();
    }catch(err){
      m.innerHTML='<span class="error">'+escapeHtml(err.message||'ثبت نظر انجام نشد.')+'</span>';
    }
  });
}
async function ensureLogin(){if(state.user)return;await account();if(!state.user)throw new Error('ابتدا وارد حساب شوید')}
let notificationTimer=null,notificationShowingId='';
function showNotificationHint(item){
 const id=String(item?.id||'');if(!id||notificationShowingId===id)return;
 const existing=document.querySelector('#ga-notification-hint');existing?.remove();notificationShowingId=id;
 const referral=String(item?.type||'')==='referral_reward';
 const el=document.createElement('div');el.id='ga-notification-hint';el.className=referral?'ga-notification-hint ga-galaxy-reward':'ga-notification-hint';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
 const points=(String(item?.message||'').match(/(\d+)\s*امتیاز/)||[])[1]||'';
 el.innerHTML=referral?'<div class="ga-stars" aria-hidden="true"></div><div class="ga-galaxy-orb">✦</div><div class="ga-reward-content"><span class="eyebrow">GILAS ART REWARDS</span><h2>'+escapeHtml(item.title||'یک خبر شیرین برای شما')+'</h2><p>'+escapeHtml(item.message||'')+'</p>'+(points?'<strong class="ga-reward-points">+'+fa(points)+' امتیاز</strong>':'')+'<button type="button" class="btn primary ga-reward-close">ادامه</button></div>':'<div class="ga-notification-icon">✦</div><div><strong>'+escapeHtml(item.title||'خبر جدید از گیلاس آرت')+'</strong><p>'+escapeHtml(item.message||'')+'</p></div><button type="button" aria-label="بستن اعلان">×</button>';
 document.body.appendChild(el);
 const close=async()=>{if(!document.body.contains(el))return;el.remove();notificationShowingId='';try{await api('/api/notifications/read',{method:'POST',headers:{'x-csrf-token':csrf()},body:JSON.stringify({id})})}catch{}};
 el.querySelector('.ga-reward-close')?.addEventListener('click',close);el.querySelector('[aria-label="بستن اعلان"]')?.addEventListener('click',close);if(!referral)setTimeout(close,9000);
}async function pollNotifications(){
 if(!state.user)return;
 try{const d=await api('/api/notifications');const items=Array.isArray(d.items)?d.items:[];if(items[0])showNotificationHint(items[0])}catch{}
}
function startNotificationPolling(){
 clearInterval(notificationTimer);notificationTimer=null;
 if(state.user){pollNotifications();notificationTimer=setInterval(()=>{pollNotifications()},10000)}
}
async function loadMe(){try{const d=await api('/api/me');state.user=d.user||null;state.roles=d.roles||[];state.permissions=d.permissions||[];csrfToken=d.csrfToken||csrfToken;if(state.user){try{state.rewards=await api('/api/rewards');state.points=Number(state.rewards.balance||0)}catch{state.rewards=null;state.points=0}await syncCartBadge()}else{state.rewards=null;state.points=0;updateCartBadge(0)}startNotificationPolling();return d}catch(e){return null}}
async function cart(){
 await loadMe();
 if(!state.user){
  layout('<section class="wrap page"><div class="panel"><h2>سبد خرید</h2><p>برای دیدن سبد خرید وارد حساب شوید.</p><a class="btn primary" href="#/account">ورود</a></div></section>');
  return;
 }
 let d=await api('/api/cart'),addressData={items:[]},couponCode='',couponMessage='';
 try{addressData=await api('/api/addresses')}catch{}
 const savedAddress=(addressData.items||[])[0]||{};
 const idempotencyKey=()=>((crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/-/g,''));
 const render=(p=d)=>{
  const items=p.items||[];
  const lines=items.map(x=>{
   const opts=x.selected_options?.length?'<div class="cart-options">'+x.selected_options.map(o=>escapeHtml(o.attributeName)+': '+escapeHtml(o.optionName)+(Number(o.priceDeltaIrt||0)?' (+'+fa(o.priceDeltaIrt)+' ریال)':'')).join(' · ')+'</div>':'';
   const href=productUrl(x.slug||x.product_slug||'');
   const lineTotal=Number((x.unit_price_irt??x.price_irt)||0)*Number(x.quantity||0); const qtyDiscount=Number(x.quantity_discount_irt||0); const finalLineTotal=Number(x.line_total_after_quantity_discount_irt??lineTotal); const qtyDiscountLabel=Number(x.quantity_discount_percent||0)>0?'<span class="cart-quantity-discount">'+fa(x.quantity_discount_percent)+'٪ تخفیف تعدادی · '+fa(qtyDiscount)+' ریال صرفه‌جویی</span>':'';
   return '<article class="cartline"><a class="cart-product-link" href="'+href+'" aria-label="مشاهده '+escapeHtml(x.name)+'"><span class="cart-product-thumb">'+(x.image?'<img src="'+escapeHtml(safeUrl(x.image))+'" alt="'+escapeHtml(x.name)+'">':'<span>گیلاس آرت</span>')+'</span><span class="grow"><b>'+escapeHtml(x.name)+'</b><span class="muted">'+fa(x.unit_price_irt??x.price_irt)+' ریال × '+fa(x.quantity)+'</span><strong class="cart-line-total">'+fa(finalLineTotal)+' ریال</strong>'+(qtyDiscount>0?'<span class="cart-line-old-total">'+fa(lineTotal)+' ریال</span>':'')+qtyDiscountLabel+opts+'</span></a><div class="cart-qty" role="group" aria-label="تعداد '+escapeHtml(x.name)+'"><button class="cart-qty-btn" data-id="'+escapeHtml(x.product_id)+'" data-qty="'+Math.max(1,Number(x.quantity)-1)+'" type="button" aria-label="کاهش تعداد">−</button><span>'+fa(x.quantity)+'</span><button class="cart-qty-btn" data-id="'+escapeHtml(x.product_id)+'" data-qty="'+Math.min(99,Number(x.quantity)+1)+'" type="button" aria-label="افزایش تعداد">+</button></div><button class="btn ghost del" data-id="'+escapeHtml(x.product_id)+'" type="button">حذف</button></article>';
  }).join('');
  const empty=!items.length;
  const summary=empty?'':'<div class="cart-section cart-pricing"><div class="cart-section-title"><div><span class="eyebrow">ORDER SUMMARY</span><h2>خلاصه سفارش</h2></div><span class="cart-items-count">'+fa(items.length)+' محصول</span></div><div class="quantity-discount-summary">'+((p.items||[]).filter(x=>Number(x.quantity_discount_irt||0)>0).map(x=>'<div><span>'+escapeHtml(x.name)+' × '+fa(x.quantity)+'</span><b>− '+fa(x.quantity_discount_irt)+' ریال</b></div>').join('')||'<span class="muted">با افزایش تعداد هر محصول، تخفیف تعدادی به‌صورت خودکار اعمال می‌شود.</span>')+'</div><div class="coupon-box cart-coupon"><div><label for="coupon-code">کد تخفیف</label><input id="coupon-code" dir="ltr" inputmode="text" autocomplete="off" value="'+escapeHtml(couponCode)+'" placeholder="GLS________"></div><button class="btn ghost" id="apply-coupon" type="button">اعمال کوپن</button><div id="coupon-message" class="'+(couponMessage?'ok':'muted')+'">'+escapeHtml(couponMessage)+'</div></div><div class="price-summary cart-total-list"><div><span>جمع کالاها</span><b>'+fa(p.subtotal_irt)+' ریال</b></div><div><span>تخفیف</span><b>'+fa(p.discount_irt)+' ریال</b></div><div><span>هزینه ارسال</span><b>'+fa(p.shipping_irt)+' ریال</b></div><div class="cart-grand-total"><span>مبلغ قابل پرداخت</span><strong>'+fa(p.total_irt)+' ریال</strong></div></div></div>';
  const address=empty?'':'<div class="cart-section cart-address"><div class="cart-section-title"><div><span class="eyebrow">DELIVERY</span><h2>اطلاعات تحویل</h2><p class="muted">این اطلاعات برای ثبت سفارش و ارسال تابلو استفاده می‌شود.</p></div><span class="cart-secure-note">اطلاعات شما امن ارسال می‌شود</span></div><div class="cart-address-grid"><label>نام گیرنده<input id="rn" value="'+escapeHtml(savedAddress.recipient_name||state.user.name||'')+'" autocomplete="name" required></label><label>شماره موبایل گیرنده<input id="rm" value="'+escapeHtml(savedAddress.mobile||state.user.mobile||'')+'" inputmode="tel" autocomplete="tel" maxlength="11" dir="ltr" required></label><label>استان<input id="pr" value="'+escapeHtml(savedAddress.province||'')+'" autocomplete="address-level1" required></label><label>شهر<input id="ct" value="'+escapeHtml(savedAddress.city||'')+'" autocomplete="address-level2" required></label><label class="cart-address-wide">نشانی کامل<textarea id="ad" autocomplete="street-address" rows="4" required>'+escapeHtml(savedAddress.address||'')+'</textarea></label><label>کد پستی<input id="pc" value="'+escapeHtml(savedAddress.postal_code||'')+'" inputmode="numeric" maxlength="10" autocomplete="postal-code" dir="ltr" required></label></div></div>';
  const action=empty?'':'<div class="cart-checkout-bar"><div><span>مبلغ نهایی</span><strong>'+fa(p.total_irt)+' ریال</strong><small>با کلیک روی پرداخت، سفارش ثبت و به درگاه امن منتقل می‌شوید.</small></div><button class="btn primary cart-pay-btn" id="order" type="button">ثبت سفارش و پرداخت</button></div><div id="msg" class="cart-order-message" aria-live="polite"></div>';
  layout('<section class="wrap page cart-page"><div class="cart-hero"><div><span class="eyebrow">GILASART CHECKOUT</span><h1>سبد خرید</h1><p>همه چیز برای تکمیل خرید شما در همین صفحه آماده است.</p></div><div class="cart-hero-badge">'+fa(items.length)+' محصول</div></div><div class="cart-layout"><div class="cart-main"><div class="panel cart-items-panel"><div class="cart-section-title"><div><span class="eyebrow">YOUR ARTWORKS</span><h2>محصولات انتخاب‌شده</h2></div><span class="cart-items-count">'+fa(items.length)+' محصول</span></div><div class="cart-items-list">'+(lines||'<div class="cart-empty"><strong>سبد خرید شما خالی است.</strong><p>آثار مورد علاقه‌تان را از فروشگاه انتخاب کنید.</p><a class="btn primary" href="#/shop">مشاهده فروشگاه</a></div>')+'</div></div>'+address+summary+action+'</div><aside class="cart-side"><div class="cart-trust"><span class="eyebrow">GILASART</span><h3>خریدی ساده و مطمئن</h3><p>اطلاعات تحویل، تخفیف و مبلغ نهایی را قبل از پرداخت یکجا بررسی کنید.</p><div class="cart-trust-item">✓ اطلاعات سفارش قبل از پرداخت قابل بررسی است</div><div class="cart-trust-item">✓ پرداخت از طریق درگاه فروشگاه انجام می‌شود</div><div class="cart-trust-item">✓ شماره همراه از حساب شما دریافت می‌شود</div></div></aside></div></section>');
 };
 const bind=()=>{
  document.querySelectorAll('.cart-qty-btn').forEach(b=>b.onclick=async()=>{
   if(b.disabled)return;
   b.disabled=true;
   try{await api('/api/cart',{method:'POST',body:JSON.stringify({productId:b.dataset.id,quantity:Number(b.dataset.qty)}),headers:{'x-csrf-token':csrf()}});await cart()}catch(e){b.disabled=false;alert(e.message||'تغییر تعداد انجام نشد.')}
  });
  document.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{
   if(b.disabled)return;
   b.disabled=true;
   try{await api('/api/cart?productId='+encodeURIComponent(b.dataset.id),{method:'DELETE',headers:{'x-csrf-token':csrf()}});await cart()}catch(e){b.disabled=false;alert(e.message||'حذف محصول انجام نشد.')}
  });
  document.querySelector('#apply-coupon')?.addEventListener('click',async()=>{
   const input=document.querySelector('#coupon-code'),code=String(input?.value||'').trim();
   const m=document.querySelector('#coupon-message');
   if(!code){if(m){m.className='error';m.textContent='کد تخفیف را وارد کنید.'}return}
   try{
    const priced=await api('/api/cart/price',{method:'POST',body:JSON.stringify({code}),headers:{'x-csrf-token':csrf()}});
    couponCode=code;couponMessage='کوپن اعمال شد: '+fa(priced.coupon_discount_irt||0)+' ریال تخفیف';
    render(priced);bind();
   }catch(e){
    if(m){m.className='error';m.textContent=e.message==='coupon_not_found'?'کد کوپن معتبر نیست.':e.message==='coupon_expired_or_inactive'?'کد کوپن منقضی یا غیرفعال است.':e.message==='coupon_usage_limit'?'سقف استفاده از این کوپن تکمیل شده است.':e.message==='coupon_already_used'?'این کوپن قبلاً برای حساب شما استفاده شده است.':e.message==='coupon_not_applicable'?'این کوپن برای محصولات سبد شما قابل استفاده نیست.':e.message==='coupon_min_order'?'حداقل مبلغ خرید این کوپن رعایت نشده است.':'اعمال کوپن با خطا مواجه شد.'}
   }
  });
  document.querySelector('#order')?.addEventListener('click',async()=>{
   const button=document.querySelector('#order'),msg=document.querySelector('#msg');
   const values={recipientName:String(document.querySelector('#rn')?.value||'').trim(),mobile:String(document.querySelector('#rm')?.value||'').replace(/\D/g,''),province:String(document.querySelector('#pr')?.value||'').trim(),city:String(document.querySelector('#ct')?.value||'').trim(),address:String(document.querySelector('#ad')?.value||'').trim(),postalCode:String(document.querySelector('#pc')?.value||'').replace(/\D/g,'')};
   if(!values.recipientName||!values.mobile||!values.province||!values.city||!values.address||!values.postalCode){if(msg)msg.innerHTML='<span class="error">لطفاً همه اطلاعات تحویل را کامل کنید.</span>';return}
   if(!/^09\d{9}$/.test(values.mobile)){if(msg)msg.innerHTML='<span class="error">شماره موبایل گیرنده باید معتبر باشد.</span>';return}
   if(!/^\d{10}$/.test(values.postalCode)){if(msg)msg.innerHTML='<span class="error">کد پستی باید ۱۰ رقم باشد.</span>';return}
   if(button.disabled)return;
   button.disabled=true;button.textContent='در حال ثبت سفارش…';if(msg)msg.textContent='';
   try{
    const a=await api('/api/addresses',{method:'POST',body:JSON.stringify(values),headers:{'x-csrf-token':csrf()}});
    const o=await api('/api/orders',{method:'POST',body:JSON.stringify({addressId:a.addressId,idempotencyKey:idempotencyKey(),couponCode}),headers:{'x-csrf-token':csrf()}});
    const pay=await api('/api/orders/'+encodeURIComponent(o.orderId)+'/pay',{method:'POST',headers:{'x-csrf-token':csrf()}});
    if(!pay?.url)throw new Error('آدرس درگاه پرداخت از سرور دریافت نشد.');
    if(msg)msg.innerHTML='<span class="ok">سفارش ثبت شد؛ در حال انتقال به درگاه پرداخت…</span>';
    location.href=pay.url;
   }catch(e){
    button.disabled=false;button.textContent='ثبت سفارش و پرداخت';
    if(msg)msg.innerHTML='<span class="error">'+escapeHtml(e.message||'ثبت سفارش یا پرداخت انجام نشد.')+'</span>';
   }
  });
 };
 render(d);bind();
}const ORDER_STATUS_LABELS_PUBLIC={PENDING:'در انتظار پرداخت',PAID:'پرداخت شد',PROCESSING:'در حال پردازش',SHIPPED:'ارسال شد',DELIVERED:'تحویل شد',CANCELLED:'لغو شد',FAILED:'ناموفق'};
const orderStatusPublic=s=>ORDER_STATUS_LABELS_PUBLIC[String(s||'').toUpperCase()]||String(s||'نامشخص');
function invoiceHtmlData(d){
 const o=d.order||{},items=d.items||[],p=d.payment||{},cfg=d.invoice||{};
 const paid=['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(o.status||'').toUpperCase())||String(p.status||'').toUpperCase()==='PAID'; const title=paid?'فاکتور فروش':'پیش فاکتور فروش';
 const esc=escapeHtml;
 const rows=items.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.sku||'-')+'</td><td>'+esc(x.quantity)+'</td><td>'+fa(x.unit_price_irt)+'</td><td>'+fa(x.line_total_irt)+'</td></tr>').join('');
 const logo=cfg.invoice_logo_path||'/glsArt/invoice/logo.svg',sig=cfg.invoice_signature_path||'';
 return '<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>'+esc(title)+' - '+esc(o.id)+'</title><style>@page{size:A4;margin:12mm}body{font-family:Vazirmatn,Tahoma,Arial,sans-serif;color:#1b1a18;background:#fff;margin:0}.invoice{max-width:900px;margin:auto;padding:26px}.head{text-align:center;border-bottom:2px solid #d9a441;padding-bottom:18px}.head img{width:145px;max-height:58px;object-fit:contain}.head h1{margin:12px 0 0;font-size:26px}.meta{display:flex;gap:16px;margin:18px 0}.box{border:1px solid #d9d3c8;border-radius:10px;padding:12px;flex:1;line-height:2;font-size:13px}.box h3{margin:0 0 5px;font-size:14px;color:#8c6418}.items{width:100%;border-collapse:collapse;margin-top:18px}.items th,.items td{border:1px solid #d9d3c8;padding:9px;text-align:center;font-size:12px}.items th{background:#f5f1e9}.sum{margin-top:14px;display:flex;justify-content:flex-end}.sum-box{min-width:270px;border:1px solid #d9d3c8;border-radius:10px;padding:12px}.sum-box b{font-size:16px}.sign{display:flex;justify-content:flex-start;margin-top:45px;min-height:115px}.sign img{max-width:190px;max-height:110px;object-fit:contain}.muted{color:#777;font-size:11px}@media(max-width:700px){.meta{flex-direction:column}}@media print{.invoice{padding:0}}</style></head><body><article class="invoice"><header class="head"><img src="'+esc(logo)+'" alt="لوگوی گیلاس آرت" onerror="this.style.display=\'none\'"><h1>'+esc(title)+'</h1></header><div class="meta"><section class="box"><h3>مشخصات فروشنده</h3><div><b>'+esc(cfg.invoice_store_name||'فروشگاه صنایع دستی گیلاس آرت')+'</b></div><div>کد اقتصادی: '+esc(cfg.invoice_economic_code||'—')+'</div><div>تلفن: '+esc(cfg.invoice_phone||'—')+' | همراه: '+esc(cfg.invoice_mobile||'—')+'</div><div>آدرس: '+esc(cfg.invoice_address||'—')+'</div></section><section class="box"><h3>مشخصات مشتری</h3><div>نام و نام خانوادگی: '+esc(o.name||o.recipient_name||'—')+'</div><div>تلفن: '+esc(o.address_mobile||o.mobile||'—')+'</div><div>آدرس: '+esc([o.province,o.city,o.address].filter(Boolean).join('، ')||'—')+'</div></section></div><div class="box"><div>شماره سفارش: <b>'+esc(o.id)+'</b></div><div>تاریخ ثبت: '+esc(jalaliDate(o.created_at))+'</div><div>وضعیت: <b>'+esc(orderStatusPublic(o.status))+'</b></div></div><table class="items"><thead><tr><th>شرح سفارش</th><th>کد</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead><tbody>'+rows+'</tbody></table><div class="sum"><div class="sum-box">جمع کل سفارش: <b>'+fa(o.total_irt)+' تومان</b></div></div><div class="sign">'+(sig?'<img src="'+esc(sig)+'" alt="مهر و امضا" onerror="this.style.display=\'none\'">':'<span class="muted">مهر و امضا در تنظیمات فاکتور ثبت نشده است.</span>')+'</div></article><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>';
}
function openInvoiceWindow(d){
 const w=window.open('','_blank','noopener,noreferrer,width=980,height=900');
 if(!w)throw new Error('مرورگر اجازه باز کردن فاکتور را نداد.');
 w.document.write(invoiceHtmlData(d));w.document.close();
}
function orderTimeline(order){
 const status=String(order.status||'PENDING').toUpperCase();
 const history=order.history||[];
 const stages=[['PENDING','ثبت سفارش'],['PAID','تأیید پرداخت'],['PROCESSING','آماده‌سازی تابلو'],['SHIPPED','تحویل به پست / ارسال'],['DELIVERED','تحویل سفارش']];
 const rank={PENDING:0,PAID:1,PROCESSING:2,SHIPPED:3,DELIVERED:4}[status]??0;
 const terminal=['CANCELLED','FAILED'].includes(status);
 const nodes=stages.map((st,i)=>{
  const h=history.find(x=>String(x.to_status||'').toUpperCase()===st);
  const done=!terminal&&i<=rank;
  const active=!terminal&&i===rank;
  return '<div class="order-track-step '+(done?'done ':'')+(active?'active ':'')+'"><span class="order-track-dot">'+(done?'✓':(i+1))+'</span><div><b>'+stages[i][1]+'</b><small>'+(h?jalaliDate(h.changed_at):(active?'در حال پیگیری':'در انتظار'))+'</small></div></div>';
 }).join('');
 return '<div class="order-track '+(terminal?'is-terminal':'')+'">'+nodes+(terminal?'<div class="order-track-terminal"><b>'+escapeHtml(orderStatusPublic(status))+'</b><small>این سفارش در وضعیت نهایی قرار گرفته است.</small></div>':'')+'</div>';
}
function referralFromLocation(){try{const q=new URLSearchParams(location.search||'').get('ref');if(q)return decodeURIComponent(q).trim().toUpperCase();const h=new URLSearchParams(String(location.hash||'').split('?')[1]||'').get('ref');return h?decodeURIComponent(h).trim().toUpperCase():''}catch{return ''}}
async function account(){
 await loadMe();
 if(state.user){
  const invoiceModule=await import('./invoice.js?v=20260929-invoice-2');
  const ordersData=await api('/api/account/orders');
  const orders=ordersData.items||[],invoiceSettings=ordersData.invoice||{};
  const statusLabels={PENDING:'در انتظار پرداخت',PAID:'پرداخت شد',PROCESSING:'در حال آماده‌سازی',SHIPPED:'ارسال شد',DELIVERED:'تحویل شد',CANCELLED:'لغو شد',FAILED:'ناموفق'};
  const steps=[['PENDING','ثبت سفارش'],['PAID','تأیید پرداخت'],['PROCESSING','آماده‌سازی اثر'],['SHIPPED','تحویل به پست / ارسال'],['DELIVERED','تحویل تابلو']];
  const rank={PENDING:0,PAID:1,PROCESSING:2,SHIPPED:3,DELIVERED:4};
  const date=v=>{if(!v)return '-';const d=new Date(String(v).replace(' ','T')+(String(v).endsWith('Z')?'':'Z'));return Number.isNaN(d.getTime())?escapeHtml(v):new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'medium',timeStyle:'short'}).format(d)};
  const timeline=(o)=>{
   const st=String(o.status||'PENDING').toUpperCase(),current=rank[st]??0;
   const terminal=st==='CANCELLED'||st==='FAILED';
   return '<div class="customer-order-timeline '+(terminal?'timeline-terminal':'')+'">'+steps.map((s,i)=>{
    const hist=(o.history||[]).find(h=>String(h.to_status).toUpperCase()===s[0]);
    const cls=terminal?(s[0]==='PENDING'?'done':'pending'):(i<current?'done':i===current?'current':'pending');
    return '<div class="track-step '+cls+'"><div class="track-dot">'+(cls==='done'?'✓':(i+1))+'</div><div class="track-label"><b>'+s[1]+'</b><small>'+ (hist?date(hist.changed_at):(i===current?statusLabels[st]||st:'در انتظار')) +'</small></div></div>';
   }).join('')+(terminal?'<div class="track-terminal"><strong>'+escapeHtml(statusLabels[st]||st)+'</strong><span>این سفارش ادامه مسیر عادی ارسال را طی نمی‌کند.</span></div>':'')+'</div>';
  };
  layout('<section class="wrap page account-page"><div class="profile-panel panel"><div class="profile-head"><div class="profile-avatar">'+icon('user')+'</div><div><span class="eyebrow">MY ACCOUNT</span><h1>پروفایل کاربر</h1><p class="muted">مدیریت سفارش‌ها، فاکتورها و پیگیری مسیر تحویل تابلو</p></div></div><div class="profile-data"><div><span>شماره موبایل</span><strong>'+escapeHtml(state.user.mobile)+'</strong></div><div><span>نام</span><strong>'+escapeHtml(state.user.name||'کاربر گیلاس آرت')+'</strong></div></div><div class="toolbar"><a class="btn ghost" href="#/support">'+icon('support')+' تیکت پشتیبانی</a>'+ (isAdminUser()?'<a class="btn primary" href="#/admin">کنترل پنل</a>':'') +'<button class="btn ghost" id="logout">'+icon('close')+' خروج</button></div></div><section class="orders-profile-section"><div class="sectionhead"><div><span class="eyebrow">MY ORDERS</span><h2>سفارش‌های من</h2><p class="muted">از ثبت سفارش تا تحویل تابلو، همه مراحل را یکجا ببینید.</p></div><span class="orders-profile-count">'+fa(orders.length)+' سفارش</span></div><div id="account-orders">'+(orders.length?orders.map(o=>'<article class="customer-order-card" data-order-id="'+escapeHtml(o.id)+'"><div class="customer-order-head"><div><span class="customer-order-number">سفارش #'+escapeHtml(String(o.id).slice(-8))+'</span><h3>'+escapeHtml(o.recipient_name||o.name||'سفارش گیلاس آرت')+'</h3><small>'+date(o.created_at)+'</small></div><div class="customer-order-actions"><span class="order-status-badge status-'+escapeHtml(String(o.status||'').toLowerCase())+'">'+escapeHtml(statusLabels[o.status]||o.status)+'</span><button class="btn ghost account-invoice" type="button" data-id="'+escapeHtml(o.id)+'">'+(String(o.status)==='PENDING'?'پیش‌فاکتور':'فاکتور فروش')+'</button></div></div>'+timeline(o)+'<div class="customer-order-summary"><span>'+fa((o.items||[]).reduce((n,x)=>n+Number(x.quantity||0),0))+' قلم</span><span>'+fa(o.total_irt)+' ریال</span><span>'+escapeHtml(o.address_mobile||o.mobile||'-')+'</span></div></article>').join(''):'<div class="panel empty-orders"><strong>هنوز سفارشی ثبت نکرده‌اید.</strong><p class="muted">آثار گیلاس آرت را ببینید و اولین انتخاب خود را ثبت کنید.</p><a class="btn primary" href="#/shop">مشاهده فروشگاه</a></div>')+'</div></section><section class="rewards-account-card panel"><div><span class="eyebrow">GILAS ART REWARDS</span><h2>باشگاه امتیاز</h2><p class="muted">امتیاز فعلی شما: <strong class="rewards-balance-inline">'+fa(state.points)+'</strong> — امتیازها را به کوپن یک‌بارمصرف تا ۲۰٪ تبدیل کنید.</p></div><a class="btn primary" href="#/rewards">مشاهده و تبدیل امتیاز</a></section></section>');
  document.querySelector('#logout').onclick=async()=>{await api('/api/auth/logout',{method:'POST',headers:{'x-csrf-token':csrf()}});state.user=null;state.roles=[];state.permissions=[];location.hash='/shop';router()};
  document.querySelectorAll('.account-invoice').forEach(b=>b.onclick=()=>{const o=orders.find(x=>x.id===b.dataset.id);if(o)invoiceModule.openInvoice(o,invoiceSettings)});
  return;
 }
 layout('<section class="wrap page auth-page"><div class="login-panel panel"><div class="login-aurora"></div><div class="auth-brand"><div class="profile-avatar">'+icon('user')+'</div><span class="eyebrow">GILAS ART ACCOUNT</span><h1>ورود امن به گیلاس آرت</h1><p class="muted">شماره موبایل خود را وارد کنید؛ کد یک‌بارمصرف برای شما ارسال می‌شود.</p></div><div class="form auth-form"><label id="mobile-label" class="auth-mobile-field"><span>شماره موبایل</span><input id="mobile" inputmode="numeric" autocomplete="tel" maxlength="11" placeholder="0912 345 6789" aria-label="شماره موبایل"></label><label id="referral-login-label" class="auth-referral-field"><span>کد دعوت <small>(اختیاری)</small></span><input id="login-referral-code" dir="ltr" inputmode="latin" maxlength="20" autocomplete="off" placeholder="مثلاً GA1A2B3C4D" aria-label="کد دعوت اختیاری"></label><button class="btn primary auth-send" id="send">'+icon('send')+' ارسال کد ورود</button><div id="step" aria-live="polite"></div></div><div class="auth-trust"><span>رمز عبور لازم نیست</span><span>ورود با کد یک‌بارمصرف</span><span>امن و سریع</span></div></div></section>');
 const send=document.querySelector('#send'),mobileEl=document.querySelector('#mobile'),mobileLabel=document.querySelector('#mobile-label'),referralEl=document.querySelector('#login-referral-code'),step=document.querySelector('#step');
 let countdownTimer=null,webOtpController=null;const referralPrefill=referralFromLocation();if(referralEl&&referralPrefill)referralEl.value=referralPrefill.slice(0,20);
 const authError=e=>({invalid_mobile:'شماره موبایل را به‌صورت ۱۱ رقمی وارد کنید.',invalid_or_locked:'کد واردشده صحیح نیست یا منقضی شده است.',rate_limited:'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً کمی بعد دوباره تلاش کنید.',sms_unavailable:'ارتباط با سرویس ارسال پیامک برقرار نشد. لطفاً چند لحظه بعد دوباره تلاش کنید.',sms_provider_rejected:'ارسال پیامک توسط سرویس پیامک انجام نشد. لطفاً چند لحظه بعد دوباره تلاش کنید.',sms_sender_not_configured:'سرویس پیامک هنوز تنظیم نشده است. لطفاً بعداً دوباره تلاش کنید.',otp_provider_not_configured:'سرویس ارسال کد ورود در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',otp_not_configured:'سرویس ورود موقتاً در دسترس نیست. لطفاً بعداً دوباره تلاش کنید.',invalid_referral_code:'کد دعوت واردشده معتبر نیست.'}[String(e?.message||'')])||'عملیات ورود انجام نشد. لطفاً چند لحظه بعد دوباره تلاش کنید.';
 const showMobile=()=>{mobileLabel.hidden=false;mobileLabel.removeAttribute('aria-hidden');mobileEl.disabled=false;send.hidden=false;send.disabled=false};
 const startWebOtp=()=>{if(!('OTPCredential' in window)||!navigator.credentials?.get)return null;webOtpController?.abort();const ac=new AbortController();webOtpController=ac;setTimeout(()=>ac.abort(),130000);return navigator.credentials.get({otp:{transport:['sms']},signal:ac.signal}).catch(e=>{if(e?.name!=='AbortError')console.warn('webotp_unavailable',e);return null}).finally(()=>{if(webOtpController===ac)webOtpController=null})};
 const hideMobile=()=>{mobileLabel.hidden=true;mobileLabel.setAttribute('aria-hidden','true');mobileEl.disabled=true;send.hidden=true;send.disabled=true};
 const renderOtp=async(d,webOtpPromise)=>{/* autocomplete="one-time-code" is intentionally used on the first OTP field for native SMS AutoFill */step.innerHTML='<div class="otp-session auth-otp-panel"><div class="otp-topline"><div><span class="eyebrow">VERIFICATION</span><strong>کد تأیید را وارد کنید</strong><small>پیامک حاوی کد ۶ رقمی ارسال شد.</small></div><span id="otp-count" class="otp-count">02:00</span></div><div class="otp-boxes" dir="ltr" role="group" aria-label="کد تأیید شش رقمی">'+Array.from({length:6},(_,i)=>'<input class="otp-digit" id="otp-'+i+'" type="text" inputmode="numeric" autocomplete="'+(i===0?'one-time-code':'off')+'" maxlength="'+(i===0?'6':'1')+'" pattern="[0-9]*" aria-label="رقم '+(i+1)+'" enterkeyhint="done">').join('')+'</div><button class="btn primary otp-verify" id="verify">'+icon('check')+' تأیید و ورود</button><button class="btn ghost resend-btn" id="resend" disabled>'+icon('send')+' ارسال مجدد <span id="resend-state">در '+fa(120)+' ثانیه</span></button><button type="button" class="auth-change-number" id="change-mobile">تغییر شماره موبایل</button><p id="otp-status" class="muted">اگر دستگاه و مرورگر پشتیبانی کنند، کد پیامک‌شده به‌صورت خودکار در کادرها قرار می‌گیرد.</p></div>';
  const boxes=[...document.querySelectorAll('.otp-digit')],verify=document.querySelector('#verify'),status=document.querySelector('#otp-status'),countEl=document.querySelector('#otp-count'),resend=document.querySelector('#resend'),resendState=document.querySelector('#resend-state'),change=document.querySelector('#change-mobile');let verifying=false;
  clearInterval(countdownTimer);let left=Math.max(1,Number(d.expiresIn||120));const paint=()=>{const m=Math.floor(left/60),ss=left%60;countEl.textContent=String(m).padStart(2,'0')+':'+String(ss).padStart(2,'0');resend.disabled=left>0;resendState.textContent=left>0?'در '+left+' ثانیه':'اکنون آماده است'};const tick=()=>{paint();if(left<=0){clearInterval(countdownTimer);status.textContent='زمان کد قبلی تمام شد؛ اکنون می‌توانید کد جدید درخواست کنید.';return}left--};tick();countdownTimer=setInterval(tick,1000);
  const codeValue=()=>boxes.map(x=>x.value).join('');
  const fillCode=code=>{String(code||'').replace(/\D/g,'').slice(0,6).split('').forEach((v,i)=>{if(boxes[i])boxes[i].value=v});return codeValue()};
  const finish=async(code)=>{if(verifying)return;code=String(code||'').replace(/\D/g,'').slice(0,6);if(code.length!==6)return;fillCode(code);verifying=true;verify.disabled=true;status.textContent='در حال بررسی کد…';try{const v=await api('/api/auth/verify-otp',{method:'POST',body:JSON.stringify({challengeId:d.challengeId,code})});state.user=v.user||null;state.roles=v.roles||[];state.permissions=v.permissions||[];csrfToken=v.csrfToken||csrfToken;clearInterval(countdownTimer);status.innerHTML='<span class="ok">ورود با موفقیت انجام شد.</span>';await pollNotifications();setTimeout(()=>{location.hash=isAdminUser()?'/admin':'/account';router()},220)}catch(e){verifying=false;verify.disabled=false;status.textContent=authError(e);boxes.find(x=>x.value==='')?.focus()}};
  boxes.forEach((box,i)=>{box.addEventListener('input',()=>{const raw=box.value.replace(/\D/g,'');if(raw.length>1){const filled=fillCode(raw);if(filled.length===6)finish(filled);return}box.value=raw.slice(0,1);if(box.value&&boxes[i+1])boxes[i+1].focus();if(codeValue().length===6)finish(codeValue())});box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&boxes[i-1])boxes[i-1].focus();if(e.key==='ArrowLeft'&&boxes[i-1])boxes[i-1].focus();if(e.key==='ArrowRight'&&boxes[i+1])boxes[i+1].focus()});box.addEventListener('paste',e=>{const v=(e.clipboardData?.getData('text')||'').replace(/\D/g,'').slice(0,6);if(v){e.preventDefault();const filled=fillCode(v);if(filled.length===6)finish(filled)}})});
  verify.onclick=()=>finish(codeValue());
  change.onclick=()=>{clearInterval(countdownTimer);webOtpController?.abort();showMobile();step.innerHTML='';mobileEl.focus()};
  resend.onclick=async()=>{if(left>0)return;try{const mobile=mobileEl.value;const webOtpPromise=startWebOtp();hideMobile();resend.disabled=true;status.textContent='در حال ارسال کد جدید…';const nd=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile,referralCode:String(referralEl?.value||'').trim().toUpperCase()})});renderOtp(nd,webOtpPromise)}catch(e){webOtpController?.abort();resend.disabled=false;status.textContent=authError(e)}};
  boxes[0]?.focus();
  if(webOtpPromise){try{const credential=await webOtpPromise;if(credential?.code){const filled=fillCode(credential.code);if(filled.length===6)finish(filled)}}catch(e){if(e?.name!=='AbortError')console.warn('webotp_unavailable',e)}}
 };
 send.onclick=async()=>{const mobile=String(mobileEl.value||'').replace(/\D/g,'');if(!/^09\d{9}$/.test(mobile)){step.innerHTML='<div class="auth-inline-error">شماره موبایل را به‌صورت ۱۱ رقمی وارد کنید.</div>';mobileEl.focus();return}const webOtpPromise=startWebOtp();hideMobile();step.innerHTML='<div class="otp-loading auth-loading" role="status"><span class="auth-spinner"></span><strong>در حال ارسال کد امن…</strong><small>لطفاً این صفحه را نبندید.</small></div>';try{const d=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile,referralCode:String(referralEl?.value||'').trim().toUpperCase()})});renderOtp(d,webOtpPromise)}catch(e){webOtpController?.abort();showMobile();step.innerHTML='<div class="auth-inline-error">'+escapeHtml(authError(e))+'</div>'}};
}
async function support(){await loadMe();if(!state.user){layout('<section class="wrap page"><div class="panel login-required"><h1>پرتال CRM پشتیبانی</h1><p>برای ثبت و پیگیری تیکت، ابتدا وارد حساب خود شوید.</p><a class="btn primary" href="#/account">'+icon('user')+' ورود</a></div></section>');return}const f=await api('/api/faq');const d=await api('/api/support/tickets');layout(`<section class="wrap page support-portal"><div class="support-hero"><div><div class="eyebrow">CUSTOMER CRM</div><h1>پرتال پشتیبانی گیلاس آرت</h1><p class="muted">ثبت تیکت، مشاهده مرحله رسیدگی و ادامه گفت‌وگو در یک صفحه.</p></div><div class="support-orb">${icon('support')}</div></div><div class="support-grid"><div><div class="panel"><h2>${icon('plus')} ثبت تیکت جدید</h2><form id="ticket-form" class="form"><label>موضوع<input name="subject" maxlength="180" required></label><label>دسته‌بندی<select name="category"><option>عمومی</option><option>سفارش</option><option>پرداخت</option><option>محصول</option><option>سفارش سفارشی</option></select></label><label>اولویت<select name="priority"><option value="normal">عادی</option><option value="high">مهم</option><option value="low">کم</option></select></label><label>پیام<textarea name="message" required maxlength="10000"></textarea></label><button class="btn primary">${icon('send')} ثبت تیکت</button><div id="ticket-msg"></div></form></div><div class="panel"><div class="sectionhead"><h2>تیکت‌های من</h2><span class="muted">${fa((d.items||[]).length)} مورد</span></div><div class="ticket-list">${(d.items||[]).map(t=>`<a class="ticket-row" href="#/support/${encodeURIComponent(t.id)}"><div><strong>${escapeHtml(t.subject)}</strong><small>${escapeHtml(t.stage)} • ${jalaliDate(t.updated_at)}</small></div><span class="status-${escapeHtml(t.status)}">${t.status==='open'?'باز':'بسته'}</span></a>`).join('')||'<p class="muted">هنوز تیکتی ثبت نکرده‌اید.</p>'}</div></div></div><aside><div class="panel faq-panel"><div class="eyebrow">FAQ</div><h2>پرسش‌های متداول</h2>${renderFaq(f.items||[])}</div></aside></div></section>`);document.querySelector('#ticket-form').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const m=document.querySelector('#ticket-msg');try{await api('/api/support/tickets',{method:'POST',body:JSON.stringify({subject:f.get('subject'),category:f.get('category'),priority:f.get('priority'),message:f.get('message')}),headers:{'x-csrf-token':csrf()}});m.innerHTML='<span class="ok">تیکت ثبت شد.</span>';setTimeout(()=>support(),250)}catch(err){m.innerHTML='<span class="error">'+escapeHtml(err.message)+'</span>'}}}
async function supportDetail(id){await loadMe();if(!state.user){location.hash='/account';return}const d=await api('/api/support/tickets/'+encodeURIComponent(id));layout(`<section class="wrap page support-detail"><div class="panel"><div class="sectionhead"><div><span class="eyebrow">TICKET</span><h1>${escapeHtml(d.ticket.subject)}</h1><p class="muted">${escapeHtml(d.ticket.stage)} • ${d.ticket.status==='open'?'باز':'بسته'} • ${jalaliDate(d.ticket.created_at)}</p></div><a class="btn ghost" href="#/support">← همه تیکت‌ها</a></div><div class="ticket-thread">${(d.messages||[]).map(m=>`<div class="ticket-message ${m.author_type==='admin'?'from-admin':'from-user'}"><div class="message-meta">${m.author_type==='admin'?'پشتیبانی گیلاس آرت':'شما'} • ${jalaliDate(m.created_at)}</div><div>${escapeHtml(m.body)}</div></div>`).join('')}</div>${d.ticket.status==='open'?'<form id="reply-ticket" class="form"><label>پیام جدید<textarea name="message" required maxlength="10000"></textarea></label><button class="btn primary">'+icon('send')+' ارسال پاسخ</button><div id="reply-msg"></div></form>':'<div class="notice">این تیکت بسته شده است.</div>'}</div></section>`);document.querySelector('#reply-ticket')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);try{await api('/api/support/tickets/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({message:f.get('message')}),headers:{'x-csrf-token':csrf()}});supportDetail(id)}catch(err){document.querySelector('#reply-msg').textContent=err.message}})}
async function cmsPage(section){
 const allowed={about:'درباره ما',contact:'تماس با ما',news:'اخبار گیلاس آرت',articles:'مقالات'},title=allowed[section]||'گیلاس آرت';
 const intro=section==='about'?'روایت گیلاس آرت، از هنر ایرانی تا انتخابی برای ماندن.':section==='contact'?'راه‌های ارتباط با گیلاس آرت را در یک نگاه پیدا کنید.':'نگاهی به تازه‌ترین نوشته‌ها و مطالب گیلاس آرت.';
 layout('<section class="wrap page cms-page"><div class="cms-hero"><div><div class="eyebrow">GILAS ART</div><h1>'+escapeHtml(title)+'</h1><p class="cms-hero-lead">'+intro+'</p></div><div class="cms-hero-mark" aria-hidden="true">GA</div></div><div class="panel cms-loading" aria-live="polite">در حال دریافت اطلاعات...</div></section>');
 const bodyText=v=>escapeHtml(String(v||'')).replace(/\r?\n/g,'<br>');
 const coverVisual=x=>{const src=safeUrl(x?.cover_image);return src?'<div class="cms-page-visual"><img src="'+escapeHtml(src)+'" alt="'+escapeHtml(x?.title||'تصویر محتوا')+'" loading="eager" decoding="async"><span><small>GILAS ART</small><strong>'+escapeHtml(x?.title||'')+'</strong></span></div>':'<div class="cms-page-visual cms-page-visual-empty" aria-hidden="true"><span>GILAS ART</span><strong>روایت و هنر</strong></div>'};
 try{
  const d=await api('/api/content?section='+encodeURIComponent(section)+'&limit=20'),items=Array.isArray(d.items)?d.items:[];
  let body='';
  const visual=coverVisual(items[0]);
  if(section==='contact'){
   const x=items[0]||{}, rows=[
    x.phone?'<a class="cms-contact-item" href="tel:'+escapeHtml(x.phone)+'"><span>تلفن</span><strong>'+escapeHtml(x.phone)+'</strong></a>':'',
    x.mobile?'<a class="cms-contact-item" href="tel:'+escapeHtml(x.mobile)+'"><span>موبایل</span><strong>'+escapeHtml(x.mobile)+'</strong></a>':'',
    x.address?'<div class="cms-contact-item"><span>آدرس هنرکده</span><strong>'+bodyText(x.address)+'</strong></div>':''
   ].filter(Boolean).join('');
   body='<div class="cms-contact-layout"><article class="panel cms-rich cms-contact-main"><span class="eyebrow">CONTACT</span><h2>'+escapeHtml(x.title||title)+'</h2>'+(x.summary?'<p class="cms-lead">'+escapeHtml(x.summary)+'</p>':'')+'<div class="cms-body">'+bodyText(x.body||'')+'</div><div class="cms-contact-list">'+(rows||'<p class="muted">اطلاعات تماس هنوز ثبت نشده است.</p>')+'</div>'+(x.map_url?'<div class="cms-contact-actions"><a class="btn primary" href="'+escapeHtml(safeUrl(x.map_url))+'" target="_blank" rel="noopener noreferrer">مسیریابی روی نقشه</a><a class="btn ghost" href="#/shop">مشاهده آثار</a></div>':'')+'</article><aside class="panel cms-contact-aside"><span class="eyebrow">GILAS ART</span><h3>در کنار شما هستیم</h3><p class="muted">اگر درباره اثر، ابعاد، قاب، سفارش یا روند خرید پرسشی دارید، از راه ارتباطی ثبت‌شده استفاده کنید.</p><a class="btn ghost" href="#/support">پشتیبانی و تیکت</a></aside></div>';
  }else if(section==='about'){
   const x=items[0];body=x?'<article class="panel cms-rich cms-about-card"><span class="eyebrow">ABOUT GILAS ART</span><h2>'+escapeHtml(x.title||title)+'</h2>'+(x.summary?'<p class="cms-lead">'+escapeHtml(x.summary)+'</p>':'')+'<div class="cms-body">'+bodyText(x.body||'')+'</div><div class="cms-about-actions"><a class="btn primary" href="#/shop">مشاهده آثار</a><a class="btn ghost" href="#/contact">تماس با ما</a></div></article>':'<div class="panel cms-empty"><h2>اطلاعات درباره ما</h2><p class="muted">اطلاعات درباره ما هنوز در پایگاه داده ثبت نشده است.</p></div>';
  }else{
   body=items.length?'<div class="cms-list">'+items.map(x=>{const src=safeUrl(x.cover_image);return '<article class="panel cms-card">'+(src?'<a class="cms-card-image" href="#/'+section+'/'+encodeURIComponent(x.slug||'')+'"><img src="'+escapeHtml(src)+'" alt="'+escapeHtml(x.title||'تصویر محتوا')+'" loading="lazy" decoding="async"></a>':'')+'<div class="cms-card-top"><span class="eyebrow">'+(section==='news'?'NEWS':'ARTICLE')+'</span>'+(x.published_at?'<time class="cms-date" datetime="'+escapeHtml(x.published_at)+'">'+jalaliDate(x.published_at)+'</time>':'')+'</div><h2>'+escapeHtml(x.title||'بدون عنوان')+'</h2>'+(x.summary?'<p class="cms-lead">'+escapeHtml(x.summary)+'</p>':'')+'<a class="btn ghost" href="#/'+section+'/'+encodeURIComponent(x.slug||'')+'">ادامه مطلب <span aria-hidden="true">←</span></a></article>'}).join('')+'</div>':'<div class="panel cms-empty"><strong>محتوایی برای نمایش وجود ندارد.</strong><p class="muted">به‌زودی مطالب تازه‌ای در این بخش منتشر خواهد شد.</p></div>';
  }
  const root=document.querySelector('.cms-page');if(root)root.innerHTML=visual+'<div class="cms-hero cms-hero-compact"><div><div class="eyebrow">GILAS ART</div><h1>'+escapeHtml(title)+'</h1></div><div class="cms-hero-mark" aria-hidden="true">GA</div></div>'+body;
  setSeo({title:title+' | گیلاس آرت',description:items[0]?.summary||'اطلاعات رسمی گیلاس آرت',image:safeUrl(items[0]?.cover_image)||undefined});
 }catch(e){const root=document.querySelector('.cms-page');if(root)root.innerHTML='<div class="cms-hero cms-hero-compact"><div><div class="eyebrow">GILAS ART</div><h1>'+escapeHtml(title)+'</h1></div></div><div class="panel"><p class="error">اطلاعات این بخش از پایگاه داده دریافت نشد.</p><p class="muted">'+escapeHtml(e.message||'خطای ارتباط با سرور')+'</p><button class="btn ghost" type="button" onclick="location.reload()">تلاش دوباره</button></div>'}
}
async function contentDetail(section,slug){
 const labels={news:'اخبار گیلاس آرت',articles:'مقالات'},title=labels[section]||'گیلاس آرت';
 layout('<section class="wrap page cms-page"><article class="panel cms-detail"><div class="cms-loading" aria-live="polite">در حال دریافت محتوا...</div></article></section>');
 try{
  const d=await api('/api/content/'+encodeURIComponent(section)+'/'+encodeURIComponent(slug)),x=d.item||{},src=safeUrl(x.cover_image),visual=src?'<div class="cms-page-visual"><img src="'+escapeHtml(src)+'" alt="'+escapeHtml(x.title||'تصویر محتوا')+'" loading="eager" decoding="async"><span><small>GILAS ART</small><strong>'+escapeHtml(x.title||'')+'</strong></span></div>':'<div class="cms-page-visual cms-page-visual-empty" aria-hidden="true"><span>GILAS ART</span><strong>روایت و هنر</strong></div>',bodyText=v=>escapeHtml(String(v||'')).replace(/\r?\n/g,'<br>');
  layout('<section class="wrap page cms-page">'+visual+'<article class="panel cms-detail"><div class="cms-detail-head"><div><span class="eyebrow">'+(section==='news'?'NEWS':'ARTICLE')+'</span><h1>'+escapeHtml(x.title||title)+'</h1>'+(x.published_at?'<time class="cms-date" datetime="'+escapeHtml(x.published_at)+'">'+escapeHtml(jalaliDate(x.published_at))+'</time>':'')+'</div><a class="btn ghost" href="#/'+section+'">← بازگشت</a></div>'+(x.summary?'<p class="cms-detail-lead">'+escapeHtml(x.summary)+'</p>':'')+'<div class="cms-body">'+bodyText(x.body||'')+'</div><div class="cms-detail-footer"><a class="btn ghost" href="#/'+section+'">مطالب بیشتر</a><a class="btn primary" href="#/shop">مشاهده آثار</a></div></article></section>');
  setSeo({title:(x.title||title)+' | گیلاس آرت',description:x.summary||'',image:src||undefined});
 }catch(e){layout('<section class="wrap page cms-page"><div class="panel cms-empty"><h1>محتوا یافت نشد</h1><p class="error">'+escapeHtml(e.message||'این محتوا قابل دریافت نیست.')+'</p><a class="btn ghost" href="#/'+section+'">بازگشت</a></div></section>')}}

async function rewardsPage(){
 await loadMe();
 if(!state.user){location.hash='/account';return}
 let d=state.rewards;
 try{d=await api('/api/rewards');state.rewards=d;state.points=Number(d.balance||0)}
 catch(e){layout('<section class="wrap page"><div class="panel"><h1>باشگاه امتیاز</h1><p class="error">'+escapeHtml(e.message||'خطا')+'</p></div></section>');return}

 const balance=Math.max(0,Number(d.balance||0));
 const tiers=[...(d.tiers||[])].sort((a,b)=>Number(a.points)-Number(b.points));
 const next=tiers.find(t=>Number(t.points)>balance)||null;
 const previous=tiers.filter(t=>Number(t.points)<=balance).pop()||{points:0,percent:0};
 const progressMax=next?Number(next.points):Number(previous.points||400);
 const progressStart=Number(previous.points||0);
 const progress=next?Math.min(100,Math.max(0,((balance-progressStart)/Math.max(1,progressMax-progressStart))*100)):100;
 const remaining=next?Math.max(0,Number(next.points)-balance):0;

 const tierIcon=p=>p===400?'✦':p===300?'◆':p===200?'◇':'•';
 const tiersHtml=tiers.map(t=>{
   const cost=Number(t.points),ready=balance>=cost;
   return '<article class="reward-tier '+(ready?'is-ready':'')+'"><div class="reward-tier-top"><span class="reward-tier-icon" aria-hidden="true">'+tierIcon(cost)+'</span><div><strong>'+fa(cost)+' امتیاز</strong><span>'+fa(t.percent)+'٪ تخفیف</span></div></div><p>'+(ready?'این جایزه برای شما آماده است.':'برای باز کردن این جایزه '+fa(cost-balance)+' امتیاز دیگر لازم دارید.')+'</p><button class="btn '+(ready?'primary':'ghost')+' reward-redeem" data-points="'+cost+'" type="button" '+(ready?'':'disabled')+'>'+ (ready?'ساخت کوپن':'امتیاز کافی نیست') +'</button></article>';
 }).join('');

 const ledger=(d.ledger||[]).map(x=>{
   const pts=Number(x.points||0), positive=pts>=0;
   return '<tr><td><span class="ledger-event">'+escapeHtml(x.description||x.event_type)+'</span></td><td class="'+(positive?'points-positive':'points-negative')+'">'+(positive?'+':'')+fa(pts)+'</td><td><time datetime="'+escapeHtml(x.created_at||'')+'">'+jalaliDate(x.created_at)+'</time></td></tr>';
 }).join('')||'<tr><td colspan="3" class="muted">هنوز فعالیتی برای ثبت امتیاز وجود ندارد.</td></tr>';

 const coupons=(d.coupons||[]).map(x=>{
   const expired=x.expires_at&&new Date(x.expires_at).getTime()<Date.now();
   return '<article class="reward-coupon '+(expired?'is-expired':'')+'"><div class="reward-coupon-head"><code dir="ltr">'+escapeHtml(x.code)+'</code><b>'+fa(x.value)+'٪</b></div><div class="reward-coupon-meta"><span>'+(expired?'منقضی شده':'اعتبار تا '+escapeHtml(jalaliDate(x.expires_at)))+'</span><span>هزینه: '+fa(x.points_cost)+' امتیاز</span></div><small>'+(expired?'این کوپن دیگر قابل استفاده نیست.':'یک‌بار مصرف و فقط برای حساب شما')+'</small></article>';
 }).join('')||'<div class="empty-rewards"><span>✦</span><p>هنوز کوپن امتیازی نساخته‌اید.</p><small>با جمع‌کردن امتیاز، یکی از سطوح تخفیف را فعال کنید.</small></div>';

 const activity=[
  ['ثبت‌نام','۱۰ امتیاز','شروع عضویت'],
  ['نظر تأییدشده','۵ امتیاز','مشارکت در گالری'],
  ['دعوت موفق','۳۰ امتیاز','پس از ثبت‌نام دوست شما'],
  ['تکمیل اطلاعات ارسال','۵ امتیاز','یک‌بار برای هر حساب'],
  ['افزودن به علاقه‌مندی','۳ امتیاز','برای هر اثر جدید'],
  ['خرید موفق','تا ۳۰ امتیاز','۱ امتیاز به ازای هر ۱٬۰۰۰٬۰۰۰ ریال']
 ].map(x=>'<div class="reward-earn-item"><strong>'+x[0]+'</strong><span>'+x[1]+'</span><small>'+x[2]+'</small></div>').join('');

 layout('<section class="wrap page rewards-page">'+
   '<div class="page-masthead rewards-masthead"><div class="page-masthead-copy"><span class="eyebrow">GILAS ART REWARDS</span><h1>باشگاه امتیاز گیلاس آرت</h1><p>هر خرید و هر مشارکت ارزشمند شما، یک قدم به یک تجربه خرید بهتر نزدیک‌ترتان می‌کند.</p><div class="rewards-microcopy"><span>یک‌بار مصرف</span><span>اختصاصی برای شما</span><span>حداکثر ۲۰٪ تخفیف</span></div></div>'+
   '<div class="rewards-balance-hero"><span>موجودی فعلی شما</span><strong>'+fa(balance)+'</strong><small>امتیاز</small><div class="rewards-progress" aria-label="پیشرفت تا جایزه بعدی"><span style="width:'+progress+'%"></span></div><div class="rewards-progress-copy">'+(next?'تا کوپن '+fa(next.percent)+'٪ فقط <b>'+fa(remaining)+'</b> امتیاز مانده است.':'شما به بالاترین سطح فعلی باشگاه رسیده‌اید.')+'</div></div></div>'+
   '<div class="rewards-grid"><section class="panel rewards-convert-panel"><div class="sectionhead"><div><span class="eyebrow">REDEEM</span><h2>امتیازهایتان را به تخفیف تبدیل کنید</h2><p class="muted">امتیاز مصرف‌شده از موجودی شما کم می‌شود و کوپن تا ۳۰ روز اعتبار دارد.</p></div></div><div class="reward-tiers">'+tiersHtml+'</div></section>'+
   '<section class="panel referral-panel"><span class="eyebrow">INVITE FRIENDS</span><h2>دوستت را دعوت کن</h2><p class="muted">لینک دعوتت را برای دوستت بفرست. بعد از ثبت‌نام او، <strong>۳۰ امتیاز</strong> برای شما ثبت می‌شود.</p><div class="referral-code"><code id="my-referral-code" dir="ltr">'+escapeHtml(d.referralCode)+'</code><button class="referral-code-copy" id="copy-referral-code" type="button" aria-label="کپی کد دعوت" title="کپی کد دعوت">'+icon('copy')+'</button></div><label class="referral-label" for="referral-url">لینک دعوت شما</label><div class="referral-url-row"><input id="referral-url" class="referral-url" dir="ltr" readonly value="'+escapeHtml(d.referralUrl)+'"><button class="btn ghost referral-copy-btn" id="copy-referral" type="button" aria-label="کپی لینک دعوت" title="کپی لینک دعوت"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="7" y="7" width="12" height="12" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>کپی لینک دعوت</span></button><button class="btn primary referral-sms-btn" id="sms-referral" type="button" aria-label="ارسال مستقیم پیامک به دوستان" title="ارسال مستقیم پیامک به دوستان"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4l4 3 4-3h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path><path d="M6 8h12M6 12h8"></path></svg><span>ارسال مستقیم پیامک به دوستان</span></button></div><p class="referral-note">کد دعوت را می‌توانید با آیکون کپی کنار آن برای دوستتان بفرستید. کد دعوت فقط در نخستین ثبت‌نام و پیش از ارسال کد ورود قابل استفاده است.</p><div class="referral-privacy-note"><span aria-hidden="true">🔒</span><div><strong>حریم خصوصی شما محفوظ است.</strong><br>مخاطبان فقط در دستگاه شما برای انتخاب گیرنده خوانده می‌شوند و به گیلاس آرت ارسال یا ذخیره نمی‌شوند. ارسال نهایی نیز در برنامه پیامک گوشی و با تأیید خود شما انجام می‌شود.</div></div></section></div>'+
   '<section class="panel rewards-earn-panel"><div class="sectionhead"><div><span class="eyebrow">EARN POINTS</span><h2>چطور امتیاز بیشتری بگیریم؟</h2><p class="muted">امتیازها بر اساس فعالیت واقعی حساب شما ثبت می‌شوند.</p></div></div><div class="reward-earn-grid">'+activity+'</div></section>'+
   '<section class="panel reward-coupons-panel"><div class="sectionhead"><div><span class="eyebrow">MY COUPONS</span><h2>کوپن‌های من</h2></div><span class="section-count">'+fa((d.coupons||[]).length)+' کوپن</span></div><div class="reward-coupons">'+coupons+'</div></section>'+
   '<section class="panel reward-activity-panel"><div class="sectionhead"><div><span class="eyebrow">ACTIVITY</span><h2>تاریخچه امتیازها</h2></div><span class="section-count">۵۰ رویداد اخیر</span></div><div class="table-wrap"><table class="rewards-ledger"><thead><tr><th>رویداد</th><th>امتیاز</th><th>تاریخ</th></tr></thead><tbody>'+ledger+'</tbody></table></div></section>'+
   '</section>');

 const referralInput=document.querySelector('#referral-apply-code');if(referralInput&&referralQuery)referralInput.value=referralQuery.toUpperCase().slice(0,20);

 document.querySelector('#copy-referral')?.addEventListener('click',async()=>{
   const btn=document.querySelector('#copy-referral'),source=document.querySelector('#referral-url'),value=String(source?.value||'').trim(),label=btn?.querySelector('span');
   let copied=false;
   try{if(value){await navigator.clipboard.writeText(value);copied=true}}catch{}
   if(!copied&&source){try{source.focus();source.select();copied=document.execCommand('copy')}catch{}}
   if(label){label.textContent=copied?'لینک کپی شد ✓':'کپی ناموفق بود';setTimeout(()=>{if(document.body.contains(btn))label.textContent='کپی لینک دعوت'},1800)}
 });
 document.querySelector('#sms-referral')?.addEventListener('click',async()=>{
   const btn=document.querySelector('#sms-referral'),link=String(document.querySelector('#referral-url')?.value||d.referralUrl||'').trim();
   if(!link)return;
   const message='گیلاس آرت تولید کننده برتر تابلو های معر مس در ایران\n'+link;
   try{
     if(!navigator.contacts?.select){alert('انتخاب مخاطب در این مرورگر پشتیبانی نمی‌شود. لطفاً از مرورگر یا اپلیکیشن سازگار استفاده کنید.');return}
     const contacts=await navigator.contacts.select(['name','tel'],{multiple:true});
     const phones=[...new Set((contacts||[]).flatMap(x=>Array.isArray(x.tel)?x.tel:[]).map(v=>String(v||'').replace(/[۰-۹]/g,d=>String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).trim()).filter(Boolean))];
     if(!phones.length){alert('مخاطبی برای ارسال انتخاب نشد.');return}
     const smsUrl='sms:'+phones.join(',')+'?body='+encodeURIComponent(message);
     location.href=smsUrl;
   }catch(e){
     if(String(e?.name||'')!=='AbortError') console.error('[GilasArt] contact picker / SMS handoff failed',e);
   }
 });
 document.querySelector('#copy-referral-code')?.addEventListener('click',async()=>{const btn=document.querySelector('#copy-referral-code'),code=String(document.querySelector('#my-referral-code')?.textContent||'').trim();let copied=false;try{if(code){await navigator.clipboard.writeText(code);copied=true}}catch{}if(!copied&&code){try{const t=document.createElement('textarea');t.value=code;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.select();copied=document.execCommand('copy');t.remove()}catch{}}if(btn){btn.setAttribute('aria-label',copied?'کد دعوت کپی شد':'کپی کد دعوت');btn.title=copied?'کد دعوت کپی شد':'کپی کد دعوت';setTimeout(()=>{if(document.body.contains(btn)){btn.setAttribute('aria-label','کپی کد دعوت');btn.title='کپی کد دعوت'}},1600)}});
 document.querySelectorAll('.reward-redeem').forEach(btn=>btn.addEventListener('click',async()=>{
   btn.disabled=true;
   const original=btn.textContent;btn.textContent='در حال ساخت…';
   try{await api('/api/rewards/redeem',{method:'POST',headers:{'x-csrf-token':csrf()},body:JSON.stringify({points:Number(btn.dataset.points)})});await rewardsPage()}
   catch(e){btn.disabled=false;btn.textContent=original;alert(e.message||'تبدیل امتیاز انجام نشد')}
 }));
}
async function checkout(){ location.hash='/cart'; }
async function router(){const base=location.pathname.includes('/glsArt')?'/glsArt':'';const cleanPath=location.pathname.startsWith(base)?location.pathname.slice(base.length).replace(/^\/+|\/+$/g,''):location.pathname.replace(/^\/+|\/+$/g,'');const pathAdmin=cleanPath==='admin'||cleanPath.startsWith('admin/');const p=location.hash?location.hash.slice(2).split('/'):pathAdmin?['admin']:cleanPath?['product',decodeURIComponent(cleanPath)]:[''];try{if(!p[0])return home();if(p[0]==='admin'){await loadMe();if(!isAdminUser()){location.hash='/account';return}if(document.querySelector('.admin-layout')&&typeof window.GilasArtAdminNavigate==='function'){await window.GilasArtAdminNavigate();return}const base=location.pathname.includes('/glsArt/')?'/glsArt':'';const {default:AdminApp}=await import(base+'/admin/AdminApp.js?v=20261001-reviews');app.innerHTML=AdminApp();return}if(p[0]==='shop')return shop();if(p[0]==='product')return product(p[1]);if(p[0]==='cart')return cart();if(p[0]==='account')return account();if(p[0]==='rewards')return rewardsPage();if(p[0]==='checkout')return checkout();if(p[0]==='about'||p[0]==='contact')return cmsPage(p[0]);if((p[0]==='article'||p[0]==='articles')&&p[1])return contentDetail('articles',decodeURIComponent(p[1]));if(p[0]==='news'&&p[1])return contentDetail('news',decodeURIComponent(p[1]));if(p[0]==='news'||p[0]==='articles')return cmsPage(p[0]);if(p[0]==='terms'){
 layout('<section class="wrap page"><div class="panel"><h1 id="terms-title">قوانین سایت</h1><div id="terms-body" class="terms-content">در حال دریافت قوانین...</div></div></section>');
 try{
  const d=await api('/api/site-rules'),item=d.item||{},title=String(item.title||'قوانین سایت'),body=String(item.body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.');
  const titleEl=document.querySelector('#terms-title'),bodyEl=document.querySelector('#terms-body');
  if(titleEl)titleEl.textContent=title;
  if(bodyEl)bodyEl.innerHTML=escapeHtml(body).replace(/\r?\n/g,'<br>');const rewardsBox='<section class="loyalty-rules panel"><span class="eyebrow">GILAS ART REWARDS</span><h2>جدول امتیازها و تخفیف</h2><p>امتیازها قابل تبدیل به کوپن یک‌بارمصرف هستند و هر کوپن فقط برای صاحب حساب صادر می‌شود.</p><div class="table-wrap"><table><thead><tr><th>فعالیت</th><th>امتیاز</th></tr></thead><tbody><tr><td>ثبت‌نام</td><td>۱۰</td></tr><tr><td>ثبت نظر تاییدشده</td><td>۵</td></tr><tr><td>معرفی دوست پس از ثبت‌نام او</td><td>۳۰</td></tr><tr><td>تکمیل اطلاعات ارسال</td><td>۵</td></tr><tr><td>افزودن اثر به علاقه‌مندی‌ها</td><td>۳</td></tr><tr><td>خرید موفق</td><td>۱ امتیاز به ازای هر ۱٬۰۰۰٬۰۰۰ ریال، حداکثر ۳۰</td></tr></tbody></table></div><div class="table-wrap"><table><thead><tr><th>امتیاز مصرفی</th><th>کوپن</th><th>اعتبار</th></tr></thead><tbody><tr><td>۱۰۰</td><td>۵٪</td><td>۳۰ روز</td></tr><tr><td>۲۰۰</td><td>۱۰٪</td><td>۳۰ روز</td></tr><tr><td>۳۰۰</td><td>۱۵٪</td><td>۳۰ روز</td></tr><tr><td>۴۰۰</td><td>۲۰٪</td><td>۳۰ روز</td></tr></tbody></table></div><a class="btn primary" href="#/rewards">باشگاه امتیاز من ←</a></section>';bodyEl?.insertAdjacentHTML('afterend',rewardsBox);
 }catch(e){
  const bodyEl=document.querySelector('#terms-body');if(bodyEl)bodyEl.textContent='قوانین سایت در حال حاضر قابل دریافت نیست.';
 }
 return}if(p[0]==='support')return p[1]?supportDetail(decodeURIComponent(p[1])):support();if(p[0]==='payment'){layout(`<section class="wrap page"><div class="panel"><h1>${p[1]==='success'?'پرداخت با موفقیت تایید شد':'پرداخت ناموفق بود'}</h1><a class="btn primary" href="#/shop">بازگشت به فروشگاه</a></div></section>`);return}home()}catch(e){console.error('router_error',e);if(!p[0])console.warn('home_render_error',e)} }window.addEventListener('hashchange',()=>router());window.addEventListener('popstate',()=>router());(async()=>{try{await loadMe()}catch{}try{const sd=await api('/api/settings');state.settings=sd.settings||state.settings}catch{}await router()})();

/* GilasArt interaction guard */
(()=>{
 document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
 document.addEventListener('copy',e=>{if(e.target?.closest?.('.copy-image-name,.social-link-row input'))return;e.preventDefault();}, {capture:true});
 document.addEventListener('cut',e=>{e.preventDefault();}, {capture:true});
 document.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});
 document.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopPropagation()}},{capture:true});
 document.addEventListener('click',e=>{
   const link=e.target?.closest?.('a[href]');
   if(link && !link.closest('.footer-social-link') && (link.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 document.addEventListener('keydown',e=>{   const k=String(e.key||'').toLowerCase();
   if((e.ctrlKey||e.metaKey)&&['c','x','u','s','p'].includes(k)){e.preventDefault();e.stopPropagation();}
   if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 window.addEventListener('beforeprint',e=>e.preventDefault?.());
})();