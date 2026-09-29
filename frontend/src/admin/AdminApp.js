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
   window.addEventListener('hashchange',close);
  }
  window.dispatchEvent(new Event('admin-mounted'));
  import('./router.js?v=20260929-admin').then(m=>m.default()).then(html=>{const page=document.getElementById('admin-page');if(page)page.innerHTML=html}).catch(e=>{const page=document.getElementById('admin-page');if(page)page.innerHTML='<div class="admin-page panel" dir="rtl"><h2>خطا در بارگذاری کنترل پنل</h2><p class="error">'+String(e?.message||e)+'</p></div>'});
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

