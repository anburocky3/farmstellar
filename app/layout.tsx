import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "react-hot-toast";
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
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/icons/icon-180x180.png" />
        <meta name="apple-mobile-web-app-title" content="Farmstellar" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${quicksandFont.className}  antialiased`}>
        <ClientI18nLoader />
        <PWAProvider />
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "max-sm:!bottom-4 max-sm:!top-auto max-sm:!left-1/2 max-sm:!-translate-x-1/2 max-sm:!right-auto",
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
