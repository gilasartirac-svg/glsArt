import {setupDataGrid} from '../components/Table.js';
import {admin} from '../services/api.js?v=20260929-access';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const roleLabel=r=>r?.role_name||'کاربر عادی';

export default function AccessControl(){
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><h2>سطح دسترسی</h2><p class="muted">مدیریت نقش کاربران ثبت‌نام‌شده و دسترسی مدیریت</p></div></div><div id="access-error" class="error"></div><div class="panel"><div class="panel-head"><strong>کاربران سیستم</strong><button id="access-refresh" class="btn ghost" type="button">بروزرسانی</button></div><div class="table-wrap"><table class="admin-table"><thead><tr><th>شماره موبایل</th><th>نام</th><th>تاریخ ثبت‌نام</th><th>سطح دسترسی</th><th>عملیات</th></tr></thead><tbody id="access-users-grid"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div></div><div class="panel access-note"><strong>نکته امنیتی</strong><p class="muted">برداشتن نقش، حساب مشتری و سفارش‌های او را حذف نمی‌کند؛ فقط دسترسی مدیریتی او را لغو می‌کند. تغییر نقش خود مدیر نیز از داخل این بخش مجاز نیست.</p></div></div>';
}

export async function mount(){
 const grid=document.querySelector('#access-users-grid'),err=document.querySelector('#access-error');
 let roles=[];
 const fail=e=>{if(err)err.textContent=e?.message||'خطا در دریافت کاربران';};
 const load=async()=>{
  if(!grid)return;
  grid.innerHTML='<tr><td colspan="5">در حال دریافت...</td></tr>';
  try{
   const [users,rd]=await Promise.all([admin.users(),admin.roles()]);
   roles=rd.items||[];
   grid.innerHTML=(users.items||[]).map(u=>'<tr><td><strong>'+esc(u.mobile)+'</strong></td><td>'+esc(u.name||'—')+'</td><td>'+(u.created_at?new Date(u.created_at.replace(' ','T')+'Z').toLocaleDateString('fa-IR'):'—')+'</td><td><span class="pill">'+esc(roleLabel(u))+'</span></td><td><select class="access-role" data-id="'+esc(u.id)+'" aria-label="نقش '+esc(u.mobile)+'"><option value="">کاربر عادی</option>'+roles.map(r=>'<option value="'+esc(r.id)+'" '+(u.role_id===r.id?'selected':'')+'>'+esc(r.name)+'</option>').join('')+'</select> <button class="btn primary access-save" data-id="'+esc(u.id)+'">ذخیره نقش</button></td></tr>').join('')||'<tr><td colspan="5">کاربری ثبت نشده است.</td></tr>';
   try{setupDataGrid('access-users-grid')}catch(e){console.warn('access grid enhancement skipped',e)}
   grid.querySelectorAll('.access-save').forEach(btn=>btn.onclick=async()=>{
    const select=grid.querySelector('.access-role[data-id="'+CSS.escape(btn.dataset.id)+'"]');
    if(!select)return;
    btn.disabled=true;
    try{if(select.value)await admin.assignRole(btn.dataset.id,select.value);else await admin.revokeRole(btn.dataset.id);await load()}catch(e){fail(e);btn.disabled=false}
   });
  }catch(e){fail(e);grid.innerHTML='<tr><td colspan="5" class="error-cell">دریافت کاربران انجام نشد.</td></tr>'}
 };
 document.querySelector('#access-refresh')?.addEventListener('click',load);
 await load();
}
