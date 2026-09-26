export default function Sidebar(){
return `
<nav class="admin-sidebar" dir="rtl">
 <div class="admin-brand">گیلاس آرت <small>GILAS ART / ADMIN</small></div>
 <div class="admin-nav-group">
  <a href="#/admin/dashboard">داشبورد</a>
  <a href="#/admin/products">محصولات</a>
  <a href="#/admin/orders">سفارشات</a>
  <a href="#/admin/customers">مشتریان</a>
  <a href="#/admin/inventory">موجودی</a>
  <a href="#/admin/payments">پرداخت‌ها</a>
  <a href="#/admin/reports">گزارش‌ها</a>
  <a href="#/admin/roles">دسترسی‌ها</a>
  <a href="#/admin/audit">لاگ سیستم</a>
  <a href="#/admin/settings">تنظیمات</a>
 </div>
 <a class="admin-back" href="#/">بازگشت به فروشگاه</a>
</nav>
`;
}
