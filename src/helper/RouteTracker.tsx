// In a top-level component like App.tsx
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import type { RootState } from "../store";
import { useAuth } from "../contexts/AuthContext";

const RouteTracker = () => {
  const location = useLocation();
  const { role } = useAuth();

  useEffect(() => {
    localStorage.setItem("lastPath", location.pathname + location.search);
  }, [location]);

  return null;
};

export default RouteTracker;
