"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";

type Language = "en" | "ar";

/** Document type options for the income-proof dropdown. */
export function useDocumentTypes(language: Language) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    frontendApi
      .getSelectionOptions("document_type", { language })
      .then((rows) => {
        if (cancelled) return;
        setOptions(rows.map((row) => ({ value: row.value, label: row.label })));
      })
      .catch((caught) => {
        if (!cancelled) {
          setOptions([]);
          setError(
            caught instanceof Error ? caught.message : "Failed to load document types",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return { options, loading, error };
}
