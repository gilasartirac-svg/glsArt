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
  settings:Settings
 };

 return (pages[page]||Dashboard)();

}
