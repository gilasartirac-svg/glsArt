const pages={
  dashboard:'./pages/Dashboard.js',
  products:'./pages/Products.js',
  categories:'./pages/Categories.js',
  orders:'./pages/Orders.js',
  customers:'./pages/Customers.js',
  inventory:'./pages/Inventory.js',
  payments:'./pages/Payments.js',
  coupons:'./pages/Coupons.js',
  reviews:'./pages/Reviews.js',
  reports:'./pages/Reports.js',
  roles:'./pages/Roles.js',
  audit:'./pages/AuditLogs.js',
  settings:'./pages/Settings.js'
};

export default function adminRouter(){
  const page=location.hash.replace('#/admin/','')||'dashboard';
  return '<div class="panel"><p class="muted">در حال بارگذاری پنل…</p></div>';
}

export async function loadAdminPage(){
  const page=location.hash.replace('#/admin/','')||'dashboard';
  const path=pages[page]||pages.dashboard;
  const mod=await import(path);
  const el=document.querySelector('#admin-page');
  if(el)el.innerHTML=mod.default();
}
