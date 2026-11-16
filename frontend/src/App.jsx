import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import MenuPage from './pages/customer/MenuPage';
import CustomerLogin from './pages/customer/CustomerLogin';
import CheckoutPage from './pages/customer/CheckoutPage';
import OrderTrackingPage from './pages/customer/OrderTrackingPage';
import MyOrdersPage from './pages/customer/MyOrdersPage';
import KitchenLogin from './pages/kitchen/KitchenLogin';
import KitchenDashboard from './pages/kitchen/KitchenDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Customer QR entry & Menu */}
            <Route path="/" element={<Navigate to="/menu?table=1" replace />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:id" element={<OrderTrackingPage />} />

            {/* Customer Login & My Orders */}
            <Route path="/login" element={<CustomerLogin />} />
            <Route
              path="/orders/my"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN']}>
                  <MyOrdersPage />
                </ProtectedRoute>
              }
            />

            {/* Kitchen */}
            <Route path="/kitchen/login" element={<KitchenLogin />} />
            <Route
              path="/kitchen"
              element={
                <ProtectedRoute allowedRoles={['KITCHEN', 'ADMIN']}>
                  <KitchenDashboard />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/menu" replace />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
