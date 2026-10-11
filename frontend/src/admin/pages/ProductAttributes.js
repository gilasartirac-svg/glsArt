import {api} from '../services/api.js?v=20261011-product-attributes';

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
export default function ProductAttributes(){
 let attributes=[];
 let loading=false;
 const load=async()=>{
  if(loading)return;
  loading=true;
  const box=document.querySelector('#attributes-manager');
  const status=document.querySelector('#attributes-status');
  if(status)status.textContent='در حال دریافت ویژگی‌ها…';
  try{
   const data=await api('/api/admin/product-attributes');
   attributes=Array.isArray(data.items)?data.items:[];
   renderAttributeManager();
   if(status)status.textContent=attributes.length?`${attributes.length.toLocaleString('fa-IR')} ویژگی ثبت شده است.`:'هنوز ویژگی‌ای ثبت نشده است.';
  }catch(e){
   if(status)status.textContent=e.message||'دریافت ویژگی‌ها انجام نشد.';
   if(box)box.innerHTML='<p class="error">امکان دریافت ویژگی‌ها وجود ندارد. لطفاً دوباره تلاش کنید.</p>';
  }finally{loading=false}
 };
 function renderAttributeManager(){
  const box=document.querySelector('#attributes-manager');if(!box)return;
  box.innerHTML=attributes.map(a=>`<div class="attribute-card">
   <div class="attribute-card-head"><div><strong>${esc(a.name)}</strong><span class="pill">${a.active?'فعال':'غیرفعال'}</span></div><button class="btn ghost toggle-attr" data-id="${esc(a.id)}" data-active="${a.active?'1':'0'}">${a.active?'غیرفعال کردن':'فعال کردن'}</button></div>
   <div class="attribute-options">${(a.options||[]).map(o=>`<div class="attribute-option-row" data-option="${esc(o.id)}">
     <input class="opt-name" value="${esc(o.name)}" aria-label="نام گزینه">
     <label><input class="opt-active" type="checkbox" ${o.active?'checked':''}> فعال</label>
     <label><input class="opt-default" type="checkbox" ${o.is_default?'checked':''}> پیش‌فرض</label>
     <input class="opt-price" type="number" min="0" value="${Number(o.price_delta_irt||0)}" aria-label="افزایش قیمت">
     <button class="btn ghost save-opt" data-id="${esc(o.id)}">ذخیره</button>
     <button class="btn danger delete-opt" data-id="${esc(o.id)}">حذف</button>
   </div>`).join('')||'<div class="muted">هنوز گزینه‌ای ثبت نشده است.</div>'}</div>
   <form class="inline-option-form" data-attribute="${esc(a.id)}"><input name="name" required placeholder="گزینه جدید"><input name="price" type="number" min="0" value="0" placeholder="افزایش قیمت"><label><input name="active" type="checkbox" checked> فعال</label><label><input name="default" type="checkbox"> پیش‌فرض</label><button class="btn primary">افزودن گزینه</button></form>
  </div>`).join('')||'<div class="muted">برای شروع یک ویژگی مثل «رنگ قاب» ایجاد کنید.</div>';
  box.querySelectorAll('.toggle-attr').forEach(b=>b.onclick=async()=>{try{await api('/api/admin/product-attributes/'+encodeURIComponent(b.dataset.id),{method:'PUT',body:JSON.stringify({active:b.dataset.active!=='1'})});await load()}catch(e){alert(e.message)}});
  box.querySelectorAll('.inline-option-form').forEach(f=>f.onsubmit=async e=>{e.preventDefault();const x=new FormData(f);try{await api('/api/admin/product-attributes/'+encodeURIComponent(f.dataset.attribute)+'/options',{method:'POST',body:JSON.stringify({name:x.get('name'),priceDeltaIrt:Number(x.get('price')||0),active:x.get('active')==='on',isDefault:x.get('default')==='on'})});await load()}catch(err){alert(err.message)}});
  box.querySelectorAll('.save-opt').forEach(b=>b.onclick=async()=>{const row=b.closest('.attribute-option-row');try{await api('/api/admin/product-attribute-options/'+encodeURIComponent(b.dataset.id),{method:'PUT',body:JSON.stringify({name:row.querySelector('.opt-name').value,active:row.querySelector('.opt-active').checked,isDefault:row.querySelector('.opt-default').checked,priceDeltaIrt:Number(row.querySelector('.opt-price').value||0)})});await load()}catch(e){alert(e.message)}});
  box.querySelectorAll('.delete-opt').forEach(b=>b.onclick=async()=>{if(!confirm('این گزینه حذف شود؟'))return;try{await api('/api/admin/product-attribute-options/'+encodeURIComponent(b.dataset.id),{method:'DELETE'});await load()}catch(e){alert(e.message)}});
 }
 setTimeout(()=>{load();bindForms()},0);
 function bindForms(){
  const form=document.querySelector('#attribute-form');
  form?.addEventListener('submit',async e=>{
   e.preventDefault();
   const input=form.querySelector('[name="name"]');
   const button=form.querySelector('button[type="submit"],button:not([type])');
   if(button)button.disabled=true;
   try{
    await api('/api/admin/product-attributes',{method:'POST',body:JSON.stringify({name:input.value.trim(),active:true})});
    form.reset();await load();
   }catch(err){alert(err.message||'ایجاد ویژگی انجام نشد.')}
   finally{if(button)button.disabled=false}
  });
 }
 return `<div class="admin-page" dir="rtl">
  <div class="admin-title"><div><h2>ویژگی‌های قابل انتخاب</h2><span class="muted">مدیریت مستقل ویژگی‌های عمومی، گزینه‌ها، وضعیت، مقدار پیش‌فرض و افزایش قیمت</span></div></div>
  <div class="panel"><div class="sectionhead"><div><h3>ایجاد ویژگی جدید</h3><p class="muted">برای نمونه «رنگ قاب» یا هر ویژگی عمومی قابل انتخاب در محصولات.</p></div></div>
   <form id="attribute-form" class="inline-option-form"><input name="name" required maxlength="120" placeholder="مثلاً رنگ قاب"><button type="submit" class="btn primary">ایجاد ویژگی</button></form>
   <p id="attributes-status" class="muted" role="status" aria-live="polite"></p>
   <div id="attributes-manager" class="attributes-manager"><p class="muted">در حال دریافت…</p></div>
  </div>
 </div>`;
}