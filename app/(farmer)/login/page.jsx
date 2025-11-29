"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function FarmerLogin({ onSuccess, onBack, isSignup = false }) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handlePhonePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const digitsOnly = pastedText.replace(/\D/g, "").slice(0, 10);
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phone.length !== 10) return;

    // Send OTP and handle submission logic here
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/verify-otp?phone=${phone}&isSignup=${isSignup}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-linear-to-br from-background via-muted/30 to-background">
      <Card className="w-full max-w-md p-8 bg-card border-[1.5px] border-border rounded-2xl shadow-[0_2px_8px_rgba(107,166,115,0.08),0_1px_3px_rgba(107,166,115,0.04)] hover:shadow-[0_4px_12px_rgba(107,166,115,0.12),0_2px_6px_rgba(107,166,115,0.08)] hover:-translate-y-0.5 transition-all">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {isSignup
              ? "Enter your phone number to get started"
              : "Enter your phone number to login"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">Mobile Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                placeholder="9876543210"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                onPaste={handlePhonePaste}
                className="pl-12"
                required
              />
            </div>
            {phone.length > 0 && phone.length !== 10 && (
              <p className="text-xs text-destructive">
                Please enter a valid 10-digit phone number
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={phone.length !== 10 || isSubmitting}
          >
            {isSubmitting ? "Sending OTP..." : "Continue"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={onBack}
          >
            Back to Welcome
          </Button>
        </form>
      </Card>
    </div>
  );
}
