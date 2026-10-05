const loaders={
 dashboard:()=>import('./pages/Dashboard.js?v=20260929-admin'),
 products:()=>import('./pages/Products.js?v=20260929-admin'),
 orders:()=>import('./pages/Orders.js?v=20260929-admin'),
 customers:()=>import('./pages/Customers.js?v=20260929-admin'),
 inventory:()=>import('./pages/Inventory.js?v=20260929-admin'),
 payments:()=>import('./pages/Payments.js?v=20260929-admin'),
 reports:()=>import('./pages/Reports.js?v=20260929-admin'),
 roles:()=>import('./pages/Roles.js?v=20260929-admin'),
 'access-control':()=>import('./pages/AccessControl.js?v=20260929-admin'),
 audit:()=>import('./pages/AuditLogs.js?v=20260929-admin'),
 settings:()=>import('./pages/Settings.js?v=20260929-admin'),
 'invoice-settings':()=>import('./pages/InvoiceSettings.js?v=20260929-admin'),
 categories:()=>import('./pages/Categories.js?v=20260929-admin'),
 coupons:()=>import('./pages/Coupons.js?v=20260929-admin'),
 reviews:()=>import('./pages/Reviews.js?v=20261001-reviews'),
 discounts:()=>import('./pages/Discounts.js?v=20260929-admin'),
 sms:()=>import('./pages/SmsSettings.js?v=20260929-admin'),
 payment:()=>import('./pages/PaymentSettings.js?v=20260929-admin'),
 visitors:()=>import('./pages/Visitors.js?v=20260929-admin'),
 about:()=>import('./pages/About.js?v=20261005-about-hardening'),
 contact:()=>import('./pages/Contact.js?v=20261005-contact-modal2'),
 news:()=>import('./pages/News.js?v=20260929-admin'),
 articles:()=>import('./pages/Articles.js?v=20260929-admin'),
 support:()=>import('./pages/SupportTickets.js?v=20260929-admin'),
 'site-rules':()=>import('./pages/SiteRules.js?v=20260929-admin'),
 'storefront-snapshot':()=>import('./pages/StorefrontSnapshot.js?v=20261004-snapshot')
};

export default async function adminRouter(){
 const hashPage=location.hash.startsWith('#/admin/')?location.hash.replace('#/admin/',''):'';
 const pathPage=location.pathname.replace(/^.*\/admin\/?/,'').replace(/\/$/,'');
 const page=hashPage||pathPage||'dashboard';
 const loader=loaders[page]||loaders.dashboard;
 try{
  const mod=await loader();
  const html=(mod.default||mod)();
  return {html,mount:typeof mod.mount==='function'?mod.mount:null};
 }catch(e){
  console.error('GilasArt admin page load failed',page,e);
  return {html:'<div class="admin-page panel" dir="rtl"><h2>خطا در بارگذاری صفحه</h2><p class="error">'+String(e?.message||e||'خطای ناشناخته')+'</p><p class="muted">لطفاً دوباره تلاش کنید.</p></div>',mount:null};
 }
}