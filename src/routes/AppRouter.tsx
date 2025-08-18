import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import AnalyticsView from "../pages/view/AnalyticsView";
import ClientsView from "../pages/view/ClientsView.tsx";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../auth/useAuth";
import TasksView from "../pages/view/TasksView.tsx";
import SettingsView from "../pages/view/Settings.tsx";
import AboutView from "../pages/view/AboutView.tsx";
import FeedBackView from "../pages/view/FeedBackView.tsx";
import Checkout from "../pages/checkout/Checkout.tsx";
import ShopsListView from "../pages/view/ShopsListView.tsx";
import EmailVerified from "../components/EmailVerifiedView.tsx";
import LandingPage from "../pages/LandingPage/LandingPage.tsx";
import SignIn from "../pages/Login/SignIn.tsx";
import CouponsListView from "../pages/view/CouponsListView.tsx";
import ResetPassword from "../pages/Login/components/ResetPassword.tsx";
import ChatSupport from "../pages/ChatSupport/ChatSupport.tsx";
import Orders from "../pages/orders/orders.tsx";
import DashboardView from "../pages/dashboard/components/DashboardView.tsx";
import PaymentGateway from "../pages/paymentGateway/PaymentGateway.tsx";
import Customers from "../pages/customers/Customers.tsx";
import Plan from "../pages/plan/Plan.tsx";
import Shops from "../pages/shops/Shops.tsx";

const AppRouter = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Root Route: decides based on authentication */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              role === "0" ? (
                <Navigate to="/superadmin-dashboard" />
              ) : (
                <Navigate to="/admin-dashboard" />
              )
            ) : (
              <LandingPage />
            )
          }
        />

        {/* Login Route */}
        <Route
          path="/signin"
          element={
            isAuthenticated ? (
              role === "0" ? (
                <Navigate to="/superadmin-dashboard" />
              ) : (
                <Navigate to="/admin-dashboard" />
              )
            ) : (
              <SignIn />
            )
          }
        />

        {/* Email Verification and Password Reset */}
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardView />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="orders" element={<Orders />} />
          <Route path="coupons" element={<CouponsListView />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-gateway" element={<PaymentGateway />} />
          <Route path="chatSupport" element={<ChatSupport />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="about" element={<AboutView />} />
          <Route path="feedback" element={<FeedBackView />} />
        </Route>

        {/* Superadmin Dashboard (Protected) */}
        <Route
          path="/superadmin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardView />} />
          <Route path="dashboard" element={<DashboardView />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="orders" element={<Orders />} />
          <Route path="shops" element={<Shops />} />
           <Route path="plan" element={<Plan />} />
          <Route path="payment-gateway" element={<PaymentGateway />} />
          <Route path="chatSupport" element={<ChatSupport />} />
          <Route path="settings" element={<SettingsView />} />
          <Route path="about" element={<AboutView />} />
          <Route path="feedback" element={<FeedBackView />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
