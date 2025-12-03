"use client";

import { useEffect, useState } from "react";

export default function PWAProvider() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    let timer = null;

    function onBeforeInstallPrompt(e) {
      try {
        e.preventDefault();
      } catch (err) {}
      setDeferredPrompt(e);
      // Show custom install banner after a short delay. Use a shorter delay on mobile.
      const mobileDelay = 3000; // 3s on mobile for better UX
      const desktopDelay = 30000; // 30s on desktop
      const delay = /Mobi|Android/i.test(navigator.userAgent)
        ? mobileDelay
        : desktopDelay;
      timer = setTimeout(() => setShowBanner(true), delay);
    }

    function onAppInstalled() {
      setInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    }

    if (typeof window !== "undefined") {
      // Detect iOS (Safari) where beforeinstallprompt is not fired
      const ua = navigator.userAgent || "";
      // Treat iOS if userAgent contains iPhone|iPad|iPod
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsIos(/iphone|ipad|ipod/i.test(ua));

      // If iOS and not already in standalone mode, show banner after short delay
      const isStandalone =
        (window.matchMedia &&
          window.matchMedia("(display-mode: standalone)").matches) ||
        window.navigator.standalone === true;
      if (/iphone|ipad|ipod/i.test(ua) && !isStandalone) {
        // show iOS install hint after 3s
        timer = setTimeout(() => setShowBanner(true), 3000);
      }
      window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.addEventListener("appinstalled", onAppInstalled);

      // Register service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            // console.log('SW registered', reg);
          })
          .catch((err) => {
            // console.warn('SW registration failed', err);
          });
      }
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      if (timer) clearTimeout(timer);
    };
  }, []);

  // Expose a short method to trigger the prompt immediately (e.g., after user action)
  async function triggerInstallPrompt() {
    // If there is no deferred prompt but this is iOS, show instructions
    if (!deferredPrompt) {
      if (isIos) {
        setShowInstructions(true);
        return;
      }
      // show banner as a fallback
      setShowBanner(true);
      return;
    }
    try {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      // choice.outcome === 'accepted' | 'dismissed'
      if (choice && choice.outcome === "accepted") {
        setInstalled(true);
      }
      setShowBanner(false);
      setDeferredPrompt(null);
    } catch (e) {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  }

  // Quick shortcut for CTA on pages (other pages can call this by setting localStorage flag)
  useEffect(() => {
    function onShowInstallNow() {
      // for example a landing CTA may set localStorage.setItem('farmstellar_prompt', '1')
      const val = localStorage.getItem("farmstellar_prompt");
      if (val === "1") {
        // show immediately
        setShowBanner(true);
      }
    }
    onShowInstallNow();
    window.addEventListener("storage", onShowInstallNow);
    return () => window.removeEventListener("storage", onShowInstallNow);
  }, []);

  return (
    <>
      {/* Minimal, accessible install banner */}
      {showBanner && !installed && (
        <div
          id="pwa-install-banner"
          style={{
            position: "fixed",
            left: "600px",
            right: "600px",
            bottom: "60px",
            zIndex: 9999,
            background: "white",
            color: "#064e3b",
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            padding: "12px 14px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <img
              src="/logo.png"
              alt="Farmstellar Logo"
              width={44}
              height={44}
              style={{ display: "block" }}
            />
            <div style={{ fontSize: 14 }}>
              <div style={{ fontWeight: 700 }}>Install Farmstellar</div>
              <div style={{ fontSize: 13, color: "#334155" }}>
                Install Farmstellar for offline access and better performance!
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                setShowBanner(false);
              }}
              style={{
                background: "transparent",
                border: "1px solid #cbd5e1",
                padding: "8px 12px",
                borderRadius: 8,
                color: "#334155",
              }}
            >
              Dismiss
            </button>
            <button
              onClick={triggerInstallPrompt}
              style={{
                background: "#16a34a",
                border: "none",
                padding: "8px 14px",
                borderRadius: 8,
                color: "white",
                fontWeight: 700,
              }}
            >
              Install
            </button>
          </div>
        </div>
      )}
      {/* iOS-specific instructions modal */}
      {showInstructions && (
        <div
          id="pwa-ios-instructions"
          style={{
            position: "fixed",
            left: "12px",
            right: "12px",
            bottom: "20px",
            zIndex: 10000,
            background: "white",
            color: "#064e3b",
            borderRadius: 12,
            boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            padding: "14px",
          }}
        >
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>
                Install Farmstellar
              </div>
              <div style={{ color: "#334155", fontSize: 13, marginBottom: 8 }}>
                To install on iPhone or iPad: tap the <strong>Share</strong>{" "}
                button in Safari, then choose{" "}
                <strong>Add to Home Screen</strong>.
              </div>
              <div style={{ color: "#334155", fontSize: 13 }}>
                After adding, open the app from your Home Screen for the best
                experience.
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => setShowInstructions(false)}
                style={{
                  background: "transparent",
                  border: "1px solid #cbd5e1",
                  padding: "8px 12px",
                  borderRadius: 8,
                  color: "#334155",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
