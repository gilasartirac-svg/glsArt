export default function Sidebar(){
  const current=location.hash.replace('#/admin/','')||'dashboard';
  const items=[
    ['dashboard','داشبورد','⌂'],['products','محصولات','▣'],['categories','دسته‌بندی‌ها','◈'],['orders','سفارشات','◫'],
    ['customers','مشتریان','♙'],['inventory','موجودی','▤'],['payments','پرداخت‌ها','◇'],['discounts','تخفیف‌ها','%'],['coupons','کوپن‌ها','▱'],
    ['reviews','نظرات','✦'],['reports','گزارش‌ها','▥'],['roles','دسترسی‌ها','♢'],['audit','لاگ سیستم','◉'],['settings','SEO و تنظیمات','⚙'],['sms','سیستم پیامکی','⌁'],['payment','درگاه زرین‌پال','₿'],['visitors','بازدیدکنندگان','◌'],['support','تیکت‌های پشتیبانی','?'],['about','درباره ما','i'],['contact','تماس با ما','⌁'],['news','اخبار گیلاس آرت','◍'],['articles','مقالات','≡']
  ];
  return `<button class="admin-mobile-menu" id="admin-mobile-menu" type="button" aria-label="باز کردن منوی مدیریت" aria-controls="admin-mobile-drawer" aria-expanded="false"><span></span><span></span><span></span></button>
  <div class="admin-mobile-backdrop" id="admin-mobile-backdrop" aria-hidden="true"></div>
  <nav class="admin-sidebar" id="admin-mobile-drawer" dir="rtl">
    <div class="admin-brand"><span class="admin-brand-mark">G</span><span class="admin-brand-copy"><strong>گیلاس آرت</strong><small>GILAS ART / ADMIN</small></span></div><div class="admin-nav-label">مدیریت فروشگاه</div>
    <div class="admin-nav-group">${items.map(([id,label,icon])=>`<a href="#/admin/${id}" class="${current===id?'active':''}" ${current===id?'aria-current="page"':''}><span class="admin-nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('')}</div>
    <a class="admin-back" href="#/"><span class="admin-nav-icon" aria-hidden="true">←</span><span>بازگشت به فروشگاه</span></a>
  </nav>`;
}
