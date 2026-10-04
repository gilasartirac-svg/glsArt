import {api} from '../services/api.js';

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const PLATFORMS=[
 ['instagram','اینستاگرام'],['telegram','تلگرام'],['aparat','آپارات'],
 ['whatsapp','واتساپ'],['youtube','یوتیوب'],['linkedin','لینکدین'],['other','سایر']
];
const iconPath=id=>`/glsArt/assets/social/${['telegram','instagram','aparat','whatsapp','youtube','linkedin','other'].includes(id)?id:'other'}.svg`;

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

  <div class="panel">
   <div class="sectionhead"><div><h3>نماد اعتماد الکترونیکی</h3><p class="muted">کد رسمی ارائه‌شده توسط شرکت به‌صورت ثابت در Footer سایت قرار می‌گیرد.</p></div></div>
   <div class="enamad-admin-preview">
    <div class="enamad-code-label">کد نماد</div>
    <code dir="ltr">u04bawyWrXOcWNwCSK6B</code>
    <span class="pill">فعال در Footer</span>
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
  renderSocialLinks(normalizeLinks(map.footer_social_links));
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
