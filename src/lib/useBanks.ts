"use client";

import { useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import type { BankOption } from "@/components/wizard/types";

type Language = "en" | "ar";

/** Colours for the bank chips, assigned by position since the API sends none. */
const chipColors = ["#283f76", "#0f7a4d", "#b45309", "#7c3aed", "#0891b2", "#be123c"];

/**
 * Loads selectable banks from master-data, each with its branches.
 *
 * Branches used to be a hard-coded list of names here, because the API had no
 * branch concept. It now has one, and create rejects a request without a
 * branch_id, so they have to be the real records.
 */
export function useBanks(language: Language) {
  const [banks, setBanks] = useState<BankOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    frontendApi
      .getBanks({ language })
      .then(async (rows) => {
        if (cancelled) return;
        // This portal is scoped to Omdurman National Bank only -- the API
        // still returns the full master-data bank list, so filter it down.
        const onbRows = rows.filter((row) => row.bic?.toUpperCase() === "ONB");

        const withBranches = await Promise.all(
          onbRows.map(async (row) => {
            // A bank with no branches still lists, so the customer sees the
            // empty picker rather than a screen that never finishes loading.
            const branches = await frontendApi
              .getBankBranches(row.id, { language })
              .catch(() => []);

            return { row, branches };
          }),
        );
        if (cancelled) return;

        setBanks(
          withBranches.map(({ row, branches }, index) => ({
            id: String(row.id),
            name: row.name,
            color: chipColors[index % chipColors.length],
            branches: branches.map((branch) => ({
              id: String(branch.id),
              name: branch.name,
            })),
          })),
        );
      })
      .catch((caught) => {
        if (cancelled) return;
        setError(errorMessage(caught));
        setBanks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return { banks, loading, error };
}
