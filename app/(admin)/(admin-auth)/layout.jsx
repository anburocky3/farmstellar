"use client";

import { AdminAuthProvider } from "@/lib/adminAuthContext";
import { AdminAuthGuard } from "@/components/admin/AdminAuthGuard";

export default function AdminAuthLayout({ children }) {
  return (
    <AdminAuthProvider>
      <AdminAuthGuard>{children}</AdminAuthGuard>
    </AdminAuthProvider>
  );
}
