"use client";

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function LoginCard({ phone: initialPhone, OTPSent }) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState(initialPhone || "");

  useEffect(() => {
    // Only update internal state when the incoming prop actually changes.
    if ((initialPhone || "") !== phone) {
      setPhone(initialPhone || "");
    }
    // We intentionally only depend on initialPhone so typing won't continuously
    // trigger updates; comparison ensures we don't overwrite user input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPhone]);

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
          {t("login.mobileLabel")}
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
            placeholder={t("login.placeholder")}
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
            {t("login.invalidPhone")}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full font-semibold text-base!"
        disabled={phone.length !== 10 || isSubmitting}
      >
        {isSubmitting ? t("login.sendingOTP") : t("login.continue")}
      </Button>
      <p className="text-medium text-shadow-green-800 mt-4 sm:mt-8 text-center">
        {t("login.footerTagline")}
      </p>
    </form>
  );
}
