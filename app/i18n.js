"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import ta from "../locales/ta.json";
import ml from "../locales/ml.json";
import hi from "../locales/hi.json";
import mr from "../locales/mr.json";

const resources = {
  en: { translation: en },
  ta: { translation: ta },
  ml: { translation: ml },
  hi: { translation: hi },
  mr: { translation: mr },
};

const instance = i18n.createInstance();

// Initialize synchronously using English as the initial language so that
// server-rendered markup (which is English) matches the client's initial render.
// The client-side `ClientI18nLoader` will run after hydration and apply the
// preferred language (from cookie/localStorage/geo) by calling
// `instance.changeLanguage(...)`.
instance.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default instance;
