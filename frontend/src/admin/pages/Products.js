import {admin,api} from '../services/api.js';

function csrf(){
 return document.cookie
 .split('; ')
 .find(x=>x.startsWith('gs_csrf='))
 ?.split('=')[1]||'';
}

export default function Products(){

async function loadProducts(){

 try{

  const data=await admin.products();

  const body=document.querySelector('#products-table');

  if(!body)return;

  body.innerHTML=(data.items||[]).map(p=>`

  <tr>
   <td>${p.name||''}</td>
   <td>${p.sku||''}</td>
   <td>${new Intl.NumberFormat('fa-IR').format(p.price_irt||0)}</td>
   <td>${p.stock||0}</td>
   <td>${p.active?'فعال':'غیرفعال'}</td>
  </tr>

  `).join('');

 }catch(e){

 console.error('products load error',e);

 }

}


setTimeout(()=>{

 loadProducts();


 const btn=document.querySelector('#create-product');


 if(btn){

 btn.onclick=async()=>{

 try{

 const payload={

  name:document.querySelector('#p-name').value,
  sku:document.querySelector('#p-sku').value,
  slug:document.querySelector('#p-slug').value,
  priceIrt:Number(document.querySelector('#p-price').value||0),
  stock:Number(document.querySelector('#p-stock').value||0),
  description:document.querySelector('#p-description').value

 };


 await api('/api/admin/products',{

  method:'POST',

  headers:{
   'x-csrf-token':csrf()
  },

  body:JSON.stringify(payload)

 });


 alert('محصول ثبت شد');

 loadProducts();


 }catch(e){

 alert(e.message||'خطا در ثبت محصول');

 }

 };

 }


},0);



return `

<div class="admin-page" dir="rtl">

<div class="admin-title">
<h2>مدیریت محصولات</h2>
</div>


<div class="panel">

<h3>افزودن محصول</h3>

<div class="form">

<input id="p-name" placeholder="نام محصول">

<input id="p-sku" placeholder="کد محصول">

<input id="p-slug" placeholder="slug">

<input id="p-price" placeholder="قیمت">

<input id="p-stock" placeholder="موجودی">

<textarea id="p-description" placeholder="توضیحات"></textarea>

<button class="btn primary" id="create-product">
ثبت محصول
</button>

</div>

</div>


<div class="panel">

<h3>لیست محصولات</h3>

<table class="admin-table">

<thead>
<tr>
<th>نام</th>
<th>کد</th>
<th>قیمت</th>
<th>موجودی</th>
<th>وضعیت</th>
</tr>
</thead>


<tbody id="products-table">

<tr>
<td colspan="5">
در حال دریافت...
</td>
</tr>

</tbody>

</table>

</div>

</div>

`;

}
