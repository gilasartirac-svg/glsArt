import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';

import Dashboard from './pages/Dashboard.js';

export default function AdminApp(){

 return `
 <div class="admin-layout">

  <aside>
   ${Sidebar()}
  </aside>

  <main>
   ${Header()}
   <section id="admin-page">
    ${Dashboard()}
   </section>
  </main>

 </div>
 `;
}
