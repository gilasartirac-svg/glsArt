import {setupDataGrid} from '../components/Table.js';
import {admin,api} from '../services/api.js?v=20260929-orders';
import {openInvoice} from '../../invoice.js?v=20260929-invoice-4';
const ADMIN_API=window.GILASART_API||((location.hostname==='gilasart.ir'||location.hostname==='www.gilasart.ir')?'https://api.gilasart.ir':'https://gilasartworker.gilasart-ir-ac.workers.dev');

const STATUS_LABELS={
 PENDING:'در انتظار پرداخت',
 PAID:'پرداخت شد',
 PROCESSING:'در حال پردازش',
 SHIPPED:'ارسال شد',
 DELIVERED:'تحویل شد',
 CANCELLED:'لغو شد',
 FAILED:'ناموفق'
};
const statusLabel=s=>STATUS_LABELS[String(s||'').toUpperCase()]||String(s||'نامشخص');
const money=v=>new Intl.NumberFormat('fa-IR').format(Number(v||0));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateFa=v=>{if(!v)return '-';const d=new Date(String(v).replace(' ','T')+(String(v).endsWith('Z')?'':'Z'));return Number.isNaN(d.getTime())?esc(v):new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'medium',timeStyle:'short'}).format(d)};
const optionHtml=s=>Object.entries(STATUS_LABELS).map(([k,v])=>'<option value="'+k+'" '+(s===k?'selected':'')+'>'+v+'</option>').join('');

export default function Orders(){
 let rows=[];
 let selectedId='';
 const markup=`
 <div class="admin-page orders-admin" dir="rtl">
  <div class="admin-title orders-title">
   <div><h2>سفارشات</h2><span class="muted">مدیریت، پیگیری و تغییر وضعیت سفارش مشتریان</span></div>
   <button id="orders-refresh" class="btn ghost" type="button">به‌روزرسانی</button>
  </div>
  <div id="orders-error" class="error"></div>
  <div class="orders-layout">
   <section class="panel orders-master">
    <div class="orders-master-head"><div><strong>آخرین سفارش‌ها</strong><small>برای مشاهده جزئیات، یک ردیف را انتخاب کنید.</small></div><span id="orders-count" class="orders-count">۰ سفارش</span></div>
    <div class="orders-table-wrap">
     <table class="admin-table orders-table">
      <thead><tr><th>سفارش</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th><th>فیش واریزی</th><th>ثبت</th><th>فاکتور</th></tr></thead>
      <tbody id="orders-grid"><tr><td colspan="7">در حال دریافت...</td></tr></tbody>
     </table>
    </div>
   </section>
  </div>
  <style>
   .orders-admin .order-modal[hidden]{display:none!important}
   .orders-admin .order-modal{position:fixed;inset:0;z-index:10000;display:grid;place-items:center;padding:clamp(8px,2vw,24px);background:rgba(15,13,10,.68);backdrop-filter:blur(5px)}
   .orders-admin .order-modal-dialog{position:relative;display:flex;flex-direction:column;width:min(100%,980px);max-height:min(92dvh,900px);overflow:hidden;border:1px solid var(--ui-line,#d7c8ae);border-radius:18px;background:var(--ui-surface,#fff);color:var(--ui-text,#29241d);box-shadow:0 24px 90px rgba(0,0,0,.35)}
   .orders-admin .order-modal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--ui-line,#d7c8ae);background:var(--ui-surface-2,#f7f3ec)}
   .orders-admin .order-modal-head strong{font-size:1.05rem}
   .orders-admin .order-modal-close{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border:1px solid var(--ui-line,#d7c8ae);border-radius:12px;background:transparent;color:inherit;font-size:25px;cursor:pointer}
   .orders-admin .order-modal-body{padding:clamp(12px,2vw,24px);overflow:auto;overscroll-behavior:contain}
   .orders-admin .order-modal-body .order-detail{border:0;box-shadow:none;padding:0;background:transparent}
   .orders-admin .order-modal-body .order-detail-head{gap:12px;flex-wrap:wrap}
   .orders-admin .order-modal-body .receipt-review-preview{max-width:100%;overflow:auto}
   .orders-admin .order-modal-close:focus-visible{outline:3px solid var(--ui-gold,#9b742d);outline-offset:3px}
   @media(max-width:600px){.orders-admin .order-modal{padding:0;align-items:end}.orders-admin .order-modal-dialog{width:100%;max-height:96dvh;border-radius:18px 18px 0 0}.orders-admin .order-modal-head{padding:10px 14px}.orders-admin .order-modal-body{padding:12px}.orders-admin .order-modal-body .order-detail-grid{grid-template-columns:1fr 1fr}.orders-admin .order-modal-body .order-detail-actions{flex-wrap:wrap}}
   @media(prefers-reduced-motion:no-preference){.orders-admin .order-modal-dialog{animation:orders-modal-enter .18s ease-out}@keyframes orders-modal-enter{from{opacity:.6;transform:translateY(10px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}}
  </style>
  <div id="order-detail-modal" class="order-modal" hidden>
   <section class="order-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="order-modal-title">
    <header class="order-modal-head"><strong id="order-modal-title">جزئیات سفارش مشتری</strong><button type="button" class="order-modal-close" id="order-modal-close" aria-label="بستن پنجره جزئیات">×</button></header>
    <div class="order-modal-body"><aside id="order-detail" class="order-detail" aria-live="polite"><div class="order-detail-empty"><strong>در حال آماده‌سازی جزئیات سفارش…</strong></div></aside></div>
   </section>
  </div>
 </div>`;
 setTimeout(()=>mount(),0);
 async function mount(){
  const liveRoot=document.querySelector('#admin-page .orders-admin');
  if(!liveRoot)return;
  const grid=liveRoot.querySelector('#orders-grid');
  const detail=liveRoot.querySelector('#order-detail');
  const modal=liveRoot.querySelector('#order-detail-modal');
  const modalClose=liveRoot.querySelector('#order-modal-close');
  const error=liveRoot.querySelector('#orders-error');
  const count=liveRoot.querySelector('#orders-count');
  const refresh=liveRoot.querySelector('#orders-refresh');
  async function load(){
   error.textContent='';
   grid.innerHTML='<tr><td colspan="7">در حال دریافت سفارش‌ها...</td></tr>';
   try{
    const d=await admin.orders();
    rows=d.items||[];
    count.textContent=new Intl.NumberFormat('fa-IR').format(rows.length)+' سفارش';
    grid.innerHTML=rows.map(o=>`
     <tr class="order-master-row ${o.id===selectedId?'is-selected':''}" data-id="${esc(o.id)}">
      <td><strong>#${esc(String(o.id).slice(-8))}</strong><small>${esc(o.id)}</small></td>
      <td><strong>${esc(o.mobile||'-')}</strong><small>${esc(o.name||'مشتری')}</small></td>
      <td><strong>${money(o.total_irt)}</strong><small>تومان</small></td>
      <td><select class="order-status" data-id="${esc(o.id)}" aria-label="وضعیت سفارش">${optionHtml(o.status)}</select></td>
      <td>${o.provider==='card_transfer'&&o.receipt_status&&o.receipt_status!=='NONE'?'<button type="button" class="btn primary order-receipt-btn" data-id="'+esc(o.id)+'">مشاهده فیش · '+esc(o.receipt_status)+'</button>':'<span class="muted">—</span>'}</td>
      <td><span class="order-date">${dateFa(o.created_at)}</span></td>
      <td><button type="button" class="btn ghost order-invoice-btn" data-id="${esc(o.id)}">${String(o.status)==='PENDING'?'پیش‌فاکتور':'فاکتور'}</button></td>
     </tr>`).join('')||'<tr><td colspan="7">سفارشی وجود ندارد.</td></tr>';
    if(!grid.closest('table').dataset.gridReady)setupDataGrid(grid.closest('table').querySelector('tbody').id,{dateColumns:[]});
    bindRows();
    if(selectedId&&rows.some(x=>x.id===selectedId))await showDetail(selectedId);
   }catch(e){grid.innerHTML='<tr><td colspan="7" class="error-cell">دریافت سفارش‌ها انجام نشد.</td></tr>';error.textContent=e.message||'خطا در دریافت اطلاعات';}
  }
  function bindRows(){
   grid.querySelectorAll('.order-master-row').forEach(row=>row.onclick=async e=>{
    if(e.target.closest('select,button,a'))return;
    await showDetail(row.dataset.id);
   });
   grid.querySelectorAll('.order-receipt-btn').forEach(btn=>btn.onclick=async e=>{e.stopPropagation();await showDetail(btn.dataset.id);});
   grid.querySelectorAll('.order-invoice-btn').forEach(btn=>btn.onclick=async e=>{e.stopPropagation();const w=window.open('about:blank','_blank','width=1000,height=900');try{const d=await admin.order(btn.dataset.id);openInvoice({...d.order,items:d.items||[]},d.invoice||{},w);}catch(err){try{w?.close()}catch{}error.textContent=err.message||'فاکتور دریافت نشد.';}});
   grid.querySelectorAll('.order-status').forEach(sel=>sel.onchange=async e=>{
    e.stopPropagation();
    const id=sel.dataset.id,old=rows.find(x=>x.id===id)?.status,next=sel.value;
    sel.disabled=true;
    try{
     const r=await api('/api/admin/orders/'+encodeURIComponent(id)+'/status',{method:'PUT',body:JSON.stringify({status:next})});
     if(r.changed!==false){const item=rows.find(x=>x.id===id);if(item)item.status=next;}
     await showDetail(id);
     bindRows();
    }catch(err){sel.value=old||sel.value;error.textContent=err.message||'تغییر وضعیت انجام نشد.';}
    finally{sel.disabled=false;}
   });
  }
  async function showDetail(id){
   selectedId=id;
   modal.hidden=false;
   document.body.style.overflow='hidden';
   modalClose?.focus({preventScroll:true});
   grid.querySelectorAll('.order-master-row').forEach(r=>r.classList.toggle('is-selected',r.dataset.id===id));
   detail.innerHTML='<div class="order-detail-loading">در حال دریافت جزئیات سفارش…</div>';
   try{
    const d=await admin.order(id),o=d.order||{},items=d.items||[],history=d.history||[],p=d.payment;
    const receiptHtml=(p?.provider==='card_transfer'&&p?.receipt_status&&p.receipt_status!=='NONE')?'<section class="order-detail-section card-transfer-receipt-admin"><h4>فیش واریزی کارت به کارت</h4><div class="receipt-review-box"><div class="receipt-review-preview" data-admin-receipt-preview="'+esc(o.id)+'" aria-live="polite"><span>در حال دریافت تصویر فیش…</span></div><div class="receipt-review-meta"><span>وضعیت: <b>'+esc(p.receipt_status)+'</b></span><span>حجم: '+money(p.receipt_size)+' بایت</span><span>ارسال: '+dateFa(p.receipt_uploaded_at)+'</span>'+(p.receipt_status==='PENDING_REVIEW'?'<div class="receipt-review-actions"><span class="receipt-review-pending">فیش آماده بررسی مدیر است.</span><button id="approve-card-receipt" class="btn primary" type="button">تأیید و ثبت پرداخت</button><button id="reject-card-receipt" class="btn ghost danger" type="button">رد فیش</button></div>':p.receipt_status==='APPROVED'?'<span class="ok">پرداخت تأیید شده است.</span>':p.receipt_status==='REJECTED'?'<div class="receipt-rejected"><span class="error">فیش رد شده است.</span><small>دلیل: '+esc(p.receipt_rejection_reason||'بدون توضیح')+'</small></div>':'<span>فیش در وضعیت '+esc(p.receipt_status)+'</span>')+'</div></div></section>':'';
    detail.innerHTML=`
     <div class="order-detail-head">
      <div><span class="order-detail-kicker">سفارش</span><h3>#${esc(String(o.id||'').slice(-8))}</h3><small>${esc(o.id||'')}</small></div>
      <div class="order-detail-actions"><button id="order-detail-invoice" class="btn primary" type="button">▣ ${o.status==='PENDING'?'پیش‌فاکتور':'فاکتور فروش'}</button><span class="order-status-badge status-${esc(String(o.status||'').toLowerCase())}">${esc(statusLabel(o.status))}</span></div>
     </div>
     <div class="order-detail-grid">
      <div><span>مشتری</span><b>${esc(o.name||'مشتری')}</b><small>${esc(o.mobile||'-')}</small></div>
      <div><span>مبلغ نهایی</span><b>${money(o.total_irt)} تومان</b><small>ثبت: ${dateFa(o.created_at)}</small></div>
      <div><span>پرداخت</span><b>${esc(p?.status||'-')}</b><small>${p?.paid_at?'پرداخت: '+dateFa(p.paid_at):'هنوز پرداخت نشده'}</small></div>
      <div><span>گیرنده</span><b>${esc(o.recipient_name||o.name||'-')}</b><small>${esc(o.address_mobile||o.mobile||'-')}</small></div>
     </div>
     <section class="order-detail-section"><h4>اقلام سفارش</h4><div class="order-items-list">${items.map(x=>'<div class="order-item"><div><b>'+esc(x.name)+'</b><small>'+esc(x.sku||'')+' · تعداد '+esc(x.quantity)+'</small></div><strong>'+money(x.line_total_irt)+' تومان</strong></div>').join('')||'<div class="order-empty">آیتمی ثبت نشده است.</div>'}</div></section>
     <section class="order-detail-section"><h4>تاریخچه وضعیت</h4><div class="order-history">${history.length?history.map(h=>'<div class="order-history-row"><i></i><div><b>'+esc(statusLabel(h.to_status))+'</b><small>'+dateFa(h.changed_at)+(h.changed_by_name?' · توسط '+esc(h.changed_by_name):'')+'</small></div></div>').join(''):'<div class="order-empty">تاریخچه‌ای ثبت نشده است.</div>'}</div></section>
     ${receiptHtml}
     ${o.city||o.address?'<section class="order-detail-section"><h4>نشانی ارسال</h4><p class="order-address">'+esc([o.province,o.city,o.address].filter(Boolean).join('، '))+'</p></section>':''}`;
    const receiptPreview=detail.querySelector('[data-admin-receipt-preview]');
    if(receiptPreview){
     try{
      const response=await fetch(ADMIN_API+'/api/admin/orders/'+encodeURIComponent(o.id)+'/payment-receipt',{credentials:'include',cache:'no-store'});
      if(!response.ok)throw new Error('receipt_preview_unavailable');
      const blob=await response.blob();
      if(!String(blob.type||'').startsWith('image/'))throw new Error('receipt_preview_invalid');
      const image=document.createElement('img');image.alt='فیش واریزی سفارش';image.loading='lazy';image.src=URL.createObjectURL(blob);
      receiptPreview.replaceChildren(image);
     }catch{receiptPreview.textContent='تصویر فیش دریافت نشد؛ نشست مدیریت و دسترسی orders.read را بررسی کنید.';}
    }
   }catch(e){detail.innerHTML='<div class="order-detail-empty"><strong>جزئیات سفارش دریافت نشد.</strong><p>'+esc(e.message||'خطای سرور')+'</p></div>';}
  }
  const closeModal=()=>{modal.hidden=true;document.body.style.overflow='';};
  modalClose.onclick=closeModal;
  modal.onclick=e=>{if(e.target===modal)closeModal();};
  const onModalKeydown=e=>{if(e.key==='Escape'&&!modal.hidden)closeModal();};
  document.addEventListener('keydown',onModalKeydown);
  refresh.onclick=load;
  document.addEventListener('click',async e=>{
   if(e.target?.id==='order-detail-invoice'){const w=window.open('about:blank','_blank','width=1000,height=900');admin.order(selectedId).then(d=>{if(['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(d.order?.status||'').toUpperCase()))openInvoice({...d.order,items:d.items||[]},d.invoice||{},w);else{try{w?.close()}catch{}}}).catch(err=>{try{w?.close()}catch{}error.textContent=err.message||'فاکتور دریافت نشد.'})}
   if(e.target?.id==='reject-card-receipt'){
    const b=e.target,reason=window.prompt('دلیل رد فیش را وارد کنید:','تصویر فیش قابل تأیید نیست. لطفاً فیش صحیح و خوانا را دوباره ارسال کنید.');
    if(!reason?.trim())return;
    b.disabled=true;b.textContent='در حال ثبت رد…';
    try{await api('/api/admin/orders/'+encodeURIComponent(selectedId)+'/payment-receipt/reject',{method:'POST',body:JSON.stringify({reason:reason.trim()})});await load();await showDetail(selectedId);}
    catch(err){error.textContent=err.message||'رد فیش انجام نشد.';b.disabled=false;b.textContent='رد فیش';}
   }
   if(e.target?.id==='approve-card-receipt'){
    const b=e.target;b.disabled=true;b.textContent='در حال تأیید…';
    try{await api('/api/admin/orders/'+encodeURIComponent(selectedId)+'/payment-receipt/approve',{method:'POST'});await load();await showDetail(selectedId);}
    catch(err){error.textContent=err.message||'تأیید فیش انجام نشد.';b.disabled=false;b.textContent='تأیید و ثبت پرداخت';}
   }
  });
  await load();
 }
 return markup;
}
