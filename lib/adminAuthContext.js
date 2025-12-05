"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminAuthContext = createContext();

export function AdminAuthProvider({ children }) {
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("farmstellar_admin_token");
      const adminInfo = localStorage.getItem("farmstellar_admin");

      if (token && adminInfo) {
        try {
          const admin = JSON.parse(adminInfo);
          setAdminData(admin);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing admin data:", error);
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setAdminData(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("farmstellar_admin_token");
    localStorage.removeItem("farmstellar_admin");
    setAdminData(null);
    setIsAuthenticated(false);
    router.push("/admin/login");
  };

  return (
    <AdminAuthContext.Provider
      value={{
        adminData,
        isAuthenticated,
        isLoading,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
