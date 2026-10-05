export default function Sidebar(){
  const hashCurrent=location.hash.startsWith('#/admin/')?location.hash.replace('#/admin/',''):'';
  const pathCurrent=location.pathname.replace(/^.*\/admin\/?/,'').replace(/\/$/,'');
  const current=hashCurrent||pathCurrent||'dashboard';
  const items=[
    ['dashboard','داشبورد','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h7V3H3v9Zm11 9h7v-9h-7v9ZM3 21h7v-5H3v5Zm11-18v5h7V3h-7Z"/></svg>'],
    ['products','محصولات','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z M8 8h8v8H8z"/></svg>'],
    ['categories','دسته‌بندی‌ها','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 21 8 12 13 3 8 12 3Zm0 8 9 5-9 5-9-5 9-5Z"/></svg>'],
    ['orders','سفارشات','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h4"/></svg>'],
    ['site-rules','قوانین سایت','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12v18H6z M9 7h6 M9 11h6 M9 15h6"/></svg>'],
    ['customers','مشتریان','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0"/></svg>'],
    ['inventory','موجودی','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v14H4z M8 9h8 M8 13h8 M8 17h5"/></svg>'],
    ['payments','پرداخت‌ها','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 6h16v12H4z M7 10h10 M8 14h4"/></svg>'],
    ['discounts','تخفیف‌ها','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10v16H7z M9 8h6 M9 12h6 M9 16h3"/></svg>'],
    ['coupons','کوپن‌ها','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 6h14v12H5z M8 10h8 M8 14h5"/></svg>'],
    ['reviews','نظرات کاربران','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 14.8 8.7 21 9.6 16.5 14 17.6 20 12 17 6.4 20 7.5 14 3 9.6 9.2 8.7 12 3Z"/></svg>'],
    ['reports','گزارش‌ها','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 19V9 M12 19V5 M19 19v-7"/></svg>'],
    ['access-control','سطح دسترسی','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 20 7v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4Z M9 12l2 2 4-4"/></svg>'],
    ['audit','لاگ سیستم','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 7v5l3 2 M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/></svg>'],
    ['settings','SEO و تنظیمات','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0-5v2m0 14v2M3 12h2m14 0h2M5.6 5.6l1.4 1.4m10 10 1.4 1.4M18.4 5.6 17 7m-10 10-1.4 1.4"/></svg>'],
    ['invoice-settings','تنظیمات فاکتور','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 3h14v18H5z M8 7h8 M8 11h8 M8 15h5"/></svg>'],
    ['sms','سیستم پیامکی','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H7l-3 3V5Z M8 9h8"/></svg>'],
    ['payment','درگاه زرین‌پال','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18v12H3z M7 10h10 M7 14h4"/></svg>'],
    ['visitors','بازدیدکنندگان','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-13v5l3 2"/></svg>'],
    ['storefront-snapshot','آفلاین‌سازی فروشگاه','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v11m0 0-4-4m4 4 4-4M5 17v3h14v-3"/></svg>'],
    ['support','تیکت‌های پشتیبانی','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v12H8l-4 4V5Z M8 9h8"/></svg>'],
    ['about','درباره ما','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v16 M8 8h8 M8 16h6"/></svg>'],
    ['contact','تماس با ما','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v14H4z M7 8h10 M7 12h7 M7 16h5"/></svg>'],
    ['news','اخبار گیلاس آرت','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v14H4z M7 8h4v4H7z M13 8h4 M13 12h4 M7 16h10"/></svg>'],
    ['articles','مقالات','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h14v16H5z M8 8h8 M8 12h8 M8 16h5"/></svg>']
  ];
  return `<button class="admin-mobile-menu" id="admin-mobile-menu" type="button" aria-label="باز کردن منوی مدیریت" aria-controls="admin-mobile-drawer" aria-expanded="false"><span></span><span></span><span></span></button>
  <div class="admin-mobile-backdrop" id="admin-mobile-backdrop" aria-hidden="true"></div>
  <nav class="admin-sidebar" id="admin-mobile-drawer" dir="rtl">
    <div class="admin-brand"><span class="admin-brand-mark">G</span><span class="admin-brand-copy"><strong>گیلاس آرت</strong><small>GILAS ART / ADMIN</small></span></div><div class="admin-nav-label">مدیریت فروشگاه</div>
    <div class="admin-nav-group">${items.map(([id,label,icon])=>`<a href="/admin/${id}" data-admin-route="${id}" class="${current===id?'active':''}" ${current===id?'aria-current="page"':''}><span class="admin-nav-icon" aria-hidden="true">${icon}</span><span>${label}</span></a>`).join('')}</div>
    <a class="admin-back" href="/"><span class="admin-nav-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span><span>بازگشت به فروشگاه</span></a>
  </nav>`;
}
