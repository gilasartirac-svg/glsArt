import {admin} from '../services/api.js?v=20260928.3';

const money=(v)=>new Intl.NumberFormat('fa-IR').format(Number(v)||0);
const esc=(v)=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const statusLabel=(s)=>({PENDING:'در انتظار',PAID:'پرداخت‌شده',PROCESSING:'در حال پردازش',SHIPPED:'ارسال‌شده',DELIVERED:'تحویل‌شده',CANCELLED:'لغوشده'}[s]||s||'—');
const statusClass=(s)=>String(s||'').toLowerCase();

export default function Dashboard(){
 setTimeout(async()=>{
  const root=document.querySelector('.admin-dashboard');
  if(!root)return;
  try{
   const [stats,sales,orders,inventory]=await Promise.all([
    admin.stats(),
    admin.reports(),
    admin.orders(),
    admin.inventory()
   ]);
   const items=Array.isArray(sales?.items)?sales.items:[];
   const orderItems=Array.isArray(orders?.items)?orders.items:[];
   const stockItems=Array.isArray(inventory?.items)?inventory.items:[];
   const lowStock=stockItems.filter(x=>Number(x.quantity||0)<=5).slice(0,6);
   const recentOrders=orderItems.slice(0,6);
   const points=items.slice(0,14).reverse();
   const max=Math.max(...points.map(x=>Number(x.revenue_irt)||0),1);
   const chart=root.querySelector('#sales-chart');
   if(chart){
    chart.innerHTML=points.length?points.map(x=>`<div class="dashboard-chart-col"><div class="dashboard-chart-value">${money(x.revenue_irt)}</div><div class="dashboard-chart-bar"><i style="height:${Math.max(5,Math.round((Number(x.revenue_irt)||0)/max*100))}%"></i></div><small>${esc(x.day||'')}</small></div>`).join(''):'<div class="dashboard-empty">هنوز داده‌ای برای نمودار فروش ثبت نشده است.</div>';
   }
   const ordersEl=root.querySelector('#recent-orders');
   if(ordersEl)ordersEl.innerHTML=recentOrders.length?recentOrders.map(o=>`<article class="dashboard-order"><div><strong>#${esc(o.id)}</strong><span>${esc(o.mobile||'—')}</span></div><div><b>${money(o.total_irt)} تومان</b><em class="dashboard-status ${statusClass(o.status)}">${esc(statusLabel(o.status))}</em></div></article>`).join(''):'<div class="dashboard-empty">سفارشی برای نمایش وجود ندارد.</div>';
   const stockEl=root.querySelector('#low-stock');
   if(stockEl)stockEl.innerHTML=lowStock.length?lowStock.map(x=>`<article class="dashboard-stock"><div><strong>${esc(x.name)}</strong><small>${esc(x.sku||'بدون SKU')}</small></div><b class="${Number(x.quantity||0)===0?'danger':''}">${money(x.quantity)} عدد</b></article>`).join(''):'<div class="dashboard-empty">موجودی بحرانی یا کم وجود ندارد.</div>';
   root.querySelector('#dashboard-refresh')?.addEventListener('click',()=>location.reload());
  }catch(e){
   console.error('dashboard load error',e);
   root.querySelectorAll('.dashboard-loading').forEach(x=>x.textContent='دریافت اطلاعات با خطا مواجه شد.');
  }
 },0);

 return `
 <div class="admin-page dashboard admin-dashboard" dir="rtl">
  <div class="dashboard-hero">
   <div><span class="dashboard-kicker">GILAS ART / ADMIN</span><h2>داشبورد فروشگاه</h2><p>نمایی سریع از وضعیت فروش، سفارش‌ها و موجودی فروشگاه.</p></div>
   <button id="dashboard-refresh" class="btn ghost" type="button">↻ بروزرسانی</button>
  </div>
  <section class="dashboard-kpis">
   <article class="dashboard-kpi"><span>فروش امروز</span><strong id="today-sales">—</strong><small>تومان</small></article>
   <article class="dashboard-kpi"><span>فروش کل</span><strong id="month-sales">—</strong><small>تومان</small></article>
   <article class="dashboard-kpi"><span>کل سفارش‌ها</span><strong id="orders-count">—</strong><small>سفارش</small></article>
   <article class="dashboard-kpi"><span>کاربران</span><strong id="users-count">—</strong><small>کاربر</small></article>
  </section>
  <section class="dashboard-main-grid">
   <article class="dashboard-panel dashboard-chart-panel">
    <div class="dashboard-panel-head"><div><h3>روند فروش</h3><p>۱۴ روز اخیر دارای فروش</p></div><span class="dashboard-live-dot">LIVE</span></div>
    <div id="sales-chart" class="dashboard-chart"><div class="dashboard-loading">در حال دریافت...</div></div>
   </article>
   <article class="dashboard-panel">
    <div class="dashboard-panel-head"><div><h3>سفارش‌های اخیر</h3><p>آخرین فعالیت‌های فروشگاه</p></div><a href="#/admin/orders" class="dashboard-link">مشاهده همه</a></div>
    <div id="recent-orders" class="dashboard-list"><div class="dashboard-loading">در حال دریافت...</div></div>
   </article>
  </section>
  <section class="dashboard-main-grid dashboard-secondary-grid">
   <article class="dashboard-panel">
    <div class="dashboard-panel-head"><div><h3>موجودی کم</h3><p>محصولاتی که نیاز به بررسی دارند</p></div><a href="#/admin/inventory" class="dashboard-link">مدیریت موجودی</a></div>
    <div id="low-stock" class="dashboard-list"><div class="dashboard-loading">در حال دریافت...</div></div>
   </article>
   <article class="dashboard-panel dashboard-health">
    <div class="dashboard-panel-head"><div><h3>وضعیت فروشگاه</h3><p>شاخص‌های عملیاتی</p></div></div>
    <div class="dashboard-health-row"><span><i></i>API فروشگاه</span><b>فعال</b></div>
    <div class="dashboard-health-row"><span><i></i>پنل مدیریت</span><b>فعال</b></div>
    <div class="dashboard-health-row"><span><i></i>داده‌های فروش</span><b>متصل</b></div>
   </article>
  </section>
 </div>`;
}