// Shared font loader utilities for language-specific Google Fonts
export function fontFamilyForCode(code) {
  const map = {
    en: null,
    ta: "Noto Sans Tamil",
    ml: "Noto Sans Malayalam",
    hi: "Noto Sans Devanagari",
    mr: "Noto Sans Devanagari",
  };
  return map[code] || null;
}

export function loadFontForCode(code) {
  return new Promise((resolve) => {
    try {
      const family = fontFamilyForCode(code);
      if (!family) return resolve();

      const id = `farm-font-${code}`;
      if (typeof document === "undefined") return resolve();
      if (document.getElementById(id)) return resolve();

      const famForUrl = family.replace(/\s+/g, "+");
      const href = `https://fonts.googleapis.com/css2?family=${famForUrl}:wght@400;600;700&display=swap`;

      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.id = id;
      link.onload = () => {
        try {
          const style = document.createElement("style");
          style.setAttribute("data-farm-font-style", code);
          style.innerHTML = `html[lang="${code}"] body { font-family: '${family}', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; }`;
          document.head.appendChild(style);
        } catch (e) {}
        resolve();
      };
      link.onerror = () => resolve();
      document.head.appendChild(link);
    } catch (e) {
      resolve();
    }
  });
}

export async function applyFontAndLang(code) {
  try {
    if (typeof document !== "undefined") {
      try {
        document.documentElement.lang = code;
      } catch (e) {}
      try {
        localStorage.setItem("farmstellar_lang", code);
      } catch (e) {}
      try {
        document.cookie = `farmstellar_lang=${code};path=/;max-age=${
          60 * 60 * 24 * 365
        }`;
      } catch (e) {}
      try {
        // mark that the user explicitly selected a language so auto-geo won't override
        localStorage.setItem("farmstellar_lang_user", "1");
      } catch (e) {}
    }
    await loadFontForCode(code);
  } catch (e) {}
}
