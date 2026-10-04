import {setupDataGrid} from '../components/Table.js';
import {api} from '../services/api.js?v=20260928.1';

const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const date=v=>{try{return new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Tehran'}).format(new Date(v))}catch{return ''}};

export default function SupportTickets(){
 setTimeout(async()=>{
  try{const d=await api('/api/admin/tickets');render(d.items||[])}catch(e){const x=document.querySelector('#support-admin-error');if(x)x.textContent=e.message}
 },0);
 function render(items){
  const el=document.querySelector('#support-tickets-grid');if(!el)return;
  el.innerHTML=items.map(t=>`<tr>
   <td><b>${esc(t.subject)}</b><div class="muted">${esc(t.mobile)}</div></td>
   <td>${esc(t.category)}</td><td>${t.priority==='high'?'مهم':t.priority==='low'?'کم':'عادی'}</td>
   <td><span class="pill">${t.status==='open'?'باز':'بسته'}</span></td><td>${esc(t.stage)}</td><td>${date(t.updated_at)}</td>
   <td><button class="btn ghost ticket-open" data-id="${esc(t.id)}">مشاهده</button></td>
  </tr>`).join('')||'<tr><td colspan="8">تیکتی وجود ندارد.</td></tr>';
  setupDataGrid('support-tickets-grid');
  el.querySelectorAll('.ticket-open').forEach(b=>b.onclick=()=>openTicket(b.dataset.id));
 }
 async function openTicket(id){
  try{
   const d=await api('/api/admin/tickets/'+encodeURIComponent(id));
   const panel=document.querySelector('#support-ticket-detail');
   panel.innerHTML=`<div class="sectionhead"><div><span class="eyebrow">CRM TICKET</span><h3>${esc(d.ticket.subject)}</h3><p class="muted">${esc(d.ticket.mobile)} • ${esc(d.ticket.stage)} • ${d.ticket.status==='open'?'باز':'بسته'}</p></div></div>
   <div class="ticket-thread">${(d.messages||[]).map(m=>`<div class="ticket-message ${m.author_type==='admin'?'from-admin':'from-user'}"><div class="message-meta">${m.author_type==='admin'?'پشتیبانی':'کاربر'} • ${date(m.created_at)}</div><div>${esc(m.body)}</div></div>`).join('')}</div>
   <form id="admin-ticket-reply" class="form admin-ticket-reply-form"><label>پاسخ پشتیبانی<textarea name="message" maxlength="10000" rows="7" placeholder="پاسخ دقیق و محترمانه خود را برای کاربر بنویسید..."></textarea></label><div class="form-grid"><label>مرحله<select name="stage"><option ${d.ticket.stage==='ثبت شده'?'selected':''}>ثبت شده</option><option ${d.ticket.stage==='در حال بررسی'?'selected':''}>در حال بررسی</option><option ${d.ticket.stage==='پاسخ داده شد'?'selected':''}>پاسخ داده شد</option><option ${d.ticket.stage==='در انتظار بررسی'?'selected':''}>در انتظار بررسی</option><option ${d.ticket.stage==='بسته شده'?'selected':''}>بسته شده</option></select></label><label>وضعیت<select name="status"><option value="open" ${d.ticket.status==='open'?'selected':''}>باز</option><option value="closed" ${d.ticket.status==='closed'?'selected':''}>بسته</option></select></label></div><label class="check-row ticket-sms-toggle"><input type="checkbox" name="sendSms" checked><span>ارسال پیامک اطلاع‌رسانی به کاربر</span></label><small class="muted">در صورت فعال بودن، پس از ثبت پاسخ پیامک «پاسخی برای تیکت شما ثبت شده است» به شماره کاربر ارسال می‌شود.</small><button class="btn primary">ذخیره پاسخ و وضعیت</button><div id="admin-ticket-msg" role="status" aria-live="polite"></div></form>`;
   document.querySelector('#admin-ticket-reply').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);try{const result=await api('/api/admin/tickets/'+encodeURIComponent(id),{method:'POST',body:JSON.stringify({message:f.get('message'),stage:f.get('stage'),status:f.get('status'),sendSms:f.get('sendSms')==='on'}));const notice=document.querySelector('#admin-ticket-msg');if(notice)notice.innerHTML=result.smsSent?'<span class="ok">پاسخ ذخیره شد و پیامک با موفقیت ارسال شد.</span>':(f.get('sendSms')==='on'?'<span class="error">پاسخ ذخیره شد، اما پیامک ارسال نشد. علت: '+esc(result.smsReason||'نامشخص')+'</span>':'<span class="ok">پاسخ و وضعیت تیکت ذخیره شد.</span>');await openTicket(id);const d2=await api('/api/admin/tickets');render(d2.items||[])}catch(err){document.querySelector('#admin-ticket-msg').textContent=err.message}};
  }catch(e){document.querySelector('#support-ticket-detail').innerHTML='<p class="error">'+esc(e.message)+'</p>'}
 }
 return `<div class="admin-page" dir="rtl"><div class="admin-title"><div><h2>CRM پشتیبانی</h2><span class="muted">مدیریت تیکت‌ها، مراحل رسیدگی و پاسخ‌گویی</span></div></div><div id="support-admin-error" class="error"></div><div class="panel"><div class="table-scroll"><table class="admin-table"><thead><tr><th>تیکت / موبایل</th><th>دسته</th><th>اولویت</th><th>وضعیت</th><th>مرحله</th><th>آخرین تغییر</th><th>عملیات</th></tr></thead><tbody id="support-tickets-grid"><tr><td colspan="7">در حال دریافت...</td></tr></tbody></table></div></div><div id="support-ticket-detail" class="panel support-admin-detail"><p class="muted">برای مشاهده جزئیات یک تیکت، روی «مشاهده» بزنید.</p></div></div>`;
}
