import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

interface AppContextValue {
  dark: boolean;
  toggle: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "relhr-dark-mode";

function getInitialDark(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return stored === "dark";
  } catch {
    /* noop */
  }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
      /* noop */
    }
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);

  return <AppContext.Provider value={{ dark, toggle }}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProviders");
  return ctx;
}
