import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import MainGrid from "../pages/dashboard/components/MainGrid";
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
import ResetPasswordPage from "../components/ResetPasswordPage.tsx";
import SupportView from "../pages/view/SupportView.tsx";
import Signup from "../pages/Signup.tsx";
import EmailVerified from "../components/EmailVerifiedView.tsx";
// import AddShop from "../pages/LandingPage/components/AddShop.tsx";
import LandingPage from "../pages/LandingPage/LandingPage.tsx";
import SignIn from "../pages/Login/SignIn.tsx";
import CouponsListView from "../pages/view/CouponsListView.tsx";

const AppRouter = () => {
  const { isAuthenticated, role } = useAuth();

  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<AddShop />}></Route>
    //     <Route
    //       path="/login"
    //       element={
    //         isAuthenticated ? (
    //           role === "0" ? (
    //             <Navigate to="/superadmin-dashboard" />
    //           ) : (
    //             <Navigate to="/admin-dashboard" />
    //           )
    //         ) : (
    //           <Login />
    //         )
    //       }
    //     />
    //     <Route path="/email-verified" element={<EmailVerified />} />

    //     <Route
    //       path="/signup"
    //       element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
    //     />

    //     {/* <Route path="/request-reset" element={<RequestReset />} />
    //     <Route path="/reset-password/:token" element={<ResetPassword />} /> */}
    //     <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
    //     <Route
    //       path="/"
    //       element={
    //         <ProtectedRoute>
    //           <Dashboard />
    //         </ProtectedRoute>
    //       }
    //     >
    //       <Route index element={<MainGrid />} />
    //       <Route path="dashboard" element={<MainGrid />} />
    //       <Route path="analytics" element={<AnalyticsView />} />
    //       <Route path="clients" element={<ClientsView />} />
    //       <Route path="tasks" element={<TasksView />} />
    //       <Route path="settings" element={<SettingsView />} />
    //       <Route path="about" element={<AboutView />} />
    //       <Route path="feedback" element={<FeedBackView />} />
    //       <Route
    //         path="checkout"
    //         element={role === "1" ? <Checkout /> : <Navigate to="/" />}
    //       />
    //       <Route
    //         path="shops"
    //         element={role === "0" ? <ShopsListView /> : <Navigate to="/" />}
    //       />
    //       <Route path="support" element={<SupportView />} />
    //     </Route>

    //     <Route path="*" element={<Navigate to="/" />} />
    //   </Routes>
    // </BrowserRouter>

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
        {/* <Route
          path="/login"
          element={
            isAuthenticated ? (
              role === "0" ? (
                <Navigate to="/superadmin-dashboard" />
              ) : (
                <Navigate to="/admin-dashboard" />
              )
            ) : (
              <Login />
            )
          }
        /> */}

        {/* Signup */}
        <Route
          path="/signup"
          element={isAuthenticated ? <Navigate to="/" /> : <Signup />}
        />

        {/* Email Verification and Password Reset */}
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MainGrid />} />
          <Route path="dashboard" element={<MainGrid />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="coupons" element={<CouponsListView />} />
          <Route path="support" element={<SupportView />} />
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
          <Route index element={<MainGrid />} />
          <Route path="dashboard" element={<MainGrid />} />
          <Route path="analytics" element={<AnalyticsView />} />
          <Route path="clients" element={<ClientsView />} />
          <Route path="tasks" element={<TasksView />} />
          <Route path="shops" element={<ShopsListView />} />
          <Route path="support" element={<SupportView />} />
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
