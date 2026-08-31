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
