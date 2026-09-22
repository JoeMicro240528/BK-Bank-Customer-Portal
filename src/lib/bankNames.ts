type Language = "en" | "ar";

/**
 * Display names for banks the backend only names in Arabic.
 *
 * res.bank.name is a plain, untranslated field holding the Arabic name, so the
 * API returns "بنك امدرمان الوطني" whatever Accept-Language asks for -- in
 * master-data and in each bank's review entry alike. The portal serves one
 * bank, so its English name lives here until the backend can translate it.
 */
const ENGLISH_BY_BIC: Record<string, string> = {
  ONB: "Omdurman National Bank",
};

/** Spellings the name arrives under, reduced by normalise(), mapped to a BIC. */
const BIC_BY_NAME: Record<string, string> = {
  بنكامدرمانالوطني: "ONB",
  omdurmannationalbank: "ONB",
};

/**
 * Collapses spacing, tatweel and the alef forms, so "بنك أم درمان الوطني" and
 * "بنك امدرمان الوطني" -- both in use -- are recognised as one name.
 */
function normalise(name: string): string {
  return name
    .replace(/[أإآ]/g, "ا")
    .replace(/[\sـ]/g, "")
    .toLowerCase();
}

/**
 * The bank's name in the portal's language. Review entries carry no BIC, so the
 * name itself identifies the bank when no code is given. Arabic keeps the
 * backend's own name, and a bank this table does not know passes through.
 */
export function localBankName(name: string, language: Language, bic?: string | null): string {
  if (language !== "en" || !name) return name;

  const code = bic?.toUpperCase() || BIC_BY_NAME[normalise(name)];
  return (code && ENGLISH_BY_BIC[code]) || name;
}
