import * as React from "react";
import { clearStoredToken, getStoredToken, setStoredToken } from "@/api/apiClient";
import * as authApi from "@/api/authApi";
import { clearDemoStorage } from "@/utils/storageCleanup";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  avatar?: string;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  token: string | null;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [token, setToken] = React.useState<string | null>(null);

  const refresh = React.useCallback(async () => {
    clearDemoStorage();
    const t = getStoredToken();
    setToken(t);
    if (!t) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.me();
      const u = res?.data?.user;
      setUser(u || null);
    } catch {
      clearStoredToken();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  const login = React.useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const t = res?.data?.token || res?.token;
    const u = res?.data?.user || res?.data?.me || null;
    if (!t) throw new Error("Missing token");
    clearDemoStorage();
    setStoredToken(t);
    setToken(t);
    setUser(u);
    // ensure we have fresh user shape
    await refresh();
  }, [refresh]);

  const register = React.useCallback(async (payload: { name: string; email: string; password: string; phone?: string }) => {
    const res = await authApi.register(payload);
    const t = res?.data?.token || res?.token;
    const u = res?.data?.user || null;
    if (!t) throw new Error("Missing token");
    clearDemoStorage();
    setStoredToken(t);
    setToken(t);
    setUser(u);
    await refresh();
  }, [refresh]);

  const logout = React.useCallback(() => {
    authApi.logout?.().catch(() => {});
    clearStoredToken();
    clearDemoStorage();
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = { user, loading, token, refresh, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
