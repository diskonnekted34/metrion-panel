import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeChoice = "dark" | "light" | "system";
type ResolvedTheme = "dark" | "light";

interface ThemeContextType {
  theme: ResolvedTheme;
  themeChoice: ThemeChoice;
  setThemeChoice: (choice: ThemeChoice) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

const resolve = (choice: ThemeChoice): ResolvedTheme =>
  choice === "system" ? getSystemTheme() : choice;

const getInitialChoice = (): ThemeChoice => {
  const stored = localStorage.getItem("c-levels-theme");
  if (stored === "light" || stored === "dark" || stored === "system") return stored;
  return "system";
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeChoice, setThemeChoiceState] = useState<ThemeChoice>(getInitialChoice);
  const [theme, setTheme] = useState<ResolvedTheme>(() => resolve(getInitialChoice()));

  const applyTheme = (resolved: ResolvedTheme) => {
    const root = document.documentElement;
    if (resolved === "light") {
      root.classList.add("light");
    } else {
      root.classList.remove("light");
    }
  };

  useEffect(() => {
    const resolved = resolve(themeChoice);
    setTheme(resolved);
    applyTheme(resolved);
    localStorage.setItem("c-levels-theme", themeChoice);
  }, [themeChoice]);

  // Listen for system preference changes when in "system" mode
  useEffect(() => {
    if (themeChoice !== "system") return;
    const mql = window.matchMedia("(prefers-color-scheme: light)");
    const handler = () => {
      const resolved = getSystemTheme();
      setTheme(resolved);
      applyTheme(resolved);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [themeChoice]);

  const setThemeChoice = (choice: ThemeChoice) => setThemeChoiceState(choice);

  const toggleTheme = () => {
    setThemeChoiceState(prev => {
      if (prev === "dark" || (prev === "system" && resolve(prev) === "dark")) return "light";
      return "dark";
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, themeChoice, setThemeChoice, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
