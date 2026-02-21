"use client";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getUser, logout } from "../services/authService";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { api } from "src/lib/api";

interface User {
  id: number;
  name: string;
  email: string;
  is_super_admin?: boolean;
  tenant_id?: number | null;
  roles?: string[];
  permissions?: string[];
}

interface MeResponse extends User {
  roles: string[];
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  me: MeResponse | null;
  loading: boolean;
  can: (permission: string) => boolean;
  canAny: (permissions: string[]) => boolean;
  handleLogout: () => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  useEffect(() => {
    const storedUser = getUser();

    if (storedUser) {
      setUser(storedUser);
      if (Array.isArray(storedUser.permissions) && Array.isArray(storedUser.roles)) {
        setMe({
          ...storedUser,
          roles: storedUser.roles,
          permissions: storedUser.permissions,
        });
      }

      // ✅ যদি ইউজার লগইন করা অবস্থায় login/register পেজে যায়, redirect করো
      if (isAuthPage) {
        router.push(storedUser.is_super_admin ? "/superadmin/dashboard" : "/dashboard");
      }
    } else {
      // ✅ লগইন না করা অবস্থায় অন্য পেজে গেলে login এ রিডাইরেক্ট করো
      if (!isAuthPage) {
        router.push("/login");
      }
    }
  }, [pathname, router]);

  const refreshMe = useCallback(async (withLoading: boolean = false) => {
    if (typeof window !== "undefined") {
      const token =
        localStorage.getItem("token_impersonation") || localStorage.getItem("token");
      if (!token) {
        setMe(null);
        if (withLoading) setLoading(false);
        return;
      }
    }

    if (withLoading) setLoading(true);
    try {
      const res = await api.get<MeResponse>("/me");
      setMe(res.data);
      setUser(res.data);
    } catch (err) {
      console.warn("Failed to refresh user:", err);
    } finally {
      if (withLoading) setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.warn("Logout failed");
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMe(null);
    router.push("/login");
  };

  useEffect(() => {
    refreshMe(true);
  }, [refreshMe]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleImpersonationChanged = () => {
      refreshMe(false);
    };
    window.addEventListener("impersonation-changed", handleImpersonationChanged);
    return () => window.removeEventListener("impersonation-changed", handleImpersonationChanged);
  }, [refreshMe]);

  // 🚦 permission helpers
  const permissionSet = useMemo(
    () => new Set(me?.permissions ?? user?.permissions ?? []),
    [me, user]
  );
  const can = (permission: string): boolean => {
    const currentUser = me ?? user;

    // 🔥 Super Admin → সব permission allow
    if (currentUser?.is_super_admin) {
      return true;
    }

    // ❌ permission না থাকলে deny
    if (!permission) {
      return false;
    }

    // ⛔ always boolean return
    return Boolean(
      currentUser &&
      Array.isArray(currentUser.permissions) &&
      currentUser.permissions.includes(permission)
    );
  };


  // MULTIPLE permission check (any)
  const canAny = (permissions: string[]): boolean => {
    const currentUser = me ?? user;

    if (currentUser?.is_super_admin) return true;
    if (!Array.isArray(permissions) || permissions.length === 0) return false;

    return permissions.some((p) => permissionSet.has(p));
  };

  return (
    <AuthContext.Provider value={{ user, setUser, me, loading, can, canAny, handleLogout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
