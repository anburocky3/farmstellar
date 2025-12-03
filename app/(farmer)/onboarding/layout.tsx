import type { Metadata } from "next";
import Image from "next/image";
import LanguageSelector from "@/components/ui/LanguageSelector";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding - Farmstellar",
  description: "Get Started with Farmstellar",
};

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col center-flex relative overflow-hidden">
      <div className="absolute top-7 right-0 sm:top-10 sm:right-10 m-4 z-10">
        <div className="relative ">
          <LanguageSelector />
        </div>
      </div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-xs hidden sm:flex"
        style={{ backgroundImage: "url('/farm-landscape-background.jpg')" }}
      />
      <Link
        href={"/"}
        className="relative sm:bg-green-800/60 rounded flex items-center! justify-start sm:justify-center space-x-3 sm:space-x-6 z-10 max-w-2xl mx-auto px-4 py-1 mb-10 w-full sm:w-fit"
      >
        <Image
          src="/logo.png"
          alt="FarmStellar Logo"
          width={50}
          height={50}
          className="rounded-2xl"
        />
        <h1 className="text-display sm:text-white text-shadow-2xs text-foreground text-3xl font-sans!">
          FarmStellar
        </h1>
      </Link>
      {children}
    </div>
  );
}
