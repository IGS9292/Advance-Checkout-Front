import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

// Define user shape
interface User {
  id: string;
  role: string;
  token: string;
  email: string;
  
  shopName?: string;
}

// Define context value shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  role: string | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

// Create context with undefined initially
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false); // Done loading
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    // console.log("userData:", userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const value: AuthContextType & { loading: boolean } = {
    user,
    isAuthenticated: !!user,
    role: user?.role?.toString() || null,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Typed custom hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
