"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAuthenticated, getStoredToken, logout } from "@/lib/auth";
import { toast } from "react-hot-toast";
import NavigationMenu from "@/components/common/navigation-menu";
import { UserProvider } from "@/lib/userContext";

/**
 * AuthGuard Layout
 * Protects all child routes in (farmer-auth) by checking JWT authentication.
 * Unauthenticated users are redirected to /login.
 * Also fetches and displays current user details.
 */
export default function FarmerAuthLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [userData, setUserData] = useState(null);

  const handleLogout = async () => {
    try {
      // Call the comprehensive logout utility
      // This clears localStorage and calls server logout endpoint
      await logout(true);
      // Notify user
      try {
        toast.success("Logged out successfully");
      } catch (e) {
        /* ignore toast errors */
      }
      // Redirect to login
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      // Even if server logout fails, redirect to login
      // because localStorage is already cleared
      router.push("/login");
    }
  };

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      // Redirect to login if not authenticated
      router.push("/login");
    } else {
      // User is authenticated, fetch user details
      fetchUserData();
    }
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = getStoredToken();
      if (!token) {
        setIsChecking(false);
        return;
      }

      const res = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn("Failed to fetch user data:", res.status);
        setIsChecking(false);
        return;
      }

      const data = await res.json();
      if (data.success && data.user) {
        setUserData(data.user);
        // Optionally cache user data in localStorage
        try {
          localStorage.setItem("farmquest_userdata", JSON.stringify(data.user));
        } catch (e) {
          console.warn("Failed to cache user data", e);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setIsChecking(false);
    }
  };

  // Show nothing while checking authentication to avoid flash of content
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleNavigate = (screen) => {
    const routes = {
      "farmer-dashboard": "/dashboard",
      "quests-list": "/quests",
      community: "/community",
      rewards: "/rewards",
      "farmer-profile": "/settings/profile",
      settings: "/settings",
      "impact-tracker": "/impact",
    };

    if (routes[screen]) {
      router.push(routes[screen]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        onLogout={handleLogout}
        currentScreen={pathname}
        onNavigate={handleNavigate}
        userType="farmer"
        userData={userData}
      />
      <UserProvider value={userData}>{children}</UserProvider>
    </div>
  );
}
