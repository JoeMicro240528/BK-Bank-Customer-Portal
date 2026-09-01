"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import { toFormState } from "./draft";
import type { FormState } from "./form";

type Language = "en" | "ar";

export type Draft = { externalRef: string; state: FormState };

/**
 * Loads one saved draft by its external_ref so the form can pick up where the
 * user left off. Resuming is always an explicit choice -- continuing from the
 * draft's own details page -- because silently reopening the newest draft made
 * "new request" unable to ever start a new one.
 */
export function useDraft(
  ownerId: string | undefined,
  language: Language,
  externalRef: string | undefined,
) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(Boolean(externalRef));

  useEffect(() => {
    if (!ownerId || !externalRef) {
      setDraft(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    frontendApi
      .getRequest(externalRef, { language, ownerId })
      .then((full) => {
        if (!cancelled) setDraft({ externalRef, state: toFormState(full) });
      })
      .catch(() => {
        // A failed lookup should not block starting a new request.
        if (!cancelled) setDraft(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, language, externalRef]);

  return { draft, loading };
}
