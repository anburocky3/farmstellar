"use client";

import { AdminAuthProvider } from "@/lib/adminAuthContext";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export default function AdminLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminAuthGuard>
        <div className="min-h-screen bg-background">{children}</div>
      </AdminAuthGuard>
    </AdminAuthProvider>
  );
}
