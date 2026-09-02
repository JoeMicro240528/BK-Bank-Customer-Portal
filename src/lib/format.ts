type Language = "en" | "ar";

/**
 * Formatters for the identity values SudaPass returns, which come through as
 * raw codes (`SDN`) and ISO dates rather than anything display-ready.
 */

/** ISO date (1997-11-15) -> localised long date. Returns the input if unparseable. */
export function formatBirthDate(value: string | undefined, language: Language): string {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** SudaPass sends either an ISO-3166 alpha-3 code (`SDN`) or an English name. */
const nationalityLabels: Record<string, { ar: string; en: string }> = {
  SDN: { ar: "سوداني", en: "Sudanese" },
  SUDANESE: { ar: "سوداني", en: "Sudanese" },
  EGY: { ar: "مصري", en: "Egyptian" },
  SAU: { ar: "سعودي", en: "Saudi" },
  ARE: { ar: "إماراتي", en: "Emirati" },
  ETH: { ar: "إثيوبي", en: "Ethiopian" },
  ERI: { ar: "إريتري", en: "Eritrean" },
  TCD: { ar: "تشادي", en: "Chadian" },
  SSD: { ar: "جنوب سوداني", en: "South Sudanese" },
};

export function formatNationality(value: string | undefined, language: Language): string {
  if (!value) return "";

  const label = nationalityLabels[value.trim().toUpperCase()];
  return label ? label[language] : value;
}

export function formatGender(value: string | undefined, language: Language): string {
  if (!value) return "";

  const normalized = value.trim().toLowerCase();
  if (normalized === "male") return language === "ar" ? "ذكر" : "Male";
  if (normalized === "female") return language === "ar" ? "أنثى" : "Female";

  return value;
}

/**
 * SudaPass reports nationality as an ISO alpha-3 code ("SDN"), while the
 * master-data countries carry alpha-2 ("SD"). Only the codes we can actually
 * meet are listed; anything else falls back to the picker.
 */
const alpha3ToAlpha2: Record<string, string> = {
  SDN: "SD", EGY: "EG", SAU: "SA", ARE: "AE", ETH: "ET", ERI: "ER",
  TCD: "TD", SSD: "SS", LBY: "LY", QAT: "QA", KWT: "KW", BHR: "BH",
  OMN: "OM", JOR: "JO", SYR: "SY", LBN: "LB", IRQ: "IQ", YEM: "YE",
  TUR: "TR", GBR: "GB", USA: "US", CAN: "CA", FRA: "FR", DEU: "DE",
  CHN: "CN", IND: "IN", PAK: "PK", NGA: "NG", KEN: "KE", ZAF: "ZA",
  MAR: "MA", DZA: "DZ", TUN: "TN", SOM: "SO", UGA: "UG", TZA: "TZ",
};

/**
 * The master-data id for a SudaPass nationality, or "" when it cannot be
 * resolved -- in which case the form should keep asking for it.
 */
export function resolveNationalityId(
  nationality: string | undefined,
  codeToId: Record<string, string>,
): string {
  if (!nationality) return "";

  const raw = nationality.trim().toUpperCase();
  const alpha2 = raw.length === 3 ? alpha3ToAlpha2[raw] : raw.length === 2 ? raw : undefined;

  return (alpha2 && codeToId[alpha2]) || "";
}
