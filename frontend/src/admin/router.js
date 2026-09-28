import Dashboard from './pages/Dashboard.js';
import Products from './pages/Products.js';
import Orders from './pages/Orders.js';
import Customers from './pages/Customers.js';
import Inventory from './pages/Inventory.js';
import Payments from './pages/Payments.js';
import Reports from './pages/Reports.js';
import Roles from './pages/Roles.js';
import AuditLogs from './pages/AuditLogs.js';
import Settings from './pages/Settings.js';
import Categories from './pages/Categories.js';
import Coupons from './pages/Coupons.js';
import Discounts from './pages/Discounts.js';
import SmsSettings from './pages/SmsSettings.js';
import PaymentSettings from './pages/PaymentSettings.js';
import Visitors from './pages/Visitors.js';
import About from './pages/About.js';
import Contact from './pages/Contact.js';
import News from './pages/News.js';
import Articles from './pages/Articles.js';
import SupportTickets from './pages/SupportTickets.js';

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

 const mod = await import(`./pages/${page.charAt(0).toUpperCase()+page.slice(1)}.js`)
   .catch(()=>null);

 if(mod && mod.mount){
   await mod.mount();
 }

},0);

return view;


}
