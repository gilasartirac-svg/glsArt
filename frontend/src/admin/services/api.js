export async function api(path,options={}){
 const res=await fetch(path,{
  credentials:'include',
  headers:{
   'content-type':'application/json',
   ...(options.headers||{})
  },
  ...options
 });

 return res.json();
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
