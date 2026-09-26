const API=window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev';
let csrfToken='';
let sessionChecked=false;

const apiError=(data,status,path)=>new Error((data?.error||data?.message||`HTTP ${status}`)+` · ${path}`);

async function ensureCsrf(force=false){
 if(csrfToken&&!force)return csrfToken;
 try{
  const r=await fetch(API+'/api/me',{credentials:'include',cache:'no-store'});
  const d=await r.json().catch(()=>({}));
  csrfToken=d.csrfToken||'';
  sessionChecked=true;
  return csrfToken;
 }catch{
  sessionChecked=true;
  return '';
 }
}

function friendlyError(data,status,path){
 const code=String(data?.error||'');
 if(status===401||code==='unauthorized')return 'نشست مدیریت معتبر نیست یا منقضی شده است.';
 if(status===403||code==='forbidden')return 'دسترسی این کاربر به این بخش تأیید نشد.';
 if(status===404||code==='not_found')return 'مسیر یا اطلاعات در سرور پیدا نشد.';
 if(status===409)return 'این عملیات با وضعیت فعلی داده‌ها سازگار نیست.';
 if(status>=500||code==='internal_error')return 'سرور هنگام خواندن اطلاعات با خطا روبه‌رو شد.';
 return data?.message||data?.error||`HTTP ${status} · ${path}`;
}

function showAdminLoadError(message){
 document.querySelectorAll('#admin-page tbody').forEach(el=>{
  if(/در حال دریافت|در حال بارگذاری/.test(el.textContent||'')){
   const colspan=el.querySelector('td')?.getAttribute('colspan')||'12';
   el.innerHTML=`<tr><td colspan="${colspan}" class="error-cell">${message}</td></tr>`;
  }
 });
 document.querySelectorAll('#admin-page .admin-data-error,#admin-page .error').forEach(el=>{
  if(!el.textContent||el.classList.contains('admin-data-error'))el.textContent=message;
 });
}

async function request(path,options,attempt=0){
 const method=(options.method||'GET').toUpperCase();
 const headers={...(options.headers||{})};
 if(options.body&&!headers['content-type'])headers['content-type']='application/json';
 if(method!=='GET'&&method!=='HEAD'&&method!=='OPTIONS'){
  const token=await ensureCsrf();
  if(token)headers['x-csrf-token']=token;
 }
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),10000);
 try{
  const res=await fetch(API+path,{credentials:'include',cache:'no-store',...options,headers,signal:controller.signal});
  const data=await res.json().catch(()=>({}));
  if(data.csrfToken)csrfToken=data.csrfToken;
  if((res.status===401||res.status===403)&&attempt===0){
   await ensureCsrf(true);
   return request(path,options,1);
  }
  if(!res.ok){
   const message=friendlyError(data,res.status,path);
   showAdminLoadError(`خطا در دریافت اطلاعات: ${message}`);
   throw apiError({error:message},res.status,path);
  }
  return data;
 }catch(e){
  if(e.name==='AbortError'){
   const err=new Error('پاسخ سرور در زمان مقرر دریافت نشد؛ اتصال Worker یا D1 در دسترس نیست.');
   showAdminLoadError(err.message);
   throw err;
  }
  showAdminLoadError(e.message||'خطا در ارتباط با سرور');
  throw e;
 }finally{
  clearTimeout(timeout);
 }
}

export async function api(path,options={}){
 return request(path,options,0);
}

export const admin={
 me:()=>api('/api/admin/me'),
 stats:()=>api('/api/admin/stats'),
 products:()=>api('/api/admin/products'),
 orders:()=>api('/api/admin/orders'),
 customers:()=>api('/api/admin/reports/customers'),
 reports:()=>api('/api/admin/reports/sales'),
 audit:()=>api('/api/admin/audit'),
 roles:()=>api('/api/admin/roles')
};
