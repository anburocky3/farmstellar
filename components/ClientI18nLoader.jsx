"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import i18n from "../app/i18n";
import { loadFontForCode } from "../lib/font";
import { Languages } from "lucide-react";

export default function ClientI18nLoader() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    let toastTimer = null;

    // Use shared loader

    async function detectAndApply() {
      let chosen = "en";
      let userSelected = false;
      let detectedAutomatically = false;
      let detectionSource = null; // 'navigator' | 'geo'

      // 0) Pre-hydration fast path (hint set by layout inline script)
      try {
        const pre = window && window.__FARMSTELLAR_LANG;
        if (pre) chosen = pre;
      } catch (e) {}

      // 1) cookie
      try {
        const cookieMatch = document.cookie.match(
          /(^|;)\s*farmstellar_lang=([^;]+)/
        );
        if (cookieMatch && cookieMatch[2]) {
          chosen = cookieMatch[2];
        }
      } catch (e) {}

      // 2) localStorage (allow overriding cookie)
      try {
        const stored = localStorage.getItem("farmstellar_lang");
        if (stored) chosen = stored;
      } catch (e) {}

      // If the user has explicitly selected a language previously, skip auto-detection
      try {
        userSelected = !!localStorage.getItem("farmstellar_lang_user");
      } catch (e) {
        userSelected = false;
      }

      // 3) navigator language (only if we still have english)
      try {
        if (!userSelected && (!chosen || chosen === "en")) {
          const nav = (
            navigator.language ||
            navigator.userLanguage ||
            ""
          ).toLowerCase();
          if (nav.startsWith("ta")) {
            chosen = "ta";
            detectedAutomatically = true;
            detectionSource = "navigator";
          } else if (nav.startsWith("ml")) {
            chosen = "ml";
            detectedAutomatically = true;
            detectionSource = "navigator";
          } else if (nav.startsWith("mr")) {
            chosen = "mr";
            detectedAutomatically = true;
            detectionSource = "navigator";
          } else if (nav.startsWith("hi")) {
            chosen = "hi";
            detectedAutomatically = true;
            detectionSource = "navigator";
          }
        }
      } catch (e) {}

      // 4) IP geolocation as a final best-effort (only if still english and user hasn't chosen)
      try {
        if (!userSelected && mounted && (!chosen || chosen === "en")) {
          const resp = await fetch("https://ipapi.co/json/");
          if (resp.ok) {
            const data = await resp.json();
            if (data && data.country === "IN") {
              const region = (data.region || "").toLowerCase();
              if (region.includes("tamil") || region.includes("chennai")) {
                chosen = "ta";
                detectedAutomatically = true;
                detectionSource = "geo";
              } else if (
                region.includes("kerala") ||
                region.includes("thiruvananthapuram") ||
                region.includes("kochi")
              ) {
                chosen = "ml";
                detectedAutomatically = true;
                detectionSource = "geo";
              } else if (
                region.includes("maharashtra") ||
                region.includes("mumbai") ||
                region.includes("pune")
              ) {
                chosen = "mr";
                detectedAutomatically = true;
                detectionSource = "geo";
              } else {
                chosen = "hi";
                detectedAutomatically = true;
                detectionSource = "geo";
              }

              console.log(
                "Detected region",
                region,
                "choosing language",
                chosen
              );
            }
          }
        }
      } catch (e) {}

      // normalize
      if (!chosen) chosen = "en";
      chosen = (chosen || "en").toLowerCase();
      if (chosen.indexOf("-") !== -1) chosen = chosen.split("-")[0];
      const supported = ["en", "ta", "ml", "hi", "mr"];
      if (!supported.includes(chosen)) chosen = "en";

      // apply language, persist, set html lang and load font
      try {
        await i18n.changeLanguage(chosen);
      } catch (e) {
        // ignore
      }

      try {
        // persist
        try {
          localStorage.setItem("farmstellar_lang", chosen);
        } catch (e) {}
        try {
          document.cookie = `farmstellar_lang=${chosen};path=/;max-age=${
            60 * 60 * 24 * 365
          }`;
        } catch (e) {}

        // set html lang
        try {
          document.documentElement.lang = chosen;
        } catch (e) {}

        // load font (if any) and wait for it before revealing
        await loadFontForCode(chosen);
      } catch (e) {}

      // If we auto-detected the language, show a short toast so user knows and can change in settings
      try {
        if (!userSelected && detectedAutomatically && mounted) {
          const langNames = {
            en: "English",
            ta: "தமிழ்",
            ml: "മലയാളം",
            hi: "हिन्दी",
            mr: "मराठी",
          };
          const langLabel = langNames[chosen] || chosen;
          // const sourceKey =
          //   detectionSource === "geo" ? "i18n.source_geo" : "i18n.source_nav";
          const message = i18n.t("i18n.detected_auto", {
            lang: langLabel,
            source: i18n.t(i18n.source_geo),
          });
          setToastMessage(message);
          setShowToast(true);
          // Hide after 5s
          toastTimer = setTimeout(() => setShowToast(false), 50000);
        }
      } catch (e) {}
    }

    (async () => {
      await detectAndApply();
      if (mounted) document.documentElement.setAttribute("data-i18n", "ready");
    })();

    return () => {
      mounted = false;
      if (toastTimer) clearTimeout(toastTimer);
    };
  }, [router]);

  return (
    <>
      {showToast && (
        <div className="fixed mx-4 bottom-4  right-4  z-50 animate-slide-down">
          <div className="bg-accent text-accent-foreground px-4 py-3 rounded-2xl shadow-2xl border-2 border-accent/30 flex flex-col items-center gap-3 max-w-3xl">
            <div className="text-sm">{toastMessage}</div>
            <div className="sm:ml-2 flex items-center space-x-4 gap-2">
              <button
                className="text-sm underline"
                onClick={() => {
                  setShowToast(false);
                  try {
                    router.push("/settings");
                  } catch (e) {
                    window.location.href = "/settings";
                  }
                }}
              >
                Settings
              </button>
              <button
                aria-label={i18n.t("i18n.dismiss")}
                className="text-sm opacity-80"
                onClick={() => setShowToast(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
