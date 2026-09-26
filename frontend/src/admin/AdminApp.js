import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import {loadAdminPage} from './router.js';

export default function AdminApp(){
  setTimeout(()=>loadAdminPage().catch(e=>{
    const el=document.querySelector('#admin-page');
    if(el)el.innerHTML=`<div class="panel"><h2>خطا در کنترل پنل</h2><p class="error">${e.message}</p></div>`;
  }),0);
  return `<div class="admin-layout" dir="rtl"><aside>${Sidebar()}</aside><main>${Header()}<section id="admin-page"><div class="panel"><p class="muted">در حال بارگذاری پنل…</p></div></section></main></div>`;
}
