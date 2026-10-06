import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';

export default function AdminApp(){
 requestAnimationFrame(()=>{
  const b=document.getElementById('admin-mobile-menu'),d=document.getElementById('admin-mobile-drawer'),o=document.getElementById('admin-mobile-backdrop');
  if(b&&d&&o&&!b.dataset.bound){
   b.dataset.bound='1';
   const close=()=>{d.classList.remove('open');o.classList.remove('open');b.setAttribute('aria-expanded','false');document.body.classList.remove('admin-menu-open')};
   b.addEventListener('click',()=>{const open=!d.classList.contains('open');d.classList.toggle('open',open);o.classList.toggle('open',open);b.setAttribute('aria-expanded',String(open));document.body.classList.toggle('admin-menu-open',open)});
   o.addEventListener('click',close);
   d.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   d.addEventListener('click',e=>{const a=e.target.closest('a[data-admin-route]');if(!a)return;const target=a.getAttribute('href');if(target&&target!==location.hash){e.preventDefault();location.hash=target.slice(1);if(typeof window.GilasArtAdminNavigate==='function')window.setTimeout(window.GilasArtAdminNavigate,0)}});
   window.addEventListener('hashchange',close);
  }
  if(!document.documentElement.dataset.adminRouteBound){
   document.documentElement.dataset.adminRouteBound='1';
   document.addEventListener('click',e=>{
    const a=e.target?.closest?.('a[data-admin-route]');
    if(!a)return;
    const target=a.getAttribute('href');
    if(!target||target===location.hash)return;
    e.preventDefault();
    e.stopPropagation();
    location.hash=target.slice(1);
    if(typeof window.GilasArtAdminNavigate==='function')window.setTimeout(window.GilasArtAdminNavigate,0);
   },{capture:true});
  }
  const bindAdminLogout=()=>{
   const button=document.getElementById('admin-session-logout');if(!button||button.dataset.bound)return;
   button.dataset.bound='1';
   button.addEventListener('click',async()=>{
    button.disabled=true;
    try{
     const {api}=await import('./services/api.js');
     await api('/api/auth/logout',{method:'POST'});
    }catch{}
    window.location.href='/account';
   });
  };
  window.addEventListener('admin-mounted',bindAdminLogout);
  window.dispatchEvent(new Event('admin-mounted'));
  const renderAdminPage=async()=>{
   const page=document.getElementById('admin-page');
   if(!page)return;
   page.innerHTML='<div class="admin-page panel" dir="rtl">در حال بارگذاری…</div>';
   try{
    const result=await import('./router.js?v=20261001-reviews-ui').then(m=>m.default());
    page.innerHTML=result?.html||'<div class="admin-page panel" dir="rtl"><p class="error">صفحه مدیریت قابل بارگذاری نیست.</p></div>';
    if(typeof result?.mount==='function')await result.mount();
   }catch(e){page.innerHTML='<div class="admin-page panel" dir="rtl"><h2>خطا در بارگذاری کنترل پنل</h2><p class="error">'+String(e?.message||e)+'</p></div>'}
  };
  window.GilasArtAdminNavigate=renderAdminPage;
  renderAdminPage();
 });
 return `
<div class="admin-layout" dir="rtl">
<aside>${Sidebar()}</aside>
<main>
${Header()}
<section id="admin-page"><div class="admin-page panel" dir="rtl">در حال بارگذاری کنترل پنل…</div></section>
</main>
</div>`;
}

