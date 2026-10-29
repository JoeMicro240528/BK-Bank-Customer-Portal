"use client";

import { useCallback, useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { canEditRequest } from "@/lib/requests";
import type { AUFRequestRead } from "@/lib/swagger-types";
import { existingUploads, toFormState, type ExistingUpload } from "./draft";
import type { FormState } from "./form";

type Language = "en" | "ar";

export type Draft = {
  externalRef: string;
  state: FormState;
  /** Attachments the server already holds for this request. */
  uploads: Record<string, ExistingUpload>;
  rawRequest?: AUFRequestRead;
};

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
  const [rawRequest, setRawRequest] = useState<AUFRequestRead | null>(null);
  const [loading, setLoading] = useState(Boolean(externalRef));
  const [error, setError] = useState<string | null>(null);

  const fetchDraft = useCallback(async () => {
    if (!ownerId || !externalRef) {
      setDraft(null);
      setRawRequest(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const full = await frontendApi.getRequest(externalRef, { language, ownerId });
      setRawRequest(full);
      setDraft({
        externalRef,
        state: toFormState(full),
        uploads: existingUploads(full),
        rawRequest: full,
      });
      setError(null);
    } catch (caught) {
      setError(errorMessage(caught) || "Failed to load request details.");
      setDraft(null);
      setRawRequest(null);
    } finally {
      setLoading(false);
    }
  }, [ownerId, language, externalRef]);

  useEffect(() => {
    fetchDraft();
  }, [fetchDraft]);

  const canEdit = rawRequest ? canEditRequest(rawRequest.state) : false;

  return {
    draft,
    rawRequest,
    loading,
    error,
    canEdit,
    reload: fetchDraft,
    setDraft,
  };
}
