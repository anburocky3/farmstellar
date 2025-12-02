import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import ClientI18nLoader from "@/components/ClientI18nLoader";
import PWAProvider from "@/components/PWAProvider";

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
      <head>
        <meta name="theme-color" content="#4CAF50" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${quicksandFont.className}  antialiased`}>
        <ClientI18nLoader />
        <PWAProvider />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
