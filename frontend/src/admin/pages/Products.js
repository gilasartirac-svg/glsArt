import {setupDataGrid} from '../components/Table.js';
import {admin,api} from '../services/api.js?v=20260929-products-grid';
import {bindImagePicker} from '../components/ImagePicker.js';

const localDateTime=v=>{if(!v)return '';const d=new Date(v);if(Number.isNaN(d.getTime()))return '';const p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`};
const isoDateTime=v=>{if(!v)return null;const d=new Date(v);return Number.isNaN(d.getTime())?null:d.toISOString()};
const money=n=>new Intl.NumberFormat('fa-IR').format(Number(n||0));
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

export default function Products(){
 let attributes=[];
 const load=async()=>{
  try{
   const pd=await admin.products();
   if(!Array.isArray(pd.items))throw new Error('پاسخ API محصولات ساختار معتبر ندارد.');
   render(pd.items);
  }catch(e){
   const el=document.querySelector('#products-grid');
   if(el)el.innerHTML=`<tr><td colspan="6" class="error-cell">${esc(e.message||'خطا در دریافت محصولات')}</td></tr>`;
   throw e;
  }
  try{
   const cd=await api('/api/admin/categories');
   const cat=document.querySelector('#p-category');
   if(cat)cat.innerHTML='<option value="">بدون دسته</option>'+(cd.items||[]).map(x=>`<option value="${esc(x.id)}">${esc(x.name)}</option>`).join('');
  }catch(e){
   const el=document.querySelector('#products-error');if(el)el.textContent='اطلاعات دسته‌بندی در دسترس نیست؛ فهرست محصولات همچنان قابل استفاده است.';
  }
  try{
   const ad=await api('/api/admin/product-attributes');
   attributes=ad.items||[];
  }catch(e){
   attributes=[];
   const el=document.querySelector('#products-error');if(el)el.textContent='ویژگی‌های محصول هنوز در دسترس نیست؛ فهرست محصولات همچنان قابل استفاده است.';
  }
  renderAttributeManager();
  renderAttributeChoices();
 };
 setTimeout(async()=>{
  try{await load()}catch(e){const el=document.querySelector('#products-error');if(el)el.textContent=e.message}
  bindImagePicker({buttonId:'choose-product-image',inputId:'p-image',altInputId:'p-image-alt'});
  bindForms();
 },0);

 function render(items){
  const el=document.querySelector('#products-grid');if(!el)return;
  el.innerHTML=items.map(p=>{const src=String(p.image||'').trim(),file=imageFile(src);return `<tr>
  <td class="product-admin-identity">
   <div class="product-admin-thumb">${src?`<img src="${esc(src)}" alt="${esc(p.name||'محصول')}" loading="lazy" decoding="async">`:'<span aria-hidden="true">—</span>'}</div>
   <div class="product-admin-meta"><b>${esc(p.name)}</b><div class="muted product-admin-slug">${esc(p.slug)}</div><div class="product-admin-image-file" dir="ltr"><code>${esc(file||'بدون تصویر')}</code>${file?`<button type="button" class="icon-copy copy-image-name" data-filename="${esc(file)}" aria-label="کپی نام فایل تصویر" title="کپی نام فایل تصویر"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg></button>`:""}</div></div>
  </td>
  <td>${esc(p.sku)}</td><td>${money(p.price_irt)} ریال</td><td>${p.stock??0}</td><td><span class="pill">${p.active?'فعال':'غیرفعال'}</span></td>
  <td><button class="btn ghost edit" data-id="${esc(p.id)}">ویرایش</button> <button class="btn danger del" data-id="${esc(p.id)}">حذف</button></td>
 </tr>`}).join('')||'<tr><td colspan="6">محصولی وجود ندارد.</td></tr>';
  try{setupDataGrid('products-grid')}catch(err){console.warn('Products data-grid enhancement failed; catalog rendering preserved.',err)}
  el.querySelectorAll('.copy-image-name').forEach(b=>b.onclick=async()=>{
  const value=b.dataset.filename||'';
  try{
   if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(value);
   else{const ta=document.createElement('textarea');ta.value=value;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove()}
   const old=b.title;b.title='کپی شد';b.classList.add('is-copied');setTimeout(()=>{b.title=old;b.classList.remove('is-copied')},1200);
  }catch{alert('کپی نام فایل انجام نشد.')}
});
el.querySelectorAll('.edit').forEach(b=>b.onclick=()=>edit(items.find(x=>x.id===b.dataset.id)));
  el.querySelectorAll('.del').forEach(b=>b.onclick=async()=>{if(!confirm('حذف شود؟'))return;try{await api('/api/admin/products/'+encodeURIComponent(b.dataset.id),{method:'DELETE'});await refresh();}catch(e){alert(e.message)}});
 }
 async function refresh(){const d=await admin.products();if(!Array.isArray(d.items))throw new Error('پاسخ API محصولات ساختار معتبر ندارد.');render(d.items)}
 function renderAttributeChoices(selected=[]){
  const box=document.querySelector('#product-attributes');if(!box)return;
  box.innerHTML=attributes.filter(a=>a.active).map(a=>`<label class="attribute-check"><input type="checkbox" value="${esc(a.id)}" ${selected.includes(a.id)?'checked':''}><span><b>${esc(a.name)}</b><small>${a.options?.length||0} گزینه</small></span></label>`).join('')||'<span class="muted">هنوز ویژگی فعالی تعریف نشده است.</span>';
 }
 function selectedAttributeIds(){return [...document.querySelectorAll('#product-attributes input[type=checkbox]:checked')].map(x=>x.value)}
 function renderAttributeManager(){
  const box=document.querySelector('#attributes-manager');if(!box)return;
  box.innerHTML=attributes.map(a=>`<div class="attribute-card">
   <div class="attribute-card-head"><div><strong>${esc(a.name)}</strong><span class="pill">${a.active?'فعال':'غیرفعال'}</span></div><button class="btn ghost toggle-attr" data-id="${esc(a.id)}" data-active="${a.active?'1':'0'}">${a.active?'غیرفعال کردن':'فعال کردن'}</button></div>
   <div class="attribute-options">${(a.options||[]).map(o=>`<div class="attribute-option-row" data-option="${esc(o.id)}">
     <input class="opt-name" value="${esc(o.name)}" aria-label="نام گزینه">
     <label><input class="opt-active" type="checkbox" ${o.active?'checked':''}> فعال</label>
     <label><input class="opt-default" type="checkbox" ${o.is_default?'checked':''}> پیش‌فرض</label>
     <input class="opt-price" type="number" min="0" value="${Number(o.price_delta_irt||0)}" aria-label="افزایش قیمت">
     <button class="btn ghost save-opt" data-id="${esc(o.id)}">ذخیره</button>
     <button class="btn danger delete-opt" data-id="${esc(o.id)}">حذف</button>
   </div>`).join('')||'<div class="muted">هنوز گزینه‌ای ثبت نشده است.</div>'}</div>
   <form class="inline-option-form" data-attribute="${esc(a.id)}"><input name="name" required placeholder="گزینه جدید"><input name="price" type="number" min="0" value="0" placeholder="افزایش قیمت"><label><input name="active" type="checkbox" checked> فعال</label><label><input name="default" type="checkbox"> پیش‌فرض</label><button class="btn primary">افزودن گزینه</button></form>
  </div>`).join('')||'<div class="muted">برای شروع یک ویژگی مثل «رنگ قاب» ایجاد کنید.</div>';
  box.querySelectorAll('.toggle-attr').forEach(b=>b.onclick=async()=>{try{await api('/api/admin/product-attributes/'+encodeURIComponent(b.dataset.id),{method:'PUT',body:JSON.stringify({active:b.dataset.active!=='1'})});await load()}catch(e){alert(e.message)}});
  box.querySelectorAll('.inline-option-form').forEach(f=>f.onsubmit=async e=>{e.preventDefault();const x=new FormData(f);try{await api('/api/admin/product-attributes/'+encodeURIComponent(f.dataset.attribute)+'/options',{method:'POST',body:JSON.stringify({name:x.get('name'),priceDeltaIrt:Number(x.get('price')||0),active:x.get('active')==='on',isDefault:x.get('default')==='on'})});await load()}catch(err){alert(err.message)}});
  box.querySelectorAll('.save-opt').forEach(b=>b.onclick=async()=>{const row=b.closest('.attribute-option-row');try{await api('/api/admin/product-attribute-options/'+encodeURIComponent(b.dataset.id),{method:'PUT',body:JSON.stringify({name:row.querySelector('.opt-name').value,active:row.querySelector('.opt-active').checked,isDefault:row.querySelector('.opt-default').checked,priceDeltaIrt:Number(row.querySelector('.opt-price').value||0)})});await load()}catch(e){alert(e.message)}});
  box.querySelectorAll('.delete-opt').forEach(b=>b.onclick=async()=>{if(!confirm('این گزینه حذف شود؟'))return;try{await api('/api/admin/product-attribute-options/'+encodeURIComponent(b.dataset.id),{method:'DELETE'});await load()}catch(e){alert(e.message)}});
 }
 function bindForms(){
  const attributeForm=document.querySelector('#attribute-form');
  attributeForm?.addEventListener('submit',async e=>{e.preventDefault();const x=new FormData(attributeForm);try{await api('/api/admin/product-attributes',{method:'POST',body:JSON.stringify({name:x.get('name'),active:true})});attributeForm.reset();await load()}catch(err){alert(err.message)}});
  const form=document.querySelector('#product-form');
  document.querySelector('#product-reset')?.addEventListener('click',resetForm);
  form?.addEventListener('submit',async e=>{
   e.preventDefault();const f=new FormData(form);const id=form.dataset.editId;
   const payload={name:f.get('name'),sku:f.get('sku'),slug:f.get('slug'),categoryId:f.get('categoryId')||null,priceIrt:Number(f.get('priceIrt')),stock:Number(f.get('stock')),description:f.get('description'),seoTitle:f.get('seoTitle'),seoDescription:f.get('seoDescription'),imagePath:f.get('imagePath'),imageAlt:f.get('imageAlt'),videoUrl:String(f.get('videoUrl')||'').trim()||null,attributeIds:selectedAttributeIds(),flashSaleActive:f.get('flashSaleActive')==='on',flashSaleEndsAt:isoDateTime(f.get('flashSaleEndsAt')),flashSalePriceIrt:f.get('flashSalePriceIrt')?Number(f.get('flashSalePriceIrt')):null};
   try{await api(id?'/api/admin/products/'+encodeURIComponent(id):'/api/admin/products',{method:id?'PUT':'POST',body:JSON.stringify(payload)});resetForm();await refresh();alert(id?'ویرایش ذخیره شد':'محصول ثبت شد')}catch(err){alert(err.message)}
  });
 }
 function resetForm(){const f=document.querySelector('#product-form');f.reset();delete f.dataset.editId;document.querySelector('#p-form-title').textContent='افزودن محصول';renderAttributeChoices([])}
 function edit(p){
  const f=document.querySelector('#product-form');f.dataset.editId=p.id;
  for(const [id,v] of [['p-name',p.name],['p-sku',p.sku],['p-slug',p.slug],['p-category',p.category_id||''],['p-price',p.price_irt],['p-stock',p.stock||0],['p-description',p.description||''],['p-seo-title',p.seo_title||''],['p-seo-description',p.seo_description||''],['p-image',p.image||''],['p-image-alt',p.image_alt||p.name||''],['p-video',p.video_url||''],['p-flash-end',localDateTime(p.flash_sale_ends_at)],['p-flash-price',p.flash_sale_price_irt??'']]){const e=document.querySelector('#'+id);if(e)e.value=v}
  const active=document.querySelector('#p-flash-active');if(active)active.checked=!!p.flash_sale_active;
  renderAttributeChoices(p.attribute_ids||[]);
  document.querySelector('#p-form-title').textContent='ویرایش محصول';
  window.scrollTo({top:0,behavior:'smooth'});
 }
 return `<div class="admin-page" dir="rtl">
 <div class="admin-title"><div><h2>محصولات</h2><span class="muted">کامل: اطلاعات، دسته، قیمت، موجودی، تصویر، ویدئو، ویژگی و SEO</span></div></div>
 <div id="products-error" class="error"></div>
 <div class="panel"><h3 id="p-form-title">افزودن محصول</h3>
 <form id="product-form" class="form"><div class="form-grid">
  <label>نام<input id="p-name" name="name" required></label><label>SKU<input id="p-sku" name="sku" required></label><label>Slug<input id="p-slug" name="slug" required></label><label>دسته<select id="p-category" name="categoryId"></select></label>
  <label>قیمت (ریال)<input id="p-price" name="priceIrt" type="number" min="0" required></label><label>موجودی<input id="p-stock" name="stock" type="number" min="0" required></label>
 </div>
 <label>توضیحات<textarea id="p-description" name="description" required></textarea></label>
 <div class="form-grid">
  <label>SEO Title<input id="p-seo-title" name="seoTitle" maxlength="70"></label><label>SEO Description<textarea id="p-seo-description" name="seoDescription" maxlength="180"></textarea></label>
  <label>تصویر محصول<div class="image-field"><input id="p-image" name="imagePath" placeholder="انتخاب از Repository تصویر" readonly><button type="button" class="btn ghost" id="choose-product-image">انتخاب تصویر</button></div></label>
  <label>Alt تصویر<input id="p-image-alt" name="imageAlt"></label>
  <label class="full-field">ویدئوی محصول<input id="p-video" name="videoUrl" type="url" inputmode="url" placeholder="https://example.com/product-video.mp4"><small class="muted">فقط URL کامل HTTPS ذخیره می‌شود؛ فایل ویدئو در D1 ذخیره نمی‌شود.</small></label>
  <div class="flash-sale-editor"><label class="check-row"><input id="p-flash-active" name="flashSaleActive" type="checkbox"> فعال‌سازی پیشنهاد شگفت‌انگیز</label><label>پایان پیشنهاد<input id="p-flash-end" name="flashSaleEndsAt" type="datetime-local"></label><label>قیمت ویژه (ریال، اختیاری)<input id="p-flash-price" name="flashSalePriceIrt" type="number" min="0"></label><small class="muted">برای فعال‌سازی، تاریخ پایان باید در آینده باشد.</small></div>
 </div>
 <div class="product-attributes-editor"><div class="sectionhead"><div><h4>ویژگی‌های این محصول</h4><p class="muted">چند ویژگی را همزمان انتخاب کنید؛ قیمت نهایی هنگام افزودن به سبد در Backend اعتبارسنجی می‌شود.</p></div></div><div id="product-attributes" class="attribute-choice-grid"></div></div>
 <button class="btn primary">ذخیره</button><button type="button" class="btn ghost" id="product-reset">لغو و پاک کردن فرم</button>
 </form></div>
 <div class="panel"><div class="sectionhead"><div><h3>ویژگی‌های قابل انتخاب</h3><p class="muted">ویژگی عمومی بسازید و گزینه‌های آن را با وضعیت، پیش‌فرض و افزایش قیمت مدیریت کنید.</p></div></div>
 <form id="attribute-form" class="inline-option-form"><input name="name" required placeholder="مثلاً رنگ قاب"><button class="btn primary">ایجاد ویژگی</button></form>
 <div id="attributes-manager" class="attributes-manager"></div></div>
 <div class="panel"><h3>کاتالوگ</h3><div class="table-scroll"><table class="admin-table products-admin-table"><thead><tr><th>محصول / تصویر</th><th>SKU</th><th>قیمت</th><th>موجودی</th><th>وضعیت</th><th>عملیات</th></tr></thead><tbody id="products-grid"><tr><td colspan="6">در حال دریافت...</td></tr></tbody></table></div></div>
 </div>`;
}

