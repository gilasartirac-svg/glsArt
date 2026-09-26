export default function Sidebar(){
  const current=location.hash.replace('#/admin/','')||'dashboard';
  const items=[
    ['dashboard','داشبورد'],['products','محصولات'],['categories','دسته‌بندی‌ها'],['orders','سفارشات'],
    ['customers','مشتریان'],['inventory','موجودی'],['payments','پرداخت‌ها'],['coupons','تخفیف‌ها'],
    ['reviews','نظرات'],['reports','گزارش‌ها'],['roles','دسترسی‌ها'],['audit','لاگ سیستم'],['settings','SEO و تنظیمات']
  ];
  return `<nav class="admin-sidebar" dir="rtl">
    <div class="admin-brand">گیلاس آرت <small>GILAS ART / ADMIN</small></div>
    <div class="admin-nav-group">${items.map(([id,label])=>`<a href="#/admin/${id}" class="${current===id?'active':''}" ${current===id?'aria-current="page"':''}>${label}</a>`).join('')}</div>
    <a class="admin-back" href="#/">بازگشت به فروشگاه</a>
  </nav>`;
}
