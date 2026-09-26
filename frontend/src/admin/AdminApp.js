import Sidebar from './components/Sidebar.js?v=20260926.2';
import Header from './components/Header.js?v=20260926.2';
import {loadAdminPage} from './router.js?v=20260926.2';

export default function AdminApp(){
  setTimeout(()=>loadAdminPage().catch(e=>{
    const el=document.querySelector('#admin-page');
    if(el)el.innerHTML='<div class="panel"><h2>خطا در کنترل پنل</h2><p class="error">'+(e.message||'خطای ناشناخته')+'</p></div>';
  }),0);
  return '<div class="admin-layout" dir="rtl"><aside>'+Sidebar()+'</aside><main>'+Header()+'<section id="admin-page"><div class="panel"><p class="muted">در حال بارگذاری پنل…</p></div></section></main></div>';
}
