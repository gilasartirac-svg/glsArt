import {setupDataGrid} from '../components/Table.js';
import {api} from '../services/api.js?v=20260929-categories';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const errorText=e=>String(e?.message||'خطا در انجام عملیات').replace(/^خطا در دریافت اطلاعات:\s*/,'');
let gridReady=false;

export default function Categories(){
 return `<div class="admin-page" dir="rtl">
  <div class="admin-title"><div><h2>دسته‌بندی‌ها</h2><p class="muted">مدیریت دسته‌بندی‌های فروشگاه</p></div></div>
  <div id="cat-error" class="error"></div>
  <div class="panel">
   <form id="cat-form" class="form">
    <div class="form-grid">
     <label>نام دسته<input name="name" maxlength="160" required></label>
     <label>Slug<input name="slug" maxlength="120" dir="ltr" required></label>
    </div>
    <label>توضیح<textarea name="description" maxlength="1000"></textarea></label>
    <button id="cat-submit" class="btn primary" type="submit">ثبت دسته</button>
   </form>
  </div>
  <div class="panel">
   <div class="panel-head"><strong>دسته‌بندی‌های ثبت‌شده</strong><button id="cat-refresh" class="btn ghost" type="button">بروزرسانی</button></div>
   <div class="table-wrap"><table class="admin-table"><thead><tr><th>نام</th><th>Slug</th><th>تعداد محصول</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="cat-grid"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div>
  </div>
 </div>`;
}

export async function mount(){
 const grid=document.querySelector('#cat-grid'),form=document.querySelector('#cat-form'),err=document.querySelector('#cat-error'),submit=document.querySelector('#cat-submit');
 if(!grid||!form)return;
 const showError=e=>{err.textContent=errorText(e)};
 const bindActions=()=>{
  grid.querySelectorAll('.cat-delete').forEach(btn=>btn.onclick=async()=>{
   if(btn.disabled)return;
   btn.disabled=true;err.textContent='';
   try{
    await api('/api/admin/categories/'+encodeURIComponent(btn.dataset.id),{method:'DELETE'});
    await load();
   }catch(e){showError(e);btn.disabled=false}
  });
 };
 const load=async()=>{
  grid.innerHTML='<tr><td colspan="5">در حال دریافت...</td></tr>';
  try{
   const d=await api('/api/admin/categories?_ts='+Date.now());
   const items=d.items||[];
   grid.innerHTML=items.length?items.map(x=>`<tr><td>${esc(x.name)}</td><td dir="ltr">${esc(x.slug)}</td><td>${Number(x.product_count||0).toLocaleString('fa-IR')}</td><td>${x.active?'فعال':'غیرفعال'}</td><td><button type="button" class="btn danger cat-delete" data-id="${esc(x.id)}">حذف</button></td></tr>`).join(''):'<tr><td colspan="5">دسته‌ای ثبت نشده است.</td></tr>';
   if(!gridReady){
    setupDataGrid('cat-grid');
    gridReady=true;
   }
   bindActions();
  }catch(e){
   grid.innerHTML='<tr><td colspan="5" class="error-cell">دریافت دسته‌بندی‌ها انجام نشد.</td></tr>';
   showError(e);
  }
 };
 form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(submit.disabled)return;
  err.textContent='';
  const f=new FormData(form);
  submit.disabled=true;submit.textContent='در حال ذخیره...';
  try{
   await api('/api/admin/categories',{method:'POST',body:JSON.stringify({name:String(f.get('name')||'').trim(),slug:String(f.get('slug')||'').trim(),description:String(f.get('description')||'').trim()})});
   form.reset();
   await load();
  }catch(e){showError(e)}
  finally{submit.disabled=false;submit.textContent='ثبت دسته'}
 });
 document.querySelector('#cat-refresh')?.addEventListener('click',load);
 await load();
}
