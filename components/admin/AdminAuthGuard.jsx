"use client";

import { useAdminAuth } from "@/lib/adminAuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminAuthGuard({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && !pathname.includes("/admin/login")) {
      router.push("/admin/login");
    }

    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname.includes("/admin/login")) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
}
