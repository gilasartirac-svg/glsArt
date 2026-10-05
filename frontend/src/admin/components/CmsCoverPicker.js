import {api} from '../services/api.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function coverImageField(){
 return '<div class="cms-cover-field"><div class="cms-cover-head"><div><strong>تصویر اصلی محتوا</strong><small>یک تصویر واقعی از رسانه‌های موجود را برای نمایش بالای متن انتخاب کنید.</small></div><button type="button" class="btn ghost cms-cover-refresh">به‌روزرسانی تصاویر</button></div><input type="hidden" name="coverImage"><div class="cms-cover-current"><span>بدون تصویر انتخاب‌شده</span></div><div class="cms-cover-grid" aria-live="polite"><div class="muted">در حال دریافت تصاویر...</div></div></div>';
}

export async function setupCoverImageField(form){
 const field=form?.querySelector('[name="coverImage"]');if(!field)return;
 const grid=form.querySelector('.cms-cover-grid'),current=form.querySelector('.cms-cover-current');
 const renderCurrent=()=>{
  const url=String(field.value||'');
  current.innerHTML=url?'<img src="'+esc(url)+'" alt="پیش‌نمایش تصویر اصلی"><div><strong>تصویر انتخاب‌شده</strong><button type="button" class="btn danger cms-cover-clear">حذف انتخاب</button></div>':'<span>بدون تصویر انتخاب‌شده</span>';
  current.querySelector('.cms-cover-clear')?.addEventListener('click',()=>{field.value='';renderCurrent();grid.querySelectorAll('.cms-cover-option').forEach(x=>x.classList.remove('active'))});
 };
 const load=async()=>{
  grid.innerHTML='<div class="muted">در حال دریافت تصاویر...</div>';
  try{
   const d=await api('/api/admin/media-images'),items=Array.isArray(d.items)?d.items:[];
   grid.innerHTML=items.length?items.map(x=>'<button type="button" class="cms-cover-option '+(x.url===field.value?'active':'')+'" data-url="'+esc(x.url)+'" title="'+esc(x.name||x.path)+'"><img src="'+esc(x.url)+'" alt="'+esc(x.name||'تصویر رسانه')+'" loading="lazy" decoding="async"><span>'+esc(x.name||x.path)+'</span><small class="cms-cover-path" dir="ltr">'+esc(x.path||'مسیر ثبت نشده')+'</small><small>'+esc(x.source||'media')+'</small></button>').join(''):'<div class="muted">تصویر قابل انتخابی پیدا نشد.</div>';
   grid.querySelectorAll('.cms-cover-option').forEach(b=>b.addEventListener('click',()=>{field.value=b.dataset.url||'';grid.querySelectorAll('.cms-cover-option').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderCurrent()}));
  }catch(e){grid.innerHTML='<div class="error">دریافت تصاویر انجام نشد: '+esc(e.message||'خطا')+'</div>'}
 };
 form.querySelector('.cms-cover-refresh')?.addEventListener('click',load);
 renderCurrent();await load();
}

export function setCoverImageField(form,value){
 const field=form?.querySelector('[name="coverImage"]');if(!field)return;
 field.value=String(value||'');
 form.querySelectorAll('.cms-cover-option').forEach(x=>x.classList.toggle('active',x.dataset.url===field.value));
 const img=form.querySelector('.cms-cover-current img');
 if(img){img.src=field.value}
 else if(field.value){const box=form.querySelector('.cms-cover-current');box.innerHTML='<img src="'+esc(field.value)+'" alt="پیش‌نمایش تصویر اصلی"><div><strong>تصویر انتخاب‌شده</strong><button type="button" class="btn danger cms-cover-clear">حذف انتخاب</button></div>';box.querySelector('.cms-cover-clear').addEventListener('click',()=>{field.value='';box.innerHTML='<span>بدون تصویر انتخاب‌شده</span>';form.querySelectorAll('.cms-cover-option').forEach(x=>x.classList.remove('active'))})}
}