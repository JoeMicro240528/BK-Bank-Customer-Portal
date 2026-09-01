import type { RequestSummary } from "@/components/home/types";
import type { BankStatus } from "@/components/request/types";
import type { AUFRequestSummary } from "./swagger-types";

type Language = "en" | "ar";

/**
 * Odoo request states mapped onto the statuses the UI shows.
 * Anything unrecognised is treated as in-progress rather than guessed at.
 */
export function mapRequestState(state: string | undefined): BankStatus {
  switch ((state || "").toLowerCase()) {
    // Not yet submitted -- showing this as "under review" tells the user a bank
    // is looking at a request they never sent.
    case "draft":
      return "draft";
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

/**
 * Banks on a request. The list endpoint only names them through `feedback`,
 * which stays empty until the request is submitted -- a draft resolves its
 * banks from the detail endpoint instead (see useRequests).
 */
function banksOf(request: AUFRequestSummary): string[] {
  const names = (request.feedback || []).map((entry) => entry.bank_name).filter(Boolean);
  return [...new Set(names)];
}

export function toRequestSummary(request: AUFRequestSummary, language: Language): RequestSummary {
  const bankNames = banksOf(request);

  return {
    // external_ref is what the detail endpoint is keyed on; fall back to the
    // human reference so a row is never unroutable.
    id: request.external_ref || request.reference,
    reference: request.reference,
    date: formatDate(request.created, language),
    bankCount: bankNames.length,
    bankNames,
    status: mapRequestState(request.state),
  };
}
