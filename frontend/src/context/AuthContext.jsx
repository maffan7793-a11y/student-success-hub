import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { setTokens, clearTokens } from "../api/axios";
import { fetchMe } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null); // "student" | "admin" | "super_admin"
  const [loading, setLoading] = useState(true);

  const loadMe = useCallback(async () => {
    const token = localStorage.getItem("ssh_access_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const data = await fetchMe();
      setUser(data.user);
      setRole(data.role);
    } catch {
      clearTokens();
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = (authResponse, userRole) => {
    setTokens(authResponse);
    setUser(authResponse.student || authResponse.admin);
    setRole(userRole);
  };

  const logout = () => {
    clearTokens();
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, login, logout, refresh: loadMe, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
