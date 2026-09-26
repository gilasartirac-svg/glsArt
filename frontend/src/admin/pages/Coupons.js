import {api} from '../services/api.js';

export default function Coupons(){
 setTimeout(()=>{load();document.querySelector('#coupon-form')?.addEventListener('submit',submit)},0);

 async function load(){
  try{
   const d=await api('/api/admin/coupons');
   const el=document.querySelector('#coupon-table');
   if(el){
    el.innerHTML=(d.items||[]).map(x=>`<tr><td>${x.code}</td><td>${x.kind==='PERCENT'?'درصدی':'مبلغ ثابت'}</td><td>${x.value}</td><td>${x.active?'فعال':'غیرفعال'}</td><td><button class="btn danger" data-id="${x.id}">حذف</button></td></tr>`).join('')||'<tr><td colspan="5">کد تخفیفی نیست.</td></tr>';
    el.querySelectorAll('.danger').forEach(b=>b.onclick=async()=>{
     try{await api('/api/admin/coupons/'+b.dataset.id,{method:'DELETE'});await load()}
     catch(e){alert(e.message)}
    });
   }
  }catch(e){
   const err=document.querySelector('#coupon-error');if(err)err.textContent=e.message;
  }
 }

 async function submit(e){
  e.preventDefault();
  const f=new FormData(e.currentTarget);
  try{
   await api('/api/admin/coupons',{
    method:'POST',
    body:JSON.stringify({
     code:f.get('code'),
     kind:f.get('kind'),
     value:Number(f.get('value')),
     maxUses:f.get('maxUses')||null,
     expiresAt:f.get('expiresAt')||null
    })
   });
   e.currentTarget.reset();
   await load();
  }catch(x){alert(x.message)}
 }

 return `<div class="admin-page" dir="rtl"><div class="admin-title"><h2>کدهای تخفیف</h2></div><div id="coupon-error" class="error"></div><div class="panel"><form id="coupon-form" class="form"><div class="form-grid"><label>کد<input name="code" required></label><label>نوع<select name="kind"><option value="PERCENT">درصدی</option><option value="FIXED">مبلغ ثابت</option></select></label><label>مقدار<input name="value" type="number" min="0" required></label><label>حداکثر استفاده<input name="maxUses" type="number" min="1"></label><label>انقضا<input name="expiresAt" type="datetime-local"></label></div><button class="btn primary">ثبت کد</button></form></div><div class="panel"><div class="table-scroll"><table class="admin-table"><thead><tr><th>کد</th><th>نوع</th><th>مقدار</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="coupon-table"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div></div></div>`;
}