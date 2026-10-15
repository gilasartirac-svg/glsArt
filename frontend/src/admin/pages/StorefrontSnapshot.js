import {api} from '../services/api.js';

const scopes=[
 {id:'catalog',title:'فروشگاه و محصولات',eyebrow:'CATALOG SNAPSHOT',description:'محصولات، قیمت‌های نمایشی، دسته‌بندی‌ها، ویژگی‌ها، تصاویر و اطلاعات عمومی فروشگاه.',button:'آفلاین‌سازی فروشگاه',note:'برای تغییرات کاتالوگ فروشگاه اجرا کنید.'},
 {id:'about',title:'صفحه درباره ما',eyebrow:'ABOUT PAGE',description:'فقط محتوای «درباره ما» و تصویر اصلی همان صفحه از D1 خوانده و منتشر می‌شود.',button:'به‌روزرسانی درباره ما',note:'به محصولات و فایل‌های فروشگاه دست نمی‌زند.'},
 {id:'contact',title:'صفحه تماس با ما',eyebrow:'CONTACT PAGE',description:'فقط محتوای «تماس با ما»، تصویر، تلفن، موبایل، آدرس و نقشه به‌روزرسانی می‌شود.',button:'به‌روزرسانی تماس با ما',note:'به محصولات و فایل‌های فروشگاه دست نمی‌زند.'}
];
export default function StorefrontSnapshot(){
 return `
 <div class="admin-page offline-center" dir="rtl">
  <div class="admin-title"><div><div class="eyebrow">GILAS ART • PUBLISHING CENTER</div><h2>مرکز آفلاین‌سازی محتوا</h2><span class="muted">هر بخش را مستقل منتشر کنید؛ ویرایش یک صفحه باعث بازسازی کاتالوگ محصولات نمی‌شود.</span></div></div>
  <div class="offline-intro panel"><span class="offline-intro-mark" aria-hidden="true">GA</span><div><strong>انتشار دقیق، سریع و مستقل</strong><p>برای تغییرات روزمره فقط بخش مربوطه را اجرا کنید. هر عملیات فقط فایل‌های همان بخش را به‌روزرسانی می‌کند.</p><div class="offline-legend"><span><i class="offline-dot offline-dot-gold"></i> کاتالوگ فروشگاه</span><span><i class="offline-dot offline-dot-green"></i> صفحات محتوایی</span></div></div></div>
  <div class="offline-snapshot-grid">
   ${scopes.map((x,i)=>`<section class="panel offline-snapshot-card offline-snapshot-card-${x.id}">
    <div class="offline-card-top"><span class="offline-card-icon" aria-hidden="true">${i===0?'▦':i===1?'✦':'⌖'}</span><span class="offline-card-index">0${i+1}</span></div>
    <div class="eyebrow">${x.eyebrow}</div><h3>${x.title}</h3><p>${x.description}</p>
    <div class="offline-card-note">${x.note}</div>
    <button id="snapshot-run-${x.id}" class="btn ${x.id==='catalog'?'primary':'ghost'} offline-run" data-snapshot-scope="${x.id}" type="button">${x.button}</button>
    <div id="snapshot-message-${x.id}" class="offline-card-status" role="status" aria-live="polite">آماده اجرا</div>
   </section>`).join('')}
  </div>
  <div class="panel offline-safety"><h3>حفاظت از داده‌های عملیاتی</h3><p>این فایل‌ها فقط برای نمایش عمومی‌اند. موجودی و قیمت نهایی خرید، سبد خرید، سفارش‌ها، پرداخت‌ها و اطلاعات خصوصی همچنان از Backend و D1 اعتبارسنجی می‌شوند.</p></div>
 </div>`;
}
export async function mount(){
 document.querySelectorAll('[data-snapshot-scope]').forEach(btn=>{
  btn.addEventListener('click',async()=>{
   const scope=btn.dataset.snapshotScope,msg=document.querySelector('#snapshot-message-'+scope),label=btn.textContent;
   btn.disabled=true;btn.textContent='در حال ارسال…';
   if(msg)msg.textContent='در حال ارسال درخواست امن به GitHub Actions…';
   try{
    const r=await api('/api/admin/storefront-snapshot/trigger',{method:'POST',body:JSON.stringify({scope})});
    if(msg)msg.textContent=r?.status==='queued'?(scope==='catalog'?'آفلاین‌سازی کاتالوگ در صف اجرا قرار گرفت.':'به‌روزرسانی مستقل این صفحه در صف اجرا قرار گرفت.'):'درخواست ثبت شد؛ وضعیت اجرا را در GitHub Actions بررسی کنید.';
    if(msg)msg.dataset.state='queued';
   }catch(e){
    if(msg)msg.textContent='ارسال درخواست ناموفق بود؛ اتصال یا دسترسی مدیریت را بررسی کنید.';
    if(msg)msg.dataset.state='error';
    console.error('offline_snapshot_trigger_failed',scope,e);
   }finally{btn.disabled=false;btn.textContent=label}
  });
 });
}
