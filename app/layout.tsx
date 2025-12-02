import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientI18nLoader from "@/components/ClientI18nLoader";

const quicksandFont = Quicksand({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
});

// const _mali = Mali({ weight: ["400", "600", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Farmstellar - Learn Sustainable Farming",
  description: "Gamified farming education app for beginners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${quicksandFont.className}  antialiased`}>
        <ClientI18nLoader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
