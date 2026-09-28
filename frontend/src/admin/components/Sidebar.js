export default function Sidebar(){
  const current=location.hash.replace('#/admin/','')||'dashboard';
  const items=[
    ['dashboard','داشبورد'],['products','محصولات'],['categories','دسته‌بندی‌ها'],['orders','سفارشات'],
    ['customers','مشتریان'],['inventory','موجودی'],['payments','پرداخت‌ها'],['discounts','تخفیف‌ها'],['coupons','کوپن‌ها'],
    ['reviews','نظرات'],['reports','گزارش‌ها'],['roles','دسترسی‌ها'],['audit','لاگ سیستم'],['settings','SEO و تنظیمات'],['sms','سیستم پیامکی'],['payment','درگاه زرین‌پال'],['visitors','بازدیدکنندگان'],['support','تیکت‌های پشتیبانی'],['about','درباره ما'],['contact','تماس با ما'],['news','اخبار گیلاس آرت'],['articles','مقالات']
  ];
  return `<button class="admin-mobile-menu" id="admin-mobile-menu" type="button" aria-label="باز کردن منوی مدیریت" aria-controls="admin-mobile-drawer" aria-expanded="false"><span></span><span></span><span></span></button>
  <div class="admin-mobile-backdrop" id="admin-mobile-backdrop" aria-hidden="true"></div>
  <nav class="admin-sidebar" id="admin-mobile-drawer" dir="rtl">
    <div class="admin-brand">گیلاس آرت <small>GILAS ART / ADMIN</small></div>
    <div class="admin-nav-group">${items.map(([id,label])=>`<a href="#/admin/${id}" class="${current===id?'active':''}" ${current===id?'aria-current="page"':''}>${label}</a>`).join('')}</div>
    <a class="admin-back" href="#/">بازگشت به فروشگاه</a>
  </nav>
  <script>
  (()=>{const b=document.getElementById('admin-mobile-menu'),d=document.getElementById('admin-mobile-drawer'),o=document.getElementById('admin-mobile-backdrop');if(!b||!d||!o)return;const close=()=>{d.classList.remove('open');o.classList.remove('open');b.setAttribute('aria-expanded','false');document.body.classList.remove('admin-menu-open')};b.addEventListener('click',()=>{const open=!d.classList.contains('open');d.classList.toggle('open',open);o.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));document.body.classList.toggle('admin-menu-open',open)});o.addEventListener('click',close);d.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));window.addEventListener('hashchange',close)})();
  </script>`;
}
