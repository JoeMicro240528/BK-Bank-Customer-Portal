"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";

type Language = "en" | "ar";

/**
 * Cities of one state. The API stores the address city as city_id, so this is
 * a picker rather than the free-text box it used to be -- a typed name was
 * simply dropped on save.
 */
export function useCities(stateId: string | undefined, language: Language) {
  const [cities, setCities] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const parsed = stateId ? Number.parseInt(stateId, 10) : Number.NaN;
    if (!Number.isFinite(parsed)) {
      setCities([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    frontendApi
      .getCities(parsed, { language })
      .then((rows) => {
        if (cancelled) return;
        setCities(
          rows
            .map((row) => ({ value: String(row.id), label: row.name }))
            .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en")),
        );
      })
      .catch(() => {
        if (!cancelled) setCities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [stateId, language]);

  return { cities, loading };
}
