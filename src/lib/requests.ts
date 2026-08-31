import type { RequestSummary } from "@/components/home/types";
import type { BankStatus } from "@/components/request/types";
import type { AUFRequestRead } from "./swagger-types";

type Language = "en" | "ar";

/**
 * Odoo request states mapped onto the three statuses the UI shows.
 * Anything unrecognised is treated as in-progress rather than guessed at.
 */
export function mapRequestState(state: string | undefined): BankStatus {
  switch ((state || "").toLowerCase()) {
    case "done":
    case "verified":
    case "approved":
      return "approved";
    case "rejected":
    case "cancelled":
    case "canceled":
      return "action_required";
    default:
      return "under_review";
  }
}

function formatDate(value: string | undefined, language: Language): string {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(language === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Number of distinct banks a request touches, from its selected accounts. */
function bankCountOf(request: AUFRequestRead): number {
  const accounts = request.selected_accounts || [];
  return new Set(accounts.map((account) => account.bank_id)).size;
}

export function toRequestSummary(request: AUFRequestRead, language: Language): RequestSummary {
  return {
    // external_ref is what the detail endpoint is keyed on; fall back to the
    // human reference so a row is never unroutable.
    id: request.external_ref || request.reference,
    reference: request.reference,
    date: formatDate(request.created, language),
    bankCount: bankCountOf(request),
    status: mapRequestState(request.state),
  };
}
