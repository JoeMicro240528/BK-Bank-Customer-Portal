/**
 * Mobile numbers, in one shape.
 *
 * The bank found the same number stored four ways -- 0912561024,
 * 249907900990, +249123623525 -- because the form only ever asked for digits.
 * Customers keep typing whichever form they know, so rather than refuse them,
 * each is read and written as the international one the bank asked for.
 */

const SUDAN = "+249";

/** Sudanese mobiles are nine digits after the country code. */
const NATIONAL_DIGITS = 9;

/**
 * The number as the bank wants to read it. Anything unrecognised is returned
 * trimmed but otherwise untouched, so validation can report it rather than
 * this quietly inventing a country code for it.
 */
export function normalisePhone(value: string): string {
  const digitsOnly = value.replace(/[\s\-()]/g, "").trim();
  if (!digitsOnly) return "";

  // 00 is how a customer dials out; it means the same as +.
  const plussed = digitsOnly.startsWith("00") ? `+${digitsOnly.slice(2)}` : digitsOnly;
  if (plussed.startsWith("+")) return plussed;

  // 249... typed without its plus.
  if (plussed.startsWith("249")) return `+${plussed}`;
  // 0912345678: the national trunk zero stands in for the country code.
  if (plussed.startsWith("0")) return `${SUDAN}${plussed.slice(1)}`;
  // 912345678: a Sudanese mobile with neither prefix.
  if (plussed.length === NATIONAL_DIGITS) return `${SUDAN}${plussed}`;

  return plussed;
}

/**
 * True for a number that can be dialled: a country code and enough digits.
 * Numbers abroad are accepted, since a customer may live outside Sudan.
 */
export function isValidPhone(value: string): boolean {
  const normalised = normalisePhone(value);
  if (!normalised) return true; // Emptiness is the required check's business.
  return /^\+\d{9,15}$/.test(normalised);
}

/**
 * The number tidied, but only when tidying produces something dialable.
 *
 * A half-typed number must be left alone: "0" would otherwise become the bare
 * country code "+249", which reads as though the field had been filled in when
 * it has not. What is still incomplete stays as typed, for validation to
 * report.
 */
export function tidyPhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const normalised = normalisePhone(trimmed);
  return /^\+\d{9,15}$/.test(normalised) ? normalised : trimmed;
}
