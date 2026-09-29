const API=window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev';
const app=document.querySelector('#app');
if(app&&!app.innerHTML.trim())app.innerHTML='<main class="wrap page"><div class="panel" style="text-align:center;padding:48px">در حال بارگذاری فروشگاه گیلاس آرت…</div></main>';
const visitorSessionKey=(()=>{try{let k=localStorage.getItem('GilasArtVisitorSession');if(!k){const a=new Uint8Array(24);crypto.getRandomValues(a);k=Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');localStorage.setItem('GilasArtVisitorSession',k)}return k}catch{return ''}})();
async function visitorHeartbeat(){if(!visitorSessionKey)return;try{await fetch(API+'/api/visitors/heartbeat',{method:'POST',credentials:'include',cache:'no-store',headers:{'content-type':'application/json'},body:JSON.stringify({sessionKey:visitorSessionKey})})}catch{}}
visitorHeartbeat();setInterval(visitorHeartbeat,60000);

let csrfToken='';
let state={products:[],categories:[],user:null,roles:[],permissions:[],cart:null};
const icon=n=>({cart:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.4L21 7H7"/><circle cx="10" cy="20" r="1.2"/><circle cx="18" cy="20" r="1.2"/> </svg>',user:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.2"/><path d="M5 21a7 7 0 0 1 14 0"/></svg>',search:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>',send:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 4 18 8-18 8 3-8-3-8Z"/><path d="M6 12h9"/></svg>',check:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>',support:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5.5 5V15A2.5 2.5 0 0 1 3 12.5v-7Z"/><path d="M7 8h10M7 11h6"/></svg>',plus:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',close:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',clock:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></svg>'}[n]||'');
const fa=n=>new Intl.NumberFormat('fa-IR').format(Number(n||0));
const escapeHtml=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
const safeUrl=v=>{try{const u=new URL(String(v||''),location.href);return ['http:','https:'].includes(u.protocol)?u.href:''}catch{return ''}};
const THEME_KEY='gilasart-theme';
function applyTheme(theme){const t=theme==='light'?'light':'dark';document.documentElement.dataset.theme=t;try{localStorage.setItem(THEME_KEY,t)}catch{}}
function initTheme(){let t='';try{t=localStorage.getItem(THEME_KEY)||''}catch{}applyTheme(t||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'))}
window.GilasArtTheme={toggle(){applyTheme(document.documentElement.dataset.theme==='light'?'dark':'light')},set:applyTheme};
initTheme();
let progressRequests=0,progressTimer=null;
function progressStart(){let bar=document.querySelector('#global-progress');if(!bar){bar=document.createElement('div');bar.id='global-progress';bar.innerHTML='<span></span><b>0%</b>';document.body.prepend(bar)}progressRequests++;bar.hidden=false;bar.querySelector('span').style.width='8%';bar.querySelector('b').textContent='0%';let value=8;clearInterval(progressTimer);progressTimer=setInterval(()=>{value=Math.min(92,value+Math.max(1,(92-value)/6));bar.querySelector('span').style.width=value+'%';bar.querySelector('b').textContent=Math.floor(value)+'%'},120)}
function progressEnd(){progressRequests=Math.max(0,progressRequests-1);if(progressRequests)return;clearInterval(progressTimer);const bar=document.querySelector('#global-progress');if(!bar)return;bar.querySelector('span').style.width='100%';bar.querySelector('b').textContent='100%';setTimeout(()=>{if(progressRequests===0)bar.hidden=true},220)}
window.GilasArtProgress={start:progressStart,end:progressEnd};
async function api(path,opt={}){progressStart();const headers={...(opt.headers||{})};if(opt.body)headers['content-type']='application/json';try{const r=await fetch(API+path,{credentials:'include',cache:'no-store',headers,...opt});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'خطا');return d}finally{progressEnd()}}
function csrf(){return csrfToken||''}
function setSeo({title,description,image,type='website',jsonLd}={}){if(title){document.title=title;let t=document.querySelector('meta[name="description"]');if(!t){t=document.createElement('meta');t.name='description';document.head.appendChild(t)}t.content=description||'';const og=document.querySelector('meta[property="og:title"]');if(og)og.content=title;const od=document.querySelector('meta[property="og:description"]');if(od)od.content=description||'';if(image){let oi=document.querySelector('meta[property="og:image"]');if(!oi){oi=document.createElement('meta');oi.setAttribute('property','og:image');document.head.appendChild(oi)}oi.content=image}}document.querySelectorAll('script[data-gilasart-jsonld]').forEach(x=>x.remove());if(jsonLd){const s=document.createElement('script');s.type='application/ld+json';s.dataset.gilasartJsonld='1';s.textContent=JSON.stringify(jsonLd).replace(/</g,'\\u003c');document.head.appendChild(s)}}
function isAdminUser(){return state.roles?.includes("admin")||state.roles?.includes("super_admin")||state.roles?.includes("administrator")||state.roles?.includes("admin-role")}
function accountLink(){return state.user?`<a class="iconbtn profile-link" href="#/account" title="پروفایل کاربر">${icon('user')}<span>پروفایل</span></a>`:`<a class="iconbtn" href="#/account">${icon('user')}<span>ورود</span></a>`}
function layout(content){app.innerHTML=`<header class="top"><div class="wrap nav"><a class="brand" href="#/">گیلاس آرت<small>GILAS ART</small></a><nav class="links" aria-label="منوی اصلی"><a href="#/">خانه</a><a href="#/shop">فروشگاه</a><a href="#/about">درباره ما</a><a href="#/contact">تماس با ما</a><a href="#/news">اخبار</a><a href="#/articles">مقالات</a>${isAdminUser()?'<a class="admin-link" href="#/admin">کنترل پنل</a>':''}</nav><div class="spacer"></div><button class="theme-toggle" type="button" aria-label="تغییر حالت نمایش" title="روز / شب" onclick="window.GilasArtTheme&&window.GilasArtTheme.toggle()">◐ <span>روز/شب</span></button><a class="iconbtn cart-link" href="#/cart">${icon('cart')}<span>سبد خرید</span></a>${accountLink()}</div></header><main>${content}</main><footer class="footer"><div class="wrap footer-grid"><div><strong>گیلاس آرت</strong><p>هنر، انتخابی برای ماندن.</p></div><div><strong>خدمات</strong><a href="#/terms">قوانین سایت</a><a href="#/support">تیکت پشتیبانی</a><a href="#/contact">تماس با ما</a></div><div><strong>اعتماد</strong><div class="trust-badges"><span>نماد اعتماد</span><span>درگاه امن</span><span>پرداخت معتبر</span></div></div></div></footer>`}
function productCard(p){const image=safeUrl(p.image),flash=Number(p.flash_sale_active||p.flashSaleActive)===1&&p.flash_sale_ends_at;const shown=flash&&p.flash_sale_price_irt!==null&&p.flash_sale_price_irt!==undefined?Number(p.flash_sale_price_irt):Number(p.price_irt||0);return `<article class="card product-card">
<a href="#/product/${encodeURIComponent(p.slug||'')}"><div class="thumb">${image?`<img src="${escapeHtml(image)}" alt="${escapeHtml(p.name)}" loading="lazy">`:'اثر هنری'}${flash?`<span class="flash-badge">${icon('clock')} پیشنهاد شگفت‌انگیز</span>`:''}</div><div class="cardbody"><h3>${escapeHtml(p.name)}</h3><div class="muted">${escapeHtml(p.sku||'')}</div>${flash?`<div class="flash-timer" data-flash-end="${escapeHtml(p.flash_sale_ends_at)}" aria-label="زمان باقی‌مانده"></div>`:''}<div class="price">${fa(shown)} ریال</div>${flash&&p.flash_sale_price_irt!==null&&p.flash_sale_price_irt!==undefined?`<div class="muted flash-old">${fa(p.price_irt)} ریال</div>`:''}</div></a></article>`}
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
async function home(){const [d,s,fs]=await Promise.allSettled([api('/api/products?limit=8'),api('/api/settings'),api('/api/flash-sales')]);const products=d.status==='fulfilled'?d.value:{items:[]},settings=s.status==='fulfilled'?s.value:{settings:{}},flashData=fs.status==='fulfilled'?fs.value:{items:[]};state.products=products.items||[];const ss=settings.settings||{},flash=flashData.items||[];setSeo({title:ss.seo_title||'گیلاس آرت | خرید تابلو و آثار هنری',description:ss.seo_description||ss.site_description});const flashSection=flash.length?`<section class="wrap flash-section"><div class="flash-head"><div><span class="eyebrow">LIMITED TIME</span><h2>پیشنهاد شگفت‌انگیز</h2><p>فرصت محدود برای انتخاب آثار منتخب</p></div><div class="flash-controls"><button class="icon-circle" id="flash-prev" aria-label="قبلی">‹</button><button class="icon-circle" id="flash-next" aria-label="بعدی">›</button></div></div><div id="flash-track" class="flash-track">${flash.map(productCard).join('')}</div></section>`:'';
layout(`<section class="wrap hero"><div class="hero-copy"><div class="eyebrow">هنر، با انتخابی شخصی</div><h1>آثاری برای خانه‌هایی که داستان دارند.</h1><p>گیلاس آرت یک فروشگاه فارسی برای کشف و خرید آثار هنری است؛ از انتخاب تا پرداخت، ساده و مطمئن.</p><div class="toolbar"><a class="btn primary" href="#/shop">مشاهده آثار</a><a class="btn ghost" href="#/about">درباره گیلاس آرت</a></div></div><div class="hero-sky" aria-label="قاب هنری شناور در آسمان"><canvas id="sky-canvas"></canvas><div class="sky-caption"><span class="pill">GILAS ART</span><strong>هنر در حرکت</strong><small>یک قاب، یک آسمان، یک لحظه.</small></div></div></section>${flashSection}<section class="wrap section"><div class="sectionhead"><h2>آخرین آثار</h2><a class="muted" href="#/shop">همه آثار ←</a></div><div class="grid">${state.products.slice(0,8).map(productCard).join('')||'<div class="panel">هنوز محصول فعالی منتشر نشده است.</div>'}</div></section>`);startSkyAnimation();startFlashTimers();const track=document.querySelector('#flash-track');if(track){const step=()=>{const first=track.querySelector('.card');return first?first.getBoundingClientRect().width+18:280};document.querySelector('#flash-prev').onclick=()=>track.scrollBy({left:-step(),behavior:'smooth'});document.querySelector('#flash-next').onclick=()=>track.scrollBy({left:step(),behavior:'smooth'});let timer=setInterval(()=>{if(!document.body.contains(track)){clearInterval(timer);return}const max=track.scrollWidth-track.clientWidth;if(track.scrollLeft>=max-10)track.scrollTo({left:0,behavior:'smooth'});else track.scrollBy({left:step(),behavior:'smooth'})},5000)}}
async function shop(){
 const pageSize=3;let offset=0,loading=false,done=false,query='',category='';let sentinel;
 const loadMore=async(reset=false)=>{
  if(loading||done)return;loading=true;
  if(reset){offset=0;done=false;document.querySelector('#results').innerHTML=''}
  try{
   const qs=new URLSearchParams({limit:String(pageSize),offset:String(offset)});
   if(query)qs.set('q',query);if(category)qs.set('category',category);
   const d=await api('/api/products?'+qs.toString());const items=d.items||[];
   document.querySelector('#empty')?.remove();
   document.querySelector('#results').insertAdjacentHTML('beforeend',items.map(productCard).join(''));
   offset+=items.length;if(items.length<pageSize)done=true;
   document.querySelector('#load-status').textContent=done?'همه آثار نمایش داده شد.':'با اسکرول پایین، آثار بیشتری نمایش داده می‌شود.';startFlashTimers(document.querySelector('#results'));
  }catch(e){document.querySelector('#load-status').textContent=e.message||'خطا در دریافت آثار.'}
  finally{loading=false}
 };
 const [cats]=await Promise.all([api('/api/categories')]);state.categories=cats.items||[];
 layout(`<section class="shop-hero"><div class="wrap shop-hero-inner"><div class="eyebrow">GILAS ART • COPPER INLAY</div><h1>هنرکده گیلاس آرت</h1><p>تولید کننده ی برتر تابلو های معرق مس در ایران</p><div class="hero-actions"><a class="btn primary" href="#/shop">مشاهده آثار</a><a class="btn ghost" href="#/about">درباره هنرکده</a></div></div><div class="shop-orbit" aria-hidden="true"><span></span><span></span><span></span></div></section>
 <section class="wrap page shop-page"><div class="sectionhead"><div><div class="eyebrow">GALLERY COLLECTION</div><h2>مجموعه تابلوها</h2><p class="muted">آثار به‌صورت زنده و تدریجی بارگذاری می‌شوند.</p></div></div>
 <div class="toolbar"><input id="q" class="search" placeholder="جستجوی اثر، نام یا کد محصول"><button class="btn primary" id="search">جستجو</button><button class="btn ghost cat active" data-id="">همه</button>${state.categories.map(c=>`<button class="btn ghost cat" data-id="${escapeHtml(c.id)}">${escapeHtml(c.name)}</button>`).join('')}</div>
 <div id="results" class="grid product-stream"></div><div id="sentinel" class="infinite-sentinel" aria-hidden="true"></div><div id="load-status" class="load-status">در حال آماده‌سازی گالری…</div><div id="empty" class="panel empty-state" hidden>نتیجه‌ای پیدا نشد.</div></section>`);
 sentinel=document.querySelector('#sentinel');
 const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))loadMore()}, {rootMargin:'500px 0px'});
 observer.observe(sentinel);
 const runSearch=()=>{query=document.querySelector('#q').value.trim();loadMore(true)};
 document.querySelector('#search').onclick=runSearch;
 document.querySelector('#q').addEventListener('keydown',e=>{if(e.key==='Enter')runSearch()});
 document.querySelectorAll('.cat').forEach(b=>b.onclick=()=>{category=b.dataset.id||'';document.querySelectorAll('.cat').forEach(x=>x.classList.toggle('active',x===b));loadMore(true)});
 await loadMore();
}
async function product(slug){
 const d=await api('/api/products/'+encodeURIComponent(slug)),p=d.product||{},images=d.images||[],attributes=d.attributes||[];
 const image=safeUrl(p.image);
 setSeo({title:p.seo_title||p.name+' | گیلاس آرت',description:p.seo_description||p.description,image:image||undefined,jsonLd:{'@context':'https://schema.org','@type':'Product',name:p.name,description:p.description||'',sku:p.sku,image:images.map(x=>safeUrl(x.path)).filter(Boolean),offers:{'@type':'Offer',priceCurrency:'IRR',price:String(p.price_irt),availability:'https://schema.org/InStock',url:location.href}}});
 const mediaItems=images.map((x,i)=>({type:'image',src:safeUrl(x.path),alt:x.alt_text||p.name,index:i})).filter(x=>x.src);
 if(p.video_url)mediaItems.push({type:'video',src:safeUrl(p.video_url),alt:'ویدئوی محصول',index:mediaItems.length});
 const first=mediaItems[0]||null;
 const mediaHtml=item=>item?.type==='video'?'<video class="product-video-player" controls playsinline preload="metadata" src="'+escapeHtml(item.src)+'"><p>مرورگر شما از پخش ویدئو پشتیبانی نمی‌کند.</p></video>':item?.src?'<img src="'+escapeHtml(item.src)+'" alt="'+escapeHtml(item.alt||p.name)+'">':'<div class="product-media-empty">اثر هنری</div>';
 const optionHtml=attributes.map(a=>'<label class="product-option"><span>'+escapeHtml(a.name)+'</span><select data-attribute-id="'+escapeHtml(a.id)+'">'+a.options.map(o=>'<option value="'+escapeHtml(o.id)+'" data-delta="'+Number(o.price_delta_irt||0)+'" '+(o.is_default?'selected':'')+'>'+escapeHtml(o.name)+(Number(o.price_delta_irt||0)?' (+'+fa(o.price_delta_irt)+' ریال)':'')+'</option>').join('')+'</select></label>').join('');
 layout('<section class="wrap page product"><div class="product-gallery"><div id="product-media" class="product-media">'+mediaHtml(first)+'</div><div class="product-thumbs">'+mediaItems.map((x,i)=>x.type==='video'?'<button class="product-thumb video-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش ویدئوی محصول"><span>▶</span><small>ویدئو</small></button>':'<button class="product-thumb '+(i===0?'active':'')+'" data-index="'+i+'" aria-label="نمایش تصویر '+(i+1)+'"><img src="'+escapeHtml(x.src)+'" alt=""></button>').join('')+'</div></div><div class="product-info"><span class="pill">'+escapeHtml(p.category_name||'اثر هنری')+'</span><h1>'+escapeHtml(p.name)+'</h1><p class="muted">'+escapeHtml(p.description||'')+'</p>'+(optionHtml?'<div class="panel product-options-panel"><h3>انتخاب ویژگی‌ها</h3><div class="product-options">'+optionHtml+'</div></div>':'')+'<div class="price product-live-price" id="product-live-price" style="font-size:24px;margin:24px 0">'+fa(p.price_irt)+' ریال</div><div class="muted" id="product-price-breakdown"></div><div class="toolbar"><button class="btn primary" id="add">افزودن به سبد</button><button class="btn ghost" id="fav">ذخیره</button></div><div class="panel"><h3>نظر خریداران</h3>'+((d.reviews||[]).map(r=>'<p><b>'+escapeHtml(r.name||'خریدار')+'</b> — '+('★'.repeat(Math.max(0,Math.min(5,Number(r.rating)||0))))+'<br>'+escapeHtml(r.body||'')+'</p>').join('')||'<span class="muted">هنوز نظری ثبت نشده است.</span>')+'<div class="panel"><h3>ثبت نظر</h3><form id="review-form" class="form"><label>امتیاز<select name="rating"><option value="5">★★★★★</option><option value="4">★★★★</option><option value="3">★★★</option><option value="2">★★</option><option value="1">★</option></select></label><label>نظر شما<textarea name="body" maxlength="1000" required placeholder="نظر خود درباره این اثر را بنویسید"></textarea></label><button class="btn primary" type="submit">ثبت نظر</button><div id="review-msg" aria-live="polite"></div></form></div></div></div></section>');
 document.querySelectorAll('.product-thumb').forEach(b=>b.onclick=()=>{const item=mediaItems[Number(b.dataset.index)];document.querySelector('#product-media').innerHTML=mediaHtml(item);document.querySelectorAll('.product-thumb').forEach(x=>x.classList.toggle('active',x===b))});
 const selections=()=>[...document.querySelectorAll('.product-option select')].map(x=>({attributeId:x.dataset.attributeId,optionId:x.value}));
 const recalc=()=>{let delta=0;document.querySelectorAll('.product-option option:checked').forEach(o=>delta+=Number(o.dataset.delta||0));const total=Number(p.price_irt||0)+delta;document.querySelector('#product-live-price').textContent=fa(total)+' ریال';document.querySelector('#product-price-breakdown').textContent=delta?'قیمت پایه: '+fa(p.price_irt)+' ریال + افزایش ویژگی‌ها: '+fa(delta)+' ریال':'';return total};
 document.querySelectorAll('.product-option select').forEach(x=>x.addEventListener('change',recalc));recalc();
 document.querySelector('#add').onclick=async()=>{try{await ensureLogin();await api('/api/cart',{method:'POST',body:JSON.stringify({productId:p.id,quantity:1,options:selections()}),headers:{'x-csrf-token':csrf()}});alert('به سبد خرید اضافه شد')}catch(e){alert(e.message)}};
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
    try{
      await ensureLogin();
      await api('/api/products/'+encodeURIComponent(slug)+'/reviews',{method:'POST',body:JSON.stringify({rating:Number(f.get('rating')),body:f.get('body')}),headers:{'x-csrf-token':csrf()}});
      m.innerHTML='<span class="ok">نظر شما ثبت شد و پس از بررسی منتشر می‌شود.</span>';
      e.target.reset();
    }catch(err){
      m.innerHTML='<span class="error">'+escapeHtml(err.message||'ثبت نظر انجام نشد.')+'</span>';
    }
  });
}
async function ensureLogin(){if(state.user)return;await account();if(!state.user)throw new Error('ابتدا وارد حساب شوید')}
async function loadMe(){try{const d=await api('/api/me');state.user=d.user||null;state.roles=d.roles||[];state.permissions=d.permissions||[];csrfToken=d.csrfToken||csrfToken;return d}catch(e){return null}}
async function cart(){
 await loadMe();
 if(!state.user){layout('<section class="wrap page"><div class="panel"><h2>سبد خرید</h2><p>برای دیدن سبد خرید وارد حساب شوید.</p><a class="btn primary" href="#/account">ورود</a></div></section>');return}
 let d=await api('/api/cart'),couponCode='';
 const render=(p=d)=>{
  const items=p.items||[];
  const lines=items.map(x=>{
   const opts=x.selected_options?.length?'<div class="cart-options">'+x.selected_options.map(o=>escapeHtml(o.attributeName)+': '+escapeHtml(o.optionName)+(Number(o.priceDeltaIrt||0)?' (+'+fa(o.priceDeltaIrt)+' ریال)':'')).join(' · ')+'</div>':'';
   return '<div class="cartline"><div class="grow"><b>'+escapeHtml(x.name)+'</b><div class="muted">'+fa(x.unit_price_irt??x.price_irt)+' × '+fa(x.quantity)+' ریال</div>'+opts+'</div><button class="btn ghost del" data-id="'+escapeHtml(x.product_id)+'">حذف</button></div>';
  }).join('');
  const summary=items.length?'<hr><div class="sectionhead"><b>جمع کالاها</b><strong class="price">'+fa(p.subtotal_irt)+' ریال</strong></div><div class="coupon-box"><label>کد تخفیف خود را وارد کنید<input id="coupon-code" value="'+escapeHtml(couponCode)+'" placeholder="GLS________" autocomplete="off"></label><button class="btn primary" id="apply-coupon">اعمال کوپن</button><div id="coupon-message" class="muted"></div></div><div class="price-summary"><p>مبلغ اولیه: <b>'+fa(p.subtotal_irt)+' ریال</b></p><p>تخفیف: <b>'+fa(p.discount_irt)+' ریال</b></p><p>ارسال: <b>'+fa(p.shipping_irt)+' ریال</b></p><p>مبلغ قابل پرداخت: <strong class="price">'+fa(p.total_irt)+' ریال</strong></p></div><a class="btn primary" href="#/checkout">ادامه و ثبت سفارش</a>':'';
  layout('<section class="wrap page"><h1>سبد خرید</h1><div class="panel">'+(lines||'<p class="muted">سبد شما خالی است.</p>')+summary+'</div></section>');
 };
 document.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{await api('/api/cart?productId='+b.dataset.id,{method:'DELETE',headers:{'x-csrf-token':csrf()}});cart()});
 document.querySelector('#apply-coupon')?.addEventListener('click',async()=>{const code=document.querySelector('#coupon-code').value.trim();try{const priced=await api('/api/cart/price',{method:'POST',body:JSON.stringify({code}),headers:{'x-csrf-token':csrf()}});couponCode=code;render(priced);const m=document.querySelector('#coupon-message');if(m)m.textContent='کوپن اعمال شد: '+fa(priced.coupon_discount_irt)+' ریال تخفیف';}catch(e){const m=document.querySelector('#coupon-message');if(m)m.textContent=e.message==='coupon_not_found'?'کد کوپن معتبر نیست.':e.message==='coupon_expired_or_inactive'?'کد کوپن منقضی یا غیرفعال است.':e.message==='coupon_usage_limit'?'سقف استفاده از این کوپن تکمیل شده است.':e.message==='coupon_already_used'?'این کوپن قبلاً برای حساب شما استفاده شده است.':e.message==='coupon_not_applicable'?'این کوپن برای محصولات سبد شما قابل استفاده نیست.':e.message==='coupon_min_order'?'حداقل مبلغ خرید این کوپن رعایت نشده است.':'اعمال کوپن با خطا مواجه شد.'}});
 render(d);
}
const ORDER_STATUS_LABELS_PUBLIC={PENDING:'در انتظار پرداخت',PAID:'پرداخت شد',PROCESSING:'در حال پردازش',SHIPPED:'ارسال شد',DELIVERED:'تحویل شد',CANCELLED:'لغو شد',FAILED:'ناموفق'};
const orderStatusPublic=s=>ORDER_STATUS_LABELS_PUBLIC[String(s||'').toUpperCase()]||String(s||'نامشخص');
function invoiceHtmlData(d){
 const o=d.order||{},items=d.items||[],p=d.payment||{},cfg=d.invoice||{};
 const paid=['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(o.status||'').toUpperCase())||String(p.status||'').toUpperCase()==='PAID';
 const title=paid?'فاکتور فروش':'پیش فاکتور فروش';
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
async function account(){
 await loadMe();
 if(state.user){
  const invoiceModule=await import('./invoice.js?v=20260929-invoice');
  let ordersData={items:[],invoice:{}};
  try{ordersData=await api('/api/account/orders')}catch(e){ordersData={items:[],invoice:{},error:e.message||'سفارش‌ها قابل دریافت نیستند'}}
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
  layout('<section class="wrap page account-page"><div class="profile-panel panel"><div class="profile-head"><div class="profile-avatar">'+icon('user')+'</div><div><span class="eyebrow">MY ACCOUNT</span><h1>پروفایل کاربر</h1><p class="muted">مدیریت سفارش‌ها، فاکتورها و پیگیری مسیر تحویل تابلو</p></div></div><div class="profile-data"><div><span>شماره موبایل</span><strong>'+escapeHtml(state.user.mobile)+'</strong></div><div><span>نام</span><strong>'+escapeHtml(state.user.name||'کاربر گیلاس آرت')+'</strong></div></div><div class="toolbar"><a class="btn ghost" href="#/support">'+icon('support')+' تیکت پشتیبانی</a>'+ (isAdminUser()?'<a class="btn primary" href="#/admin">کنترل پنل</a>':'') +'<button class="btn ghost" id="logout">'+icon('close')+' خروج</button></div></div><section class="orders-profile-section"><div class="sectionhead"><div><span class="eyebrow">MY ORDERS</span><h2>سفارش‌های من</h2><p class="muted">از ثبت سفارش تا تحویل تابلو، همه مراحل را یکجا ببینید.</p></div><span class="orders-profile-count">'+fa(orders.length)+' سفارش</span></div><div id="account-orders">'+(orders.length?orders.map(o=>'<article class="customer-order-card" data-order-id="'+escapeHtml(o.id)+'"><div class="customer-order-head"><div><span class="customer-order-number">سفارش #'+escapeHtml(String(o.id).slice(-8))+'</span><h3>'+escapeHtml(o.recipient_name||o.name||'سفارش گیلاس آرت')+'</h3><small>'+date(o.created_at)+'</small></div><div class="customer-order-actions"><span class="order-status-badge status-'+escapeHtml(String(o.status||'').toLowerCase())+'">'+escapeHtml(statusLabels[o.status]||o.status)+'</span><button class="btn ghost account-invoice" type="button" data-id="'+escapeHtml(o.id)+'">'+(String(o.status)==='PENDING'?'پیش‌فاکتور':'فاکتور فروش')+'</button></div></div>'+timeline(o)+'<div class="customer-order-summary"><span>'+fa((o.items||[]).reduce((n,x)=>n+Number(x.quantity||0),0))+' قلم</span><span>'+fa(o.total_irt)+' ریال</span><span>'+escapeHtml(o.address_mobile||o.mobile||'-')+'</span></div></article>').join(''):'<div class="panel empty-orders"><strong>هنوز سفارشی ثبت نکرده‌اید.</strong><p class="muted">آثار گیلاس آرت را ببینید و اولین انتخاب خود را ثبت کنید.</p><a class="btn primary" href="#/shop">مشاهده فروشگاه</a></div>')+'</div></section></section>');
  document.querySelector('#logout').onclick=async()=>{await api('/api/auth/logout',{method:'POST',headers:{'x-csrf-token':csrf()}});state.user=null;state.roles=[];state.permissions=[];location.hash='/';router()};
  document.querySelectorAll('.account-invoice').forEach(b=>b.onclick=()=>{const o=orders.find(x=>x.id===b.dataset.id);if(o)invoiceModule.openInvoice(o,invoiceSettings)});
  return;
 }
 layout('<section class="wrap page"><div class="panel login-panel" style="max-width:480px;margin:auto"><div class="profile-avatar">'+icon('user')+'</div><h1>ورود به گیلاس آرت</h1><p class="muted">کد یک‌بارمصرف برای شماره موبایل شما ارسال می‌شود.</p><div class="form"><label id="mobile-label">شماره موبایل<input id="mobile" inputmode="numeric" autocomplete="tel" maxlength="11" placeholder="09123456789"></label><button class="btn primary" id="send">'+icon('send')+' ارسال کد</button><div id="step"></div></div></div></section>');
 const send=document.querySelector('#send'),mobileEl=document.querySelector('#mobile'),mobileLabel=document.querySelector('#mobile-label'),step=document.querySelector('#step');
 let countdownTimer=null;
 const showMobile=()=>{mobileLabel.hidden=false;mobileLabel.removeAttribute('aria-hidden');mobileEl.disabled=false;send.hidden=false;send.disabled=false};
 const hideMobile=()=>{mobileLabel.hidden=true;mobileLabel.setAttribute('aria-hidden','true');mobileEl.disabled=true;send.hidden=true;send.disabled=true};
 const renderOtp=async(d)=>{step.innerHTML='<div class="otp-session"><div class="otp-title"><span>کد تأیید ارسال شد</span><span id="otp-count" class="otp-count">02:00</span></div><label>کد تأیید<input id="otp" inputmode="numeric" autocomplete="one-time-code" maxlength="6" pattern="[0-9]{6}" aria-label="کد تأیید"></label><button class="btn primary" id="verify">'+icon('check')+' ورود</button><button class="btn ghost resend-btn" id="resend" hidden>'+icon('send')+' ارسال مجدد کد</button><p id="otp-status" class="muted">کد پیامک‌شده را وارد کنید. در Chrome/Android می‌تواند با تأیید شما خودکار وارد شود.</p></div>';
  const otp=document.querySelector('#otp'),verify=document.querySelector('#verify'),status=document.querySelector('#otp-status'),countEl=document.querySelector('#otp-count'),resend=document.querySelector('#resend');let verifying=false;
  clearInterval(countdownTimer);let left=Math.max(1,Number(d.expiresIn||120));const tick=()=>{const m=Math.floor(left/60),s=left%60;countEl.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');if(left<=0){clearInterval(countdownTimer);verify.disabled=true;resend.hidden=false;showMobile();status.textContent='زمان این کد تمام شد. برای دریافت کد جدید ارسال مجدد را بزنید.';return}left--};tick();countdownTimer=setInterval(tick,1000);
  const finish=async(code)=>{if(verifying)return;code=String(code||'').replace(/\D/g,'').slice(0,6);if(code.length!==6)return;otp.value=code;verifying=true;verify.disabled=true;status.textContent='در حال ورود...';try{const v=await api('/api/auth/verify-otp',{method:'POST',body:JSON.stringify({challengeId:d.challengeId,code})});state.user=v.user||null;state.roles=v.roles||[];state.permissions=v.permissions||[];csrfToken=v.csrfToken||csrfToken;clearInterval(countdownTimer);status.innerHTML='<span class="ok">ورود با موفقیت انجام شد.</span>';setTimeout(()=>{location.hash=isAdminUser()?'/admin':'/account';router()},180)}catch(e){verifying=false;verify.disabled=false;status.textContent=e.message||'کد واردشده صحیح نیست.';otp.focus()}};
  verify.onclick=()=>finish(otp.value);otp.addEventListener('input',()=>{otp.value=otp.value.replace(/\D/g,'').slice(0,6);if(otp.value.length===6)finish(otp.value)});
  resend.onclick=async()=>{try{const mobile=mobileEl.value;hideMobile();resend.disabled=true;status.textContent='در حال ارسال کد جدید...';const nd=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile})});renderOtp(nd)}catch(e){resend.disabled=false;showMobile();status.textContent=e.message||'ارسال کد ناموفق بود.'}};
  if('OTPCredential' in window&&navigator.credentials?.get){try{const ac=new AbortController();setTimeout(()=>ac.abort(),130000);const credential=await navigator.credentials.get({otp:{transport:['sms']},signal:ac.signal});if(credential?.code)await finish(credential.code)}catch{}}
 };
 send.onclick=async()=>{hideMobile();step.innerHTML='<div class="otp-loading" role="status">در حال ارسال کد به پیامک…</div>';try{const mobile=mobileEl.value;const d=await api('/api/auth/request-otp',{method:'POST',body:JSON.stringify({mobile}));showMobile();renderOtp(d)}catch(e){showMobile();step.textContent=e.message||'ارسال کد ناموفق بود.'}};
}
async function checkout(){
 await loadMe();if(!state.user){location.hash='/account';return}
 const idempotencyKey=(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)).replace(/-/g,'');
 const d=await api('/api/cart');let couponCode='';
 layout('<section class="wrap page"><div class="product"><div class="panel"><h1>ثبت سفارش</h1><div class="form"><label>نام گیرنده<input id="rn" value="'+escapeHtml(state.user.name||'')+'"></label><label>استان<input id="pr"></label><label>شهر<input id="ct"></label><label>نشانی<textarea id="ad"></textarea></label><label>کد پستی<input id="pc"></label><button class="btn primary" id="order">ثبت سفارش و پرداخت</button><div id="msg"></div></div></div><div class="panel"><h2>خلاصه</h2><p>جمع کالاها: <span id="sum-sub">'+fa(d.subtotal_irt)+'</span> ریال</p><p>تخفیف: <span id="sum-dis">'+fa(d.discount_irt)+'</span> ریال</p><p>ارسال: <span id="sum-ship">'+fa(d.shipping_irt)+'</span> ریال</p><strong class="price">مبلغ نهایی: <span id="sum-total">'+fa(d.total_irt)+'</span> ریال</strong><label>کد کوپن<input id="checkout-coupon" placeholder="GLS________"></label><button class="btn ghost" id="checkout-apply">اعمال کوپن</button><div id="checkout-coupon-msg" class="muted"></div></div></div></section>');
 document.querySelector('#checkout-apply').onclick=async()=>{const code=document.querySelector('#checkout-coupon').value.trim();try{const p=await api('/api/cart/price',{method:'POST',body:JSON.stringify({code}),headers:{'x-csrf-token':csrf()}});couponCode=code;document.querySelector('#sum-dis').textContent=fa(p.discount_irt);document.querySelector('#sum-ship').textContent=fa(p.shipping_irt);document.querySelector('#sum-total').textContent=fa(p.total_irt);document.querySelector('#checkout-coupon-msg').textContent='کوپن معتبر است.'}catch(e){document.querySelector('#checkout-coupon-msg').textContent='کوپن معتبر نیست یا قابل استفاده نیست.'}};
 document.querySelector('#order').onclick=async()=>{try{const a=await api('/api/addresses',{method:'POST',body:JSON.stringify({recipientName:document.querySelector('#rn').value,province:document.querySelector('#pr').value,city:document.querySelector('#ct').value,address:document.querySelector('#ad').value,postalCode:document.querySelector('#pc').value}),headers:{'x-csrf-token':csrf()}});const o=await api('/api/orders',{method:'POST',body:JSON.stringify({addressId:a.addressId,idempotencyKey,couponCode}),headers:{'x-csrf-token':csrf()}});const pay=await api('/api/orders/'+o.orderId+'/pay',{method:'POST',headers:{'x-csrf-token':csrf()}});location.href=pay.url}catch(e){document.querySelector('#msg').innerHTML='<span class="error">'+escapeHtml(e.message)+'</span>'}};
}
async function router(){const p=location.hash.slice(2).split('/');try{if(!p[0])return home();if(p[0]==='admin'){const base=location.pathname.includes('/glsArt/')?'/glsArt':'';const {default:AdminApp}=await import(base+'/admin/AdminApp.js?v=20260928.5');await loadMe();if(!isAdminUser()){location.hash='/account';return}app.innerHTML=AdminApp();return}if(p[0]==='shop')return shop();if(p[0]==='product')return product(p[1]);if(p[0]==='cart')return cart();if(p[0]==='account')return account();if(p[0]==='checkout')return checkout();if(p[0]==='about'||p[0]==='contact')return cmsPage(p[0]);if(p[0]==='article'&&p[1])return contentDetail('articles',decodeURIComponent(p[1]));if(p[0]==='news'&&p[1])return contentDetail('news',decodeURIComponent(p[1]));if(p[0]==='news'||p[0]==='articles')return cmsPage(p[0]);if(p[0]==='terms'){
 layout('<section class="wrap page"><div class="panel"><h1 id="terms-title">قوانین سایت</h1><div id="terms-body" class="terms-content">در حال دریافت قوانین...</div></div></section>');
 try{
  const d=await api('/api/site-rules'),item=d.item||{},title=String(item.title||'قوانین سایت'),body=String(item.body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.');
  const titleEl=document.querySelector('#terms-title'),bodyEl=document.querySelector('#terms-body');
  if(titleEl)titleEl.textContent=title;
  if(bodyEl)bodyEl.innerHTML=escapeHtml(body).replace(/\r?\n/g,'<br>');
 }catch(e){
  const bodyEl=document.querySelector('#terms-body');if(bodyEl)bodyEl.textContent='قوانین سایت در حال حاضر قابل دریافت نیست.';
 }
 return}if(p[0]==='support')return p[1]?supportDetail(decodeURIComponent(p[1])):support();if(p[0]==='payment'){layout(`<section class="wrap page"><div class="panel"><h1>${p[1]==='success'?'پرداخت با موفقیت تایید شد':'پرداخت ناموفق بود'}</h1><a class="btn primary" href="#/">بازگشت به فروشگاه</a></div></section>`);return}home()}catch(e){layout(`<section class="wrap page"><div class="panel"><h2>خطا</h2><p class="error">${escapeHtml(e.message)}</p></div></section>`)}}window.addEventListener('hashchange',()=>router());router();loadMe().then(()=>{if(location.hash===''||location.hash==='#/' )router()});

/* GilasArt interaction guard */
(()=>{
 document.addEventListener('contextmenu',e=>e.preventDefault(),{capture:true});
 document.addEventListener('copy',e=>{e.preventDefault();}, {capture:true});
 document.addEventListener('cut',e=>{e.preventDefault();}, {capture:true});
 document.addEventListener('dragstart',e=>e.preventDefault(),{capture:true});
 document.addEventListener('auxclick',e=>{if(e.button===1){e.preventDefault();e.stopPropagation()}},{capture:true});
 document.addEventListener('click',e=>{
   const link=e.target?.closest?.('a[href]');
   if(link && (link.target==='_blank'||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 document.addEventListener('keydown',e=>{
   const k=String(e.key||'').toLowerCase();
   if((e.ctrlKey||e.metaKey)&&['c','x','u','s','p'].includes(k)){e.preventDefault();e.stopPropagation();}
   if(e.key==='ContextMenu'||(e.shiftKey&&e.key==='F10')){e.preventDefault();e.stopPropagation();}
 },{capture:true});
 window.addEventListener('beforeprint',e=>e.preventDefault?.());
})();