import React, { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
  setAccessToken,
  setUser
} from "../store/authSlice";
import type { RootState, AppDispatch } from "../store";
import { getCurrentUser, refreshAccessToken } from "../services/AuthService";

export interface User {
  id: string;
  role: string;
  token: string;
  email: string;
  shopName?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (credentials: {
    email: string;
    password: string;
    token: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  const { user, accessToken, loading } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const newAccessToken = await refreshAccessToken();
        dispatch(setAccessToken(newAccessToken));
        // Fetch user object
        const userData = await getCurrentUser(newAccessToken);
        dispatch(setUser(userData));

        const lastPath = localStorage.getItem("lastPath");
        if (lastPath && window.location.pathname !== lastPath) {
          window.history.replaceState({}, "", lastPath);
        }
      } catch {
        dispatch(logoutAction());
      }
    };
    restoreSession();
  }, [dispatch]);

  const login = async (credentials: {
    email: string;
    password: string;
    token: string;
  }) => {
    try {
      // Login call
      const data = await dispatch(loginAction(credentials)).unwrap();

      // data contains { user, token }
      dispatch(setAccessToken(data.token));
    } catch (err) {
      throw err; // propagate error to UI
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const authValue: AuthContextType = {
    user: user ? { ...user, token: accessToken || "" } : null,
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
