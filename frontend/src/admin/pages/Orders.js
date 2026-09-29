import {setupDataGrid} from '../components/Table.js';
import {admin,api} from '../services/api.js?v=20260929-orders';
import {openInvoice} from '../../invoice.js?v=20260929-invoice';

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
      <thead><tr><th>سفارش</th><th>مشتری</th><th>مبلغ</th><th>وضعیت</th><th>ثبت</th><th>فاکتور</th></tr></thead>
      <tbody id="orders-grid"><tr><td colspan="6">در حال دریافت...</td></tr></tbody>
     </table>
    </div>
   </section>
   <aside id="order-detail" class="panel order-detail" aria-live="polite">
    <div class="order-detail-empty"><span>‹</span><strong>جزئیات سفارش</strong><p>برای نمایش اطلاعات، یک سفارش را از جدول انتخاب کنید.</p></div>
   </aside>
  </div>
 </div>`;
 setTimeout(()=>mount(),0);
 async function mount(){
  const liveRoot=document.querySelector('#admin-page .orders-admin');
  if(!liveRoot)return;
  const grid=liveRoot.querySelector('#orders-grid');
  const detail=liveRoot.querySelector('#order-detail');
  const error=liveRoot.querySelector('#orders-error');
  const count=liveRoot.querySelector('#orders-count');
  const refresh=liveRoot.querySelector('#orders-refresh');
  async function load(){
   error.textContent='';
   grid.innerHTML='<tr><td colspan="6">در حال دریافت سفارش‌ها...</td></tr>';
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
      <td><span class="order-date">${dateFa(o.created_at)}</span></td>
      <td><button type="button" class="btn ghost order-invoice-btn" data-id="${esc(o.id)}" title="نمایش و چاپ فاکتور">فاکتور</button></td>
     </tr>`).join('')||'<tr><td colspan="6">سفارشی وجود ندارد.</td></tr>';
    if(!grid.closest('table').dataset.gridReady)setupDataGrid(grid.closest('table').querySelector('tbody').id,{dateColumns:[]});
    bindRows();
    if(selectedId&&rows.some(x=>x.id===selectedId))await showDetail(selectedId);
   }catch(e){grid.innerHTML='<tr><td colspan="6" class="error-cell">دریافت سفارش‌ها انجام نشد.</td></tr>';error.textContent=e.message||'خطا در دریافت اطلاعات';}
  }
  function bindRows(){
   grid.querySelectorAll('.order-master-row').forEach(row=>row.onclick=async e=>{
    if(e.target.closest('select,button,a'))return;
    await showDetail(row.dataset.id);
   });
   grid.querySelectorAll('.order-invoice-btn').forEach(btn=>btn.onclick=async e=>{e.stopPropagation();await showInvoice(btn.dataset.id)});
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
  async function showInvoice(id){
   try{
    const d=await admin.order(id),o=d.order||{},items=d.items||[],p=d.payment||{},cfg=d.invoice||{};
    const paid=['PAID','PROCESSING','SHIPPED','DELIVERED'].includes(String(o.status||'').toUpperCase())||String(p.status||'').toUpperCase()==='PAID';
    const title=paid?'فاکتور فروش':'پیش فاکتور فروش';
    const rows=items.map(x=>'<tr><td>'+esc(x.name)+'</td><td>'+esc(x.sku||'-')+'</td><td>'+esc(x.quantity)+'</td><td>'+money(x.unit_price_irt)+'</td><td>'+money(x.line_total_irt)+'</td></tr>').join('');
    const total=money(o.total_irt);
    const logo=cfg.invoice_logo_path||'/glsArt/invoice/logo.svg',sig=cfg.invoice_signature_path||'';
    const html='<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>'+esc(title)+' - '+esc(o.id)+'</title><style>@page{size:A4;margin:12mm}body{font-family:Vazirmatn,Tahoma,Arial,sans-serif;color:#1b1a18;background:#fff;margin:0}.invoice{max-width:900px;margin:auto;padding:26px}.head{text-align:center;border-bottom:2px solid #d9a441;padding-bottom:18px}.head img{width:145px;height:auto;max-height:58px;object-fit:contain}.head h1{margin:12px 0 0;font-size:26px}.meta{display:flex;justify-content:space-between;gap:16px;margin:18px 0}.box{border:1px solid #d9d3c8;border-radius:10px;padding:12px;flex:1;line-height:2;font-size:13px}.box h3{margin:0 0 5px;font-size:14px;color:#8c6418}.items{width:100%;border-collapse:collapse;margin-top:18px}.items th,.items td{border:1px solid #d9d3c8;padding:9px;text-align:center;font-size:12px}.items th{background:#f5f1e9}.sum{margin-top:14px;display:flex;justify-content:flex-end}.sum-box{min-width:270px;border:1px solid #d9d3c8;border-radius:10px;padding:12px}.sum-box b{font-size:16px}.sign{display:flex;justify-content:flex-start;margin-top:45px;min-height:115px}.sign img{max-width:190px;max-height:110px;object-fit:contain}.muted{color:#777;font-size:11px}@media print{.invoice{padding:0}.no-print{display:none!important}}</style></head><body><article class="invoice"><header class="head"><img src="'+esc(logo)+'" onerror="this.style.display=\'none\'"><h1>'+esc(title)+'</h1></header><div class="meta"><section class="box"><h3>مشخصات فروشنده</h3><div><b>'+esc(cfg.invoice_store_name||'فروشگاه صنایع دستی گیلاس آرت')+'</b></div><div>کد اقتصادی: '+esc(cfg.invoice_economic_code||'—')+'</div><div>تلفن: '+esc(cfg.invoice_phone||'—')+' | همراه: '+esc(cfg.invoice_mobile||'—')+'</div><div>آدرس: '+esc(cfg.invoice_address||'—')+'</div></section><section class="box"><h3>مشخصات مشتری</h3><div>نام و نام خانوادگی: '+esc(o.name||o.recipient_name||'—')+'</div><div>تلفن: '+esc(o.address_mobile||o.mobile||'—')+'</div><div>آدرس: '+esc([o.province,o.city,o.address].filter(Boolean).join('، ')||'—')+'</div></section></div><div class="box"><div>شماره سفارش: <b>'+esc(o.id)+'</b></div><div>تاریخ ثبت: '+esc(dateFa(o.created_at))+'</div><div>وضعیت: <b>'+esc(statusLabel(o.status))+'</b></div></div><table class="items"><thead><tr><th>شرح سفارش</th><th>کد</th><th>تعداد</th><th>قیمت واحد</th><th>جمع</th></tr></thead><tbody>'+rows+'</tbody></table><div class="sum"><div class="sum-box">جمع کل سفارش: <b>'+total+' تومان</b></div></div><div class="sign">'+(sig?'<img src="'+esc(sig)+'" alt="مهر و امضا" onerror="this.outerHTML=\'<span class=\\\'muted\\\'>فایل مهر و امضا تنظیم نشده است.</span>\'">':'<span class="muted">فایل مهر و امضای مدیرعامل هنوز در تنظیمات فاکتور ثبت نشده است.</span>')+'</div></article><script>window.onload=()=>setTimeout(()=>window.print(),250)<\/script></body></html>';
    const w=window.open('','_blank','noopener,noreferrer,width=980,height=900');if(!w)throw new Error('مرورگر اجازه باز کردن صفحه فاکتور را نداد.');w.document.write(html);w.document.close();
   }catch(e){error.textContent=e.message||'نمایش فاکتور انجام نشد.';}
  }
  async function showDetail(id){
   selectedId=id;
   grid.querySelectorAll('.order-master-row').forEach(r=>r.classList.toggle('is-selected',r.dataset.id===id));
   detail.innerHTML='<div class="order-detail-loading">در حال دریافت جزئیات سفارش…</div>';
   try{
    const d=await admin.order(id),o=d.order||{},items=d.items||[],history=d.history||[],p=d.payment;
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
     ${o.city||o.address?'<section class="order-detail-section"><h4>نشانی ارسال</h4><p class="order-address">'+esc([o.province,o.city,o.address].filter(Boolean).join('، '))+'</p></section>':''}`;
   }catch(e){detail.innerHTML='<div class="order-detail-empty"><strong>جزئیات سفارش دریافت نشد.</strong><p>'+esc(e.message||'خطای سرور')+'</p></div>';}
  }
  refresh.onclick=load;
  document.addEventListener('click',e=>{if(e.target?.id==='order-detail-invoice'){admin.order(selectedId).then(d=>openInvoice({...d.order,items:d.items||[]},d.invoice||{})).catch(err=>{error.textContent=err.message||'فاکتور دریافت نشد.'})}});
  await load();
 }
 return markup;
}
