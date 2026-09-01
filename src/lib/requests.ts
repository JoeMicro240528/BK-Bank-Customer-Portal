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

/**
 * A bank's own processing state. Odoo reuses the word "draft" here, but it
 * means something different than on the request: the bank simply has not
 * picked the request up yet, not that the customer never sent it. Showing
 * that as "draft" claimed a submitted request was unsent.
 */
export function mapBankState(state: string | undefined): BankStatus {
  switch ((state || "").toLowerCase()) {
    case "done":
    case "verified":
    case "approved":
      return "approved";
    case "rejected":
    case "cancelled":
    case "canceled":
      return "action_required";
    // "draft" included: queued at the bank is still awaiting review.
    default:
      return "under_review";
  }
}

/**
 * The status a request should display, given its own state and the states its
 * banks reported. Odoo leaves a request "submitted" after a bank rejects it,
 * so the request-level state alone would claim a rejected request is still
 * under review. Shared by the list and the details page so they never disagree.
 */
export function overallStatus(state: string | undefined, bankStates: string[]): BankStatus {
  const base = mapRequestState(state);
  if (base === "draft") return "draft";

  const banks = bankStates.map(mapBankState);
  if (banks.some((status) => status === "action_required")) return "action_required";
  if (banks.length > 0 && banks.every((status) => status === "approved")) return "approved";
  return base;
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
    status: overallStatus(
      request.state,
      (request.feedback || []).map((entry) => entry.state),
    ),
  };
}
