"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";

type Language = "en" | "ar";

/** Country options for the birth-country and nationality selects. */
export function useCountries(language: Language, enabled = true) {
  const [countries, setCountries] = useState<Option[]>([]);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    frontendApi
      .getCountries({ language })
      .then((rows) => {
        if (cancelled) return;

        setCountries(
          rows
            .map((row) => ({ value: String(row.id), label: row.name }))
            .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en")),
        );
      })
      .catch(() => {
        // An empty list still lets the rest of the form be completed.
        if (!cancelled) setCountries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, enabled]);

  return { countries, loading };
}
