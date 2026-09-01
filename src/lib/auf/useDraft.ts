"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import { toFormState } from "./draft";
import type { FormState } from "./form";

type Language = "en" | "ar";

export type Draft = { externalRef: string; state: FormState };

/**
 * Finds the user's most recent unsubmitted request so the form can continue it
 * instead of starting a second one. Only drafts carrying an external_ref are
 * usable, since that is what the update and submit endpoints are keyed on.
 */
export function useDraft(ownerId: string | undefined, language: Language) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    frontendApi
      .listRequests({ language, ownerId })
      .then(async (rows) => {
        const candidate = rows
          .filter((row) => row.state === "draft" && row.external_ref)
          .sort((a, b) => (a.created < b.created ? 1 : -1))[0];

        if (!candidate?.external_ref || cancelled) return;

        // The list omits most fields, so fetch the full record to restore it.
        const full = await frontendApi.getRequest(candidate.external_ref, { language, ownerId });
        if (cancelled) return;

        setDraft({ externalRef: candidate.external_ref, state: toFormState(full) });
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
  }, [ownerId, language]);

  return { draft, loading };
}
