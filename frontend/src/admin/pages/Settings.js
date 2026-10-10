import {api} from '../services/api.js';

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const PLATFORMS=[
 ['instagram','اینستاگرام'],['telegram','تلگرام'],['aparat','آپارات'],
 ['whatsapp','واتساپ'],['youtube','یوتیوب'],['linkedin','لینکدین'],['other','سایر']
];
const iconPath=id=>`/assets/social/${['telegram','instagram','aparat','whatsapp','youtube','linkedin','other'].includes(id)?id:'other'}.svg`;

function normalizePartnerLogos(raw){
 try{const items=typeof raw==='string'?JSON.parse(raw||'[]'):raw;if(!Array.isArray(items))return [];return items.filter(x=>x&&/^\/uploaded\/thumb\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|svg)$/i.test(String(x.path||''))&&!String(x.path||'').includes('..')).slice(0,24).map((x,i)=>({label:String(x.label||'').trim().slice(0,80)||String(x.path).split('/').pop(),path:String(x.path),active:x.active!==false,sort:Number.isFinite(Number(x.sort))?Number(x.sort):i}));}catch{return []}
}
function normalizeLinks(raw){
 try{
  const x=typeof raw==='string'?JSON.parse(raw||'[]'):raw;
  if(!Array.isArray(x))return [];
  return x.slice(0,12).map((v,i)=>({
   id:PLATFORMS.some(p=>p[0]===v?.id)?v.id:'other',
   label:String(v?.label||'').trim()||PLATFORMS.find(p=>p[0]===v?.id)?.[1]||'سایر',
   url:String(v?.url||'').trim(),
   active:v?.active!==false,
   sort:Number.isFinite(Number(v?.sort))?Number(v.sort):i
  }));
 }catch{return []}
}

export default function Settings(){
 return `<div class="admin-page" dir="rtl">
  <div class="admin-title"><div><h2>تنظیمات سایت و SEO</h2><span class="muted">اطلاعات عمومی، SEO و شبکه‌های اجتماعی Footer را از همین بخش مدیریت کنید.</span></div></div>
  <div id="settings-error" class="error"></div>

  <div class="panel">
   <div class="sectionhead"><div><h3>تنظیمات عمومی و SEO</h3><p class="muted">اطلاعات این بخش در ویترین سایت و داده‌های SEO استفاده می‌شود.</p></div></div>
   <form id="seo-form" class="form">
    <div class="form-grid">
     <label>نام سایت<input name="site_name"></label>
     <label>SEO Title<input name="seo_title" maxlength="70"></label>
    </div>
    <label>توضیح سایت<textarea name="site_description"></textarea></label>
    <label>SEO Description<textarea name="seo_description" maxlength="180"></textarea></label>
    <label>SEO Keywords<input name="seo_keywords"></label>
    <label>OG Image URL<input name="og_image" inputmode="url"></label>
    <button class="btn primary">ذخیره تنظیمات عمومی و SEO</button>
   </form>
  </div>

  <div class="panel footer-social-admin">
   <div class="sectionhead">
    <div><h3>شبکه‌های اجتماعی Footer</h3><p class="muted">یک یا چند لینک اضافه کنید. برای هر شبکه، آیکون SVG اختصاصی از Library داخلی سایت استفاده می‌شود.</p></div>
    <button type="button" class="btn primary" id="social-add">افزودن شبکه اجتماعی</button>
   </div>
   <div id="social-links-list" class="social-links-editor"></div>
   <div class="notice">فقط آدرس‌های HTTPS پذیرفته می‌شوند. ترتیب نمایش با شماره ردیف کنترل می‌شود و شبکه غیرفعال در Footer نمایش داده نخواهد شد.</div>
   <button type="button" class="btn primary" id="social-save">ذخیره شبکه‌های اجتماعی</button>
  </div>

  <div class="panel partner-logo-admin">
   <div class="sectionhead"><div><h3>لوگوهای مشتریان و همکاران سازمانی</h3><p class="muted">فایل لوگوها را در پوشه frontend/public/uploaded/thumb مخزن قرار دهید؛ سپس از کتابخانه زیر انتخاب، مرتب و برای صفحه اصلی فعال کنید.</p></div><button type="button" class="btn primary" id="partner-library-load">بارگذاری کتابخانه Repository</button></div>
   <label class="partner-library-search">جست‌وجوی فایل<input id="partner-library-search" type="search" placeholder="نام فایل یا لوگو..." autocomplete="off"></label>
   <div id="partner-library-status" class="notice" role="status">برای مشاهده تصاویر پوشه thumb، «بارگذاری کتابخانه Repository» را بزنید.</div>
   <div id="partner-library-grid" class="partner-library-grid" aria-label="کتابخانه تصاویر Repository"></div>
   <div class="sectionhead partner-selected-heading"><div><h4>لوگوهای انتخاب‌شده برای صفحه اصلی</h4><p class="muted">حداکثر ۲۴ لوگو؛ ترتیب ردیف از بالا به پایین و وضعیت نمایش قابل کنترل است.</p></div></div>
   <div id="partner-selected-list" class="partner-selected-list"></div>
   <button type="button" class="btn primary" id="partner-logos-save">ذخیره لوگوهای صفحه اصلی</button>
  </div>
  <div class="panel">
   <div class="sectionhead"><div><h3>مرکز کنترل ورود و نشست</h3><p class="muted">ورود کاربر و مدیر، اعتبار Session و خروج از حساب از همین سیاست مرکزی کنترل می‌شود.</p></div></div>
   <form id="auth-session-form" class="form">
    <div class="form-grid"><label>مدت اعتبار Session (روز)<input name="auth_session_ttl_days" type="number" min="1" max="90" step="1" inputmode="numeric"></label></div>
    <div class="notice">مقدار مجاز ۱ تا ۹۰ روز است و برای Sessionهای جدید اعمال می‌شود.</div>
    <button class="btn primary">ذخیره سیاست ورود</button>
   </form>
  </div>

  <div class="panel">
   <div class="sectionhead"><div><h3>نماد اعتماد الکترونیکی</h3><p class="muted">لینک رسمی استعلام اینماد و کد نشان در این بخش ثبت و قابل بررسی است.</p></div></div>
   <div class="enamad-admin-preview">
    <div class="enamad-code-label">کد نماد</div>
    <code dir="ltr">u04bawyWrXOcWNwCSK6B</code>
    <span class="pill">فعال در Footer</span>
    <div class="enamad-code-label">لینک رسمی اینماد</div>
    <a class="btn secondary" href="https://trustseal.enamad.ir/?id=22286&amp;Code=u04bawyWrXOcWNwCSK6B" target="_blank" rel="noopener noreferrer" referrerpolicy="origin">مشاهده صفحه رسمی استعلام اینماد</a>
    <div class="enamad-code-label">کد کامل نشان</div>
    <textarea dir="ltr" readonly rows="6" aria-label="کد کامل نشان اینماد"><a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=22286&Code=u04bawyWrXOcWNwCSK6B'><img referrerpolicy='origin' src='https://trustseal.enamad.ir/logo.aspx?id=22286&Code=u04bawyWrXOcWNwCSK6B' alt='' style='cursor:pointer' code='u04bawyWrXOcWNwCSK6B'></a></textarea>
   </div>
  </div>

  <div class="notice">Secretها، کلیدهای پرداخت و اطلاعات حساس در این بخش نمایش داده نمی‌شوند. برای اطلاعات فروشنده از «تنظیمات فاکتور» استفاده کنید.</div>
 </div>`;
}

export async function mount(){
 const error=document.querySelector('#settings-error');
 let map={};
 try{
  const d=await api('/api/admin/settings');
  (d.items||[]).forEach(x=>map[x.key]=x.value);
  document.querySelectorAll('#seo-form [name]').forEach(e=>{e.value=map[e.name]||''});
  const sessionDays=document.querySelector('#auth-session-form [name="auth_session_ttl_days"]');if(sessionDays)sessionDays.value=map.auth_session_ttl_days||'30';
  renderSocialLinks(normalizeLinks(map.footer_social_links));
  renderPartnerLogos(normalizePartnerLogos(map.partner_logos));
 }catch(e){
  if(error)error.textContent=e.message||'تنظیمات قابل دریافت نیست.';
  renderSocialLinks([]);
  return;
 }

 document.querySelector('#seo-form')?.addEventListener('submit',async e=>{
  e.preventDefault();
  const f=new FormData(e.currentTarget),b={};
  for(const k of ['site_name','site_description','seo_title','seo_description','seo_keywords','og_image'])b[k]=String(f.get(k)||'');
  try{await api('/api/admin/settings',{method:'PUT',body:JSON.stringify(b)});alert('تنظیمات عمومی و SEO ذخیره شد')}catch(x){alert(x.message)}
 });

 document.querySelector('#auth-session-form')?.addEventListener('submit',async e=>{e.preventDefault();const n=Number(new FormData(e.currentTarget).get('auth_session_ttl_days'));if(!Number.isInteger(n)||n<1||n>90){alert('مدت اعتبار باید بین ۱ تا ۹۰ روز باشد.');return}try{await api('/api/admin/settings',{method:'PUT',body:JSON.stringify({auth_session_ttl_days:n})});alert('سیاست اعتبار Session ذخیره شد.')}catch(x){alert(x.message)}});

 document.querySelector('#partner-library-load')?.addEventListener('click',loadPartnerLibrary);
 document.querySelector('#partner-library-search')?.addEventListener('input',filterPartnerLibrary);
 document.querySelector('#partner-logos-save')?.addEventListener('click',savePartnerLogos);
 document.querySelector('#social-add')?.addEventListener('click',()=>addSocialRow({id:'instagram',label:'اینستاگرام',url:'',active:true,sort:document.querySelectorAll('.social-link-row').length}));
 document.querySelector('#social-save')?.addEventListener('click',async()=>{
  const rows=[...document.querySelectorAll('.social-link-row')].map((row,i)=>({
   id:row.querySelector('[data-field="id"]').value,
   label:row.querySelector('[data-field="label"]').value.trim(),
   url:row.querySelector('[data-field="url"]').value.trim(),
   active:row.querySelector('[data-field="active"]').checked,
   sort:i
  })).filter(x=>x.label||x.url);
  if(rows.some(x=>!x.label||!/^https:\/\//i.test(x.url))){alert('برای هر شبکه اجتماعی، نام و آدرس HTTPS معتبر وارد کنید.');return}
  try{
   await api('/api/admin/settings',{method:'PUT',body:JSON.stringify({footer_social_links:JSON.stringify(rows)})});
   renderSocialLinks(rows);alert('شبکه‌های اجتماعی Footer ذخیره شد');
  }catch(x){alert(x.message)}
 });
 function renderSocialLinks(items){const box=document.querySelector('#social-links-list');if(!box)return;box.innerHTML='';(items.length?items:[]).forEach(addSocialRow);if(!items.length)box.innerHTML='<div class="social-links-empty">هنوز شبکه اجتماعی ثبت نشده است. برای شروع «افزودن شبکه اجتماعی» را بزنید.</div>'}
 let partnerLibraryItems=[];
 function renderPartnerLogos(items){
  const box=document.querySelector('#partner-selected-list');if(!box)return;box.innerHTML='';
  if(!items.length){box.innerHTML='<div class="notice">هنوز لوگویی برای صفحه اصلی انتخاب نشده است.</div>';return}
  items.forEach((item,index)=>{
   const row=document.createElement('div');row.className='partner-selected-row';row.dataset.path=item.path;
   row.innerHTML='<img class="partner-selected-preview" src="'+esc(item.path)+'" alt=""><div class="partner-selected-fields"><label>نام نمایشی<input data-field="label" maxlength="80" value="'+esc(item.label)+'"></label><small dir="ltr">'+esc(item.path)+'</small></div><label class="partner-logo-active"><input data-field="active" type="checkbox" '+(item.active?'checked':'')+'> نمایش</label><div class="partner-row-actions"><button type="button" class="btn secondary" data-move="-1" aria-label="انتقال به بالا" '+(index===0?'disabled':'')+'>↑</button><button type="button" class="btn secondary" data-move="1" aria-label="انتقال به پایین" '+(index===items.length-1?'disabled':'')+'>↓</button><button type="button" class="btn danger" data-remove>حذف</button></div>';box.appendChild(row);
  });
  box.querySelectorAll('[data-remove]').forEach(button=>button.addEventListener('click',()=>{button.closest('.partner-selected-row')?.remove();refreshPartnerRowButtons()}));
  box.querySelectorAll('[data-move]').forEach(button=>button.addEventListener('click',()=>{const row=button.closest('.partner-selected-row'),direction=Number(button.dataset.move);if(direction<0&&row.previousElementSibling)row.parentNode.insertBefore(row,row.previousElementSibling);if(direction>0&&row.nextElementSibling)row.parentNode.insertBefore(row.nextElementSibling,row);refreshPartnerRowButtons()}));
 }
 function refreshPartnerRowButtons(){const rows=[...document.querySelectorAll('.partner-selected-row')];rows.forEach((row,i)=>row.querySelectorAll('[data-move]').forEach(button=>button.disabled=Number(button.dataset.move)<0?i===0:i===rows.length-1))}
 async function loadPartnerLibrary(){
  const status=document.querySelector('#partner-library-status'),grid=document.querySelector('#partner-library-grid'),button=document.querySelector('#partner-library-load');if(!status||!grid)return;button.disabled=true;status.textContent='در حال دریافت فهرست تصاویر پوشه thumb از Repository…';grid.innerHTML='';
  try{const response=await fetch('https://api.github.com/repos/gilasartirac-svg/glsArt/contents/frontend/public/uploaded/thumb?ref=main&per_page=1000',{headers:{Accept:'application/vnd.github+json'},cache:'no-store'});if(!response.ok)throw new Error(response.status===403?'محدودیت موقت درخواست GitHub؛ کمی بعد دوباره تلاش کنید.':'دریافت کتابخانه تصاویر ناموفق بود.');const files=await response.json();partnerLibraryItems=Array.isArray(files)?files.filter(file=>file.type==='file'&&/\.(?:png|jpe?g|webp|svg)$/i.test(file.name)).map(file=>({name:file.name,path:'/uploaded/thumb/'+file.name})):[];renderPartnerLibrary();status.textContent=partnerLibraryItems.length+' تصویر از پوشه thumb پیدا شد. فقط لوگوهای واقعی و مجاز سازمان‌ها را انتخاب کنید.';}catch(error){status.textContent=error.message||'کتابخانه تصاویر در دسترس نیست.'}finally{button.disabled=false}
 }
 function renderPartnerLibrary(){
  const grid=document.querySelector('#partner-library-grid');if(!grid)return;const query=String(document.querySelector('#partner-library-search')?.value||'').trim().toLowerCase();const selected=new Set([...document.querySelectorAll('.partner-selected-row')].map(row=>row.dataset.path));const items=partnerLibraryItems.filter(x=>x.name.toLowerCase().includes(query)).slice(0,160);grid.innerHTML='';
  if(!items.length){grid.innerHTML='<div class="notice">تصویری با این جست‌وجو پیدا نشد.</div>';return}
  items.forEach(file=>{const button=document.createElement('button');button.type='button';button.className='partner-library-item';button.disabled=selected.has(file.path);button.innerHTML='<img src="'+esc(file.path)+'" alt="" loading="lazy" decoding="async"><span>'+esc(file.name)+'</span><small>'+(selected.has(file.path)?'انتخاب شده':'افزودن به فهرست')+'</small>';button.addEventListener('click',()=>{const rows=[...document.querySelectorAll('.partner-selected-row')];if(rows.length>=24){document.querySelector('#partner-library-status').textContent='حداکثر ۲۴ لوگو قابل انتخاب است.';return}const items=rows.map((row,i)=>({label:row.querySelector('[data-field="label"]').value.trim(),path:row.dataset.path,active:row.querySelector('[data-field="active"]').checked,sort:i}));if(items.some(x=>x.path===file.path))return;items.push({label:file.name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').trim(),path:file.path,active:true,sort:items.length});renderPartnerLogos(items);renderPartnerLibrary()});grid.appendChild(button)});
 }
 function filterPartnerLibrary(){renderPartnerLibrary()}
 async function savePartnerLogos(){
  const rows=[...document.querySelectorAll('.partner-selected-row')].map((row,sort)=>({label:row.querySelector('[data-field="label"]').value.trim(),path:row.dataset.path,active:row.querySelector('[data-field="active"]').checked,sort}));if(rows.some(x=>!x.label||!/^\/uploaded\/thumb\/[A-Za-z0-9._/-]+\.(?:png|jpe?g|webp|svg)$/i.test(x.path)||x.path.includes('..'))){alert('نام و مسیر معتبر برای تمام لوگوها الزامی است.');return}
  try{const value=JSON.stringify(rows);await api('/api/admin/settings',{method:'PUT',body:JSON.stringify({partner_logos:value})});try{sessionStorage.setItem('gilasart-partner-logos',JSON.stringify({expiresAt:Date.now()+5*60*1000,value}))}catch{}alert('لوگوهای سازمانی ذخیره شد. لوگوهای فعال در صفحه اصلی نمایش داده می‌شوند.')}catch(error){alert(error.message||'ذخیره لوگوها ناموفق بود.')}
 }
 function addSocialRow(item){
  const box=document.querySelector('#social-links-list');if(!box)return;
  box.querySelector('.social-links-empty')?.remove();
  const row=document.createElement('div');row.className='social-link-row';
  row.innerHTML=`<div class="social-link-icon"><img src="${esc(iconPath(item.id))}" alt="" aria-hidden="true"></div>
   <label class="social-platform-field">شبکه<select data-field="id">${PLATFORMS.map(([id,label])=>`<option value="${id}" ${id===item.id?'selected':''}>${label}</option>`).join('')}</select></label>
   <label>عنوان نمایشی<input data-field="label" value="${esc(item.label)}" maxlength="80"></label>
   <label class="social-url-field">آدرس کامل<input data-field="url" value="${esc(item.url)}" inputmode="url" placeholder="https://..."></label>
   <label class="social-active-field"><input data-field="active" type="checkbox" ${item.active!==false?'checked':''}> نمایش</label>
   <button type="button" class="btn danger social-remove" aria-label="حذف شبکه اجتماعی">حذف</button>`;
  box.appendChild(row);
  const select=row.querySelector('[data-field="id"]');
  select.addEventListener('change',()=>{row.querySelector('.social-link-icon img').src=iconPath(select.value);if(!row.querySelector('[data-field="label"]').value.trim())row.querySelector('[data-field="label"]').value=PLATFORMS.find(p=>p[0]===select.value)?.[1]||'سایر'});
  row.querySelector('.social-remove').onclick=()=>row.remove();
 }
}
