"use client";

import LoginCard from "./LoginCard";
import VerifyOTP from "./VerifyOTP";
import { useMemo, useState } from "react";
import { Leaf, User, UserCog, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginOTPWrapper() {
  // login | verify-otp
  const [section, setSection] = useState("login");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleOTPSent = (phone) => {
    setSection("verify-otp");
    setPhone(phone);
  };

  const handleVerifyOTP = (phone) => {
    console.log("[v0] OTP verified for phone:", phone);
    // If otp with phone matches, then Proceed to onboarding or dashboard

    // If it is first time login, redirect to onboarding
    if (true) {
      router.push(`/onboarding`);
    } else {
      router.push(`/dashboard`);
    }
  };

  return (
    <>
      <div className="relative z-10 flex flex-col items-center bg-white/40 p-8 rounded-3xl shadow-lg backdrop-blur-md max-w-lg w-full">
        {section === "login" && (
          <div className="flex items-start justify-center mb-6 space-x-6">
            <div className="center-flex w-20s sh-20 bg-primary rounded-3xl  shadow-lg mt-2">
              <Leaf className="icon-2xl text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-display text-foreground mb-2 text-3xl">
                FarmStellar
              </h1>
              <p className="mx-auto text-sm">
                Master sustainable farming through interactive quests and earn
                rewards
              </p>
            </div>
          </div>
        )}

        <div className="w-full max-w-md space-y-4">
          {section === "login" ? (
            <LoginCard OTPSent={handleOTPSent} />
          ) : (
            <VerifyOTP
              phone={phone}
              onOTPVerify={handleVerifyOTP}
              changeMobileNo={() => setSection("login")}
            />
          )}
        </div>
      </div>
      {section === "login" && (
        <div className="flex flex-col sm:flex-row items-center justify-center w-full max-w-2xl mx-auto mt-8 space-y-4 sm:space-x-4 z-10 text-sm">
          <Link
            href={"/login"}
            className="btn-primary w-full center-flex gap-3"
          >
            <User className="icon-sm" />
            Login as Farmer
          </Link>

          <Link
            href={"/admin-login"}
            className="btn-secondary w-full center-flex gap-3"
          >
            <UserCog className="icon-sm" />
            Login as Admin
          </Link>

          <Link href={"/login"} className="btn-accent w-full center-flex gap-3">
            <UserPlus className="icon-sm" />
            Login as Merchant
          </Link>
        </div>
      )}
    </>
  );
}
