"use client";

import { useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { toRequestSummary } from "@/lib/requests";
import type { RequestSummary } from "@/components/home/types";

type Language = "en" | "ar";



/**
 * Loads the signed-in user's update requests. The API scopes them to the
 * user's national ID, which the server-side proxy attaches.
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
      .then(async (rows) => {
        if (cancelled) return;
        const summaries = rows.map((row) => toRequestSummary(row, language));

        // Show the list immediately.
        setRequests(summaries);
        setLoading(false);
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(errorMessage(caught));
        setRequests([]);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, language]);

  return { requests, loading, error };
}
