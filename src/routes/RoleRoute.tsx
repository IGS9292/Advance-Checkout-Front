import { Navigate } from "react-router-dom";
import React from "react";

interface RoleRouteProps {
  isAuthenticated: boolean;
  // role: string | null;
  role: string;
  requiredRole: string;
  children: React.ReactNode;
}

const RoleRoute = ({
  isAuthenticated,
  role,
  requiredRole,
  children
}: RoleRouteProps) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role !== requiredRole) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

export default RoleRoute;
