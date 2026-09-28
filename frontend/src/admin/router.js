import Dashboard from './pages/Dashboard.js?v=20260928.2';
import Products from './pages/Products.js?v=20260928-products-grid';
import Orders from './pages/Orders.js?v=20260928.2';
import Customers from './pages/Customers.js?v=20260928.2';
import Inventory from './pages/Inventory.js?v=20260928.2';
import Payments from './pages/Payments.js?v=20260928.2';
import Reports from './pages/Reports.js?v=20260928.2';
import Roles from './pages/Roles.js?v=20260928.2';
import AuditLogs from './pages/AuditLogs.js?v=20260928.2';
import Settings from './pages/Settings.js?v=20260928.2';
import Categories from './pages/Categories.js?v=20260928.2';
import Coupons from './pages/Coupons.js?v=20260928.2';
import Discounts from './pages/Discounts.js?v=20260928.2';
import SmsSettings from './pages/SmsSettings.js?v=20260928.2';
import PaymentSettings from './pages/PaymentSettings.js?v=20260928.2';
import Visitors from './pages/Visitors.js?v=20260928.2';
import About from './pages/About.js?v=20260928.2';
import Contact from './pages/Contact.js?v=20260928.2';
import News from './pages/News.js?v=20260928.2';
import Articles from './pages/Articles.js?v=20260928.2';
import SupportTickets from './pages/SupportTickets.js?v=20260928.2';

export default function adminRouter(){

 const page=location.hash.replace('#/admin/','') || 'dashboard';

 const pages={
  dashboard:Dashboard,
  products:Products,
  orders:Orders,
  customers:Customers,
  inventory:Inventory,
  payments:Payments,
  reports:Reports,
  roles:Roles,
  audit:AuditLogs,
  settings:Settings,
  categories:Categories,
  coupons:Coupons,
  discounts:Discounts,
  sms:SmsSettings,
  payment:PaymentSettings,
  visitors:Visitors,
  about:About,contact:Contact,news:News,articles:Articles,support:SupportTickets
 };

 
const view=(pages[page]||Dashboard)();

setTimeout(async()=>{

 const mod = await import(`./pages/${page.charAt(0).toUpperCase()+page.slice(1)}.js?v=20260928.2`)
   .catch(()=>null);

 if(mod && mod.mount){
   await mod.mount();
 }

},0);

return view;


}
