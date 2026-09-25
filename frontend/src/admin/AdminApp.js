import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import adminRouter from './router.js';

export default function AdminApp(){

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
