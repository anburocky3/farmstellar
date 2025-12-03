"use client";

import LoginCard from "./LoginCard";
import VerifyOTP from "./VerifyOTP";
import { useMemo, useState } from "react";
import { Leaf, User, UserCog, UserPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import LanguageSelector from "@/components/ui/LanguageSelector";

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
      <div className="relative z-10 flex flex-col items-center bg-white/40 p-8 rounded-xl sm:rounded-3xl shadow-lg backdrop-blur-md max-w-lg w-full ">
        {section === "login" && (
          <div className="flex items-start justify-center mb-6 space-x-6">
            <Link href={"/"} className="shrink-0">
              <Image
                src="/logo.png"
                alt="FarmStellar Logo"
                width={80}
                height={80}
                className="rounded-2xl"
              />
            </Link>
            <div>
              <div className="flex justify-between">
                <h1 className="text-display text-foreground mb-2 text-3xl mr-2 font-sans!">
                  FarmStellar
                </h1>
                <LanguageSelector />
              </div>
              <p className="mx-auto text-sm font-sans!">
                Master sustainable farming through interactive quests and earn
                rewards
              </p>
            </div>
          </div>
        )}

        <div className="w-full max-w-md space-y-4">
          {section === "login" ? (
            <LoginCard phone={phone} OTPSent={handleOTPSent} />
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
        <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row items-center justify-center w-full max-w-2xl mx-auto mt-12 space-y-4s sm:space-x-4 z-10 text-sm font-sans!">
          <button
            type="button"
            onClick={() => setPhone("8939738801")}
            className="bg-green-600 px-4 py-4 rounded-lg font-bold hover:bg-green-700/95 text-white w-full center-flex gap-3 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            <User className="icon-sm" />
            Login as Farmer
          </button>

          <Link
            href={"/merchant/login"}
            className="bg-yellow-500 px-4 py-4 rounded-lg font-bold hover:bg-yellow-600 text-black w-full center-flex gap-3 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            <UserPlus className="icon-sm" />
            Login as Merchant
          </Link>

          <Link
            href={"/admin/login"}
            className="bg-white px-4 py-4 rounded-lg font-bold hover:bg-gray-100 text-black w-full center-flex gap-3 cursor-pointer hover:scale-105 transition-transform duration-200 shadow-lg"
          >
            <UserCog className="icon-sm" />
            Login as Admin
          </Link>
        </div>
      )}
    </>
  );
}
