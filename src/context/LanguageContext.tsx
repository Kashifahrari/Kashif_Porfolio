import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

type Lang = "en" | "hi";
type Translations = Record<string, Record<string, unknown>>;

interface LanguageContextType {
  lang: Lang;
  t: (key: string) => string;
  tArray: (key: string) => string[];
  setLanguage: (lang: Lang) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  t: (k) => k,
  tArray: () => [],
  setLanguage: () => {},
});

function resolve(obj: Record<string, unknown>, key: string): unknown {
  const parts = key.split(".");
  let current: unknown = obj;
  for (const p of parts) {
    if (current && typeof current === "object" && p in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return current;
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    try { return (localStorage.getItem("lang") as Lang) || "en"; }
    catch { return "en"; }
  });
  const [translations, setTranslations] = useState<Translations>({ en: {}, hi: {} });

  useEffect(() => {
    // import.meta.env.BASE_URL is "/Kashif_Porfolio/" in both dev and prod (from vite.config base)
    const base = import.meta.env.BASE_URL;
    Promise.all([
      fetch(`${base}locales/en.json`).then((r) => { if (!r.ok) throw new Error(r.status.toString()); return r.json(); }),
      fetch(`${base}locales/hi.json`).then((r) => { if (!r.ok) throw new Error(r.status.toString()); return r.json(); }),
    ])
      .then(([en, hi]) => {
        setTranslations({ en: en.translation || en, hi: hi.translation || hi });
      })
      .catch((e) => { console.warn("[i18n] Could not load locale files:", e.message); });
  }, []);

  const setLanguage = useCallback((newLang: Lang) => {
    setLang(newLang);
    try { localStorage.setItem("lang", newLang); document.documentElement.lang = newLang; } catch {}
  }, []);

  const t = useCallback((key: string): string => {
    const dict = translations[lang] || translations["en"];
    const val = resolve(dict, key);
    if (typeof val === "string") return val;
    if (Array.isArray(val)) return val.join(", ");
    return key;
  }, [lang, translations]);

  const tArray = useCallback((key: string): string[] => {
    const dict = translations[lang] || translations["en"];
    const val = resolve(dict, key);
    if (Array.isArray(val)) return val as string[];
    return [];
  }, [lang, translations]);

  return (
    <LanguageContext.Provider value={{ lang, t, tArray, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
