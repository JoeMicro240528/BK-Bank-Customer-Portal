"use client";

import { useEffect, useState } from "react";
import { frontendApi, errorMessage } from "@/lib/api";
import { branchesForBank } from "@/components/wizard/banks";
import type { BankOption } from "@/components/wizard/types";

type Language = "en" | "ar";

/** Colours for the bank chips, assigned by position since the API sends none. */
const chipColors = ["#283f76", "#0f7a4d", "#b45309", "#7c3aed", "#0891b2", "#be123c"];

/** Loads selectable banks from master-data. */
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
      .then((rows) => {
        if (cancelled) return;
        setBanks(
          rows.map((row, index) => ({
            id: String(row.id),
            name: row.name,
            color: chipColors[index % chipColors.length],
            branches: branchesForBank(row.bic),
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
