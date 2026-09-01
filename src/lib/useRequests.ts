"use client";

import { useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { toRequestSummary } from "@/lib/requests";
import type { RequestSummary } from "@/components/home/types";

type Language = "en" | "ar";

/**
 * Loads the signed-in user's update requests. The API scopes them by the
 * X-Owner-Id header, which carries the user's national ID.
 */
export function useRequests(ownerId: string | undefined, language: Language) {
  const [requests, setRequests] = useState<RequestSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!ownerId) {
      setRequests([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    frontendApi
      .listRequests({ language, ownerId })
      .then((rows) => {
        if (cancelled) return;
        setRequests(rows.map((row) => toRequestSummary(row, language)));
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(errorMessage(caught));
        setRequests([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, language]);

  return { requests, loading, error };
}
