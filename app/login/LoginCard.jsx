"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function LoginCard({ OTPSent }) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    OTPSent(phone);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="phone" className="font-semibold">
          Mobile Number
        </Label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-base!">
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
            className="pl-12 text-base! "
            required
          />
        </div>
        {phone.length > 0 && phone.length !== 10 && (
          <p className="text-xs text-medium text-destructive">
            Please enter a valid 10-digit phone number
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full font-semibold text-base!"
        disabled={phone.length !== 10 || isSubmitting}
      >
        {isSubmitting ? "Sending OTP..." : "Continue"}
      </Button>
      <p className="text-medium text-shadow-green-800 mt-8 text-center">
        Learn. Grow. Sustain.
      </p>
    </form>
  );
}
