import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';

function ensureAdminStyles(){
 const href=(location.pathname.startsWith('/glsArt/')?'/glsArt':'')+'/admin/admin-ui.css';
 let link=document.querySelector('link[data-gilasart-admin-css]');
 if(!link){link=document.createElement('link');link.rel='stylesheet';link.href=href+'?v=20261008-admin-ui';link.dataset.gilasartAdminCss='1';document.head.appendChild(link)}
}

export function removeAdminStyles(){
 document.querySelector('link[data-gilasart-admin-css]')?.remove();
}

export default function AdminApp(){
 ensureAdminStyles();
 requestAnimationFrame(()=>{
  const b=document.getElementById('admin-mobile-menu'),d=document.getElementById('admin-mobile-drawer'),o=document.getElementById('admin-mobile-backdrop');
  if(b&&d&&o&&!b.dataset.bound){
   b.dataset.bound='1';
   const close=()=>{d.classList.remove('open');o.classList.remove('open');b.setAttribute('aria-expanded','false');b.setAttribute('aria-label','باز کردن منوی مدیریت');o.setAttribute('aria-hidden','true');document.body.classList.remove('admin-menu-open');b.focus({preventScroll:true})};
   const openMenu=()=>{d.classList.add('open');o.classList.add('open');b.setAttribute('aria-expanded','true');b.setAttribute('aria-label','بستن منوی مدیریت');o.setAttribute('aria-hidden','false');document.body.classList.add('admin-menu-open');window.setTimeout(()=>d.querySelector('a[data-admin-route]')?.focus({preventScroll:true}),40)};
   b.addEventListener('click',()=>{d.classList.contains('open')?close():openMenu()});
   o.addEventListener('click',close);
   d.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
   d.addEventListener('click',e=>{const a=e.target.closest('a[data-admin-route]');if(!a)return;const target=a.getAttribute('href');if(target&&target!==location.hash){e.preventDefault();location.hash=target.slice(1);if(typeof window.GilasArtAdminNavigate==='function')window.setTimeout(window.GilasArtAdminNavigate,0)}});
   d.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();close();return}if(e.key!=='Tab'||!d.classList.contains('open'))return;const focusables=[...d.querySelectorAll('a[href],button:not([disabled])')];if(!focusables.length)return;const first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}});
   window.addEventListener('hashchange',close);
  }
  if(!document.documentElement.dataset.adminRouteBound){
   document.documentElement.dataset.adminRouteBound='1';
   document.addEventListener('click',e=>{
    const home=e.target?.closest?.('a[data-admin-home]');
    if(home){e.preventDefault();e.stopPropagation();window.location.assign('https://gilasart.ir/');return;}
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

