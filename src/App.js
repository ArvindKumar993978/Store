import { Routes, Route } from "react-router-dom";

import Entrance from './main/entrance.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
// import Product from './admin/ProductManagement.jsx';
import AddNewProductPage from './admin/AddNewProductPage.jsx';
import Sales from './admin/Sales.jsx';
import SettingsPage from "./admin/SettingsPage.jsx";
import Customer from "./admin/Customer.jsx";
import Billing from "./admin/Billing.jsx";
import CustomerReport from "./admin/CustomerReport.jsx";
import Reports from "./admin/Reports.jsx";
import StorefrontPage from "./customer/StorefrontPage (1).jsx";
import CreatePurchaseOrder from "./admin/CreatePurchaseOrderPage.jsx";
import CustomerProfilePage from "./admin/CustomerProfilePage.jsx";
import Billingdetails from "./admin/Billingdetails.jsx";
import StaffManagement from "./admin/StaffManagement.jsx";
import BackupData from "./admin/BackupData.jsx";
import SubscriptionPlans from "./admin/SubscriptionPlans.jsx";
import Product from "./admin/Product (1).jsx";
import ReportProgress from "./component/ReportProgress.jsx";
import ShoppingCart from "./customer/ShoppingCart (1).jsx";
import { CartProvider } from "./component/CartContext.jsx";
import CheckoutPage from "./customer/CheckoutPage (1).jsx";
import OrderHistoryPage  from "./customer/OrderHistoryPage.jsx";
import CustomerSupportPage from "./customer/CustomerSupportPage.jsx";
import ShopNowPage from "./customer/ShopNowPage.jsx";
import ViewOffersPage from "./customer/ViewOffersPage.jsx";

function App() {
  return (
    <CartProvider>
      <Routes>
      <Route path="/" element={<Entrance />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/product" element={<Product />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/add-product" element={<AddNewProductPage />} />
      <Route path="/sales" element={<Sales />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/customers" element={<Customer />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/customer-report" element={<CustomerReport />} />
      <Route path="/storefront" element={<StorefrontPage />} />
      <Route path="/CreatePurchaseOrder" element={<CreatePurchaseOrder />} />
      <Route path="/customer-profile" element={<CustomerProfilePage />} />
      <Route path="/billing-details" element={<Billingdetails />} />
      <Route path="/staff-management" element={<StaffManagement />} />
      <Route path="/backup-data" element={<BackupData />} />
      <Route path="/subscriptionPlans" element={<SubscriptionPlans />} />
      <Route path="/export-progress" element={<ReportProgress isOpen={true} />} />
      <Route path="/shop" element={<ShoppingCart />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrderHistoryPage />} />
      <Route path="/help" element={<CustomerSupportPage />} />
      <Route path="/shopnow" element={<ShopNowPage />} />
      <Route path="/offers" element={<ViewOffersPage />} />
    </Routes> 
    </CartProvider>
  );
}

export default App;
