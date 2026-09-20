"use client";

import { useEffect, useState } from "react";
import { frontendApi } from "@/lib/api";
import type { Option } from "@/components/form/Fields";
import type { MasterDataLookup } from "@/lib/swagger-types";

type Language = "en" | "ar";

/**
 * Profession and income-source options for the work step.
 *
 * These three fields used to be free text. The API now stores them as
 * many2one ids and rejects a string outright, so their options have to come
 * from master-data rather than from a list held in the portal.
 */
export function useLookups(language: Language) {
  const [jobTitles, setJobTitles] = useState<Option[]>([]);
  const [primaryIncomeSources, setPrimaryIncomeSources] = useState<Option[]>([]);
  const [otherIncomeSources, setOtherIncomeSources] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const toOptions = (rows: MasterDataLookup[]): Option[] =>
      rows
        .map((row) => ({ value: String(row.id), label: row.name }))
        .sort((a, b) => a.label.localeCompare(b.label, language === "ar" ? "ar" : "en"));

    Promise.all([
      frontendApi.getJobTitles({ language }).catch(() => []),
      frontendApi.getPrimaryIncomeSources({ language }).catch(() => []),
      frontendApi.getOtherIncomeSources({ language }).catch(() => []),
    ])
      .then(([jobs, primary, other]) => {
        if (cancelled) return;
        setJobTitles(toOptions(jobs));
        setPrimaryIncomeSources(toOptions(primary));
        setOtherIncomeSources(toOptions(other));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [language]);

  return { jobTitles, primaryIncomeSources, otherIncomeSources, loading };
}
