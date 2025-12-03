"use client";

import { useTranslation } from "react-i18next";
import { applyFontAndLang, loadFontForCode } from "../../lib/font";

const LANG_NAMES = {
  en: "English",
  ta: "தமிழ்",
  ml: "മലയാളം",
  hi: "हिन्दी",
  mr: "मराठी",
};

export default function LanguageSelector({ className = "" }) {
  const { i18n } = useTranslation();

  async function onChange(e) {
    const code = e.target.value;
    if (!code) return;
    try {
      await i18n.changeLanguage(code);
    } catch (e) {}
    try {
      // persist quickly
      localStorage.setItem("farmstellar_lang", code);
      document.cookie = `farmstellar_lang=${code};path=/;max-age=${
        60 * 60 * 24 * 365
      }`;
      document.documentElement.lang = code;
      // mark explicit user selection so geo won't override on future loads
      localStorage.setItem("farmstellar_lang_user", "1");
    } catch (e) {}

    // load font and apply style immediately so change is visible without reload
    try {
      await loadFontForCode(code);
    } catch (e) {}
  }

  const current = (i18n.language && i18n.language.split("-")[0]) || "en";

  return (
    <div className={" inline-block " + className}>
      <select
        aria-label="Select language"
        value={current}
        onChange={onChange}
        className="rounded-md border p-2 bg-transparent text-sm font-semibold"
      >
        {Object.entries(LANG_NAMES).map(([code, label]) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
