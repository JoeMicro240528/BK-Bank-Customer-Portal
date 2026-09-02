"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";

type Language = "en" | "ar";

/** Country options for the birth-country and nationality selects. */
export function useCountries(language: Language, enabled = true) {
  const [countries, setCountries] = useState<Option[]>([]);
  /** ISO alpha-2 -> master-data id, for resolving the SudaPass nationality. */
  const [codeToId, setCodeToId] = useState<Record<string, string>>({});
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

        setCodeToId(
          Object.fromEntries(
            rows
              .filter((row): row is typeof row & { code: string } => Boolean(row.code))
              .map((row) => [row.code.toUpperCase(), String(row.id)]),
          ),
        );

        setCountries(
          rows
            .map((row) => ({ value: String(row.id), label: row.name }))
            .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en")),
        );
      })
      .catch(() => {
        // An empty list still lets the rest of the form be completed.
        if (!cancelled) {
          setCountries([]);
          setCodeToId({});
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language, enabled]);

  return { countries, codeToId, loading };
}
