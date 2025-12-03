"use client";

import { useState } from "react";
import { ChevronLeft, Mail, Key } from "lucide-react";
import Link from "next/link";

export default function AdminLoginScreen() {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");

  const handleLogin = () => {
    if (email && passkey) {
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Link
          href={"/"}
          className="p-2 hover:bg-muted rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold">Admin Login</h1>
        <div className="w-9"></div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
              <Key className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Admin Access
            </h2>
            <p className="text-sm text-muted-foreground">
              Enter your organization credentials
            </p>
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Organization Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@organization.com"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <Key className="w-4 h-4 text-muted-foreground" />
                Passkey
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter your passkey"
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={!email || !passkey}
              className="w-full bg-white text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Login as Admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
