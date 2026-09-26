const API=window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev';
let csrfToken='';
const apiError=(data,status,path)=>new Error((data?.error||data?.message||`HTTP ${status}`)+` · ${path}`);
async function ensureCsrf(force=false){
 if(csrfToken&&!force)return csrfToken;
 try{
  const r=await fetch(API+'/api/me',{credentials:'include',cache:'no-store'});
  const d=await r.json().catch(()=>({}));
  csrfToken=d.csrfToken||'';
 }catch{}
 return csrfToken;
}
function showAdminLoadError(message){
 document.querySelectorAll('#admin-page tbody').forEach(el=>{
  if(el.textContent.includes('در حال دریافت')){
   el.innerHTML=`<tr><td colspan="12" class="error-cell">${message}</td></tr>`;
  }
 });
 document.querySelectorAll('#admin-page .admin-data-error').forEach(el=>el.textContent=message);
}
export async function api(path,options={}){
 const method=(options.method||'GET').toUpperCase();
 const headers={...(options.headers||{})};
 if(options.body&&!headers['content-type'])headers['content-type']='application/json';
 if(method!=='GET'&&method!=='HEAD'&&method!=='OPTIONS'){
  const token=await ensureCsrf();
  if(token)headers['x-csrf-token']=token;
 }
 const controller=new AbortController();
 const timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const res=await fetch(API+path,{credentials:'include',cache:'no-store',...options,headers,signal:controller.signal});
  const data=await res.json().catch(()=>({}));
  if(data.csrfToken)csrfToken=data.csrfToken;
  if(!res.ok){
   const message=(data?.error||`HTTP ${res.status}`);
   showAdminLoadError(`خطا در دریافت اطلاعات: ${message}`);
   throw apiError(data,res.status,path);
  }
  return data;
 }catch(e){
  if(e.name==='AbortError'){
   const err=new Error('زمان پاسخ سرور تمام شد؛ اتصال Worker/D1 را بررسی کنید.');
   showAdminLoadError(err.message);
   throw err;
  }
  showAdminLoadError(e.message||'خطا در ارتباط با سرور');
  throw e;
 }finally{clearTimeout(timeout)}
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