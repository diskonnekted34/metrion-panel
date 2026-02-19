import { createContext, useContext, useState, ReactNode } from "react";
import translations, { Lang } from "./translations";

type Translations = (typeof translations)["en"] | (typeof translations)["tr"];

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getInitialLang = (): Lang => {
  const stored = localStorage.getItem("c-levels-lang");
  if (stored === "tr" || stored === "en") return stored;
  const browserLang = navigator.language?.toLowerCase() || "";
  return browserLang.startsWith("tr") ? "tr" : "en";
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const t = translations[lang] as Translations;

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("c-levels-lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
