"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "ar";

const STORAGE_KEY = "portal_language";

type LanguageState = readonly [Language, (language: Language) => void];

const LanguageContext = createContext<LanguageState | null>(null);

/**
 * One language choice for the whole portal. Each page used to hold its own
 * state starting at Arabic, so picking English and then following any link
 * switched straight back. Living in the root layout, this survives client-side
 * navigation, and localStorage carries it across a full reload.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  // Restored after mount rather than during render: pages are prerendered in
  // Arabic, and reading storage first would make hydration disagree.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "ar") setLanguageState(saved);
    } catch {
      // Storage can be unavailable (private mode); Arabic stays the default.
    }
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // The choice still holds for this visit even if it can't be saved.
    }
  }, []);

  return (
    <LanguageContext.Provider value={[language, setLanguage] as const}>
      {children}
    </LanguageContext.Provider>
  );
}

/** The shared language and its setter, shaped like the useState pair it replaces. */
export function useLanguage(): LanguageState {
  const state = useContext(LanguageContext);
  if (!state) throw new Error("useLanguage must be used inside LanguageProvider");
  return state;
}
