import {admin} from '../services/api.js';

export default function Dashboard(){

 setTimeout(async()=>{

  try{

   const data=await admin.stats();

   const orders=document.querySelector('#orders-count');
   const revenue=document.querySelector('#month-sales');
   const users=document.querySelector('#users-count');

   if(orders) orders.textContent=data.orders||0;
   if(revenue) revenue.textContent=new Intl.NumberFormat('fa-IR').format(data.revenue_irt||0);
   if(users) users.textContent=data.users||0;

  }catch(e){

   console.error('dashboard stats error',e);

  }

 },0);


return `

<div class="dashboard" dir="rtl">

<div class="cards">

<div class="card">
فروش امروز
<strong id="today-sales">-</strong>
</div>

<div class="card">
فروش ماه
<strong id="month-sales">-</strong>
</div>

<div class="card">
سفارش‌ها
<strong id="orders-count">-</strong>
</div>

<div class="card">
کاربران جدید
<strong id="users-count">-</strong>
</div>

</div>

<div class="chart-box">

<h3>Daily Sales</h3>

<canvas id="sales-chart"></canvas>

</div>

</div>

`;

}
