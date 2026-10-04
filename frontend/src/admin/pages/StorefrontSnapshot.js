import {api} from '../services/api.js';

export default function StorefrontSnapshot(){
 setTimeout(()=>{
  const btn=document.querySelector('#snapshot-run');
  const msg=document.querySelector('#snapshot-message');
  if(!btn)return;
  btn.addEventListener('click',()=>{
   const url='https://github.com/gilasartirac-svg/glsArt/actions/workflows/storefront-snapshot.yml';
   window.open(url,'_blank','noopener,noreferrer');
   if(msg)msg.textContent='صفحه اجرای Trigger گیت‌هاب باز شد؛ از همان صفحه «Run workflow» را اجرا کنید.';
  });
 },0);
 return `
 <div class="admin-page" dir="rtl">
  <div class="admin-title"><div><div class="eyebrow">GILAS ART • DATA</div><h2>آفلاین‌سازی اطلاعات فروشگاه</h2><span class="muted">نسخه عمومی فروشگاه روزانه از D1 استخراج و به JSON داخل GitHub Pages منتقل می‌شود.</span></div></div>
  <div class="panel">
   <div class="admin-snapshot-hero">
    <div><strong>Snapshot فروشگاه</strong><p>محصولات، تصاویر، دسته‌بندی‌ها، ویژگی‌ها و قیمت گزینه‌ها، نظرات تأییدشده، مقالات، اخبار، FAQ و تنظیمات عمومی قابل انتشار در Snapshot قرار می‌گیرند.</p></div>
    <button id="snapshot-run" class="btn primary" type="button">اجرای Trigger آفلاین‌سازی</button>
   </div>
   <div id="snapshot-message" class="notice" role="status" aria-live="polite">اجرای خودکار هر شب ساعت ۰۰:۰۰ به وقت تهران برنامه‌ریزی شده است.</div>
  </div>
  <div class="panel">
   <h3>اطلاعاتی که آفلاین نمی‌شود</h3>
   <p class="muted">موجودی واقعی، قیمت نهایی Checkout، تخفیف و کوپن، رزرو موجودی، سفارش، پرداخت، احراز هویت، OTP، آدرس و اطلاعات خصوصی کاربران و اطلاعات مدیریتی همیشه از Backend و D1 خوانده می‌شوند.</p>
  </div>
  <div class="notice">این Snapshot منبع حقیقت خرید نیست؛ فقط برای نمایش عمومی فروشگاه و کاهش درخواست‌های Cloudflare استفاده می‌شود.</div>
 </div>`;
}
