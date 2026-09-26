const ASSET_VERSION='20260926.3';
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

let loadSequence=0;

export default function adminRouter(){
 return '<div class="panel"><p class="muted">در حال بارگذاری پنل…</p></div>';
}

export async function loadAdminPage(){
 const sequence=++loadSequence;
 const page=location.hash.replace('#/admin/','').split('?')[0]||'dashboard';
 const path=pages[page]||pages.dashboard;
 const el=document.querySelector('#admin-page');
 if(!el)return;
 el.innerHTML='<div class="panel admin-page-loading"><p class="muted">در حال بارگذاری بخش…</p></div>';
 try{
  const mod=await import(path+'?v='+ASSET_VERSION);
  if(sequence!==loadSequence)return;
  const current=document.querySelector('#admin-page');
  if(!current)return;
  current.innerHTML=mod.default();
  if(typeof mod.mount==='function'){
    await mod.mount();
  }
 }catch(e){
  if(sequence!==loadSequence)return;
  const current=document.querySelector('#admin-page');
  if(current)current.innerHTML='<div class="panel"><h2>خطا در بارگذاری بخش</h2><p class="error">'+(e.message||'خطای ناشناخته')+'</p><button class="btn primary" type="button" onclick="location.reload()">تلاش مجدد</button></div>';
  throw e;
 }
}
