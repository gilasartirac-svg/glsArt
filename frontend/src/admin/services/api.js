const API=window.GILASART_API||'https://gilasartworker.gilasart-ir-ac.workers.dev';
let csrfToken='';

async function ensureCsrf(){
 if(csrfToken)return csrfToken;
 try{
  const r=await fetch(API+'/api/me',{credentials:'include'});
  const d=await r.json().catch(()=>({}));
  csrfToken=d.csrfToken||'';
 }catch{}
 return csrfToken;
}

export async function api(path,options={}){
 const method=(options.method||'GET').toUpperCase();
 const headers={...(options.headers||{})};
 if(options.body && !headers['content-type'])headers['content-type']='application/json';
 if(method!=='GET'&&method!=='HEAD'&&method!=='OPTIONS'){
  const token=await ensureCsrf();
  if(token)headers['x-csrf-token']=token;
 }
 const res=await fetch(API+path,{credentials:'include',...options,headers});
 const data=await res.json().catch(()=>({}));
 if(data.csrfToken)csrfToken=data.csrfToken;
 if(!res.ok)throw new Error(data.error||'خطا در ارتباط با سرور');
 return data;
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
