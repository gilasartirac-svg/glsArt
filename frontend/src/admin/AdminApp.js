import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import adminRouter from './router.js';

export default function AdminApp(){

setTimeout(()=>{
 window.dispatchEvent(new Event('admin-mounted'));
},0);

return `

<div class="admin-layout" dir="rtl">

<aside>
${Sidebar()}
</aside>

<main>

${Header()}

<section id="admin-page">
${adminRouter()}
</section>

</main>

</div>

`;

}
