"use client";

import { useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { toRequestSummary } from "@/lib/requests";
import type { RequestSummary } from "@/components/home/types";

type Language = "en" | "ar";

/**
 * Rows the list endpoint cannot name banks for -- drafts, whose `feedback` is
 * empty until submission. Their banks live on the detail endpoint, so we fetch
 * those few rows individually and map bank ids through master-data.
 */
async function fillDraftBanks(
  rows: RequestSummary[],
  language: Language,
  ownerId: string,
): Promise<RequestSummary[]> {
  const pending = rows.filter((row) => row.bankNames.length === 0 && row.id);
  if (pending.length === 0) return rows;

  const banks = await frontendApi.getBanks({ language, ownerId }).catch(() => []);
  const bankNameById = new Map(banks.map((bank) => [bank.id, bank.name]));

  const resolved = await Promise.all(
    pending.map(async (row) => {
      try {
        const detail = await frontendApi.getRequest(row.id, { language, ownerId });
        const names = [
          ...new Set(
            (detail.selected_accounts || []).map(
              (account) => bankNameById.get(account.bank_id) || "",
            ),
          ),
        ].filter(Boolean);
        return [row.id, names] as const;
      } catch {
        // A row we cannot expand still renders; it just keeps showing no banks.
        return [row.id, [] as string[]] as const;
      }
    }),
  );

  const namesById = new Map(resolved);
  return rows.map((row) => {
    const names = namesById.get(row.id);
    return names && names.length > 0 ? { ...row, bankNames: names, bankCount: names.length } : row;
  });
}

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

        // Show the list immediately; bank names for drafts fill in after.
        setRequests(summaries);
        setLoading(false);

        const filled = await fillDraftBanks(summaries, language, ownerId);
        if (!cancelled) setRequests(filled);
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
