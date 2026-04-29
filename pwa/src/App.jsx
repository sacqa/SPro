import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/Layout';
import Splash from './pages/Splash';

const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const OTP = lazy(() => import('./pages/OTP'));
const SpeedMart = lazy(() => import('./pages/SpeedMart'));
const Pharmacy = lazy(() => import('./pages/Pharmacy'));
const SpeedSend = lazy(() => import('./pages/SpeedSend'));
const CustomOrder = lazy(() => import('./pages/CustomOrder'));
const Checkout = lazy(() => import('./pages/Checkout'));
const PaymentProof = lazy(() => import('./pages/PaymentProof'));
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Orders = lazy(() => import('./pages/Orders'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Profile = lazy(() => import('./pages/Profile'));
const Search = lazy(() => import('./pages/Search'));

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex items-center justify-center h-screen bg-primary"><div className="text-white text-2xl font-bold">Speedo</div></div>}>
            <Routes>
              <Route path="/splash" element={<Splash />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp" element={<OTP />} />
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="speedmart" element={<SpeedMart />} />
                <Route path="pharmacy" element={<Pharmacy />} />
                <Route path="speedsend" element={<SpeedSend />} />
                <Route path="custom" element={<CustomOrder />} />
                <Route path="search" element={<Search />} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="payment-proof/:orderId" element={<ProtectedRoute><PaymentProof /></ProtectedRoute>} />
                <Route path="order-confirmation/:orderId" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
                <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
                <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
