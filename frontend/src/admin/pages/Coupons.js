import {api} from '../services/api.js?v=20260926.3';

export default function Coupons(){
  setTimeout(()=>{load();document.querySelector('#coupon-form')?.addEventListener('submit',submit)},0);

  async function load(){
    try{
      const d=await api('/api/admin/coupons');
      const el=document.querySelector('#coupon-table');
      if(!el)return;
      el.innerHTML=(d.items||[]).map(x=>`<tr><td><b>${x.code}</b></td><td>${x.kind==='PERCENT'?'درصدی':'مبلغ ثابت'}</td><td>${new Intl.NumberFormat('fa-IR').format(x.value||0)}</td><td><span class="pill">${x.active?'فعال':'غیرفعال'}</span></td><td><button class="btn danger" data-id="${x.id}">حذف</button></td></tr>`).join('')||'<tr><td colspan="5">کد تخفیفی وجود ندارد.</td></tr>';
      el.querySelectorAll('.danger').forEach(b=>b.onclick=async()=>{
        if(!confirm('این کد تخفیف حذف شود؟'))return;
        try{await api('/api/admin/coupons/'+b.dataset.id,{method:'DELETE'});await load()}catch(e){alert(e.message)}
      });
    }catch(e){
      const er=document.querySelector('#coupon-error');if(er)er.textContent=e.message;
    }
  }

  async function submit(e){
    e.preventDefault();
    const f=new FormData(e.currentTarget);
    try{
      await api('/api/admin/coupons',{method:'POST',body:JSON.stringify({
        code:String(f.get('code')||'').trim(),
        kind:f.get('kind'),
        value:Number(f.get('value')||0),
        maxUses:f.get('maxUses')||null,
        expiresAt:f.get('expiresAt')||null
      })});
      e.currentTarget.reset();
      await load();
    }catch(x){alert(x.message)}
  }

  return `<div class="admin-page" dir="rtl">
    <div class="admin-title"><div><h2>کدهای تخفیف</h2><span class="muted">ساخت و مدیریت کدهای تخفیف</span></div></div>
    <div id="coupon-error" class="error"></div>
    <div class="panel"><form id="coupon-form" class="form">
      <div class="form-grid">
        <label>کد<input name="code" required maxlength="40"></label>
        <label>نوع<select name="kind"><option value="PERCENT">درصدی</option><option value="FIXED">مبلغ ثابت</option></select></label>
        <label>مقدار<input name="value" type="number" min="0" required></label>
        <label>حداکثر استفاده<input name="maxUses" type="number" min="1"></label>
        <label>انقضا<input name="expiresAt" type="datetime-local"></label>
      </div>
      <button class="btn primary">ثبت کد تخفیف</button>
    </form></div>
    <div class="panel"><div class="table-scroll"><table class="admin-table"><thead><tr><th>کد</th><th>نوع</th><th>مقدار</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="coupon-table"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div></div>
  </div>`;
}
