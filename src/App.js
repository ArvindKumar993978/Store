import React from "react";
import { Routes, Route } from "react-router-dom";

import Entrance from './main/entrance.jsx';
import LoginPage from './auth/LoginPage.jsx';
import ProtectedRoute from './auth/ProtectedRoute.jsx';
import AdminDashboard from './admin/AdminDashboard.jsx';
import AddNewProductPage from './admin/AddNewProductPage.jsx';
import Sales from './admin/Sales.jsx';
import SettingsPage from "./admin/SettingsPage.jsx";
import Customer from "./admin/Customer.jsx";
import Billing from "./admin/Billing.jsx";
import CustomerReport from "./admin/CustomerReport.jsx";
import Reports from "./admin/Reports.jsx";
import StorefrontPage from "./customer/StorefrontPage.jsx";
import CreatePurchaseOrder from "./admin/CreatePurchaseOrderPage.jsx";
import CustomerProfilePage from "./admin/CustomerProfilePage.jsx";
import Billingdetails from "./admin/Billingdetails.jsx";
import StaffManagement from "./admin/StaffManagement.jsx";
import BackupData from "./admin/BackupData.jsx";
import SubscriptionPlans from "./admin/SubscriptionPlans.jsx";
import Product from "./admin/Product.jsx";
import ReportProgress from "./component/ReportProgress.jsx";
import ShoppingCart from "./customer/ShoppingCart.jsx";
import { CartProvider } from "./component/CartContext.jsx";
import { StoreProvider } from "./context/StoreContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import CheckoutPage from "./customer/CheckoutPage.jsx";
import OrderHistoryPage from "./customer/OrderHistoryPage.jsx";
import KhataBook from "./admin/KhataBook.jsx";
import CustomerSupportPage from "./customer/CustomerSupportPage.jsx";
import ShopNowPage from "./customer/ShopNowPage.jsx";
import ViewOffersPage from "./customer/ViewOffersPage.jsx";
import Employee from "./staff/employedashboard/Employe.jsx";
import EmployeeHandler from "./staff/employehandler/EmployeHandler.jsx";

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <Routes>
            {/* Public Portal & Auth Routes */}
            <Route path="/" element={<Entrance />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes (Accessible by Admin and Staff Cashiers) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/product"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Product />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <AddNewProductPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sales"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Sales />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Billing />
                </ProtectedRoute>
              }
            />
            <Route
              path="/khata"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <KhataBook />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Customer />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-report"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <CustomerReport />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer-profile"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <CustomerProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <Reports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/CreatePurchaseOrder"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <CreatePurchaseOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing-details"
              element={
                <ProtectedRoute allowedRoles={['admin', 'staff']}>
                  <Billingdetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-management"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <StaffManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/backup-data"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <BackupData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/subscriptionPlans"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <SubscriptionPlans />
                </ProtectedRoute>
              }
            />
            <Route
              path="/export-progress"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ReportProgress isOpen={true} />
                </ProtectedRoute>
              }
            />

            {/* Protected Staff / Employee Workspace */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <Employee />
                </ProtectedRoute>
              }
            />
            <Route
              path="/staff-handler"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <EmployeeHandler />
                </ProtectedRoute>
              }
            />

            {/* Customer Storefront & Shopping Routes */}
            <Route path="/storefront" element={<StorefrontPage />} />
            <Route path="/shop" element={<ShoppingCart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/help" element={<CustomerSupportPage />} />
            <Route path="/shopnow" element={<ShopNowPage />} />
            <Route path="/offers" element={<ViewOffersPage />} />
          </Routes>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;
