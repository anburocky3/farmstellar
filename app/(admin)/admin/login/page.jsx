"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@farmstellar.com");
  const [passkey, setPasskey] = useState("123456");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasskey, setShowPasskey] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (loginSuccess) {
      router.push("/admin/dashboard");
    }
  }, [loginSuccess, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, passkey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store admin token and data
      localStorage.setItem("farmstellar_admin_token", data.token);
      localStorage.setItem("farmstellar_admin", JSON.stringify(data.admin));

      // Show success toast
      toast.success(`Welcome back, ${data.admin.name}!`, {
        duration: 2000,
      });

      // Trigger redirect via useEffect
      setLoginSuccess(true);
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error(error.message || "Invalid credentials. Please try again.", {
        duration: 4000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-blue-500  to-blue-100">
      <Card className="w-full max-w-md p-8 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center mb-3">
          <div className="w-16 h-16 bg-destructive/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-destructive"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Admin Login
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your organization credentials
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="email" className="font-semibold">
              Organization Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@farmstellar.com"
              className="bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="passkey" className="font-semibold">
              Passkey
            </Label>
            <div className="relative">
              <Input
                id="passkey"
                type={showPasskey ? "text" : "password"}
                className="bg-gray-100"
                placeholder="Enter your secure passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                disabled={isSubmitting}
              >
                {showPasskey ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full font-semibold"
              disabled={!email || !passkey || isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Login"
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full text-xs"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Back to Home
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
