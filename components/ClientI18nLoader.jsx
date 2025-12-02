"use client";

import { useEffect } from "react";
import i18n from "../app/i18n";
import { loadFontForCode } from "../lib/font";
export default function ClientI18nLoader() {
  useEffect(() => {
    let mounted = true;

    // Use shared loader

    async function detectAndApply() {
      let chosen = "en";

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

      // 3) navigator language (only if we still have english)
      // If the user has explicitly selected a language previously, skip auto-detection
      let userSelected = false;
      try {
        userSelected = !!localStorage.getItem("farmstellar_lang_user");
      } catch (e) {
        userSelected = false;
      }

      try {
        if (!userSelected && (!chosen || chosen === "en")) {
          const nav = (
            navigator.language ||
            navigator.userLanguage ||
            ""
          ).toLowerCase();
          if (nav.startsWith("ta")) chosen = "ta";
          else if (nav.startsWith("ml")) chosen = "ml";
          else if (nav.startsWith("mr")) chosen = "mr";
          else if (nav.startsWith("hi")) chosen = "hi";
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
              if (region.includes("tamil") || region.includes("chennai"))
                chosen = "ta";
              else if (
                region.includes("kerala") ||
                region.includes("thiruvananthapuram") ||
                region.includes("kochi")
              )
                chosen = "ml";
              else if (
                region.includes("maharashtra") ||
                region.includes("mumbai") ||
                region.includes("pune")
              )
                chosen = "mr";
              else chosen = "hi";

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
    }

    (async () => {
      await detectAndApply();
      if (mounted) document.documentElement.setAttribute("data-i18n", "ready");
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return null;
}
