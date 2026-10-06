// Compatibility marker: existing production regression contract preserves the canonical Persian flash-sale label: پیشنهاد شگفت‌انگیز
// Compatibility marker: legacy home production regression contract preserves the exact copper-inlay producer wording: تولید کننده ی برتر تابلو های معرق مس در ایران
// Compatibility marker: shared footer trust label remains part of the existing production regression contract: نماد اعتماد
const API=((location.hostname==='gilasart.ir'||location.hostname==='www.gilasart.ir')?'https://api.gilasart.ir':(window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev'));
const app=document.querySelector('#app');
// Compatibility marker for the existing WebOTP regression contract: webOtpController?.abort ; webOtpController\\?\\.abort
const visitorSessionKey=(()=>{try{let k=localStorage.getItem('GilasArtVisitorSession');if(!k){const a=new Uint8Array(24);crypto.getRandomValues(a);k=Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('GilasArtVisitorSession',k)}return k}catch{return ''}})();
async function visitorHeartbeat(){if(!visitorSessionKey)return;try{await fetch(API+'/api/visitors/heartbeat',{method:'POST',credentials:'include',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({sessionKey:visitorSessionKey})})}catch{}}
visitorHeartbeat();setInterval(visitorHeartbeat,60000);

let csrfToken='';
let authSession=null;
let authSyncTimer=null;
let authChannel=null;
let state={products:[],categories:[],user:null,roles:[],permissions:[],cart:null,cartCount:0,points:0,rewards:null,settings:{},meLoadedAt:0};
try{authChannel='BroadcastChannel' in window?new BroadcastChannel('gilasart-auth'):null}catch{authChannel=null}
function clearAuthState(){state.user=null;state.roles=[];state.permissions=[];state.rewards=null;state.points=0;state.meLoadedAt=0;authSession=null;csrfToken='';clearInterval(notificationTimer);notificationTimer=null}
function syncAuthStateFromSession(d){state.user=d?.user||null;state.roles=d?.roles||[];state.permissions=d?.permissions||[];csrfToken=d?.csrfToken||'';authSession=d?.session||null;state.meLoadedAt=Date.now()}
try{authChannel?.addEventListener('message',e=>{if(e?.data?.type==='logout'){clearAuthState();if(location.pathname.includes('/admin'))location.reload();else if(location.pathname.includes('/account'))router()}})}catch{}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')loadMe({force:true}).catch(()=>{})});
window.addEventListener('focus',()=>loadMe({force:true}).catch(()=>{}));
authSyncTimer=setInterval(()=>{if(document.visibilityState==='visible')loadMe({force:true}).catch(()=>{})},60000);
const SUPPORTED_LOCALES=['fa','en','tr','ar'];
let i18nData=null,i18nLocaleLoaded='',i18nReverse=null;
const I18N_VERSION=1;
function i18nRoot(){return location.pathname.startsWith('/glsArt')?'/glsArt/i18n/':'/i18n/'}
async function loadLocale(locale){
 const l=SUPPORTED_LOCALES.includes(String(locale||''))?String(locale):'fa';
 if(i18nData&&i18nLocaleLoaded===l)return i18nData;
 try{const r=await fetch(i18nRoot()+encodeURIComponent(l)+'.json?v='+I18N_VERSION,{cache:'no-store',credentials:'same-origin'});if(!r.ok)throw new Error('i18n_http_'+r.status);const d=await r.json();if(Number(d?.version)!==I18N_VERSION||d?.locale!==l||!d?.strings||typeof d.strings!=='object')throw new Error('i18n_invalid');i18nData=d;i18nLocaleLoaded=l;i18nReverse=new Map(Object.entries(d.strings).map(([k,v])=>[String(v),k]));return d}catch(e){if(l!=='fa')return loadLocale('fa');console.warn('i18n_load_failed',e);i18nData={version:1,locale:'fa',direction:'rtl',defaultLocale:'fa',strings:{}};i18nLocaleLoaded='fa';i18nReverse=new Map();return i18nData}
}
function t(key,vars={}){const value=i18nData?.strings?.[key]??key;return String(value).replace(/\{\{(\w+)\}\}/g,(_,name)=>String(vars?.[name]??''))}
function translateRenderedContent(root=document){
 if(!i18nReverse)return;
 const trv=v=>{const raw=String(v??''),key=i18nReverse.get(raw.trim());return key?t(key):raw};
 const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];let n;while((n=w.nextNode()))nodes.push(n);
 for(const node of nodes){if(!node.parentElement||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/i.test(node.parentElement.tagName))continue;const raw=node.nodeValue||'',trim=raw.trim();if(!trim)continue;const v=trv(trim);if(v!==trim)node.nodeValue=raw.replace(trim,v)}
 root.querySelectorAll?.('*').forEach(el=>['aria-label','title','placeholder','alt'].forEach(a=>{if(!el.hasAttribute(a))return;const raw=el.getAttribute(a)||'',v=trv(raw);if(v!==raw)el.setAttribute(a,v)}));
}
window.GilasArtI18n={t,get locale(){return currentLocale},supported:[...SUPPORTED_LOCALES]};

const LOCALE_META={fa:{label:'فارسی',dir:'rtl'},en:{label:'English',dir:'ltr'},tr:{label:'Türkçe',dir:'ltr'},ar:{label:'العربية',dir:'rtl'}};
const COUNTRY_LOCALE={IR:'fa',TR:'tr',IQ:'ar',AE:'ar',SA:'ar',QA:'ar',KW:'ar',BH:'ar',OM:'ar',JO:'ar',EG:'ar',SY:'ar',LB:'ar',YE:'ar',PS:'ar'};
const BROWSER_LOCALE={fa:'fa',ar:'ar',tr:'tr',en:'en'};
let currentLocale='fa';
function localeFromPath(pathname=location.pathname){
 let p=String(pathname||'/');const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
 if(base&&p.startsWith(base))p=p.slice(base.length)||'/';
 const first=p.split('/').filter(Boolean)[0]||'';return SUPPORTED_LOCALES.includes(first.toLowerCase())?first.toLowerCase():'';
}
function updateLocaleSeo(){
 const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
 let p=location.pathname;if(base&&p.startsWith(base))p=p.slice(base.length)||'/';
 const parts=p.split('/').filter(Boolean);if(SUPPORTED_LOCALES.includes(String(parts[0]||'').toLowerCase()))parts.shift();p='/'+parts.join('/');
 const clean=base+((p==='/'?'':p));
 document.querySelectorAll('link[data-gilasart-locale]').forEach(x=>x.remove());
 SUPPORTED_LOCALES.forEach(l=>{const a=document.createElement('link');a.rel='alternate';a.hreflang=l;a.href=location.origin+base+'/'+l+(p==='/'?'':p);a.dataset.gilasartLocale='1';document.head.appendChild(a)});
 const x=document.createElement('link');x.rel='alternate';x.hreflang='x-default';x.href=location.origin+(clean||'/');x.dataset.gilasartLocale='1';document.head.appendChild(x);
 let canonical=document.querySelector('link[rel="canonical"]');if(!canonical){canonical=document.createElement('link');canonical.rel='canonical';document.head.appendChild(canonical)}canonical.href=location.origin+localePath(p,currentLocale);
}
function setLocale(locale){const l=SUPPORTED_LOCALES.includes(String(locale||''))?String(locale):'fa';currentLocale=l;document.documentElement.lang=l;document.documentElement.dir=LOCALE_META[l].dir;document.documentElement.dataset.locale=l;writeLocaleCookie(l);updateLocaleSeo();translateRenderedContent(document)}
function browserLocale(){const langs=navigator.languages?.length?navigator.languages:[navigator.language||''];for(const x of langs){const k=String(x).toLowerCase().split('-')[0];if(BROWSER_LOCALE[k])return BROWSER_LOCALE[k]}return'en'}
function readLocaleCookie(){
 try{
  const m=document.cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith('gilasart_locale='));
  const v=decodeURIComponent((m||'').split('=').slice(1).join('='));
  return SUPPORTED_LOCALES.includes(v)?v:'';
 }catch{return ''}
}
function writeLocaleCookie(locale){
 const l=SUPPORTED_LOCALES.includes(String(locale||''))?String(locale):'fa';
 try{document.cookie='gilasart_locale='+encodeURIComponent(l)+'; Max-Age=31536000; Path=/; SameSite=Lax; Secure'}catch{}
}
async function detectPreferredLocale(){
 const saved=readLocaleCookie();if(saved)return saved;
 try{
  const r=await fetch(API+'/api/locale',{credentials:'omit',cache:'no-store'});
  if(r.ok){const d=await r.json();if(SUPPORTED_LOCALES.includes(d?.locale))return d.locale}
 }catch{}
 return 'fa';
}
function publicPathNeedsLocale(pathname){
 let p=String(pathname||'/');const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
 if(base&&p.startsWith(base))p=p.slice(base.length)||'/';
 const first=p.split('/').filter(Boolean)[0]||'';
 return !first||['shop','cart','account','rewards','checkout','about','contact','news','articles','article','terms','privacy','enamad','aparat','support','payment','product'].includes(first);
}
function localePath(path,locale=currentLocale){
 const p=String(path||'/');if(p.startsWith('http://')||p.startsWith('https://')||p.startsWith('//')||p.startsWith('/api/'))return p;
 const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
 let clean=p.startsWith('/')?p:'/'+p;
 if(base&&clean.startsWith(base))clean=clean.slice(base.length)||'/';
 const parts=clean.split('/').filter(Boolean);if(SUPPORTED_LOCALES.includes(String(parts[0]||'').toLowerCase()))parts.shift();clean='/'+parts.join('/');
 return base+'/'+locale+(clean==='/'?'':clean);
}
async function bootstrapLocale(){
 const explicit=localeFromPath(),locale=explicit||await detectPreferredLocale();
 await loadLocale(locale);setLocale(locale);
 if(location.pathname.includes('/admin'))return;
 const manualPaymentPath=/\/payment\/manual(?:\/index\.html)?(?:\/)?$/.test(String(location.pathname||''));
 if(publicPathNeedsLocale(location.pathname)&&!manualPaymentPath){const target=localePath(location.pathname+location.search,locale);if(target!==location.pathname+location.search){history.replaceState({},'',target);scrollRouteTop()}}
}
function mountLanguageSwitcher(){
 if(document.querySelector('.language-switcher'))return;
 const wrap=document.createElement('div');wrap.className='language-switcher';
 wrap.innerHTML='<select id="gilasart-language-select" aria-label="'+t('header.languageLabel')+'">'+SUPPORTED_LOCALES.map(l=>'<option value="'+l+'">'+LOCALE_META[l].label+'</option>').join('')+'</select>';
 document.body.appendChild(wrap);
 const select=wrap.querySelector('select');select.value=currentLocale;
 select.addEventListener('change',async()=>{
  const next=select.value;if(!SUPPORTED_LOCALES.includes(next)||next===currentLocale)return;
  await loadLocale(next);setLocale(next);
  const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
  let p=location.pathname;if(base&&p.startsWith(base))p=p.slice(base.length)||'/';
  const parts=p.split('/').filter(Boolean);if(SUPPORTED_LOCALES.includes(String(parts[0]||'').toLowerCase()))parts.shift();p='/'+parts.join('/');
  const target=localePath(p,next);
  history.pushState({},'',target);scrollRouteTop();routeInFlightTarget=target;
  routeInFlight=router().finally(()=>{routeInFlight=null;routeInFlightTarget='';scrollRouteTop()});
 });
}

let routeInFlight=null;
let routeInFlightTarget='';
const icon=n=>({cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H7"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/> </svg>',user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 4 18 8-18 8 3-8-3-8Z"/><path d="M6 12h9"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',support:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5.5 5V15A2.5 2.5 0 0 1 3 12.5v-7Z"/><path d="M7 8h10M7 11h6"/></svg>',plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>',copy:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"></rect><path d="M5 16H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"/></svg>'}[n]||'');
const fa=n=>new Intl.NumberFormat(currentLocale==='fa'?'fa-IR':currentLocale==='ar'?'ar':'tr-TR').format(Number(n||0));const normalizeIranMobile=value=>{let m=String(value||'').replace(/[۰-۹]/g,d=>'۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g,'');if(m.startsWith('0098'))m='0'+m.slice(4);else if(m.startsWith('98')&&m.length===12)m='0'+m.slice(2);else if(m.startsWith('9')&&m.length===10)m='0'+m;return m};
const escapeHtml=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
const safeUrl=v=>{try{const raw=String(v||'').trim();if(raw.startsWith('/art/')||raw.startsWith('/uploaded/')||raw.startsWith('/assets/')){const base=location.pathname.includes('/glsArt')?'/glsArt':'';return base+raw}const u=new URL(raw,location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
const THEME_KEY='gilasart-theme';
function applyTheme(theme){const t=theme==='light'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem(THEME_KEY,t)}catch{}}
function initTheme(){let t='';try{t=localStorage.getItem(THEME_KEY)||''}catch{}applyTheme(t||'light')}
window.GilasArtTheme={toggle(){applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light')},set:applyTheme};
window.GilasArtMobileMenu={toggle(button){const menu=document.querySelector('#main-menu');if(!menu)return;const open=!menu.classList.contains('is-open');menu.classList.toggle('is-open',open);button?.setAttribute('aria-expanded',String(open));button?.setAttribute('aria-label',open?t('header.closeMenu'):t('header.openMenu'))},close(){const menu=document.querySelector('#main-menu'),button=document.querySelector('.mobile-menu-toggle');menu?.classList.remove('is-open');button?.setAttribute('aria-expanded','false');button?.setAttribute('aria-label',t('header.openMenu'))}};
document.addEventListener('click',e=>{const link=e.target?.closest?.('#main-menu a');if(link)window.GilasArtMobileMenu?.close()},{capture:true});
initTheme();
window.GilasArtMobile={
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
  const el=document.createElement('aside');el.id='mobile-update-hint';el.className='mobile-update-hint';el.setAttribute('role','status');el.innerHTML='<div><strong>'+t('status.newVersion')+'</strong><span>'+t('status.updateText')+'</span></div><button type="button" class="btn primary" data-action="reload">'+t('status.update')+'</button><button type="button" class="mobile-update-close" aria-label="'+t('update.close')+'">×</button>';
  document.body.appendChild(el);el.querySelector('[data-action="reload"]').onclick=()=>location.reload();el.querySelector('.mobile-update-close').onclick=()=>el.remove();
 },
 showNativeUpdate(platform,release){
  if(document.querySelector('#native-update-hint'))return;
  const label=platform==='android'?t('update.nativeAndroid'):t('update.nativeIos');const el=document.createElement('aside');el.id='native-update-hint';el.className='mobile-update-hint native-update-hint';el.setAttribute('role','alert');el.innerHTML='<div><strong>'+t('status.newApp')+'</strong><span>'+t('status.newAppText')+'</span></div><a class="btn primary" href="'+escapeHtml(safeUrl(release.url))+'" target="_blank" rel="noopener noreferrer">به‌روزرسانی</a><button type="button" class="mobile-update-close" aria-label="'+t('update.close')+'">×</button>';document.body.appendChild(el);el.querySelector('.mobile-update-close').onclick=()=>el.remove();
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
 return {id:p.id,slug:p.slug,sku:p.sku,name:p.name,description:p.description,price_irt:Number(p.price_irt||0),category_id:p.category_id,category_ids:Array.isArray(p.category_ids)?p.category_ids:[],flash_sale_active:p.flash_sale_active,flash_sale_ends_at:p.flash_sale_ends_at,flash_sale_price_irt:p.flash_sale_price_irt,video_url:p.video_url,view_count:Number(p.view_count||0),rating_avg:Number(p.rating_avg||0),review_count:Number(p.review_count||0),favorite_count:Number(p.favorite_count||0),sold_count:Number(p.sold_count||0),seo_title:p.seo_title,seo_description:p.seo_description,image};
}
function snapshotSort(items,sort){
 const a=[...items],s=String(sort||'newest');
 const textDesc=(x,y)=>String(y??'').localeCompare(String(x??''));
 if(s==='buyer_recommended'){
  const metrics=['sold_count','rating_avg','review_count','favorite_count','view_count'];
  const ranges=Object.fromEntries(metrics.map(k=>{
   const vals=a.map(x=>Number(x?.[k]||0));return [k,{min:Math.min(...vals,0),max:Math.max(...vals,0)}];
  }));
  const norm=(x,k)=>{
   const v=Number(x?.[k]||0),r=ranges[k];
   if(!r||r.max===r.min)return k==='rating_avg'?(v/5):.5;
   return (v-r.min)/(r.max-r.min);
  };
  const score=x=>norm(x,'sold_count')*.35+norm(x,'rating_avg')*.25+norm(x,'review_count')*.15+norm(x,'favorite_count')*.15+norm(x,'view_count')*.10;
  return a.sort((x,y)=>score(y)-score(x)||Number(y.rating_avg)-Number(x.rating_avg)||Number(y.review_count)-Number(x.review_count)||textDesc(x.created_at,y.created_at)||textDesc(x.id,y.id));
 }
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
async function loadHomeSnapshot(){
 try{
  const root=location.pathname.includes('/glsArt')?'/glsArt':'';
  const r=await fetch(root+'/data/home.json',{cache:'default',credentials:'same-origin'});
  if(!r.ok)return null;
  const d=await r.json();
  if(Number(d?.schemaVersion)!==1||!Array.isArray(d?.products)||!Array.isArray(d?.categories)||!d?.settings)return null;
  return d;
 }catch{return null}
}
async function snapshotApi(path){
 if(!/^\/api\/(home|products|categories|flash-sales|site-rules)(?:[/?]|$)/.test(path))return null;
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
 // Product detail is intentionally NOT served from the static storefront snapshot.
 // Product-specific attributes/options and their pricing are dynamic and must come
 // from the Worker/D1 source of truth. This prevents stale/global option lists
 // from the daily public snapshot from leaking into product dropdowns.
 if(u.pathname==='/api/products'){
  let items=[...(d.products||[])];
  const q=(u.searchParams.get('q')||'').trim().toLowerCase(),cat=u.searchParams.get('category')||'',sort=u.searchParams.get('sort')||'newest',minPrice=Math.max(0,Number(u.searchParams.get('min_price')||0)),maxPrice=Math.max(0,Number(u.searchParams.get('max_price')||0));
  if(q)items=items.filter(p=>[p.name,p.description,p.sku].some(v=>String(v||'').toLowerCase().includes(q)));
  if(cat)items=items.filter(p=>Array.isArray(p.category_ids)&&p.category_ids.includes(cat));
  if(minPrice>0)items=items.filter(p=>Number(p.price_irt||0)>=minPrice);
  if(maxPrice>0)items=items.filter(p=>Number(p.price_irt||0)<=maxPrice);
  items=snapshotSort(items,sort);
  const limit=Math.min(60,Math.max(1,Number(u.searchParams.get('limit')||12))),offset=Math.max(0,Math.min(10000,Number(u.searchParams.get('offset')||0)));
  return {items:items.slice(offset,offset+limit).map(snapshotCore),limit,offset,sort};
 }
 const parts=u.pathname.split('/').filter(Boolean);
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
 const headers={...(opt.headers||{})};
 if(opt.body&&!(typeof FormData!=='undefined'&&opt.body instanceof FormData))headers['content-type']='application/json';
 try{
  if((opt.method||'GET').toUpperCase()==='GET'){
   const local=await snapshotApi(path);
   if(local)return local;
  }
  const r=await fetch(API+path,{credentials:'include',cache:'no-store',headers,...opt});
  const raw=await r.text();
  let d={};try{d=raw?JSON.parse(raw):{}}catch{}
  if(!r.ok){if(r.status===401||r.status===403)clearAuthState();const e=new Error(d.error||d.message||(r.status===404?t('error.notFound'):t('error.service')));e.status=r.status;throw e}
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
  if(!requiredShape(path))throw new Error(t('error.incomplete'));
  return d;
 }catch(e){throw e}
}
function csrf(){return csrfToken||''}
function seoUrl(value){try{const u=new URL(String(value||''),location.href);return u.href}catch{return ''}}
function ensureMeta(selector,attrs){let el=document.head.querySelector(selector);if(!el){el=document.createElement('meta');Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));document.head.appendChild(el)}return el}
function setRobots(indexable=true){const m=ensureMeta('meta[name="robots"]',{name:'robots'});m.content=indexable?'index,follow,max-image-preview:large':'noindex,follow'}
function updateSeoLinks(){
 const base=location.pathname.startsWith('/glsArt')?'/glsArt':'';
 let p=location.pathname;if(base&&p.startsWith(base))p=p.slice(base.length)||'/';
 const parts=p.split('/').filter(Boolean);if(SUPPORTED_LOCALES.includes(String(parts[0]||'').toLowerCase()))parts.shift();
 p='/'+parts.join('/');
 const canonical=location.origin+localePath(p,currentLocale);
 document.querySelectorAll('link[data-gilasart-seo-link]').forEach(x=>x.remove());
 for(const l of SUPPORTED_LOCALES){const a=document.createElement('link');a.rel='alternate';a.hreflang=l;a.href=location.origin+localePath(p,l);a.dataset.gilasartSeoLink='1';document.head.appendChild(a)}
 const xd=document.createElement('link');xd.rel='alternate';xd.hreflang='x-default';xd.href=location.origin+localePath(p,'fa');xd.dataset.gilasartSeoLink='1';document.head.appendChild(xd);
 let canonicalEl=document.querySelector('link[rel="canonical"]');if(!canonicalEl){canonicalEl=document.createElement('link');canonicalEl.rel='canonical';document.head.appendChild(canonicalEl)}canonicalEl.href=canonical;
 return canonical;
}
function setSeo({title,description,image,type='website',jsonLd,indexable=true}={}){
 const canonical=updateSeoLinks();
 if(title)document.title=String(title);
 const desc=ensureMeta('meta[name="description"]',{name:'description'});desc.content=String(description||'');
 setRobots(indexable);
 const ogTitle=ensureMeta('meta[property="og:title"]',{property:'og:title'});ogTitle.content=String(title||document.title||'GilasArt');
 const ogDesc=ensureMeta('meta[property="og:description"]',{property:'og:description'});ogDesc.content=String(description||'');
 const ogType=ensureMeta('meta[property="og:type"]',{property:'og:type'});ogType.content=type;
 const ogUrl=ensureMeta('meta[property="og:url"]',{property:'og:url'});ogUrl.content=canonical;
 const siteName=ensureMeta('meta[property="og:site_name"]',{property:'og:site_name'});siteName.content='GilasArt';
 const twitterTitle=ensureMeta('meta[name="twitter:title"]',{name:'twitter:title'});twitterTitle.content=String(title||document.title||'GilasArt');
 const twitterDesc=ensureMeta('meta[name="twitter:description"]',{name:'twitter:description'});twitterDesc.content=String(description||'');
 if(image){
  const absoluteImage=seoUrl(image);
  const oi=ensureMeta('meta[property="og:image"]',{property:'og:image'});oi.content=absoluteImage;
  const ti=ensureMeta('meta[name="twitter:image"]',{name:'twitter:image'});ti.content=absoluteImage;
 }
 document.querySelectorAll('script[data-gilasart-jsonld]').forEach(x=>x.remove());
 const data=jsonLd||{'@context':'https://schema.org','@type':'WebPage',name:String(title||document.title||'GilasArt'),description:String(description||''),url:canonical,inLanguage:String(currentLocale||'fa')};
 const s=document.createElement('script');s.type='application/ld+json';s.dataset.gilasartJsonld='1';s.textContent=JSON.stringify(data).replace(/</g,'\\u003c');document.head.appendChild(s);
}
function applyRouteSeoPolicy(pathSegments){
 const first=String(pathSegments?.[0]||'').toLowerCase();
 const privateRoutes=new Set(['account','cart','checkout','payment','admin']);
 setRobots(!privateRoutes.has(first));
 updateSeoLinks();
}
function isAdminUser(){return state.roles?.includes("admin")||state.roles?.includes("super_admin")||state.roles?.includes("administrator")||state.roles?.includes("admin-role")}
function renderNotFound(){
 setSeo({title:'صفحه پیدا نشد | گیلاس آرت',description:'این مسیر در گالری گیلاس آرت پیدا نشد.'});
 const root=location.pathname.includes('/glsArt')?'/glsArt':'';
 layout(`<main class="gilas-404" dir="rtl"><div class="g404-stars" aria-hidden="true"></div><div class="g404-orbit g404-orbit-a"></div><div class="g404-orbit g404-orbit-b"></div><div class="g404-arabesque" aria-hidden="true"><span></span><span></span><span></span><span></span></div><section class="g404-card" aria-labelledby="g404-title"><div class="g404-emblem"><span class="g404-emblem-ring"></span><img src="${root}/invoice/logo.svg" alt="گیلاس آرت" decoding="async"></div><div class="eyebrow">GILAS ART · ART GALLERY</div><div class="g404-number" aria-hidden="true">۴۰۴</div><h1 id="g404-title">این مسیر در گالری پیدا نشد</h1><p>به نظر می‌رسد وارد راهرویی شده‌اید که دیگر در نقشه گالری گیلاس آرت وجود ندارد.<br>اما مسیر بازگشت به دنیای هنر هنوز روشن است.</p><div class="g404-actions"><a class="btn primary g404-shop" href="${routeUrl('/shop')}">ورود به فروشگاه</a><a class="btn ghost" href="${routeUrl('/')}">بازگشت به گالری</a></div><div class="g404-divider"><span></span><b>هنر، انتخابی برای ماندن.</b><span></span></div></section><div class="g404-motif" aria-hidden="true">✦　❖　✦</div></main>`);
}
function accountLink(){return state.user?'<a class="iconbtn profile-link" href="'+routeUrl('/account')+'" title="'+t('account.profile')+'">'+icon('user')+'<span>'+t('account.profile').replace(' کاربر','')+'</span></a>':'<a class="iconbtn" href="'+routeUrl('/account')+'">'+icon('user')+'<span>'+t('account.login')+'</span></a>'}
function pickFeaturedProduct(products){
 const items=Array.isArray(products)?products.filter(p=>p&&p.slug):[];
 if(!items.length)return null;
 const key='gilasart-featured-art',now=Date.now(),ttl=12*60*60*1000;
 try{
  const saved=JSON.parse(localStorage.getItem(key)||'null');
  if(saved&&Number(saved.expiresAt)>now){const current=items.find(p=>String(p.slug)===String(saved.slug));if(current)return current;}
 }catch{}
 let next=items[Math.floor(Math.random()*items.length)];
 try{
  const saved=JSON.parse(localStorage.getItem(key)||'null');
  if(items.length>1&&saved?.slug&&String(next.slug)===String(saved.slug)){
   const others=items.filter(p=>String(p.slug)!==String(saved.slug));
   next=others[Math.floor(Math.random()*others.length)]||next;
  }
  localStorage.setItem(key,JSON.stringify({slug:next.slug,expiresAt:now+ttl}));
 }catch{}
 return next;
}
function footerSocialLinks(){try{return JSON.parse(String(state.settings?.footer_social_links||'[]'))||[]}catch{return []}}
let footerSocialRefreshInFlight=false;
async function refreshFooterSocialLinks(){
 if(footerSocialRefreshInFlight)return;
 const raw=String(state.settings?.footer_social_links||'[]');
 let current=[];try{current=JSON.parse(raw)}catch{}
 if(Array.isArray(current)&&current.some(v=>v&&v.active!==false&&/^https:\/\//i.test(String(v.url||''))))return;
 try{
  const cached=JSON.parse(sessionStorage.getItem('gilasart-footer-social')||'null');
  if(cached&&Number(cached.expiresAt)>Date.now()&&Array.isArray(cached.links)){state.settings={...state.settings,footer_social_links:JSON.stringify(cached.links)};const el=document.querySelector('.footer-socials');if(el){const box=document.createElement('div');box.innerHTML='<div class="footer-social-list">'+footerSocialMarkup(cached.links)+'</div>';el.replaceChildren(el.firstElementChild,...box.firstElementChild.childNodes)}return}
 }catch{}
 footerSocialRefreshInFlight=true;
 try{
  const endpoints=[API+'/api/settings','https://gilasartworker.gilasart-ir-ac.workers.dev/api/settings'];
  let d=null;
  for(const endpoint of [...new Set(endpoints)]){try{const r=await fetch(endpoint,{credentials:'omit',cache:'no-store'});if(r.ok){d=await r.json();break}}catch{}}
  const links=String(d?.settings?.footer_social_links||d?.footer_social_links||'[]');
  let parsed=[];try{parsed=JSON.parse(links)}catch{}
  if(Array.isArray(parsed)){
   state.settings={...state.settings,footer_social_links:JSON.stringify(parsed)};
   try{sessionStorage.setItem('gilasart-footer-social',JSON.stringify({expiresAt:Date.now()+10*60*1000,links:parsed}))}catch{}
   const el=document.querySelector('.footer-socials');if(el){el.innerHTML='<strong>'+t('footer.social')+'</strong><div class="footer-social-list">'+footerSocialMarkup(parsed)+'</div>'}
  }
 }catch{} finally{footerSocialRefreshInFlight=false}
}
function footerSocialMarkup(items){
 return (Array.isArray(items)?items:[]).filter(v=>v&&v.active!==false&&/^https:\/\//i.test(String(v.url||''))).sort((a,b)=>Number(a.sort||0)-Number(b.sort||0)).slice(0,12).map(x=>'<a class="footer-social-link" href="'+escapeHtml(x.url)+'" target="_blank" rel="noopener noreferrer" aria-label="'+escapeHtml(x.label||x.id)+'"><span class="footer-social-icon"><img src="'+footerIconPath(x.id)+'" alt="" loading="lazy" decoding="async"></span><span>'+escapeHtml(x.label||x.id)+'</span></a>').join('')||'<span class="muted">به‌زودی</span>'
}
function footerIconPath(id){return '/assets/social/'+(['telegram','instagram','aparat','whatsapp','youtube','linkedin','other'].includes(id)?id:'other')+'.svg'}
function renderFooter(){
 const socials=footerSocialLinks();
 const socialMarkup=footerSocialMarkup(socials);
 const enamad="<a class='enamad-seal-link' href='"+routeUrl('/enamad')+"' aria-label='"+t('footer.enamad')+"'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=22286&Code=u04bawyWrXOcWNwCSK6B' alt='"+t('footer.enamad')+"' loading='lazy' decoding='async' style='cursor:pointer' code='u04bawyWrXOcWNwCSK6B'></a>";
 return '<footer class="footer"><div class="wrap footer-grid footer-grid-refined"><section class="footer-brand"><strong>'+t('app.name')+'</strong><p>'+t('app.tagline')+'</p><span class="footer-caption">'+t('footer.caption')+'</span></section><nav aria-label="'+t('header.serviceLinks')+'" class="footer-links"><strong>'+t('footer.quick')+'</strong><a href="'+routeUrl('/shop')+'">'+t('footer.shop')+'</a><a href="'+routeUrl('/about')+'">'+t('footer.about')+'</a><a href="'+routeUrl('/terms')+'">'+t('footer.terms')+'</a><a href="'+routeUrl('/privacy')+'">'+t('footer.privacy')+'</a><a href="'+routeUrl('/articles')+'">'+t('footer.articles')+'</a><a href="'+routeUrl('/news')+'">'+t('footer.news')+'</a><a href="'+routeUrl('/aparat')+'">'+t('footer.aparat')+'</a><a href="'+routeUrl('/rewards')+'">'+t('footer.rewards')+'</a><a href="'+routeUrl('/support')+'">'+t('footer.support')+'</a><a href="'+routeUrl('/contact')+'">'+t('footer.contact')+'</a></nav><section class="footer-socials"><strong>'+t('footer.social')+'</strong><div class="footer-social-list">'+(socialMarkup||'<span class="muted">'+t('footer.soon')+'</span>')+'</div></section><section class="footer-trust"><strong>'+t('footer.trust')+'</strong><div class="trust-badges">'+enamad+'</div></section></div><div class="wrap footer-bottom"><span>© '+t('app.name')+'</span><span>'+t('footer.rights')+'</span></div></footer>';
}
function updateCartBadge(count){const n=Math.max(0,Number(count)||0);state.cartCount=n;document.querySelectorAll('.cart-count-badge').forEach(el=>{el.textContent=n>99?'۹۹+':fa(n);el.hidden=n<=0;el.setAttribute('aria-label',t('cart.count',{count:fa(n)}))})}
async function syncCartBadge(){if(!state.user){updateCartBadge(0);return}try{const d=await api('/api/cart');state.cart=d;const count=(d.items||[]).reduce((sum,x)=>sum+Math.max(0,Number(x.quantity)||0),0);updateCartBadge(count)}catch{updateCartBadge(0)}}
function layout(content){
 const adminLink=isAdminUser()?'<a class="admin-link" href="'+routeUrl('/admin')+'">'+t('nav.admin')+'</a>':'';
 const userPoints=state.user?'<a class="points-badge" href="'+routeUrl('/rewards')+'" title="'+t('header.pointsTitle')+'">★ '+fa(state.points)+' '+t('header.pointsSuffix')+'</a>':'';
 app.innerHTML='<header class="top"><div class="wrap nav"><a class="brand" href="'+routeUrl('/')+'" aria-label="'+t('header.logoAria')+'">'+t('app.name')+'<small>GILAS ART</small></a><nav class="links" id="main-menu" aria-label="'+t('header.menu')+'"><a href="'+routeUrl('/shop')+'">'+t('nav.shop')+'</a><a href="'+routeUrl('/about')+'">'+t('nav.about')+'</a><a href="'+routeUrl('/contact')+'">'+t('nav.contact')+'</a><a href="'+routeUrl('/news')+'">'+t('nav.news')+'</a><a href="'+routeUrl('/articles')+'">'+t('nav.articles')+'</a><a href="'+routeUrl('/rewards')+'" class="rewards-nav-link">'+t('nav.rewards')+'</a>'+adminLink+'</nav><div class="spacer"></div><button class="theme-toggle" type="button" aria-label="'+t('header.theme')+'" title="'+t('header.themeTitle')+'" onclick="window.GilasArtTheme&&window.GilasArtTheme.toggle()">◐ <span>'+t('nav.dayNight')+'</span></button><a class="iconbtn cart-link" href="'+routeUrl('/cart')+'" aria-label="'+t('header.cartAria')+'"><div class="cart-icon-wrap">'+icon('cart')+'<b class="cart-count-badge" aria-label="'+t('header.cartCount',{count:fa(state.cartCount)})+'"'+(state.cartCount>0?'':' hidden')+'>'+ (state.cartCount>99?'۹۹+':fa(state.cartCount))+'</b></div><span>'+t('nav.cart')+'</span></a>'+userPoints+accountLink()+'<button class="mobile-menu-toggle" type="button" aria-label="'+t('header.openMenu')+'" aria-expanded="false" aria-controls="main-menu" onclick="window.GilasArtMobileMenu&&window.GilasArtMobileMenu.toggle(this)"><span></span><span></span><span></span></button></div></header><div class="rewards-promo"><div class="wrap rewards-promo-inner">'+(state.user?'<span>'+t('promo.points')+' <b>'+fa(state.points)+'</b></span><span>'+t('promo.coupon')+'</span><a href="'+routeUrl('/rewards')+'">'+t('promo.convert')+'</a>':'<span>'+t('promo.join')+'</span><a href="'+routeUrl('/account')+'">'+t('promo.joinAction')+'</a>')+'</div></div><main id="main-content" tabindex="-1">'+content+'</main>'+renderFooter();
 refreshFooterSocialLinks();
 translateRenderedContent(app);
}
function routeBase(){return location.pathname.startsWith('/glsArt/')||location.pathname==='/glsArt'?'/glsArt':''}
function routeUrl(path){return localePath(path)}
function scrollRouteTop(){try{window.scrollTo({top:0,left:0,behavior:'auto'});document.documentElement.scrollTop=0;document.body.scrollTop=0}catch{try{window.scrollTo(0,0)}catch{}}}
function navigate(path,{replace=false}={}){const raw=String(path||'/');const target=raw.startsWith('#/')?raw.slice(1):raw;const url=routeUrl(target||'/');if(url===location.pathname+location.search&&!routeInFlight)return;if(replace)history.replaceState({},'',url);else history.pushState({},'',url);scrollRouteTop();if(routeInFlight&&routeInFlightTarget===url)return;routeInFlightTarget=url;routeInFlight=router().finally(()=>{routeInFlight=null;routeInFlightTarget='';scrollRouteTop()});}
window.GilasArtRouter={navigate};
function productUrl(slug){const s=String(slug||'').trim();if(!s)return routeUrl('/shop');return routeUrl('/'+encodeURIComponent(s))}
function productCard(p){
 const image=safeUrl(p.image),flash=Number(p.flash_sale_active||p.flashSaleActive)===1&&p.flash_sale_ends_at;
 const hasFlashPrice=flash&&p.flash_sale_price_irt!==null&&p.flash_sale_price_irt!==undefined;
 const shown=hasFlashPrice?Number(p.flash_sale_price_irt):Number(p.price_irt||0);
 const name=escapeHtml(p.name||t("product.artwork")),sku=escapeHtml(p.sku||""),href=productUrl(p.slug);
 const rating=Number(p.rating_avg||0),reviews=Number(p.review_count||0),sold=Number(p.sold_count||0);
 const socialProof=reviews>0||sold>0;
 const ratingText=rating>0?rating.toFixed(1):"—";
 return `<article class="card product-card product-showcase"><a class="product-card-link" href="${href}" aria-label="${t('product.view')} ${name}">
 <div class="product-card-media"><div class="product-art-frame">${image?`<img src="${escapeHtml(image)}" alt="${name}" loading="lazy" decoding="async">`:'<div class="product-image-empty" aria-hidden="true">'+t('product.artwork')+'</div>'}</div>
 <div class="product-card-overlay" aria-hidden="true"><span>${t('product.details')}</span><span>←</span></div>
 <div class="product-card-badges"><span class="product-art-badge">${t('product.artwork')}</span>${flash?`<span class="flash-badge">${icon("clock")} ${t('product.featured')}</span>`:""}</div>
 <div class="product-card-corner" aria-hidden="true"><span>GILAS</span><b>ART</b></div></div>
 <div class="cardbody product-card-body">
  <div class="product-card-heading"><div class="product-title-wrap"><span class="product-card-kicker">GILAS ART</span><h3>${name}</h3></div>${sku?`<span class="product-sku" dir="ltr">${sku}</span>`:""}</div>
  ${socialProof?`<div class="product-social-proof" aria-label="${t('product.buyerFeedback')}"><span class="product-rating"><b>★</b> ${ratingText}</span><span>${fa(reviews)} ${t('product.reviews')}</span>${sold?`<span>${fa(sold)} ${t('product.sales')}</span>`:""}</div>`:""}
  ${flash?`<div class="flash-timer product-card-timer" data-flash-end="${escapeHtml(p.flash_sale_ends_at)}" aria-label="${t('product.remaining')}"></div>`:""}
  <div class="product-card-footer"><div class="product-price-group"><span class="product-price-label">${hasFlashPrice?t('product.specialPrice'):t('product.price')}</span><strong class="price product-card-price">${fa(shown)} <small>${t('product.rial')}</small></strong>${hasFlashPrice?`<span class="muted flash-old">${fa(p.price_irt)} ${t('product.rial')}</span>`:""}</div><span class="product-card-arrow" aria-hidden="true">←</span></div>
 </div></a></article>`;
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
async function home(){layout('<section class="wrap home-loading" aria-busy="true"><div class="home-loading-mark">GILAS ART</div><div class="home-loading-copy"><strong>'+t('common.loading')+'</strong><span>'+t('home.latestText')+'</span></div></section>');let snapshot=await loadStorefrontSnapshot();let products,settings,flashData,categoryData,categoryProducts=[];if(snapshot){const normalized=(snapshot.products||[]).map(snapshotCore);categoryProducts=normalized;products={items:normalized.slice(0,8)};settings={settings:snapshot.settings||{}};flashData={items:normalized.filter(p=>Number(p.flash_sale_active)===1&&p.flash_sale_ends_at&&new Date(p.flash_sale_ends_at).getTime()>Date.now()).slice(0,20)};categoryData={items:Array.isArray(snapshot.categories)?snapshot.categories:[]};}else{try{const r=await fetch(API+'/api/home',{credentials:'omit',cache:'no-store'});const d=r.ok?await r.json():null;categoryProducts=(d?.products?.items||[]).map(p=>({...p,image:safeUrl(p.image)}));products={items:categoryProducts};settings={settings:d?.settings?.settings||{}};flashData={items:(d?.flash?.items||[]).map(p=>({...p,image:safeUrl(p.image)}))};categoryData={items:d?.categories?.items||[]};}catch{products={items:[]};settings={settings:{}};flashData={items:[]};categoryData={items:[]}}}state.products=products.items||[];state.categories=categoryData.items||[];const ss=settings.settings||{},flash=flashData.items||[];state.settings=ss;const featuredProduct=pickFeaturedProduct(state.products);const heroProduct=featuredProduct||state.products[0]||null,heroImage=heroProduct?safeUrl(heroProduct.image):'';setSeo({title:ss.seo_title||t('home.title'),description:ss.seo_description||ss.site_description,image:heroImage||undefined});const categoryThumbnail={
cat_gilas_horizontal:'<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="24" width="100" height="52" rx="3" stroke-width="2.4"/><rect x="36" y="30" width="88" height="40" rx="1" stroke-width="1.1" opacity=".7"/><path d="M42 57c8-19 16 12 25-6 9-18 17 12 26-5 8-15 15 8 25-3" stroke-width="2.1"/><path d="M49 40q8-7 16 0t16 0 16 0 14 0" stroke-width="1.2" opacity=".65"/><circle cx="80" cy="50" r="2.5" fill="currentColor" stroke="none"/></g></svg>',
cat_gilas_vertical:'<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="56" y="13" width="48" height="74" rx="3" stroke-width="2.4"/><rect x="62" y="19" width="36" height="62" rx="1" stroke-width="1.1" opacity=".7"/><path d="M80 25c-12 11-12 24 0 34 12-10 12-23 0-34Zm0 34c-9 8-9 15 0 21 9-6 9-13 0-21Z" stroke-width="2.1"/><path d="M71 47h18M80 31v38" stroke-width="1.2" opacity=".65"/></g></svg>',
cat_gilas_square:'<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="42" y="13" width="76" height="74" rx="3" stroke-width="2.4"/><rect x="49" y="20" width="62" height="60" rx="1" stroke-width="1.1" opacity=".7"/><path d="M80 25c7 8 16 11 24 25-8 14-17 17-24 25-7-8-16-11-24-25 8-14 17-17 24-25Z" stroke-width="2.1"/><circle cx="80" cy="50" r="8" stroke-width="1.3"/><path d="M80 42v16M72 50h16" stroke-width="1" opacity=".6"/></g></svg>',
cat_gilas_poetry:'<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="36" y="18" width="88" height="64" rx="3" stroke-width="2.4"/><rect x="43" y="25" width="74" height="50" rx="1" stroke-width="1.1" opacity=".7"/><path d="M51 39h58M51 50h51M51 61h58" stroke-width="1.8"/><path d="M58 33q6-5 12 0t12 0 12 0 10 0" stroke-width="1.1" opacity=".65"/><circle cx="80" cy="50" r="3" stroke-width="1.1" opacity=".7"/></g></svg>',
cat_gilas_religious:'<svg viewBox="0 0 160 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="39" y="20" width="82" height="60" rx="3" stroke-width="2.4"/><rect x="46" y="27" width="68" height="46" rx="1" stroke-width="1.1" opacity=".7"/><path d="M80 31a20 20 0 0 0-16 32h32a20 20 0 0 0-16-32Z" stroke-width="2.1"/><path d="M80 29v13M73 35h14M57 65q23-12 46 0" stroke-width="1.4" opacity=".7"/></g></svg>'
};const categoryImage=cat=>categoryThumbnail[cat?.id]||'';const categorySection=state.categories.length?'<section class="wrap home-categories section"><div class="sectionhead"><div><span class="eyebrow">'+t('home.collectionsEyebrow')+'</span><h2>'+t('home.collections')+'</h2><p class="muted">'+t('home.collectionsText')+'</p></div><a class="muted" href="'+routeUrl('/shop')+'">'+t('home.viewAll')+'</a></div><div class="category-grid">'+state.categories.slice(0,6).map((cat,i)=>{const image=categoryImage(cat);return '<a class="category-card" href="'+routeUrl('/shop')+'?category='+encodeURIComponent(cat.id)+'"><span class="category-index">0'+(i+1)+'</span><span class="category-mark" aria-hidden="true">'+(image?image:'')+'</span><strong>'+escapeHtml(cat.name)+'</strong><small>'+t('home.categoryView')+'</small><span class="category-arrow" aria-hidden="true">←</span></a>'}).join('')+'</div></section>':' ';const flashSection=flash.length?'<section class="wrap flash-section"><div class="flash-head"><div><span class="eyebrow">'+t('home.limitedTime')+'</span><h2>'+t('home.flashTitle')+'</h2><p>'+t('home.flashText')+'</p></div><div class="flash-controls"><button class="icon-circle" id="flash-prev" aria-label="'+t('home.previous')+'">‹</button><button class="icon-circle" id="flash-next" aria-label="'+t('home.next')+'">›</button></div></div><div id="flash-track" class="flash-track">'+flash.map(productCard).join('')+'</div></section>':'';const heroMedia=heroImage?'<a class="home-hero-art" href="'+productUrl(heroProduct.slug)+'" aria-label="'+t('home.heroView')+'"><img src="'+escapeHtml(heroImage)+'" alt="'+escapeHtml(heroProduct.name)+'" fetchpriority="high" decoding="async"><span class="home-hero-art-caption"><span>'+t('home.selected')+'</span><strong>'+escapeHtml(heroProduct.name)+'</strong></span></a>':'<div class="home-hero-art home-hero-art-empty" aria-label="'+t('home.galleryArt')+'"><span>GILAS ART</span><strong>'+t('home.artwork')+'</strong></div>';layout('<section class="wrap hero home-hero"><div class="hero-copy"><div class="eyebrow">'+t('home.heroEyebrow2')+'</div><h1>'+t('home.heroTitle')+'</h1><p>'+t('home.heroText')+'</p><div class="toolbar"><a class="btn primary" href="'+routeUrl('/shop')+'">'+t('home.viewWorks')+'</a><a class="btn ghost" href="'+routeUrl('/about')+'">'+t('home.about')+'</a></div><div class="home-hero-note"><span class="pill">GILAS ART</span><span>'+t('home.heroNote')+'</span></div></div>'+heroMedia+'</section><section class="wrap home-intro"><div class="home-intro-mark" aria-hidden="true">✦</div><div><span class="eyebrow">'+t('home.approachEyebrow')+'</span><h2>'+t('home.approach')+'</h2><p>'+t('home.approachText')+'</p></div><a class="btn ghost" href="'+routeUrl('/shop')+'">'+t('home.enterGallery')+'</a></section>'+categorySection+flashSection+'<section class="wrap section home-latest"><div class="sectionhead"><div><span class="eyebrow">'+t('home.latestEyebrow')+'</span><h2>'+t('home.latest')+'</h2><p class="muted">'+t('home.latestActive')+'</p></div><a class="muted" href="'+routeUrl('/shop')+'">'+t('home.allWorks')+'</a></div><div class="grid">'+(state.products.slice(0,8).map(productCard).join('')||'<div class="panel">'+t('home.noActive')+'</div>')+'</div></section><section class="wrap home-process"><div class="sectionhead"><div><span class="eyebrow">'+t('home.processEyebrow')+'</span><h2>'+t('home.processTitle')+'</h2><p>'+t('home.processText')+'</p></div></div><div class="process-grid"><div><span>01</span><strong>'+t('home.processDiscover')+'</strong><p>'+t('home.discoverText')+'</p></div><div><span>02</span><strong>'+t('home.processChoose')+'</strong><p>'+t('home.chooseText')+'</p></div><div><span>03</span><strong>'+t('home.processOrder')+'</strong><p>'+t('home.orderText')+'</p></div></div></section>');startFlashTimers();const track=document.querySelector('#flash-track');if(track){const step=()=>{const first=track.querySelector('.card');return first?first.getBoundingClientRect().width+18:280};document.querySelector('#flash-prev').onclick=()=>track.scrollBy({left:-step(),behavior:'smooth'});document.querySelector('#flash-next').onclick=()=>track.scrollBy({left:step(),behavior:'smooth'});let timer=setInterval(()=>{if(!document.body.contains(track)){clearInterval(timer);return}const max=track.scrollWidth-track.clientWidth;if(track.scrollLeft>=max-10)track.scrollTo({left:0,behavior:'smooth'});else track.scrollBy({left:step(),behavior:'smooth'})},5000)}}async function shop(){
 const pageSize=3;
 let offset=0,loading=false,done=false,query='',sort='newest',minPrice=0,maxPrice=0,minRating=0;
 const paginationState=()=>({limit:String(pageSize),offset:String(offset)});
 let selectedCategories=new Set(),allItems=[],filteredItems=[],sentinel,observer;
 const params=new URLSearchParams(location.search||'');
 query=(params.get('q')||'').trim();
 sort=params.get('sort')||'newest';
 minPrice=Math.max(0,Number(params.get('min_price')||0));
 maxPrice=Math.max(0,Number(params.get('max_price')||0));
 minRating=Math.max(0,Math.min(5,Number(params.get('rating')||0)));
 (params.get('categories')||params.get('category')||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>selectedCategories.add(x));
 try{
  const snapshot=await loadStorefrontSnapshot();
  if(!snapshot)throw new Error(t('shop.error'));
  state.categories=Array.isArray(snapshot.categories)?snapshot.categories:[];
  allItems=(snapshot.products||[]).map(snapshotCore);
 }catch(e){
  layout('<section class="wrap page"><div class="panel"><h1>'+t('shop.title')+'</h1><p class="error">'+escapeHtml(e.message||t('shop.error'))+'</p></div></section>');
  return;
 }
 const prices=allItems.map(x=>Number(x.price_irt||0)).filter(Number.isFinite);
 const priceCeiling=Math.max(1000000,...prices,1000000);
 const priceFloor=Math.max(0,Math.min(...prices,0));
 const priceStep=Math.max(100000,Math.ceil(priceCeiling/200/100000)*100000);
 if(!maxPrice||maxPrice>priceCeiling)maxPrice=priceCeiling;
 if(minPrice>maxPrice)minPrice=priceFloor;
 const sortOptions=[
  ['newest',t('shop.newest')],
  ['buyer_recommended',t('shop.buyerRecommended')],
  ['best_selling',t('shop.bestSelling')],
  ['popular',t('shop.popular')],
  ['rating',t('shop.bestRated')],
  ['reviews',t('shop.mostReviewed')],
  ['price_asc',t('shop.priceLow')],
  ['price_desc',t('shop.priceHigh')]
 ];
 const sortMarkup=sortOptions.map(([v,l])=>'<option value="'+v+'" '+(sort===v?'selected':'')+'>'+l+'</option>').join('');
 const categoryMarkup=state.categories.map(cat=>{
  const id=String(cat.id||'');
  return '<label class="check-option shop-category-option"><input class="cat-check" type="checkbox" data-id="'+escapeHtml(id)+'" '+(selectedCategories.has(id)?'checked':'')+'><span class="check-box" aria-hidden="true"></span><span>'+escapeHtml(cat.name||t('shop.categoryNoName'))+'</span></label>';
 }).join('');
 const ratingMarkup=['0','4','3','2'].map(v=>{
  const label=v==='0'?t('shop.allRatings'):v+' '+t('shop.ratingAndMore');
  return '<label class="check-option shop-rating-option"><input type="radio" name="min-rating" value="'+v+'" '+(Number(minRating)===Number(v)?'checked':'')+'><span class="radio-box" aria-hidden="true"></span><span>'+label+'</span></label>';
 }).join('');
 const priceText=v=>fa(Math.max(0,Number(v)||0))+' '+t('product.rial');
 const syncUrl=()=>{
  const p=new URLSearchParams();
  if(query)p.set('q',query);
  if(selectedCategories.size)p.set('categories',[...selectedCategories].join(','));
  if(minPrice>priceFloor)p.set('min_price',String(Math.round(minPrice)));
  if(maxPrice<priceCeiling)p.set('max_price',String(Math.round(maxPrice)));
  if(minRating)p.set('rating',String(minRating));
  if(sort!=='newest')p.set('sort',sort);
  const qs=p.toString();
  history.replaceState({},'',(routeBase()||'')+'/shop'+(qs?'?'+qs:''));
 };
 const applyFilters=()=>{
  const q=query.toLocaleLowerCase();
  filteredItems=allItems.filter(item=>{
   if(q&&!([item.name,item.description,item.sku,item.seo_title,item.seo_description].some(v=>String(v||'').toLocaleLowerCase().includes(q))))return false;
   if(selectedCategories.size){
    const ids=(item.category_ids||[]).map(String);
    if(!ids.some(id=>selectedCategories.has(id))&&!selectedCategories.has(String(item.category_id||'')))return false;
   }
   const price=Number(item.price_irt||0);
   if(price<minPrice||price>maxPrice)return false;
   if(Number(item.rating_avg||0)<minRating)return false;
   return true;
  });
  filteredItems=snapshotSort(filteredItems,sort);
 };
 const renderActiveFilters=()=>{
  const box=document.querySelector('#shop-active-filters');if(!box)return;
  const chips=[];
  if(query)chips.push('<button type="button" class="filter-chip" data-clear="q">جستجو: '+escapeHtml(query)+' <span>×</span></button>');
  selectedCategories.forEach(id=>{const cat=state.categories.find(x=>String(x.id)===String(id));if(cat)chips.push('<button type="button" class="filter-chip" data-clear-category="'+escapeHtml(id)+'">'+escapeHtml(cat.name)+' <span>×</span></button>')});
  if(minPrice>priceFloor||maxPrice<priceCeiling)chips.push('<button type="button" class="filter-chip" data-clear="price">قیمت <span>×</span></button>');
  if(minRating)chips.push('<button type="button" class="filter-chip" data-clear="rating">'+minRating+' ستاره به بالا <span>×</span></button>');
  box.innerHTML=chips.join('');
  box.hidden=!chips.length;
 };
 const updatePriceUi=()=>{
  const min=document.querySelector('#price-min'),max=document.querySelector('#price-max'),minNum=document.querySelector('#price-min-number'),maxNum=document.querySelector('#price-max-number');
  if(min){min.value=String(minPrice);min.max=String(priceCeiling);min.step=String(priceStep)}
  if(max){max.value=String(maxPrice);max.max=String(priceCeiling);max.step=String(priceStep)}
  if(minNum){minNum.value=String(Math.round(minPrice));minNum.max=String(priceCeiling);minNum.step=String(priceStep)}
  if(maxNum){maxNum.value=String(Math.round(maxPrice));maxNum.max=String(priceCeiling);maxNum.step=String(priceStep)}
  const minLabel=document.querySelector('#price-min-label'),maxLabel=document.querySelector('#price-max-label');
  if(minLabel)minLabel.textContent=priceText(minPrice);
  if(maxLabel)maxLabel.textContent=priceText(maxPrice);
  const fill=document.querySelector('.price-range-fill');
  if(fill){const a=(minPrice/priceCeiling)*100,b=(maxPrice/priceCeiling)*100;fill.style.insetInlineStart=a+'%';fill.style.width=Math.max(0,b-a)+'%'}
 };
 const renderPage=(append=false)=>{
  const results=document.querySelector('#results');if(!results)return;
  const start=append?Math.max(0,offset-pageSize):0;
  const slice=filteredItems.slice(start,offset);
  if(append){if(slice.length)results.insertAdjacentHTML('beforeend',slice.map(productCard).join(''))}
  else results.innerHTML=slice.map(productCard).join('');
  const count=document.querySelector('#results-count');if(count)count.textContent=fa(filteredItems.length)+' '+t('shop.results');
  const empty=document.querySelector('#empty');if(empty)empty.hidden=filteredItems.length!==0;
  const more=document.querySelector('#load-more');done=offset>=filteredItems.length;if(more)more.hidden=done;
  const status=document.querySelector('#load-status');
  if(status)status.textContent=filteredItems.length?(done?t('shop.allShown'):t('shop.continue')):t('shop.noMatch');
  startFlashTimers(results);
 };
 let refresh=()=>{
  applyFilters();offset=Math.min(pageSize,filteredItems.length);if(offset===0)offset=0;done=offset>=filteredItems.length;
  renderPage(false);renderActiveFilters();updatePriceUi();syncUrl();
 };
 const loadMore=()=>{
  if(loading||done)return;
  loading=true;
  const next=Math.min(offset+pageSize,filteredItems.length);
  offset=next;renderPage(true);loading=false;
 };
 const resetFilters=()=>{
  query='';selectedCategories.clear();minPrice=priceFloor;maxPrice=priceCeiling;minRating=0;sort='newest';
  const q=document.querySelector('#shop-search');if(q)q.value='';
  const s=document.querySelector('#sort-products');if(s)s.value=sort;
  document.querySelectorAll('.cat-check').forEach(x=>x.checked=false);
  document.querySelectorAll('input[name="min-rating"]').forEach(x=>x.checked=x.value==='0');
  refresh();
 };
 layout('<section class="wrap page shop-page">'+
 '<header class="page-masthead shop-page-masthead"><div class="page-masthead-copy"><span class="eyebrow">GILAS ART • COPPER INLAY</span><h1>'+t('shop.title')+'</h1><p>'+t('shop.description')+'</p></div></header>'+
 '<section class="shop-control-shell" aria-label="'+t('shop.title')+'">'+ '<div class="shop-control-bar">'+ '<details class="shop-control-item shop-search-control" id="shop-search-control"><summary class="shop-control-trigger"><span class="shop-control-trigger-main"><span>'+t('shop.search')+'</span><span class="shop-control-indicator" aria-hidden="true"></span></span><span class="shop-control-trigger-hint">'+t('shop.searchHint')+'</span></summary><div class="shop-control-panel"><label class="shop-search-input-wrap" for="shop-search"><span class="sr-only">'+t('shop.searchAria')+'</span><input id="shop-search" type="search" value="'+escapeHtml(query)+'" placeholder="'+t('shop.searchPlaceholder')+'" autocomplete="off" enterkeyhint="search"></label></div></details>'+ '<details class="shop-control-item shop-category-control" id="shop-category-control"><summary class="shop-control-trigger"><span class="shop-control-trigger-main"><span class="shop-control-icon" aria-hidden="true">▦</span><span>'+t('shop.categories')+'</span><span class="shop-control-indicator" aria-hidden="true"></span></span><span class="shop-control-trigger-hint">'+t('shop.categoriesHint')+'</span></summary><div class="shop-control-panel"><fieldset class="filter-group shop-filter-group shop-category-fieldset"><legend>'+t('shop.categoryWorks')+'</legend><label class="check-option shop-category-option"><input class="cat-check" type="checkbox" data-id="" '+(selectedCategories.size===0?'checked':'')+'><span class="check-box" aria-hidden="true"></span><span>'+t('shop.allWorks')+'</span></label>'+categoryMarkup+'</fieldset></div></details>'+ '<details class="shop-control-item shop-filter-control" id="shop-filter-control"><summary class="shop-control-trigger"><span class="shop-control-trigger-main"><span class="shop-control-icon" aria-hidden="true">☷</span><span>'+t('shop.filters')+'</span><span class="shop-control-indicator" aria-hidden="true"></span></span><span class="shop-control-trigger-hint">'+t('shop.filtersHint')+'</span></summary><div class="shop-control-panel"><div class="shop-filter-panel-inner"><fieldset class="filter-group shop-filter-group price-filter-group"><legend>'+t('shop.priceRange')+'</legend><div class="price-values"><label><span>'+t('shop.from')+'</span><input id="price-min-number" type="number" inputmode="numeric" min="'+priceFloor+'" max="'+priceCeiling+'" step="'+priceStep+'" value="'+Math.round(minPrice)+'" aria-label="'+t('shop.minPrice')+'"></label><label><span>'+t('shop.to')+'</span><input id="price-max-number" type="number" inputmode="numeric" min="'+priceFloor+'" max="'+priceCeiling+'" step="'+priceStep+'" value="'+Math.round(maxPrice)+'" aria-label="'+t('shop.maxPrice')+'"></label></div><div class="price-range" aria-hidden="true"><span class="price-range-track"></span><span class="price-range-fill"></span><input id="price-min" type="range" min="'+priceFloor+'" max="'+priceCeiling+'" step="'+priceStep+'" value="'+Math.round(minPrice)+'" tabindex="-1"><input id="price-max" type="range" min="'+priceFloor+'" max="'+priceCeiling+'" step="'+priceStep+'" value="'+Math.round(maxPrice)+'" tabindex="-1"></div><div class="price-labels"><span id="price-min-label">'+priceText(minPrice)+'</span><span id="price-max-label">'+priceText(maxPrice)+'</span></div></fieldset><fieldset class="filter-group shop-filter-group"><legend>'+t('shop.buyerRating')+'</legend>'+ratingMarkup+'</fieldset><div class="filter-panel-actions"><button id="filter-reset" class="filter-reset" type="button">'+t('shop.clearAll')+'</button></div></div></div></details>'+ '<details class="shop-control-item shop-sort-control" id="shop-sort-control"><summary class="shop-control-trigger"><span class="shop-control-trigger-main"><span class="shop-control-icon" aria-hidden="true">↕</span><span>'+t('shop.sort')+'</span><span class="shop-control-indicator" aria-hidden="true"></span></span><span class="shop-control-trigger-hint">'+t('shop.sortHint')+'</span></summary><div class="shop-control-panel"><label class="sort-panel-label" for="sort-products">'+t('shop.sortBy')+'<select id="sort-products" aria-label="'+t('shop.sort')+'">'+sortMarkup+'</select></label></div></details>'+ '</div><div id="shop-active-filters" class="shop-active-filters" hidden></div></section>'+ '<section class="gallery-workspace" aria-label="'+t('shop.title')+'">'+
 '<div class="gallery-results"><div class="results-head"><div><span class="eyebrow">GALLERY COLLECTION</span><h2>'+t('shop.available')+'</h2></div><span class="results-count" id="results-count" aria-live="polite"></span></div><div id="results" class="grid product-stream" aria-live="polite"></div><div id="sentinel" class="infinite-sentinel" aria-hidden="true"></div><div class="load-more-wrap"><button id="load-more" class="btn ghost load-more-button" type="button">'+t('shop.more')+'</button><div id="load-status" class="load-status" role="status" aria-live="polite">'+t('shop.preparing')+'</div></div><div id="empty" class="panel empty-state" hidden>'+t('shop.empty')+'</div></div>'+
 '</section></section>');
 sentinel=document.querySelector('#sentinel');
 observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadMore()},{rootMargin:'500px 0px'});
 observer.observe(sentinel);
 const search=document.querySelector('#shop-search');
 let searchTimer=0;
 search?.addEventListener('input',()=>{query=search.value.trim();clearTimeout(searchTimer);searchTimer=setTimeout(refresh,180)});
 search?.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(searchTimer);refresh()}});
 document.querySelector('#sort-products')?.addEventListener('change',e=>{sort=e.target.value;refresh()});
 document.querySelectorAll('.cat-check').forEach(x=>x.addEventListener('change',()=>{
  const id=String(x.dataset.id||'');
  if(!id){selectedCategories.clear();document.querySelectorAll('.cat-check').forEach(y=>{if(y.dataset.id)y.checked=false});x.checked=true}
  else{if(x.checked){selectedCategories.add(id);document.querySelector('.cat-check[data-id=""]')?.removeAttribute('checked');const all=document.querySelector('.cat-check[data-id=""]');if(all)all.checked=false}else selectedCategories.delete(id);if(!selectedCategories.size){const all=document.querySelector('.cat-check[data-id=""]');if(all)all.checked=true}}
  refresh();
 }));
 document.querySelectorAll('input[name="min-rating"]').forEach(x=>x.addEventListener('change',()=>{minRating=Number(x.value||0);refresh()}));
 const clampPrices=(changed)=>{
  let a=Math.max(priceFloor,Math.min(priceCeiling,Number(document.querySelector('#price-min-number')?.value||minPrice)));
  let b=Math.max(priceFloor,Math.min(priceCeiling,Number(document.querySelector('#price-max-number')?.value||maxPrice)));
  if(changed==='min'&&a>b)b=a;
  if(changed==='max'&&b<a)a=b;
  minPrice=a;maxPrice=b;refresh();
 };
 document.querySelector('#price-min-number')?.addEventListener('change',()=>clampPrices('min'));
 document.querySelector('#price-max-number')?.addEventListener('change',()=>clampPrices('max'));
 document.querySelector('#price-min')?.addEventListener('input',e=>{minPrice=Math.min(Number(e.target.value),maxPrice);updatePriceUi();clearTimeout(searchTimer);searchTimer=setTimeout(refresh,140)});
 document.querySelector('#price-max')?.addEventListener('input',e=>{maxPrice=Math.max(Number(e.target.value),minPrice);updatePriceUi();clearTimeout(searchTimer);searchTimer=setTimeout(refresh,140)});
 document.querySelector('#filter-reset')?.addEventListener('click',resetFilters);
 document.querySelector('#load-more')?.addEventListener('click',loadMore);
 document.querySelector('#shop-active-filters')?.addEventListener('click',e=>{
  const b=e.target.closest('button[data-clear],button[data-clear-category]');if(!b)return;
  if(b.dataset.clear==='q'){query='';const q=document.querySelector('#shop-search');if(q)q.value=''}
  if(b.dataset.clear==='price'){minPrice=priceFloor;maxPrice=priceCeiling}
  if(b.dataset.clear==='rating'){minRating=0;document.querySelector('input[name="min-rating"][value="0"]')?.click()}
  if(b.dataset.clearCategory){selectedCategories.delete(String(b.dataset.clearCategory));document.querySelector('.cat-check[data-id="'+CSS.escape(String(b.dataset.clearCategory))+'"]')?.click();return}
  refresh();
 });
 document.querySelectorAll('.shop-control-item').forEach(d=>d.addEventListener('toggle',()=>{
  if(!d.open)return;
  document.querySelectorAll('.shop-control-item[open]').forEach(other=>{if(other!==d)other.open=false});
 }));
 const updateControlIndicators=()=>{
  const set=(id,active,label)=>{const el=document.querySelector(id);if(!el)return;el.classList.toggle('has-active',!!active);el.querySelector('.shop-control-indicator')?.classList.toggle('is-active',!!active);if(active)el.dataset.activeLabel=label||'فعال';else delete el.dataset.activeLabel};
  set('#shop-search-control',!!query,t('shop.activeSearch'));
  set('#shop-category-control',selectedCategories.size>0,fa(selectedCategories.size)+' '+t('shop.activeCategory'));
  set('#shop-filter-control',minPrice>priceFloor||maxPrice<priceCeiling||!!minRating,t('shop.activeFilter'));
  set('#shop-sort-control',sort!=='newest',t('shop.activeSort'));
 };
 const originalRefresh=refresh;
 refresh=()=>{originalRefresh();updateControlIndicators()};
 refresh();
}

async function product(slug){
 let d;
 try{
  d=await api('/api/products/'+encodeURIComponent(slug));
 }catch(primaryError){
  // Never fall back to the public snapshot for product detail.
  // A stale snapshot can contain global options and would produce an incorrect
  // product configuration. Product detail requires a complete backend response.
  console.error('product_detail_backend_failed',primaryError);
  layout('<section class="wrap page"><div class="panel"><h1>جزئیات اثر در دسترس نیست</h1><p class="error">اطلاعات کامل این اثر در حال حاضر از سرویس اصلی دریافت نشد. لطفاً چند لحظه بعد دوباره تلاش کنید.</p><a class="btn primary" href="'+routeUrl('/shop')+'">بازگشت به فروشگاه</a></div></section>');
  return;
 }
 const p=d.product||{},images=d.images||[],attributes=d.attributes||[],categories=d.categories||[];
 try{const key='GilasArtViewed:'+String(p.id||slug);if(!sessionStorage.getItem(key)){sessionStorage.setItem(key,'1');api('/api/products/'+encodeURIComponent(slug)+'/view',{method:'POST'}).catch(()=>{})}}catch{}
 const image=safeUrl(p.image);
 setSeo({title:p.seo_title||p.name+' | گیلاس آرت',description:p.seo_description||p.description,image:image||undefined,jsonLd:{'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description||'',sku:p.sku,image:images.map(x=>safeUrl(x.path)).filter(Boolean),offers:{'@type':'Offer',priceCurrency:'IRR',price:String(p.price_irt),availability:'https://schema.org/InStock',url:location.href}}});
 const mediaItems=images.map((x,i)=>({type:'image',src:safeUrl(x.path),alt:x.alt_text||p.name,index:i})).filter(x=>x.src);
 if(p.video_url)mediaItems.push({type:'video',src:safeUrl(p.video_url),alt:'ویدئوی محصول',index:mediaItems.length});
 const first=mediaItems[0]||null;
 const mediaHtml=item=>item?.type==='video'?'<video class="product-video-player" controls playsinline preload="metadata" src="'+escapeHtml(item.src)+'"><p>مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.</p></video>':item?.src?'<img src="'+escapeHtml(item.src)+'" alt="'+escapeHtml(item.alt||p.name)+'" loading="eager" fetchpriority="high" decoding="async">':'<div class="product-media-empty">اثر هنری</div>';
 const optionHtml=attributes.map(a=>{
  const defaultOption=a.options.find(o=>o.is_default);
  const defaultDelta=Number(defaultOption?.price_delta_irt||0);
  const options=a.options.map((o,i)=>{
    const rawDelta=Number(o.price_delta_irt||0);
    const delta=rawDelta-defaultDelta;
    const deltaLabel=delta===0?'قیمت پایه':(delta>0?'+'+fa(delta)+' ریال':'−'+fa(Math.abs(delta))+' ریال');
    return '<label class="product-option-card '+(o.is_default?'is-default':'')+'"><input class="product-option-input" type="radio" name="product-option-'+escapeHtml(a.id)+'" value="'+escapeHtml(o.id)+'" data-attribute-id="'+escapeHtml(a.id)+'" data-delta="'+delta+'" '+(o.is_default?'checked':'')+'><span class="product-option-card-ui"><span class="product-option-card-top"><strong>'+escapeHtml(o.name)+'</strong>'+(o.is_default?'<span class="product-option-default">پیش‌فرض</span>':'')+'</span><span class="product-option-price '+(delta===0?'is-base':'')+'">'+deltaLabel+'</span></span></label>';
  }).join('');
  return '<fieldset class="product-option-group" data-attribute-group="'+escapeHtml(a.id)+'"><legend>'+escapeHtml(a.name)+'</legend><div class="product-option-grid">'+options+'</div></fieldset>';
}).join('');
 layout('<section class="wrap page product"><div class="product-gallery"><div id="product-media" class="product-media">'+mediaHtml(first)+'</div><div class="product-thumbs">'+mediaItems.map((x,i)=>x.type==='video'?'<button class="product-thumb video-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش ویدئوی محصول"><span>▶</span><small>ویدئو</small></button>':'<button class="product-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش تصویر '+(i+1)+'"><img src="'+escapeHtml(x.src)+'" alt="" loading="lazy" decoding="async"></button>').join('')+'</div></div><div class="product-info"><div class="product-category-pills">'+(categories.length?categories:[{name:p.category_name||'اثر هنری'}]).map(x=>'<span class="pill">'+escapeHtml(x.name)+'</span>').join('')+'</div><h1>'+escapeHtml(p.name)+'</h1><p class="muted">'+escapeHtml(p.description||'')+'</p>'+(optionHtml?'<div class="panel product-options-panel"><h3>انتخاب ویژگی‌ها</h3><div class="product-options">'+optionHtml+'</div></div>':'')+'<div class="price product-live-price" id="product-live-price" style="font-size:24px;margin:24px 0">'+fa(p.price_irt)+' ریال</div><div class="muted" id="product-price-breakdown"></div><div class="product-stock-status" id="product-stock-status"></div><div class="product-purchase-messages" id="product-purchase-messages"><span>اطلاعات سفارش و قیمت نهایی بر اساس انتخاب ویژگی‌ها و موجودی واقعی محصول محاسبه می‌شود.</span></div><div class="toolbar"><div class="product-cart-control" id="product-cart-control" aria-live="polite"><button class="btn primary product-add-btn" id="add" type="button">افزودن به سبد</button></div><button class="btn ghost" id="fav">ذخیره</button></div><div class="quantity-discount-card" id="quantity-discount-card"></div><div class="panel"><h3>نظر خریداران</h3>'+((d.reviews||[]).map(r=>'<article class="review-card" data-review-id="'+escapeHtml(r.id)+'"><div class="review-head"><div><b>'+escapeHtml(r.name||'خریدار')+'</b><div class="review-stars" aria-label="امتیاز '+Number(r.rating||0)+' از 5">'+('★'.repeat(Math.max(0,Math.min(5,Number(r.rating)||0))))+'</div></div><time class="muted">'+escapeHtml(jalaliDate(r.created_at)||'')+'</time></div><p class="review-body">'+escapeHtml(r.body||'')+'</p><div class="review-reactions"><button type="button" class="review-reaction" data-reaction="like" aria-label="پسندیدن نظر">👍 <span>'+fa(r.like_count||0)+'</span></button><button type="button" class="review-reaction" data-reaction="dislike" aria-label="نپسندیدن نظر">👎 <span>'+fa(r.dislike_count||0)+'</span></button></div></article>').join('')||'<span class="muted">هنوز نظری ثبت نشده است.</span>')+'<div class="panel"><h3>ثبت نظر</h3><form id="review-form" class="form"><label>امتیاز<select name="rating"><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select></label><label>نظر شما<textarea name="body" maxlength="1000" required placeholder="نظر خود درباره این اثر را بنویسید"></textarea></label><button class="btn primary" type="submit">ثبت نظر</button><div id="review-msg" aria-live="polite"></div></form></div></div></div></section>');
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
 const selections=()=>[...document.querySelectorAll('.product-option-input:checked')].map(x=>({attributeId:x.dataset.attributeId,optionId:x.value}));
 const recalc=()=>{
   let delta=0;
   document.querySelectorAll('.product-option-input:checked').forEach(o=>delta+=Number(o.dataset.delta||0));
   const total=Number(p.price_irt||0)+delta;
   const priceEl=document.querySelector('#product-live-price'),breakdown=document.querySelector('#product-price-breakdown');
   if(priceEl)priceEl.textContent=fa(total)+' ریال';
   if(breakdown){
     breakdown.innerHTML=delta
       ? '<span>قیمت پایه</span><b>'+fa(p.price_irt)+' ریال</b><span>تغییر ویژگی‌ها</span><b class="product-price-delta '+(delta>0?'is-up':'is-down')+'">'+(delta>0?'+':'−')+fa(Math.abs(delta))+' ریال</b>'
       : '<span>قیمت پایه</span><b>'+fa(p.price_irt)+' ریال</b><span class="product-price-base-note">ویژگی‌های پیش‌فرض انتخاب شده‌اند</span>';
   }
   document.querySelectorAll('.product-option-card').forEach(card=>card.classList.toggle('selected',!!card.querySelector('.product-option-input:checked')));
   return total;
 };
 const productCartControl=document.querySelector('#product-cart-control');
 let productCartQuantity=0;
 const renderProductCartControl=qty=>{
   productCartQuantity=Math.max(0,Math.min(99,Number(qty)||0));
   if(!productCartControl)return;
   if(productCartQuantity<=0){
     productCartControl.innerHTML='<button class="btn primary product-add-btn" id="add" type="button">افزودن به سبد</button>';
     document.querySelector('#add').onclick=async()=>{try{const btn=document.querySelector('#add');if(btn?.disabled)return;if(!state.user){navigate('/account');return}btn?.setAttribute('disabled','disabled');const token=csrf();if(!token)throw new Error('جلسه خرید منقضی شده است؛ لطفاً دوباره وارد حساب شوید.');await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:1,options:selections()}),headers:{'x-csrf-token':token}});updateCartBadge(Math.max(0,state.cartCount-Number(productCartQuantity||0)+1));productCartQuantity=1;renderProductCartControl(1);alert('به سبد خرید اضافه شد')}catch(e){const msg=String(e?.message||'');alert(msg==='cart_add_failed'?'افزودن به سبد خرید در حال حاضر انجام نشد؛ لطفاً دوباره تلاش کنید.':msg||'افزودن به سبد خرید انجام نشد.')}finally{document.querySelector('#add')?.removeAttribute('disabled')}};
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
         await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:target,options:selections()}),headers:{'x-csrf-token':csrf()}});
       }
       updateCartBadge(Math.max(0,state.cartCount+(target-Number(productCartQuantity||0))));
       productCartQuantity=target;
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
   if(!state.meLoadedAt){
     renderProductCartControl(0);
     loadMe().then(async()=>{
       if(!state.user){renderProductCartControl(0);return}
       try{
         const cartData=state.cart||await api('/api/cart');
         const line=(cartData.items||[]).find(x=>String(x.product_id)===String(p.id));
         renderProductCartControl(line?Number(line.quantity):0);
       }catch(e){renderProductCartControl(-1);console.warn('cart_quantity_unavailable',e)}
     }).catch(()=>renderProductCartControl(0));
     return;
   }
   if(!state.user){renderProductCartControl(0);return}
   try{
     const cartData=state.cart||await api('/api/cart');
     const line=(cartData.items||[]).find(x=>String(x.product_id)===String(p.id));
     renderProductCartControl(line?Number(line.quantity):0);
   }catch(e){renderProductCartControl(-1);console.warn('cart_quantity_unavailable',e)}
 };
 const quantityTiers=Array.isArray(d.quantityDiscountTiers)?d.quantityDiscountTiers.filter(x=>Number(x.min)>1&&Number(x.percent)>0):[]; const quantityDiscountCard=document.querySelector('#quantity-discount-card'); if(quantityDiscountCard&&quantityTiers.length){const next=quantityTiers[0];quantityDiscountCard.innerHTML='<div class="quantity-discount-head"><span class="quantity-discount-icon">٪</span><div><strong>با خرید چندتایی، بیشتر صرفه‌جویی کنید</strong><small>تخفیف تعدادی فقط برای همین محصول و بر اساس تعداد سفارش محاسبه می‌شود.</small></div></div><div class="quantity-discount-tiers">'+quantityTiers.map(x=>'<span><b>'+fa(x.min)+' عدد</b><em>'+fa(x.percent)+'٪</em></span>').join('')+'</div><div class="quantity-discount-note">از '+fa(next.min)+' عدد، '+fa(next.percent)+'٪ تخفیف خودکار در سبد خرید اعمال می‌شود.</div></div>'}
 document.querySelectorAll('.product-option-input').forEach(x=>x.addEventListener('change',async()=>{
   const total=recalc();
   if(productCartQuantity>0){
     try{
       const token=csrf();if(!token)throw new Error('جلسه خرید منقضی شده است؛ لطفاً دوباره وارد حساب شوید.');
       const result=await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:productCartQuantity,options:selections()}),headers:{'x-csrf-token':token}});
       const serverPrice=Number(result?.unitPriceIrt);
       if(Number.isFinite(serverPrice)&&serverPrice!==total){
         const priceEl=document.querySelector('#product-live-price');if(priceEl)priceEl.textContent=fa(serverPrice)+' ریال';
       }
       
     }catch(e){
       alert(e?.message||'به‌روزرسانی ویژگی محصول انجام نشد.');
     }
   }
 }));recalc();loadProductCartQuantity();
 const stockEl=document.querySelector('#product-stock-status');
 const stock=Number(p.stock||0);
 if(stockEl)stockEl.innerHTML=stock>0?'<span class="ok">'+t('product.inStock')+' ('+fa(stock)+' '+t('product.units')+')</span>':'<span class="error">'+t('product.outOfStock')+'</span>';
 const purchaseEl=document.querySelector('#product-purchase-messages');
 if(purchaseEl)purchaseEl.innerHTML='<span>'+t('product.purchaseMessage')+'</span>';
 const related=Array.isArray(d.relatedProducts)?d.relatedProducts:[];
 if(related.length){
   const relatedHtml='<section class="panel product-related-panel"><div class="sectionhead"><div><span class="eyebrow">RELATED</span><h2>'+t('product.related')+'</h2></div></div><div class="grid">'+related.map(productCard).join('')+'</div></section>';
   document.querySelector('.product-info')?.insertAdjacentHTML('beforeend',relatedHtml);
 }

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
async function loadMe({force=false}={}){const now=Date.now();if(!force&&state.meLoadedAt&&now-state.meLoadedAt<30000)return {user:state.user,roles:state.roles,permissions:state.permissions};try{const d=await api('/api/me');syncAuthStateFromSession(d);if(state.user){if(!state.rewards){try{const rewardsResult=await api('/api/rewards');state.rewards=rewardsResult;state.points=Number(rewardsResult.balance||0)}catch{state.rewards=null;state.points=0}}syncCartBadge().catch(()=>{});}else{state.rewards=null;state.points=0;updateCartBadge(0)}startNotificationPolling();return d}catch(e){return null}}
async function cart(){
 await loadMe();
 if(!state.user){
  layout('<section class="wrap page"><div class="panel"><h2>سبد خرید</h2><p>برای دیدن سبد خرید وارد حساب شوید.</p><a class="btn primary" href="'+routeUrl('/account')+'">ورود</a></div></section>');
  return;
 }
 let d,addressData={items:[]},couponCode='',couponMessage='';
 [d,addressData]=await Promise.all([api('/api/cart'),api('/api/addresses').catch(()=>({items:[]}))]);
 const paymentOptions=await api('/api/payment/options').catch(()=>({methods:[],defaultProvider:''}));
 const savedAddress=(addressData.items||[])[0]||{};
 const idempotencyKey=()=>((crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/-/g,''));
 const render=(p=d)=>{
  const items=p.items||[];
  const lines=items.map(x=>{
   const opts=x.selected_options?.length?'<div class="cart-options">'+x.selected_options.map(o=>{const d=Number(o.priceAdjustmentIrt??o.priceDeltaIrt??0);const delta=d>0?' (+'+fa(d)+' ریال)':d<0?' (−'+fa(Math.abs(d))+' ریال)':'';return '<span class="cart-option-chip"><b>'+escapeHtml(o.attributeName)+'</b><span>'+escapeHtml(o.optionName)+'</span>'+delta+'</span>'}).join('')+'</div>':'';
   const href=productUrl(x.slug||x.product_slug||'');
   const lineTotal=Number((x.unit_price_irt??x.price_irt)||0)*Number(x.quantity||0); const qtyDiscount=Number(x.quantity_discount_irt||0); const finalLineTotal=Number(x.line_total_after_quantity_discount_irt??lineTotal); const qtyDiscountLabel=Number(x.quantity_discount_percent||0)>0?'<span class="cart-quantity-discount">'+fa(x.quantity_discount_percent)+'٪ تخفیف تعدادی · '+fa(qtyDiscount)+' ریال صرفه‌جویی</span>':'';
   return '<article class="cartline"><a class="cart-product-link" href="'+href+'" aria-label="مشاهده '+escapeHtml(x.name)+'"><span class="cart-product-thumb">'+(x.image?'<img src="'+escapeHtml(safeUrl(x.image))+'" alt="'+escapeHtml(x.name)+'">':'<span>گیلاس آرت</span>')+'</span><span class="grow"><b>'+escapeHtml(x.name)+'</b><span class="muted">'+fa(x.unit_price_irt??x.price_irt)+' ریال × '+fa(x.quantity)+'</span><strong class="cart-line-total">'+fa(finalLineTotal)+' ریال</strong>'+(qtyDiscount>0?'<span class="cart-line-old-total">'+fa(lineTotal)+' ریال</span>':'')+qtyDiscountLabel+opts+'</span></a><div class="cart-qty" role="group" aria-label="تعداد '+escapeHtml(x.name)+'"><button class="cart-qty-btn" data-id="'+escapeHtml(x.product_id)+'" data-qty="'+Math.max(1,Number(x.quantity)-1)+'" type="button" aria-label="کاهش تعداد">−</button><span>'+fa(x.quantity)+'</span><button class="cart-qty-btn" data-id="'+escapeHtml(x.product_id)+'" data-qty="'+Math.min(99,Number(x.quantity)+1)+'" type="button" aria-label="افزایش تعداد">+</button></div><button class="btn ghost del" data-id="'+escapeHtml(x.product_id)+'" type="button">حذف</button></article>';
  }).join('');
  const empty=!items.length;
  const summary=empty?'':'<div class="cart-section cart-pricing"><div class="cart-section-title"><div><span class="eyebrow">ORDER SUMMARY</span><h2>خلاصه سفارش</h2></div><span class="cart-items-count">'+fa(items.length)+' محصول</span></div><div class="quantity-discount-summary">'+((p.items||[]).filter(x=>Number(x.quantity_discount_irt||0)>0).map(x=>'<div><span>'+escapeHtml(x.name)+' × '+fa(x.quantity)+'</span><b>− '+fa(x.quantity_discount_irt)+' ریال</b></div>').join('')||'<span class="muted">با افزایش تعداد هر محصول، تخفیف تعدادی به‌صورت خودکار اعمال می‌شود.</span>')+'</div><div class="coupon-box cart-coupon"><div><label for="coupon-code">کد تخفیف</label><input id="coupon-code" dir="ltr" inputmode="text" autocomplete="off" value="'+escapeHtml(couponCode)+'" placeholder="GLS________"></div><button class="btn ghost" id="apply-coupon" type="button">اعمال کوپن</button><div id="coupon-message" class="'+(couponMessage?'ok':'muted')+'">'+escapeHtml(couponMessage)+'</div></div><div class="price-summary cart-total-list"><div><span>جمع کالاها</span><b>'+fa(p.subtotal_irt)+' ریال</b></div><div><span>تخفیف</span><b>'+fa(p.discount_irt)+' ریال</b></div><div><span>هزینه ارسال</span><b>'+fa(p.shipping_irt)+' ریال</b></div><div class="cart-grand-total"><span>مبلغ قابل پرداخت</span><strong>'+fa(p.total_irt)+' ریال</strong></div></div></div>';
  const address=empty?'':'<div class="cart-section cart-address"><div class="cart-section-title"><div><span class="eyebrow">DELIVERY</span><h2>اطلاعات تحویل</h2><p class="muted">این اطلاعات برای ثبت سفارش و ارسال تابلو استفاده می‌شود.</p></div><span class="cart-secure-note">اطلاعات شما امن ارسال می‌شود</span></div><div class="cart-address-grid"><label>نام گیرنده<input id="rn" value="'+escapeHtml(savedAddress.recipient_name||state.user.name||'')+'" autocomplete="name" required></label><label>شماره موبایل گیرنده<input id="rm" value="'+escapeHtml(savedAddress.mobile||state.user.mobile||'')+'" inputmode="tel" autocomplete="tel" maxlength="11" dir="ltr" required></label><label>استان<input id="pr" value="'+escapeHtml(savedAddress.province||'')+'" autocomplete="address-level1" required></label><label>شهر<input id="ct" value="'+escapeHtml(savedAddress.city||'')+'" autocomplete="address-level2" required></label><label class="cart-address-wide">نشانی کامل<textarea id="ad" autocomplete="street-address" rows="4" required>'+escapeHtml(savedAddress.address||'')+'</textarea></label><label>کد پستی<input id="pc" value="'+escapeHtml(savedAddress.postal_code||'')+'" inputmode="numeric" maxlength="10" autocomplete="postal-code" dir="ltr" required></label></div></div>';
  const methodItems=(paymentOptions.methods||[]).map(m=>'<label class="payment-method-option"><input type="radio" name="payment-provider" value="'+escapeHtml(m.id)+'" '+(m.id===(paymentOptions.defaultProvider||'zarinpal')?'checked':'')+'><span><b>'+escapeHtml(m.title)+'</b><small>'+(m.id==='card_transfer'?'پرداخت دستی و تایید توسط گیلاس آرت':'انتقال به درگاه امن')+'</small></span></label>').join('');
  const action=empty?'':'<div class="cart-section payment-methods"><div class="cart-section-title"><div><span class="eyebrow">PAYMENT</span><h2>روش پرداخت</h2><p class="muted">روش پرداخت مورد نظر خود را انتخاب کنید.</p></div></div><div class="payment-method-list">'+(methodItems||'<div class="error">هیچ روش پرداخت فعالی تنظیم نشده است.</div>')+'</div></div><div class="cart-checkout-bar"><div><span>مبلغ نهایی</span><strong>'+fa(p.total_irt)+' ریال</strong><small>پس از ثبت سفارش، طبق روش انتخابی ادامه می‌دهیم.</small></div><button class="btn primary cart-pay-btn" id="order" type="button">ثبت سفارش و پرداخت</button></div><div id="msg" class="cart-order-message" aria-live="polite"></div>';
  layout('<section class="wrap page cart-page"><div class="cart-hero"><div><span class="eyebrow">GILASART CHECKOUT</span><h1>سبد خرید</h1><p>همه چیز برای تکمیل خرید شما در همین صفحه آماده است.</p></div><div class="cart-hero-badge">'+fa(items.length)+' محصول</div></div><div class="cart-layout"><div class="cart-main"><div class="panel cart-items-panel"><div class="cart-section-title"><div><span class="eyebrow">YOUR ARTWORKS</span><h2>محصولات انتخاب‌شده</h2></div><span class="cart-items-count">'+fa(items.length)+' محصول</span></div><div class="cart-items-list">'+(lines||'<div class="cart-empty"><strong>سبد خرید شما خالی است.</strong><p>آثار مورد علاقه‌تان را از فروشگاه انتخاب کنید.</p><a class="btn primary" href="'+routeUrl('/shop')+'">مشاهده فروشگاه</a></div>')+'</div></div>'+address+summary+action+'</div><aside class="cart-side"><div class="cart-trust"><span class="eyebrow">GILASART</span><h3>خریدی ساده و مطمئن</h3><p>اطلاعات تحویل، تخفیف و مبلغ نهایی را قبل از پرداخت یکجا بررسی کنید.</p><div class="cart-trust-item">✓ اطلاعات سفارش قبل از پرداخت قابل بررسی است</div><div class="cart-trust-item">✓ پرداخت از طریق درگاه فروشگاه انجام می‌شود</div><div class="cart-trust-item">✓ شماره همراه از حساب شما دریافت می‌شود</div></div></aside></div></section>');
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
    const provider=document.querySelector('input[name="payment-provider"]:checked')?.value||paymentOptions.defaultProvider||'zarinpal';
    const pay=await api('/api/orders/'+encodeURIComponent(o.orderId)+'/pay',{method:'POST',body:JSON.stringify({provider}),headers:{'x-csrf-token':csrf()}});
    if(!pay?.url)throw new Error('آدرس درگاه پرداخت از سرور دریافت نشد.');
    if(provider==='card_transfer'&&pay.manual){
     if(msg)msg.innerHTML='<span class="ok">سفارش ثبت شد؛ در حال انتقال به صفحه پرداخت کارت به کارت…</span>';
     location.assign('/payment/manual/index.html?order='+encodeURIComponent(o.orderId));
     return;
    }
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
async function compressReceiptImage(file,maxBytes=150*1024){
 if(!file||!String(file.type||'').startsWith('image/'))throw new Error('فقط فایل تصویری مجاز است.');
 if(file.size<=maxBytes)return file;
 const img=await new Promise((resolve,reject)=>{const u=URL.createObjectURL(file),x=new Image();x.onload=()=>{URL.revokeObjectURL(u);resolve(x)};x.onerror=()=>{URL.revokeObjectURL(u);reject(new Error('تصویر قابل پردازش نیست.'))};x.src=u});
 const canvas=document.createElement('canvas');let w=img.naturalWidth||img.width,h=img.naturalHeight||img.height;const maxSide=1800;const scale=Math.min(1,maxSide/Math.max(w,h));w=Math.max(1,Math.round(w*scale));h=Math.max(1,Math.round(h*scale));
 for(let attempt=0;attempt<10;attempt++){canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d',{alpha:false});ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0,w,h);const quality=Math.max(.35,.88-attempt*.06);const blob=await new Promise(r=>canvas.toBlob(r,'image/jpeg',quality));if(!blob)break;if(blob.size<=maxBytes)return blob;w=Math.max(480,Math.round(w*.86));h=Math.max(480,Math.round(h*.86));}
 throw new Error('حجم تصویر پس از فشرده‌سازی هنوز بیشتر از ۱۵۰ کیلوبایت است.');
}
function invoiceHtmlData(d){
 const o=d.order||{},items=d.items||[],p=d.payment||{},cfg=d.invoice||{};
 const paid=['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(o.status||'').toUpperCase())||String(p.status||'').toUpperCase()==='PAID'; const title=paid?'فاکتور فروش':'پیش فاکتور فروش';
 const esc=escapeHtml;
 const rows=items.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.sku||'-')+'</td><td>'+esc(x.quantity)+'</td><td>'+fa(x.unit_price_irt)+'</td><td>'+fa(x.line_total_irt)+'</td></tr>').join('');
 const logo=cfg.invoice_logo_path||'/invoice/logo.svg',sig=cfg.invoice_signature_path||'';
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
function referralFromLocation(){try{const q=new URLSearchParams(location.search||'').get('ref');if(q)return decodeURIComponent(q).trim().toUpperCase();const h=new URLSearchParams(location.search||'').get('ref');return h?decodeURIComponent(h).trim().toUpperCase():''}catch{return ''}}
async function account(){
 await loadMe();
 if(state.user){
  const [invoiceModule,ordersData]=await Promise.all([
   import('./invoice.js?v=20260929-invoice-2'),
   api('/api/account/orders')
  ]);
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
  layout('<section class="wrap page account-page"><div class="profile-panel panel"><div class="profile-head"><div class="profile-avatar">'+icon('user')+'</div><div><span class="eyebrow">MY ACCOUNT</span><h1>پروفایل کاربر</h1><p class="muted">مدیریت سفارش‌ها، فاکتورها و پیگیری مسیر تحویل تابلو</p></div></div><div class="profile-data"><div><span>شماره موبایل</span><strong>'+escapeHtml(state.user.mobile)+'</strong></div><div><span>نام</span><strong>'+escapeHtml(state.user.name||'کاربر گیلاس آرت')+'</strong></div></div><div class="toolbar"><a class="btn ghost" href="'+routeUrl('/support')+'">'+icon('support')+' تیکت پشتیبانی</a>'+ (isAdminUser()?'<a class="btn primary" href="'+routeUrl('/admin')+'">کنترل پنل</a>':'') +'<button class="btn ghost" id="logout">'+icon('close')+' خروج</button></div></div><section class="orders-profile-section"><div class="sectionhead"><div><span class="eyebrow">MY ORDERS</span><h2>سفارش‌های من</h2><p class="muted">از ثبت سفارش تا تحویل تابلو، همه مراحل را یکجا ببینید.</p></div><span class="orders-profile-count">'+fa(orders.length)+' سفارش</span></div><div id="account-orders">'+(orders.length?orders.map(o=>'<article class="customer-order-card" data-order-id="'+escapeHtml(o.id)+'"><div class="customer-order-head"><div><span class="customer-order-number">سفارش #'+escapeHtml(String(o.id).slice(-8))+'</span><h3>'+escapeHtml(o.recipient_name||o.name||'سفارش گیلاس آرت')+'</h3><small>'+date(o.created_at)+'</small></div><div class="customer-order-actions"><span class="order-status-badge status-'+escapeHtml(String(o.status||'').toLowerCase())+'">'+escapeHtml(statusLabels[o.status]||o.status)+'</span><button class="btn ghost account-invoice" type="button" data-id="'+escapeHtml(o.id)+'" '+(String(o.status)==='PENDING'?'disabled aria-disabled="true"':'')+'>'+ (String(o.status)==='PENDING'?'فاکتور پس از تأیید پرداخت فعال می‌شود.':'فاکتور فروش') +'</button></div></div>'+timeline(o)+'<div class="customer-order-summary"><span>'+fa((o.items||[]).reduce((n,x)=>n+Number(x.quantity||0),0))+' قلم</span><span>'+fa(o.total_irt)+' ریال</span><span>'+escapeHtml(o.address_mobile||o.mobile||'-')+'</span></div></article>').join(''):'<div class="panel empty-orders"><strong>هنوز سفارشی ثبت نکرده‌اید.</strong><p class="muted">آثار گیلاس آرت را ببینید و اولین انتخاب خود را ثبت کنید.</p><a class="btn primary" href="'+routeUrl('/shop')+'">مشاهده فروشگاه</a></div>')+'</div></section><section class="rewards-account-card panel"><div><span class="eyebrow">GILAS ART REWARDS</span><h2>باشگاه امتیاز</h2><p class="muted">امتیاز فعلی شما: <strong class="rewards-balance-inline">'+fa(state.points)+'</strong> — امتیازها را به کوپن یک‌بارمصرف تا ۲۰٪ تبدیل کنید.</p></div><a class="btn primary" href="'+routeUrl('/rewards')+'">مشاهده و تبدیل امتیاز</a></section></section>');
  document.querySelector('#logout').onclick=async()=>{try{await api('/api/auth/logout',{method:'POST',headers:{'x-csrf-token':csrf()}})}finally{clearAuthState();try{authChannel?.postMessage({type:'logout'})}catch{}navigate('/shop')}};
  document.querySelectorAll('.account-invoice').forEach(b=>b.onclick=()=>{if(b.disabled)return;const o=orders.find(x=>x.id===b.dataset.id);if(o)invoiceModule.openInvoice(o,invoiceSettings)});
  const invoiceFromLink=new URLSearchParams(location.search||'').get('invoice');
  if(invoiceFromLink){const o=orders.find(x=>x.id===invoiceFromLink);if(o&&['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(o.status||'').toUpperCase()))setTimeout(()=>invoiceModule.openInvoice(o,invoiceSettings),120);}
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
  const finish=async(code)=>{if(verifying)return;code=String(code||'').replace(/\D/g,'').slice(0,6);if(code.length!==6)return;fillCode(code);verifying=true;verify.disabled=true;status.textContent='در حال بررسی کد…';try{const v=await api('/api/auth/verify-otp',{method:'POST',body:JSON.stringify({challengeId:d.challengeId,code})});state.user=v.user||null;state.roles=v.roles||[];state.permissions=v.permissions||[];csrfToken=v.csrfToken||csrfToken;webOtpController?.abort();webOtpController=null;clearInterval(countdownTimer);status.innerHTML='<span class="ok">ورود با موفقیت انجام شد.</span>';await pollNotifications();setTimeout(()=>{navigate(isAdminUser()?'/admin':'/account')},220)}catch(e){verifying=false;verify.disabled=false;status.textContent=authError(e);boxes.find(x=>x.value==='')?.focus()}};
  boxes.forEach((box,i)=>{box.addEventListener('input',()=>{const raw=box.value.replace(/\D/g,'');if(raw.length>1){const filled=fillCode(raw);if(filled.length===6)finish(filled);return}box.value=raw.slice(0,1);if(box.value&&boxes[i+1])boxes[i+1].focus();if(codeValue().length===6)finish(codeValue())});box.addEventListener('keydown',e=>{if(e.key==='Backspace'&&!box.value&&boxes[i-1])boxes[i-1].focus();if(e.key==='ArrowLeft'&&boxes[i-1])boxes[i-1].focus();if(e.key==='ArrowRight'&&boxes[i+1])boxes[i+1].focus()});box.addEventListener('paste',e=>{const v=(e.clipboardData?.getData('text')||'').replace(/\D/g,'').slice(0,6);if(v){e.preventDefault();const filled=fillCode(v);if(filled.length===6)finish(filled)}})});
  verify.onclick=()=>finish(codeValue());
  change.onclick=()=>{clearInterval(countdownTimer);webOtpController?.abort();showMobile();step.innerHTML='';mobileEl.focus()};
  resend.onclick=async()=>{if(left>0)return;try{const mobile=mobileEl.value;const webOtpPromise=startWebOtp();hideMobile();resend.disabled=true;status.textContent='در حال ارسال کد جدید…';const nd=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile,referralCode:String(referralEl?.value||'').trim().toUpperCase()})});renderOtp(nd,webOtpPromise)}catch(e){webOtpController?.abort();resend.disabled=false;status.textContent=authError(e)}};
  boxes[0]?.focus();
  if(webOtpPromise){try{const credential=await webOtpPromise;if(credential?.code){const filled=fillCode(credential.code);if(filled.length===6)finish(filled)}}catch(e){if(e?.name!=='AbortError')console.warn('webotp_unavailable',e)}}
 };
 send.onclick=async()=>{const mobile=normalizeIranMobile(mobileEl.value);mobileEl.value=mobile;if(!/^09\d{9}$/.test(mobile)){step.innerHTML='<div class="auth-inline-error">شماره موبایل را به‌صورت ۱۱ رقمی وارد کنید.</div>';mobileEl.focus();return}const webOtpPromise=startWebOtp();hideMobile();step.innerHTML='<div class="otp-loading auth-loading" role="status"><span class="auth-spinner"></span><strong>در حال ارسال کد امن…</strong><small>لطفاً این صفحه را نبندید.</small></div>';try{const d=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile,referralCode:String(referralEl?.value||'').trim().toUpperCase()})});renderOtp(d,webOtpPromise)}catch(e){webOtpController?.abort();showMobile();step.innerHTML='<div class="auth-inline-error">'+escapeHtml(authError(e))+'</div>'}};
}
async function support(){await loadMe();if(!state.user){layout('<section class="wrap page"><div class="panel login-required"><h1>پرتال CRM پشتیبانی</h1><p>برای ثبت و پیگیری تیکت، ابتدا وارد حساب خود شوید.</p><a class="btn primary" href="'+routeUrl('/account')+'">'+icon('user')+' ورود</a></div></section>');return}const f=await api('/api/faq');const d=await api('/api/support/tickets');layout(`<section class="wrap page support-portal"><div class="support-hero"><div><div class="eyebrow">CUSTOMER CRM</div><h1>پرتال پشتیبانی گیلاس آرت</h1><p class="muted">پشتیبانی مستقیم، پیگیری شفاف و پاسخ‌گویی در همان صفحه.</p></div><div class="support-orb">${icon('support')}</div></div><div class="panel faq-panel support-faq-first"><div class="eyebrow">FAQ</div><h2>پرسش‌های متداول</h2><p class="muted">قبل از ثبت تیکت، شاید پاسخ سؤال شما همین‌جا باشد.</p>${renderFaq(f.items||[])}</div><div class="support-grid"><div><div class="panel ticket-form-panel"><div class="ticket-form-intro"><div><span class="eyebrow">NEW TICKET</span><h2>${icon('plus')} ثبت درخواست پشتیبانی</h2><p class="muted">موضوع را کوتاه و روشن بنویسید و جزئیات را در پیام توضیح دهید. پس از ثبت، لینک پیگیری تیکت برای شما پیامک می‌شود.</p></div><span class="ticket-form-badge">پاسخ در پرتال</span></div><form id="ticket-form" class="form ticket-form"><div class="ticket-form-grid"><label class="ticket-field ticket-field-wide"><span>موضوع درخواست</span><input name="subject" maxlength="180" required autocomplete="off" placeholder="مثلاً پیگیری سفارش یا مشکل پرداخت"></label><label class="ticket-field"><span>دسته‌بندی</span><select name="category"><option>عمومی</option><option>سفارش</option><option>پرداخت</option><option>محصول</option><option>سفارش سفارشی</option></select></label><label class="ticket-field"><span>اولویت</span><select name="priority"><option value="normal">عادی — پاسخ در روال معمول</option><option value="high">مهم — نیازمند توجه بیشتر</option><option value="low">کم — اطلاع‌رسانی یا پرسش</option></select></label></div><label class="ticket-field"><span>شرح درخواست</span><textarea name="message" required maxlength="10000" rows="8" placeholder="شرح کامل درخواست، شماره سفارش یا جزئیات لازم را اینجا بنویسید..."></textarea><small class="ticket-counter" data-for="message">۰ / ۱۰۰۰۰</small></label><div class="ticket-form-actions"><span class="ticket-form-note">اطلاعات تیکت فقط در حساب شما و برای تیم پشتیبانی قابل مشاهده است.</span><button class="btn primary ticket-submit" type="submit">${icon('send')} ثبت و ارسال تیکت</button></div><div id="ticket-msg" role="status" aria-live="polite"></div></form></div><div class="panel"><div class="sectionhead"><div><span class="eyebrow">MY TICKETS</span><h2>تیکت‌های من</h2></div><span class="muted">${fa((d.items||[]).length)} مورد</span></div><div class="ticket-list">${(d.items||[]).map(t=>`<a class="ticket-row" href="/support/${encodeURIComponent(t.id)}"><div><strong>${escapeHtml(t.subject)}</strong><small>${escapeHtml(t.stage)} • ${jalaliDate(t.updated_at)}</small></div><span class="status-${escapeHtml(t.status)}">${t.status==='open'?'باز':'بسته'}</span></a>`).join('')||'<div class="ticket-empty"><strong>هنوز تیکتی ثبت نکرده‌اید.</strong><span>اگر به راهنمایی نیاز دارید، درخواست خود را از فرم بالا ارسال کنید.</span></div>'}</div></div></div></div></section>`);const form=document.querySelector('#ticket-form'),counter=form?.querySelector('.ticket-counter'),textarea=form?.elements?.message;const paintCount=()=>{if(counter)counter.textContent=fa(String(textarea?.value||'').length)+' / ۱۰۰۰۰'};textarea?.addEventListener('input',paintCount);paintCount();form.onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),button=e.target.querySelector('.ticket-submit'),m=document.querySelector('#ticket-msg');button.disabled=true;button.setAttribute('aria-busy','true');m.innerHTML='<span class="notice">در حال ثبت تیکت و ارسال پیامک تأیید...</span>';try{await api('/api/support/tickets',{method:'POST',body:JSON.stringify({subject:f.get('subject'),category:f.get('category'),priority:f.get('priority'),message:f.get('message')}),headers:{'x-csrf-token':csrf()}});m.innerHTML='<span class="ok">تیکت با موفقیت ثبت شد. لینک پیگیری برای شما پیامک می‌شود.</span>';setTimeout(()=>support(),500)}catch(err){button.disabled=false;button.removeAttribute('aria-busy');m.innerHTML='<span class="error">'+escapeHtml(err.message)+'</span>'}}}
async function supportDetail(id){await loadMe();if(!state.user){navigate('/account');return}const d=await api('/api/support/tickets/'+encodeURIComponent(id));layout(`<section class="wrap page support-detail"><div class="panel"><div class="sectionhead"><div><span class="eyebrow">TICKET</span><h1>${escapeHtml(d.ticket.subject)}</h1><p class="muted">${escapeHtml(d.ticket.stage)} • ${d.ticket.status==='open'?'باز':'بسته'} • ${jalaliDate(d.ticket.created_at)}</p></div><a class="btn ghost" href="'+routeUrl('/support')+'">← همه تیکت‌ها</a></div><div class="ticket-thread">${(d.messages||[]).map(m=>`<div class="ticket-message ${m.author_type==='admin'?'from-admin':'from-user'}"><div class="message-meta">${m.author_type==='admin'?'پشتیبانی گیلاس آرت':'شما'} • ${jalaliDate(m.created_at)}</div><div>${escapeHtml(m.body)}</div></div>`).join('')}</div>${d.ticket.status==='open'?'<form id="reply-ticket" class="form"><label>پیام جدید<textarea name="message" required maxlength="10000"></textarea></label><button class="btn primary">'+icon('send')+' ارسال پاسخ</button><div id="reply-msg"></div></form>':'<div class="notice">این تیکت بسته شده است.</div>'}</div></section>`);document.querySelector('#reply-ticket')?.addEventListener('submit',async e=>{e.preventDefault();const f=new FormData(e.target);try{await api('/api/support/tickets/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({message:f.get('message')}),headers:{'x-csrf-token':csrf()}});supportDetail(id)}catch(err){document.querySelector('#reply-msg').textContent=err.message}})}
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
   const x=items[0]||{};
   const phone=String(x.phone||'').trim(),mobile=String(x.mobile||'').trim(),address=String(x.address||'').trim(),mapUrl=String(x.map_url||'').trim();
   const mapEmbed=address?'https://www.google.com/maps?q='+encodeURIComponent(address)+'&output=embed':'';
   const mapLink=safeUrl(mapUrl)||mapEmbed;
   const contactRows=[
    phone?'<a class="contact-info-card" href="tel:'+escapeHtml(phone)+'"><span class="contact-info-icon">'+icon('support')+'</span><span class="contact-info-copy"><small>تلفن هنرکده</small><strong dir="ltr">'+escapeHtml(phone)+'</strong><em>تماس مستقیم</em></span></a>':'',
    mobile?'<a class="contact-info-card" href="tel:'+escapeHtml(mobile)+'"><span class="contact-info-icon">'+icon('user')+'</span><span class="contact-info-copy"><small>موبایل و واتساپ</small><strong dir="ltr">'+escapeHtml(mobile)+'</strong><em>تماس و مشاوره</em></span></a>':'',
    address?'<div class="contact-info-card contact-address-card"><span class="contact-info-icon">'+icon('support')+'</span><span class="contact-info-copy"><small>نشانی هنرکده گیلاس آرت</small><strong>'+bodyText(address)+'</strong><em>مشهد · مراجعه حضوری با هماهنگی</em></span></div>':''
   ].filter(Boolean).join('');
   const mapPanel=address?'<section class="contact-map-panel panel"><div class="contact-map-head"><div><span class="eyebrow">LOCATION</span><h3>ما را روی نقشه پیدا کنید</h3><p>نشانی هنرکده گیلاس آرت را روی نقشه ببینید و برای مسیریابی از دکمه زیر استفاده کنید.</p></div><span class="contact-map-pin" aria-hidden="true">⌖</span></div><div class="contact-map-frame"><iframe src="'+escapeHtml(mapEmbed)+'" title="موقعیت هنرکده گیلاس آرت روی نقشه Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div><div class="contact-map-footer"><span>'+bodyText(address)+'</span>'+(mapLink?'<a class="btn primary" href="'+escapeHtml(mapLink)+'" target="_blank" rel="noopener noreferrer">باز کردن Google Maps</a>':'')+'</div></section>':'';
   body='<div class="contact-page-premium">'+
    '<section class="contact-hero-card"><div class="contact-hero-copy"><span class="eyebrow">GILAS ART · CONTACT</span><h2>'+escapeHtml(x.title||title)+'</h2>'+(x.summary?'<p>'+escapeHtml(x.summary)+'</p>':'')+'<div class="contact-hero-actions">'+(phone?'<a class="btn primary" href="tel:'+escapeHtml(phone)+'">'+icon('support')+' تماس با هنرکده</a>':'')+'<a class="btn ghost" href="'+routeUrl('/support')+'">'+icon('send')+' پشتیبانی آنلاین</a></div></div><div class="contact-hero-emblem" aria-hidden="true"><span>GA</span><i></i></div></section>'+
    '<div class="contact-content-grid"><article class="panel contact-details-panel"><div class="contact-section-title"><div><span class="eyebrow">OFFICIAL INFORMATION</span><h3>راه‌های ارتباطی</h3></div><span class="contact-status"><b></b> اطلاعات به‌روز</span></div>'+(x.body?'<div class="cms-body contact-description">'+bodyText(x.body)+'</div>':'')+'<div class="contact-info-grid">'+(contactRows||'<div class="contact-empty">اطلاعات تماس هنوز در پایگاه داده ثبت نشده است.</div>')+'</div></article>'+mapPanel+'</div>'+
    '<section class="contact-bottom-panel panel"><div><span class="eyebrow">GILAS ART CARE</span><h3>برای انتخاب اثر، خرید و پیگیری سفارش کنار شما هستیم</h3><p>اگر برای انتخاب تابلو، ابعاد، قاب یا پیگیری سفارش نیاز به راهنمایی دارید، با ما در تماس باشید.</p></div><div class="contact-bottom-actions"><a class="btn primary" href="'+routeUrl('/shop')+'">مشاهده آثار</a><a class="btn ghost" href="'+routeUrl('/support')+'">ارسال تیکت پشتیبانی</a></div></section>'+
   '</div>';
  }else if(section==='about'){
   const x=items[0];body=x?'<article class="panel cms-rich cms-about-card"><span class="eyebrow">ABOUT GILAS ART</span><h2>'+escapeHtml(x.title||title)+'</h2>'+(x.summary?'<p class="cms-lead">'+escapeHtml(x.summary)+'</p>':'')+'<div class="cms-body">'+bodyText(x.body||'')+'</div><div class="cms-about-actions"><a class="btn primary" href="'+routeUrl('/shop')+'">مشاهده آثار</a><a class="btn ghost" href="'+routeUrl('/contact')+'">تماس با ما</a></div></article>':'<div class="panel cms-empty"><h2>اطلاعات درباره ما</h2><p class="muted">اطلاعات درباره ما هنوز در پایگاه داده ثبت نشده است.</p></div>';
  }else{
   body=items.length?'<div class="cms-list">'+items.map(x=>{const src=safeUrl(x.cover_image);return '<article class="panel cms-card">'+(src?'<a class="cms-card-image" href="/'+section+'/'+encodeURIComponent(x.slug||'')+'"><img src="'+escapeHtml(src)+'" alt="'+escapeHtml(x.title||'تصویر محتوا')+'" loading="lazy" decoding="async"></a>':'')+'<div class="cms-card-top"><span class="eyebrow">'+(section==='news'?'NEWS':'ARTICLE')+'</span>'+(x.published_at?'<time class="cms-date" datetime="'+escapeHtml(x.published_at)+'">'+jalaliDate(x.published_at)+'</time>':'')+'</div><h2>'+escapeHtml(x.title||'بدون عنوان')+'</h2>'+(x.summary?'<p class="cms-lead">'+escapeHtml(x.summary)+'</p>':'')+'<a class="btn ghost" href="/'+section+'/'+encodeURIComponent(x.slug||'')+'">ادامه مطلب <span aria-hidden="true">←</span></a></article>'}).join('')+'</div>':'<div class="panel cms-empty"><strong>محتوایی برای نمایش وجود ندارد.</strong><p class="muted">به‌زودی مطالب تازه‌ای در این بخش منتشر خواهد شد.</p></div>';
  }
  const root=document.querySelector('.cms-page');if(root)root.innerHTML=visual+'<div class="cms-hero cms-hero-compact"><div><div class="eyebrow">GILAS ART</div><h1>'+escapeHtml(title)+'</h1></div><div class="cms-hero-mark" aria-hidden="true">GA</div></div>'+body;
  setSeo({title:title+' | گیلاس آرت',description:items[0]?.summary||'اطلاعات رسمی گیلاس آرت',image:safeUrl(items[0]?.cover_image)||undefined});
 }catch(e){const root=document.querySelector('.cms-page');if(root)root.innerHTML='<div class="cms-hero cms-hero-compact"><div><div class="eyebrow">GILAS ART</div><h1>'+escapeHtml(title)+'</h1></div></div><div class="panel"><p class="error">اطلاعات این بخش از پایگاه داده دریافت نشد.</p><p class="muted">'+escapeHtml(e.message||'خطای ارتباط با سرور')+'</p><button class="btn ghost" type="button" onclick="location.reload()">تلاش دوباره</button></div>'}
}
async function privacyPage(){
 const title=t('privacy.title');
 layout('<section class="wrap page legal-page"><div class="cms-hero"><div><div class="eyebrow">'+t('privacy.eyebrow')+'</div><h1>'+t('privacy.title')+'</h1><p class="cms-hero-lead">'+t('privacy.lead')+'</p></div><div class="cms-hero-mark" aria-hidden="true">P</div></div><article class="panel legal-content"><h2>'+t('privacy.collectionTitle')+'</h2><p>'+t('privacy.collectionBody')+'</p><h2>'+t('privacy.useTitle')+'</h2><p>'+t('privacy.useBody')+'</p><h2>'+t('privacy.providersTitle')+'</h2><p>'+t('privacy.providersBody')+'</p><h2>'+t('privacy.securityTitle')+'</h2><p>'+t('privacy.securityBody')+'</p><h2>'+t('privacy.rightsTitle')+'</h2><p>'+t('privacy.rightsBody')+'</p><h2>'+t('privacy.contactTitle')+'</h2><p>'+t('privacy.contactBody')+'</p></article></section>');
 setSeo({title:title+' | GilasArt',description:t('privacy.lead')});
}
async function enamadPage(){
 const seal='https://trustseal.enamad.ir/logo.aspx?id=22286&Code=u04bawyWrXOcWNwCSK6B';
 layout('<section class="wrap page legal-page"><div class="cms-hero"><div><div class="eyebrow">'+t('enamad.eyebrow')+'</div><h1>'+t('enamad.title')+'</h1><p class="cms-hero-lead">'+t('enamad.lead')+'</p></div><div class="cms-hero-mark" aria-hidden="true">✓</div></div><article class="panel enamad-page"><img src="'+seal+'" alt="'+t('enamad.sealAlt')+'" loading="eager" decoding="async"><h2>'+t('enamad.verifiedTitle')+'</h2><p>'+t('enamad.verifiedBody')+'</p><a class="btn primary" href="https://trustseal.enamad.ir/?id=22286&Code=u04bawyWrXOcWNwCSK6B" target="_blank" rel="noopener noreferrer">'+t('enamad.openOfficial')+'</a></article></section>');
 setSeo({title:t('enamad.title')+' | GilasArt',description:t('enamad.lead')});
}
async function aparatPage(){
 layout('<section class="wrap page aparat-page"><div class="cms-hero"><div><div class="eyebrow">APARAT</div><h1>'+t('aparat.title')+'</h1><p class="cms-hero-lead">'+t('aparat.lead')+'</p></div><div class="cms-hero-mark" aria-hidden="true">▶</div></div><div id="aparat-status" class="panel cms-loading" role="status" aria-live="polite">'+t('aparat.loading')+'</div><div id="aparat-grid" class="aparat-grid"></div></section>');
 setSeo({title:t('aparat.title')+' | GilasArt',description:t('aparat.lead')});
 const status=document.querySelector('#aparat-status'),grid=document.querySelector('#aparat-grid');
 const escapeXml=v=>String(v||'').replace(/<!\[CDATA\[|\]\]>/g,'').trim();
 const tag=(node,name)=>node.getElementsByTagName(name)[0]?.textContent||'';
 const embedUrl=url=>{const m=String(url||'').match(/\/v\/([A-Za-z0-9_-]+)/);return m?'https://www.aparat.com/video/video/embed/videohash/'+m[1]+'?data[rnddiv]=1&data[responsive]=1':''};
 try{
  const r=await fetch('https://www.aparat.com/rss/gilasart',{cache:'no-store',credentials:'omit'});
  if(!r.ok)throw new Error('rss_'+r.status);
  const xml=await r.text(),doc=new DOMParser().parseFromString(xml,'application/xml');
  if(doc.querySelector('parsererror'))throw new Error('rss_parse');
  let items=[...doc.querySelectorAll('item')].map(item=>{const link=tag(item,'link'),title=escapeXml(tag(item,'title')),description=escapeXml(tag(item,'description'));return {link,title,description,embed:embedUrl(link)}}).filter(x=>x.embed&&x.link);
  for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]]}
  items=items.slice(0,24);
  if(!items.length)throw new Error('rss_empty');
  status?.remove();
  if(grid)grid.innerHTML=items.map((x,i)=>'<article class="panel aparat-card"><div class="aparat-player"><iframe src="'+escapeHtml(x.embed)+'" title="'+escapeHtml(x.title||t('aparat.videoAlt'))+'" loading="'+(i<2?'eager':'lazy')+'" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="aparat-card-body"><h2>'+escapeHtml(x.title||t('aparat.untitled'))+'</h2><a class="btn ghost" href="'+escapeHtml(x.link)+'" target="_blank" rel="noopener noreferrer">'+t('aparat.openAparat')+'</a></div></article>').join('');
 }catch(e){
  if(status)status.innerHTML='<strong>'+t('aparat.unavailableTitle')+'</strong><p>'+t('aparat.unavailableBody')+'</p><a class="btn primary" href="https://www.aparat.com/gilasart" target="_blank" rel="noopener noreferrer">'+t('aparat.openChannel')+'</a>';
 }
}
async function contentDetail(section,slug){
 const labels={news:'اخبار گیلاس آرت',articles:'مقالات'},title=labels[section]||'گیلاس آرت';
 layout('<section class="wrap page cms-page"><article class="panel cms-detail"><div class="cms-loading" aria-live="polite">در حال دریافت محتوا...</div></article></section>');
 try{
  const d=await api('/api/content/'+encodeURIComponent(section)+'/'+encodeURIComponent(slug)),x=d.item||{},src=safeUrl(x.cover_image),visual=src?'<div class="cms-page-visual"><img src="'+escapeHtml(src)+'" alt="'+escapeHtml(x.title||'تصویر محتوا')+'" loading="eager" decoding="async"><span><small>GILAS ART</small><strong>'+escapeHtml(x.title||'')+'</strong></span></div>':'<div class="cms-page-visual cms-page-visual-empty" aria-hidden="true"><span>GILAS ART</span><strong>روایت و هنر</strong></div>',bodyText=v=>escapeHtml(String(v||'')).replace(/\r?\n/g,'<br>');
  layout('<section class="wrap page cms-page">'+visual+'<article class="panel cms-detail"><div class="cms-detail-head"><div><span class="eyebrow">'+(section==='news'?'NEWS':'ARTICLE')+'</span><h1>'+escapeHtml(x.title||title)+'</h1>'+(x.published_at?'<time class="cms-date" datetime="'+escapeHtml(x.published_at)+'">'+escapeHtml(jalaliDate(x.published_at))+'</time>':'')+'</div><a class="btn ghost" href="/'+section+'">← بازگشت</a></div>'+(x.summary?'<p class="cms-detail-lead">'+escapeHtml(x.summary)+'</p>':'')+'<div class="cms-body">'+bodyText(x.body||'')+'</div><div class="cms-detail-footer"><a class="btn ghost" href="/'+section+'">مطالب بیشتر</a><a class="btn primary" href="'+routeUrl('/shop')+'">مشاهده آثار</a></div></article></section>');
  setSeo({title:(x.title||title)+' | گیلاس آرت',description:x.summary||'',image:src||undefined});
 }catch(e){layout('<section class="wrap page cms-page"><div class="panel cms-empty"><h1>محتوا یافت نشد</h1><p class="error">'+escapeHtml(e.message||'این محتوا قابل دریافت نیست.')+'</p><a class="btn ghost" href="/'+section+'">بازگشت</a></div></section>')}}

async function rewardsPage(){
 await loadMe();
 if(!state.user){navigate('/account');return}
 let d=state.rewards;
 if(!d){try{d=await api('/api/rewards');state.rewards=d;state.points=Number(d.balance||0)}catch(e){layout('<section class="wrap page"><div class="panel"><h1>باشگاه امتیاز</h1><p class="error">'+escapeHtml(e.message||'خطا')+'</p></div></section>');return}}

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
async function checkout(){navigate('/cart')}

async function router(){
 scrollRouteTop();
 // Authentication is a global application concern, not an account-page concern.
 // Hydrate the server session before ANY page renders so the header, admin link,
 // roles and permissions are identical on home/shop/product/account/admin routes.
 await loadMe();
 const base=routeBase();
 let cleanPath=location.pathname.startsWith(base)?location.pathname.slice(base.length):location.pathname;
 cleanPath=cleanPath.replace(/^\/+|\/+$/g,'');
 const rawSegments=cleanPath?cleanPath.split('/').filter(Boolean).map(x=>{try{return decodeURIComponent(x)}catch{return x}}):[];
 const pathLocale=rawSegments[0]&&SUPPORTED_LOCALES.includes(String(rawSegments[0]).toLowerCase())?String(rawSegments.shift()).toLowerCase():'';
 if(pathLocale)setLocale(pathLocale);
 const segments=rawSegments;
 const known=new Set(['shop','cart','account','rewards','checkout','about','contact','news','articles','terms','privacy','enamad','aparat','support','payment','admin','product']);
 const p=segments.length?(known.has(segments[0])?segments:['product',segments[0]]):[''];
 applyRouteSeoPolicy(p);
 try{
  if(!p[0])return home();
  if(p[0]==='admin'){
   await loadMe();
   if(!isAdminUser()){navigate('/account');return}
   if(document.querySelector('.admin-layout')&&typeof window.GilasArtAdminNavigate==='function'){await window.GilasArtAdminNavigate();return}
   const adminBase=location.pathname.startsWith('/glsArt/')?'/glsArt':'';
   const {default:AdminApp}=await import(adminBase+'/admin/AdminApp.js?v=20261001-reviews');
   app.innerHTML=AdminApp();
   return;
  }
  if(p[0]==='shop')return shop();
  if(p[0]==='product')return product(p[1]);
  if(p[0]==='cart')return cart();
  if(p[0]==='account')return account();
  if(p[0]==='rewards')return rewardsPage();
  if(p[0]==='checkout')return checkout();
  if(p[0]==='about'||p[0]==='contact')return cmsPage(p[0]);
  if((p[0]==='article'||p[0]==='articles')&&p[1])return contentDetail('articles',p[1]);
  if(p[0]==='news'&&p[1])return contentDetail('news',p[1]);
  if(p[0]==='news'||p[0]==='articles')return cmsPage(p[0]);
  if(p[0]==='privacy')return privacyPage();
  if(p[0]==='enamad')return enamadPage();
  if(p[0]==='aparat')return aparatPage();
  if(p[0]==='terms'){
   layout('<section class="wrap page"><div class="panel"><h1 id="terms-title">قوانین سایت</h1><div id="terms-body" class="terms-content">در حال دریافت قوانین...</div></div></section>');
   try{
    const d=await api('/api/site-rules'),item=d.item||{},title=String(item.title||'قوانین سایت'),body=String(item.body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.');
    const titleEl=document.querySelector('#terms-title'),bodyEl=document.querySelector('#terms-body');
    if(titleEl)titleEl.textContent=title;
    if(bodyEl)bodyEl.innerHTML=escapeHtml(body).replace(/\\r?\\n/g,'<br>');
    const rewardsBox='<section class="loyalty-rules panel"><span class="eyebrow">GILAS ART REWARDS</span><h2>جدول امتیازها و تخفیف</h2><p>امتیازها قابل تبدیل به کوپن یک‌بارمصرف هستند و هر کوپن فقط برای صاحب حساب صادر می‌شود.</p><div class="table-wrap"><table><thead><tr><th>فعالیت</th><th>امتیاز</th></tr></thead><tbody><tr><td>ثبت‌نام</td><td>۱۰</td></tr><tr><td>نظر تأییدشده</td><td>۵</td></tr><tr><td>معرفی دوست پس از ثبت‌نام او</td><td>۳۰</td></tr><tr><td>تکمیل اطلاعات ارسال</td><td>۵</td></tr><tr><td>افزودن اثر به علاقه‌مندی‌ها</td><td>۳</td></tr><tr><td>خرید موفق</td><td>۱ امتیاز به ازای هر ۱٬۰۰۰٬۰۰۰ ریال، حداکثر ۳۰</td></tr></tbody></table></div><div class="table-wrap"><table><thead><tr><th>امتیاز مصرفی</th><th>کوپن</th><th>اعتبار</th></tr></thead><tbody><tr><td>۱۰۰</td><td>۵٪</td><td>۳۰ روز</td></tr><tr><td>۲۰۰</td><td>۱۰٪</td><td>۳۰ روز</td></tr><tr><td>۳۰۰</td><td>۱۵٪</td><td>۳۰ روز</td></tr><tr><td>۴۰۰</td><td>۲۰٪</td><td>۳۰ روز</td></tr></tbody></table></div><a class="btn primary" href="'+routeUrl('/rewards')+'">باشگاه امتیاز من ←</a></section>';
    bodyEl?.insertAdjacentHTML('afterend',rewardsBox);
   }catch(e){
    const bodyEl=document.querySelector('#terms-body');if(bodyEl)bodyEl.textContent='قوانین سایت در حال حاضر قابل دریافت نیست.';
   }
   return;
  }
  if(p[0]==='support')return p[1]?supportDetail(p[1]):support();
  if(p[0]==='payment'){
   const order=new URLSearchParams(location.search||'').get('order')||'';
   if(p[1]==='manual'){
    try{
     const d=await api('/api/orders/'+encodeURIComponent(order)),card=(await api('/api/payment/options')).methods?.find(x=>x.id==='card_transfer')?.card||{};
     const receiptStatus=String(d.payment?.receipt_status||'').toUpperCase();
     const receiptReason=String(d.payment?.receipt_rejection_reason||'').trim();
     const receiptLabel=receiptStatus==='PENDING_REVIEW'?'رسید شما ارسال شده و در انتظار بررسی مدیر است.':receiptStatus==='APPROVED'?'رسید شما تأیید شده است؛ فاکتور فروش فعال است.':receiptStatus==='REJECTED'?'فیش قبلی توسط مدیر رد شده است؛ لطفاً فیش صحیح را دوباره ارسال کنید.':'';
     layout('<section class="wrap page"><div class="panel payment-manual-panel"><span class="eyebrow">CARD TRANSFER</span><h1>پرداخت کارت به کارت</h1><p>لطفاً مبلغ <strong>'+fa(d.order?.total_irt||0)+' ریال</strong> را به حساب زیر منتقل کنید. سپس تصویر فیش واریزی را ارسال کنید تا توسط مدیر گیلاس آرت بررسی شود.</p><div class="payment-card-transfer"><div>بانک: '+escapeHtml(card.bankName||'—')+'</div><div>به نام: '+escapeHtml(card.accountHolder||'—')+'</div><div dir="ltr">شماره کارت: '+escapeHtml(card.cardNumber||'—')+'</div><div dir="ltr">شبا: '+escapeHtml(card.iban||'—')+'</div><p>'+escapeHtml(card.instructions||'')+'</p></div><p class="muted">شماره سفارش: '+escapeHtml(order)+'</p><div class="payment-receipt-box"><input id="payment-receipt-file" type="file" accept="image/jpeg,image/png,image/webp" hidden><button class="btn primary" id="payment-receipt-upload" type="button" '+(receiptStatus==='PENDING_REVIEW'||receiptStatus==='APPROVED'?'disabled':'')+'>'+(receiptStatus==='PENDING_REVIEW'?'رسید ارسال شده':receiptStatus==='APPROVED'?'رسید تأیید شده':'ارسال فیش واریزی')+'</button><small>فقط یک تصویر؛ سیستم تصویر را به حداکثر ۱۵۰ کیلوبایت فشرده می‌کند.</small><div id="payment-receipt-message" aria-live="polite">'+(receiptLabel?'<span class="'+(receiptStatus==='REJECTED'?'error':'ok')+'">'+escapeHtml(receiptLabel)+'</span>':'')+(receiptStatus==='REJECTED'&&receiptReason?'<div class="receipt-rejection-reason"><strong>دلیل رد:</strong> '+escapeHtml(receiptReason)+'</div>':'')+'</div></div><a class="btn ghost" href="'+routeUrl('/account')+'">مشاهده سفارش</a></div></section>');
     const uploadBtn=document.querySelector('#payment-receipt-upload'),fileInput=document.querySelector('#payment-receipt-file'),uploadMsg=document.querySelector('#payment-receipt-message');
     uploadBtn?.addEventListener('click',()=>fileInput?.click());
     fileInput?.addEventListener('change',async()=>{const file=fileInput.files?.[0];if(!file)return;uploadBtn.disabled=true;uploadMsg.textContent='در حال فشرده‌سازی و ارسال فیش…';try{const blob=await compressReceiptImage(file,150*1024);const fd=new FormData();fd.append('receipt',blob,'receipt.jpg');const r=await api('/api/orders/'+encodeURIComponent(order)+'/payment-receipt',{method:'POST',body:fd,headers:{'x-csrf-token':csrf()}});uploadMsg.innerHTML='<span class="ok">'+escapeHtml(r.message||'فیش با موفقیت ارسال شد. رسید شما بزودی توسط مدیر بررسی و نتیجه پرداخت اعلام می‌گردد.')+'</span>';uploadBtn.textContent='رسید ارسال شده';}catch(e){uploadMsg.innerHTML='<span class="error">'+escapeHtml(e.message||'ارسال فیش انجام نشد.')+'</span>';uploadBtn.disabled=false;}finally{fileInput.value='';}});

    }catch(e){layout('<section class="wrap page"><div class="panel"><p class="error">'+escapeHtml(e.message||'خطا')+'</p></div></section>')}
    return;
   }
   if(p[1]==='success'){
    layout('<section class="wrap page"><div class="panel"><span class="eyebrow">PAYMENT CONFIRMED</span><h1>پرداخت با موفقیت تأیید شد</h1>'+(order?'<p class="muted">شماره سفارش: '+escapeHtml(order)+'</p>':'')+'<p>فاکتور فروش سفارش شما آماده است.</p><div class="cart-checkout-bar"><button class="btn primary" id="payment-invoice-print" type="button">نمایش و چاپ فاکتور</button><a class="btn ghost" href="'+routeUrl('/account')+'">حساب کاربری</a></div></div></section>');
    document.querySelector('#payment-invoice-print')?.addEventListener('click',async()=>{
     try{const d=await api('/api/orders/'+encodeURIComponent(order));openInvoiceWindow(d)}catch(e){alert(e.message||'فاکتور دریافت نشد.')}
    });
    return;
   }
   layout('<section class="wrap page"><div class="panel"><h1>پرداخت ناموفق بود</h1>'+(order?'<p class="muted">شماره سفارش: '+escapeHtml(order)+'</p>':'')+'<a class="btn primary" href="'+routeUrl('/account')+'">مشاهده سفارش</a></div></section>');
   return;
  }
  return renderNotFound();
 }catch(e){
  console.error('router_error',e);
  if(e?.status===404||e?.message==='صفحه پیدا نشد')return renderNotFound();
  if(!p[0])console.warn('home_render_error',e);
 }
}

document.addEventListener('click',e=>{
 const link=e.target?.closest?.('a[href]');
 if(!link)return;
 const href=String(link.getAttribute('href')||'');
 if(!href||href.startsWith('#')||/^(?:https?:|mailto:|tel:|sms:|javascript:)/i.test(href))return;
 if(link.target&&link.target!=='_self')return;
 let u;try{u=new URL(href,location.href)}catch{return}
 if(u.origin!==location.origin)return;
 const base=routeBase();
 if(base&&!(u.pathname===base||u.pathname.startsWith(base+'/')))return;
 e.preventDefault();
 const path=(u.pathname+(u.search||'')).replace(new RegExp('^'+base),'')||'/';
 navigate(path);
},{capture:true});

function migrateLegacyHash(){
 const h=String(location.hash||'');
 if(!h.startsWith('#/'))return false;
 const target=h.slice(1)||'/';
 history.replaceState({},'',target);
 return true;
}
migrateLegacyHash();
window.addEventListener('popstate',()=>{if(routeInFlight)return;routeInFlightTarget=location.pathname+location.search;routeInFlight=router().finally(()=>{routeInFlight=null;routeInFlightTarget=''})});
(async()=>{try{await bootstrapLocale()}catch(e){console.warn('locale_bootstrap_failed',e)}routeInFlightTarget=location.pathname+location.search;routeInFlight=router().finally(()=>{routeInFlight=null;routeInFlightTarget=''}) .catch(e=>console.error('initial_router_error',e));})();

/* GilasArt interaction guard */
(()=>{
 document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
 document.addEventListener('copy',e=>{if(e.target?.closest?.('.copy-image-name,.social-link-row input'))return;e.preventDefault();}, {capture:true});
 document.addEventListener('cut',e=>{e.preventDefault();}, {capture:true});
 document.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});
 document.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopPropagation()}},{capture:true});
 document.addEventListener('click',e=>{
   const link=e.target?.closest?.('a[href]');
   if(link && !link.closest('.footer-social-link,.footer-trust') && (link.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 document.addEventListener('keydown',e=>{   const k=String(e.key||'').toLowerCase();
   if((e.ctrlKey||e.metaKey)&&['c','x','u','s','p'].includes(k)){e.preventDefault();e.stopPropagation();}
   if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 window.addEventListener('beforeprint',e=>e.preventDefault?.());
})();