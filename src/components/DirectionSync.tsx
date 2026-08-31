"use client";

import { useEffect } from "react";

/**
 * Keeps <html lang/dir> in sync with the in-app language switcher, so the
 * document direction (and the scrollbar side) matches the selected language.
 */
export default function DirectionSync({ language }: { language: "en" | "ar" }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  return null;
}
