import {api} from '../services/api.js?v=20261001-reviews-ui';

const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const stars=(n)=>'★'.repeat(Math.max(0,Math.min(5,Number(n)||0)));

export default function Reviews(){
  const render=async()=>{
    const root=document.querySelector('#reviews-admin-root');
    if(!root)return;
    root.innerHTML='<div class="admin-page panel" dir="rtl"><p>در حال دریافت نظرات…</p></div>';
    try{
      const d=await api('/api/admin/reviews');
      const items=Array.isArray(d?.items)?d.items:[];
      root.innerHTML=\`
      <div class="admin-page" dir="rtl">
        <div class="admin-title"><div><span class="admin-kicker">CUSTOMER VOICE</span><h2>مدیریت نظرات کاربران</h2><p class="muted">مشاهده، بررسی، تأیید، رد تأیید و حذف نظرات ثبت‌شده برای محصولات.</p></div><button id="reviews-refresh" class="btn ghost" type="button">↻ به‌روزرسانی</button></div>
        <div id="reviews-message" class="error" aria-live="polite"></div>
        <div class="reviews-stats">
          <div class="panel"><strong>${items.length}</strong><span>کل نظرات</span></div>
          <div class="panel"><strong>${items.filter(x=>Number(x.approved)===1).length}</strong><span>تأییدشده</span></div>
          <div class="panel"><strong>${items.filter(x=>Number(x.approved)!==1).length}</strong><span>در انتظار بررسی</span></div>
        </div>
        <section class="panel reviews-manager"><div class="reviews-toolbar"><label class="review-search">جستجو<input id="reviews-search" type="search" placeholder="محصول، متن یا شماره موبایل…"></label><label>وضعیت<select id="reviews-filter"><option value="all">همه</option><option value="pending">در انتظار بررسی</option><option value="approved">تأییدشده</option></select></label></div>
        <div class="table-scroll"><table class="admin-table"><thead><tr><th>محصول</th><th>کاربر</th><th>امتیاز</th><th>متن نظر</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="reviews-grid"></tbody></table></div></section>
      </div>\`;
      const grid=root.querySelector('#reviews-grid'),search=root.querySelector('#reviews-search'),filter=root.querySelector('#reviews-filter');
      const draw=()=>{
        const q=(search.value||'').trim().toLowerCase(),f=filter.value;
        const shown=items.filter(x=>{const hay=[x.product_name,x.mobile,x.body].map(v=>String(v??'').toLowerCase()).join(' ');return (!q||hay.includes(q))&&(f==='all'||(f==='approved'?Number(x.approved)===1:Number(x.approved)!==1))});
        grid.innerHTML=shown.length?shown.map(x=>\`
          <tr><td><strong>${esc(x.product_name)}</strong></td><td>${esc(x.mobile||'—')}</td><td><span class="review-stars" aria-label="امتیاز ${Number(x.rating)||0} از 5">${stars(x.rating)}</span></td><td class="review-body">${esc(x.body)}</td><td><span class="review-status ${Number(x.approved)===1?'is-approved':'is-pending'}">${Number(x.approved)===1?'تأییدشده':'در انتظار بررسی'}</span></td><td class="review-actions"><button class="btn ghost review-moderate" type="button" data-id="${esc(x.id)}" data-approved="${Number(x.approved)===1?'0':'1'}">${Number(x.approved)===1?'رد تأیید':'تأیید'}</button> <button class="btn danger review-delete" type="button" data-id="${esc(x.id)}">حذف</button></td></tr>\`).join(''):'<tr><td colspan="6" class="muted">نظری مطابق فیلتر انتخاب‌شده پیدا نشد.</td></tr>';
      };
      search.oninput=draw;filter.onchange=draw;draw();root.querySelector('#reviews-refresh').onclick=render;
      grid.onclick=async(e)=>{const btn=e.target.closest('button[data-id]');if(!btn)return;const id=btn.dataset.id;btn.disabled=true;try{if(btn.classList.contains('review-delete')){if(!confirm('آیا از حذف این نظر مطمئن هستید؟')){btn.disabled=false;return}await api('/api/admin/reviews/'+encodeURIComponent(id),{method:'DELETE'})}else await api('/api/admin/reviews/'+encodeURIComponent(id),{method:'PUT',body:JSON.stringify({approved:btn.dataset.approved==='1'})});await render()}catch(err){const msg=root.querySelector('#reviews-message');if(msg)msg.textContent=err?.message||'عملیات روی نظر انجام نشد.';btn.disabled=false}};
    }catch(e){root.innerHTML=\`<div class="admin-page panel" dir="rtl"><h2>نظرات کاربران</h2><p class="error">${esc(e?.message||'دریافت نظرات انجام نشد.')}</p><button id="reviews-retry" class="btn ghost" type="button">تلاش دوباره</button></div>\`;root.querySelector('#reviews-retry').onclick=render}
  };
  setTimeout(render,0);
  return '<section id="reviews-admin-root"></section>';
}