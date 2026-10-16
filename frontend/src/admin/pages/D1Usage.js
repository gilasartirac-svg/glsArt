import {api} from '../services/api.js';

const fmt=n=>new Intl.NumberFormat('fa-IR').format(Math.max(0,Number(n)||0));
const pct=n=>new Intl.NumberFormat('fa-IR',{maximumFractionDigits:2}).format(Number(n)||0);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export default function D1Usage(){
 setTimeout(load,0);
 async function load(){
  const status=document.querySelector('#d1-usage-status');
  const button=document.querySelector('#d1-usage-refresh');
  if(status)status.textContent='در حال دریافت آمار واقعی Cloudflare…';
  if(button)button.disabled=true;
  try{
   const d=await api('/api/admin/d1-usage');
   const read=Number(d.rowsRead||0),limit=Number(d.limit||5000000),remaining=Number(d.remaining??Math.max(0,limit-read)),percent=Number(d.percent||0);
   const el=(id)=>document.querySelector('#'+id);
   if(el('d1-usage-read'))el('d1-usage-read').textContent=fmt(read);
   if(el('d1-usage-remaining'))el('d1-usage-remaining').textContent=fmt(remaining);
   if(el('d1-usage-written'))el('d1-usage-written').textContent=fmt(d.rowsWritten);
   if(el('d1-usage-percent'))el('d1-usage-percent').textContent=pct(percent)+'٪';
   if(el('d1-usage-progress')){el('d1-usage-progress').value=Math.min(100,percent);el('d1-usage-progress').setAttribute('aria-valuenow',String(Math.min(100,percent)))}
   if(el('d1-usage-checked'))el('d1-usage-checked').textContent=d.checkedAt?new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(new Date(d.checkedAt)):'—';
   const state=percent>=95?'بحرانی':percent>=80?'هشدار جدی':percent>=60?'هشدار':'عادی';
   if(el('d1-usage-state'))el('d1-usage-state').textContent=state;
   if(el('d1-usage-hourly'))el('d1-usage-hourly').innerHTML=(d.groups||[]).slice(0,10).map(x=>'<tr><td>'+esc(x.hour||'—')+'</td><td>'+fmt(x.rowsRead)+'</td><td>'+fmt(x.rowsWritten)+'</td><td>'+esc(String(x.query||'').slice(0,80)||'—')+'</td></tr>').join('')||'<tr><td colspan="4">داده ساعتی در دسترس نیست.</td></tr>';
   if(status)status.textContent='آمار از Cloudflare GraphQL دریافت شد. سهمیه در ساعت ۰۰:۰۰ UTC بازنشانی می‌شود.';
  }catch(e){
   if(status)status.textContent=String(e?.message||'دریافت آمار ناموفق بود. اگر تنظیمات Analytics انجام نشده باشد، Secretهای لازم باید در Worker تنظیم شوند.');
  }finally{if(button)button.disabled=false}
 }
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><div class="eyebrow">CLOUDFLARE • D1 ANALYTICS</div><h2>پایش مصرف دیتابیس D1</h2><span class="muted">آمار روز جاری بر پایه UTC؛ سقف مرجع طرح رایگان ۵٬۰۰۰٬۰۰۰ ردیف خوانده‌شده.</span></div><button id="d1-usage-refresh" type="button" class="btn primary">به‌روزرسانی آمار</button></div><div class="offline-snapshot-grid"><section class="panel"><div class="eyebrow">ROWS READ TODAY</div><h3 id="d1-usage-read">—</h3><p>مجموع ردیف‌های خوانده‌شده</p></section><section class="panel"><div class="eyebrow">REMAINING</div><h3 id="d1-usage-remaining">—</h3><p>باقی‌مانده تا سقف روزانه</p></section><section class="panel"><div class="eyebrow">ROWS WRITTEN</div><h3 id="d1-usage-written">—</h3><p>ردیف‌های نوشته‌شده امروز</p></section><section class="panel"><div class="eyebrow">USAGE</div><h3 id="d1-usage-percent">—</h3><progress id="d1-usage-progress" max="100" value="0" aria-label="درصد مصرف روزانه"></progress><p>وضعیت: <strong id="d1-usage-state">—</strong></p></section></div><div class="panel"><div class="sectionhead"><h3>بیشترین مصرف‌های ثبت‌شده</h3><span class="muted">بر اساس گروه‌های آماری GraphQL</span></div><div class="table-scroll"><table class="admin-table"><thead><tr><th>ساعت UTC</th><th>Rows read</th><th>Rows written</th><th>مشخصه کوئری / گروه</th></tr></thead><tbody id="d1-usage-hourly"><tr><td colspan="4">در حال دریافت…</td></tr></tbody></table></div><p class="muted">آخرین بررسی: <span id="d1-usage-checked">—</span></p></div><div id="d1-usage-status" class="notice" role="status" aria-live="polite">آماده دریافت آمار</div><div class="notice">این صفحه آمار Analytics را نمایش می‌دهد؛ مقدار «باقی‌مانده» محاسبه‌ای بر اساس سقف مرجع است و جایگزین شمارنده رسمی محدودیت‌های Cloudflare نیست. در صورت تأخیر Analytics، عدد ممکن است با مصرف لحظه‌ای تفاوت داشته باشد.</div></div>';
}
export async function mount(){document.querySelector('#d1-usage-refresh')?.addEventListener('click',load);}
