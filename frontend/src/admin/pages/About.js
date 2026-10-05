import {api} from '../services/api.js';
import {setupDataGrid} from '../components/Table.js';
import {coverImageField,setupCoverImageField,setCoverImageField} from '../components/CmsCoverPicker.js';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=v=>{
 if(!v)return '—';
 const raw=String(v).trim().replace(' ','T');
 const d=new Date(/Z$|[+-]\d\d:\d\d$/.test(raw)?raw:raw+'Z');
 return Number.isNaN(d.getTime())?'—':new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'short',timeStyle:'short',timeZone:'Asia/Tehran'}).format(d);
};
function showFeedback(title,message,type='success'){
 const old=document.querySelector('#cms-about-feedback-modal');old?.remove();
 const box=document.createElement('div');
 box.id='cms-about-feedback-modal';
 box.className='modal';
 box.setAttribute('role','dialog');
 box.setAttribute('aria-modal','true');
 const tone=type==='error'?'error':'success';
 box.innerHTML='<div class="modalbox cms-feedback-modal"><div class="eyebrow">GILAS ART CMS</div><h3>'+esc(title)+'</h3><p class="'+tone+'">'+esc(message)+'</p><div class="toolbar"><button type="button" class="btn primary">متوجه شدم</button></div></div>';
 document.body.appendChild(box);
 const close=()=>box.remove();
 box.querySelector('button').onclick=close;
 box.addEventListener('click',e=>{if(e.target===box)close()});
 setTimeout(()=>box.querySelector('button')?.focus(),0);
}
export default function About(){
 setTimeout(load,0);
 async function load(){
  const body=document.querySelector('#cms-grid');
  try{
   const d=await api('/api/admin/cms?section=about');
   const rows=Array.isArray(d.items)?d.items:[];
   if(!body)return;
   body.innerHTML=rows.map(x=>'<tr><td>'+esc(x.title)+'</td><td>'+esc(x.summary)+'</td><td>'+esc(x.active?'فعال':'غیرفعال')+'</td><td data-sort-value="'+esc(x.updated_at)+'">'+date(x.updated_at)+'</td><td class="table-actions"><button type="button" class="btn ghost edit" aria-label="ویرایش رکورد" data-id="'+esc(x.id)+'">ویرایش</button> <button type="button" class="btn danger del" aria-label="حذف رکورد" data-id="'+esc(x.id)+'">حذف</button></td></tr>').join('')||'<tr><td colspan="5">رکوردی ثبت نشده است.</td></tr>';
   setupDataGrid('cms-grid',{dateColumns:[3]});
   const form=document.querySelector('#cms-form');
   if(!form)return;
   form.onsubmit=save;
   document.querySelector('#cms-clear').onclick=()=>{delete form.dataset.id;setCoverImageField(form,'');form.reset();load()};
   if(!form.dataset.coverPickerReady){form.dataset.coverPickerReady='1';await setupCoverImageField(form)}
   document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>{
    const x=rows.find(y=>y.id===b.dataset.id);if(!x)return;
    for(const [k,v] of Object.entries({id:x.id,title:x.title,slug:x.slug,summary:x.summary,body:x.body,phone:x.phone,mobile:x.mobile,address:x.address,mapUrl:x.map_url,coverImage:x.cover_image,sortOrder:x.sort_order,active:x.active})){
     const e=form.querySelector('[name="'+k+'"]');if(e)e.value=v??'';
    }
    form.querySelector('[name="active"]').checked=Number(x.active)===1;
    form.dataset.id=x.id;
    setCoverImageField(form,x.cover_image);
    window.scrollTo({top:0,behavior:'smooth'});
   });
   document.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{
    if(!confirm('این رکورد حذف شود؟'))return;
    b.disabled=true;
    try{await api('/api/admin/cms/'+encodeURIComponent(b.dataset.id),{method:'DELETE'});await load();showFeedback('حذف شد','رکورد درباره ما با موفقیت حذف شد.')}
    catch(err){showFeedback('حذف انجام نشد',String(err?.message||'خطای نامشخص'),'error');b.disabled=false}
   });
  }catch(err){
   if(body)body.innerHTML='<tr><td colspan="5" class="error">دریافت اطلاعات انجام نشد: '+esc(err?.message||'خطای نامشخص')+'</td></tr>';
  }
 }
 async function save(e){
  e.preventDefault();
  const form=e.currentTarget,btn=form.querySelector('button[type="submit"]'),status=form.querySelector('.cms-save-status');
  const f=new FormData(form),b=Object.fromEntries(f.entries());
  b.section='about';b.active=f.get('active')==='on';b.coverImage=String(f.get('coverImage')||'');b.sortOrder=Number(b.sortOrder||0);
  const id=form.dataset.id;
  btn.disabled=true;
  if(status){status.textContent='در حال ذخیره‌سازی...';status.className='cms-save-status muted'}
  try{
   await api(id?'/api/admin/cms/'+encodeURIComponent(id):'/api/admin/cms',{method:id?'PUT':'POST',body:JSON.stringify(b)});
   form.reset();delete form.dataset.id;setCoverImageField(form,'');await load();
   if(status){status.textContent='';status.className='cms-save-status'}
   showFeedback('ذخیره شد','اطلاعات «درباره ما» با موفقیت در پایگاه داده ذخیره و جدول به‌روزرسانی شد.');
  }catch(err){
   if(status){status.textContent='';status.className='cms-save-status'}
   showFeedback('ذخیره انجام نشد',String(err?.message||'خطای نامشخص'),'error');
  }finally{btn.disabled=false}
 }
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><div class="eyebrow">GILAS ART CMS</div><h2>درباره ما</h2><span class="muted">ثبت و ویرایش مستقیم محتوای سایت</span></div></div><div class="panel cms-editor"><form id="cms-form" class="form"><div class="form-grid"><label>عنوان<input name="title" required maxlength="180"></label><label>Slug<input name="slug" maxlength="160"></label><label>خلاصه<textarea name="summary" maxlength="500"></textarea></label><label>متن اصلی<textarea name="body" maxlength="12000"></textarea></label>'+coverImageField()+'<label>ترتیب نمایش<input name="sortOrder" type="number" value="0"></label><label class="checkline"><input name="active" type="checkbox" checked> فعال</label></div><div class="toolbar"><button class="btn primary" type="submit">ذخیره</button><span class="cms-save-status" role="status" aria-live="polite"></span><button class="btn ghost" type="reset" id="cms-clear">پاک کردن فرم</button></div></form></div><div class="panel"><div class="sectionhead"><h3>رکوردهای ثبت‌شده</h3><span class="muted">جستجو، مرتب‌سازی و ویرایش از همین جدول</span></div><div class="table-scroll"><table class="admin-table"><thead><tr><th>عنوان</th><th>خلاصه</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody id="cms-grid"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div></div></div>';
}