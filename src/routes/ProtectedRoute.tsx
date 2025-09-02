import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import type { ReactNode } from "react";
import Loader from "../shared/components/Loader";
import { showToast } from "../helper/toastHelper";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role, loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(role ?? ""))
    return <Navigate to="/unauthorized" />;

  if (!user?.activePlanId) {
    const isBillingPage = location.pathname.startsWith(
      "/admin-dashboard/billing"
    );
    const isPlansPage = location.pathname === "/admin-dashboard/plans-view";

    if (!isBillingPage && !isPlansPage) {
      showToast.error("No access, please buy a plan first");
      return <Navigate to="/admin-dashboard/plans-view" />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
