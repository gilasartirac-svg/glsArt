import {api} from '../services/api.js';
import {setupDataGrid} from '../components/Table.js';
import {coverImageField,setupCoverImageField,setCoverImageField} from '../components/CmsCoverPicker.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=v=>v?new Intl.DateTimeFormat('fa-IR-u-ca-persian',{dateStyle:'short',timeStyle:'short',timeZone:'Asia/Tehran'}).format(new Date(String(v).replace(' ','T')+'Z')):'—';
export default function Contact(){
 setTimeout(load,0);
 async function load(){
  const d=await api('/api/admin/cms?section=contact');const rows=d.items||[];
  const body=document.querySelector('#cms-grid');body.innerHTML=rows.map(x=>'<tr><td>'+esc(x.title)+'</td><td>'+esc(x.summary)+'</td><td>'+esc(x.active?'فعال':'غیرفعال')+'</td><td data-sort-value="'+esc(x.updated_at)+'">'+date(x.updated_at)+'</td><td class="table-actions"><button type="button" class="btn ghost edit" aria-label="ویرایش رکورد" data-id="'+esc(x.id)+'">ویرایش</button> <button type="button" class="btn danger del" aria-label="حذف رکورد" data-id="'+esc(x.id)+'">حذف</button></td></tr>').join('')||'<tr><td colspan="5">رکوردی ثبت نشده است.</td></tr>';
  setupDataGrid('cms-grid',{dateColumns:[3]});
  const form=document.querySelector('#cms-form');form.onsubmit=save;document.querySelector('#cms-clear').onclick=()=>{delete form.dataset.id;setCoverImageField(form,'');load()};setupCoverImageField(form);
  document.querySelectorAll('.edit').forEach(b=>b.onclick=()=>{const x=rows.find(y=>y.id===b.dataset.id);if(x){for(const [k,v] of Object.entries({id:x.id,title:x.title,slug:x.slug,summary:x.summary,body:x.body,phone:x.phone,mobile:x.mobile,address:x.address,mapUrl:x.map_url,coverImage:x.cover_image,sortOrder:x.sort_order,active:x.active})){const e=document.querySelector('#cms-form [name="'+k+'"]');if(e)e.value=v??''}document.querySelector('#cms-form').dataset.id=x.id;setCoverImageField(document.querySelector('#cms-form'),x.cover_image);window.scrollTo({top:0,behavior:'smooth'})}});
  document.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{if(!confirm('این رکورد حذف شود؟'))return;await api('/api/admin/cms/'+b.dataset.id,{method:'DELETE'});load()});
 }
 async function save(e){
 e.preventDefault();
 const form=e.currentTarget,btn=form.querySelector('button[type="submit"]'),status=form.querySelector('.cms-save-status');
 const f=new FormData(form),b=Object.fromEntries(f.entries());b.section='contact';b.active=f.get('active')==='on';b.coverImage=String(f.get('coverImage')||'');b.sortOrder=Number(b.sortOrder||0);
 const id=form.dataset.id; btn.disabled=true; if(status){status.textContent='در حال ذخیره‌سازی...';status.className='cms-save-status muted'}
 try{
  const result=await api(id?'/api/admin/cms/'+id:'/api/admin/cms',{method:id?'PUT':'POST',body:JSON.stringify(b)});
  form.reset();delete form.dataset.id;setCoverImageField(form,'');await load();
  if(status){status.textContent=result?.ok===false?'ذخیره‌سازی انجام نشد.':'تغییرات با موفقیت ذخیره شد.';status.className='cms-save-status success'}
 }catch(err){
  if(status){status.textContent='ذخیره‌سازی انجام نشد: '+String(err?.message||'خطای نامشخص');status.className='cms-save-status error'}
 }finally{btn.disabled=false}
}
 return '<div class="admin-page" dir="rtl"><div class="admin-title"><div><div class="eyebrow">GILAS ART CMS</div><h2>تماس با ما</h2><span class="muted">ثبت و ویرایش مستقیم محتوای سایت</span></div></div><div class="panel cms-editor"><form id="cms-form" class="form"><div class="form-grid"><label>عنوان<input name="title" required maxlength="180"></label><label>Slug<input name="slug" maxlength="160"></label><label>خلاصه<textarea name="summary" maxlength="500"></textarea></label><label>متن اصلی<textarea name="body" maxlength="12000"></textarea></label><label>تلفن<input name="phone"></label><label>موبایل<input name="mobile"></label><label>آدرس هنرکده<textarea name="address"></textarea></label><label>لینک نقشه / مسیریابی<input name="mapUrl" type="url"></label>'+coverImageField()+'<label>ترتیب نمایش<input name="sortOrder" type="number" value="0"></label><label class="checkline"><input name="active" type="checkbox" checked> فعال</label></div><div class="toolbar"><button class="btn primary" type="submit">ذخیره</button><span class="cms-save-status" role="status" aria-live="polite"></span><button class="btn ghost" type="reset" id="cms-clear">پاک کردن فرم</button></div></form></div><div class="panel"><div class="sectionhead"><h3>رکوردهای ثبت‌شده</h3><span class="muted">جستجو، مرتب‌سازی و ویرایش از همین جدول</span></div><div class="table-scroll"><table class="admin-table"><thead><tr><th>عنوان</th><th>خلاصه</th><th>وضعیت</th><th>آخرین ویرایش</th><th>عملیات</th></tr></thead><tbody id="cms-grid"><tr><td colspan="5">در حال دریافت...</td></tr></tbody></table></div></div></div>';
}