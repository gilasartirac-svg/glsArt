export default function Dashboard(){

return `

<div class="dashboard" dir="rtl">

<div class="cards">

<div class="card">
فروش امروز
<strong id="today-sales">0</strong>
</div>

<div class="card">
فروش ماه
<strong id="month-sales">0</strong>
</div>

<div class="card">
سفارش‌ها
<strong id="orders-count">0</strong>
</div>

<div class="card">
کاربران جدید
<strong id="users-count">0</strong>
</div>

</div>


<div class="chart-box">

<h3>Daily Sales</h3>

<canvas id="sales-chart"></canvas>

</div>


</div>

`;

}
