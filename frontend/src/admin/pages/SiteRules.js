import {api} from '../services/api.js';

export default function SiteRules(){
 setTimeout(load,0);
 async function load(){
  try{
   const d=await api('/api/admin/site-rules');
   const item=d.item||{};
   const title=document.querySelector('#site-rules-title');
   const body=document.querySelector('#site-rules-body');
   if(title)title.value=item.title||'قوانین سایت';
   if(body)body.value=item.body||'ثبت سفارش و پرداخت به معنی پذیرش قوانین و شرایط فروش گیلاس آرت است.';
  }catch(e){
   const el=document.querySelector('#site-rules-error');if(el)el.textContent=e.message||'خطا در دریافت قوانین سایت.';
  }
 }
 async function save(e){
  e.preventDefault();
  const form=e.currentTarget,btn=form.querySelector('button[type="submit"]'),msg=document.querySelector('#site-rules-message');
  const title=form.elements.title.value.trim(),body=form.elements.body.value.trim();
  if(!title||!body){msg.textContent='عنوان و متن قوانین الزامی است.';return}
  btn.disabled=true;msg.textContent='در حال ذخیره...';
  try{
   await api('/api/admin/site-rules',{method:'PUT',body:JSON.stringify({title,body})});
   msg.textContent='قوانین سایت با موفقیت ذخیره شد.';
  }catch(err){msg.textContent=err.message||'ذخیره قوانین انجام نشد.'}
  finally{btn.disabled=false}
 }
 setTimeout(()=>document.querySelector('#site-rules-form')?.addEventListener('submit',save),0);
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><div class="eyebrow">GILAS ART • CONTENT</div><h2>قوانین سایت</h2><span class="muted">متنی که در بخش قوانین سایت برای بازدیدکنندگان نمایش داده می‌شود.</span></div></div><div id="site-rules-error" class="error"></div><div class="panel cms-editor"><form id="site-rules-form" class="form"><label>عنوان قوانین<input id="site-rules-title" name="title" maxlength="180" required></label><label>متن قوانین<textarea id="site-rules-body" name="body" maxlength="30000" rows="18" required></textarea></label><div class="toolbar"><button class="btn primary" type="submit">ذخیره قوانین</button><span id="site-rules-message" class="muted" role="status" aria-live="polite"></span></div></form></div><div class="notice">تغییرات این بخش مستقیماً برای صفحه «قوانین سایت» در سایت اصلی استفاده می‌شود.</div></div>';
}
