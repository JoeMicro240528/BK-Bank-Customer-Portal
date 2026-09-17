"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";

type Language = "en" | "ar";

/**
 * States for one country, by its ISO alpha-2 code. Loaded on demand, since the
 * list only matters once a country is chosen. An unknown code or a failed
 * request yields no states, which callers treat as "nothing to pick".
 */
export function useStates(countryCode: string | undefined, language: Language) {
  const [states, setStates] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!countryCode) {
      setStates([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    frontendApi
      .getStates(countryCode, { language })
      .then((rows) => {
        if (cancelled) return;
        setStates(
          rows
            .map((row) => ({ value: String(row.id), label: row.name }))
            .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en")),
        );
      })
      .catch(() => {
        if (!cancelled) setStates([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [countryCode, language]);

  return { states, loading };
}
