import type { BankReview, RequestDetailsData, TimelineStep } from "@/components/request/types";
import type { AUFRequestRead } from "./swagger-types";
import { mapBankState, overallStatus } from "./requests";

type Language = "en" | "ar";

const chipColors = ["#283f76", "#0f7a4d", "#b45309", "#7c3aed", "#0891b2", "#be123c"];

function formatDateTime(value: string | null | undefined, language: Language): string {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  const locale = language === "ar" ? "ar-EG" : "en-GB";
  return parsed.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}

function formatTime(value: string | null | undefined, language: Language): string {
  if (!value) return "";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleTimeString(language === "ar" ? "ar-EG" : "en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const labels = {
  ar: {
    received: "تم الاستلام",
    review: "قيد المراجعة",
    approved: "تم الاعتماد",
    action: "يحتاج إجراء من العميل",
    created: "تم إنشاء الطلب",
    bankReview: "قيد المراجعة لدى البنوك",
    partial: "بعض البنوك معتمد",
    complete: "اكتمل التحديث",
    updateType: "تحديث بيانات",
    mainBranch: "الفرع الرئيسي",
  },
  en: {
    received: "Received",
    review: "Under review",
    approved: "Approved",
    action: "Action required",
    created: "Request created",
    bankReview: "Under review by banks",
    partial: "Some banks approved",
    complete: "Update complete",
    updateType: "Data update",
    mainBranch: "Main branch",
  },
} as const;

/** Builds the three-node timeline shown per bank from that bank's state. */
function timelineFor(state: string, processedAt: string | null | undefined, language: Language): TimelineStep[] {
  const t = labels[language];
  const status = mapBankState(state);
  const when = processedAt ? `${formatDateTime(processedAt, language)} - ${formatTime(processedAt, language)}` : undefined;

  if (status === "approved") {
    return [
      { key: "received", label: t.received, date: when, state: "done" },
      { key: "review", label: t.review, date: when, state: "done" },
      { key: "approved", label: t.approved, date: when, state: "done" },
    ];
  }

  if (status === "action_required") {
    return [
      { key: "received", label: t.received, date: when, state: "done" },
      { key: "action", label: t.action, date: when, state: "blocked" },
      { key: "review", label: t.review, state: "pending" },
    ];
  }

  return [
    { key: "received", label: t.received, date: when, state: "done" },
    { key: "review", label: t.review, date: when, state: "current" },
    { key: "approved", label: t.approved, state: "pending" },
  ];
}

export function toRequestDetails(
  request: AUFRequestRead,
  language: Language,
  supportPhone: string,
): RequestDetailsData {
  const t = labels[language];
  const feedback = request.feedback || [];
  const accounts = request.selected_accounts || [];

  const banks: BankReview[] = feedback.map((entry, index) => {
    const account = accounts.find((item) => item.bank_id === entry.bank_id);

    return {
      id: String(entry.bank_id),
      bankName: entry.bank_name,
      bankColor: chipColors[index % chipColors.length],
      // The API has no branch field yet, so show a neutral placeholder.
      branch: t.mainBranch,
      accountNumber: account ? `**** ${account.account_number.slice(-4)}` : "",
      status: mapBankState(entry.state),
      lastUpdate: formatDateTime(entry.processed_at, language),
      lastUpdateTime: formatTime(entry.processed_at, language),
      timeline: timelineFor(entry.state, entry.processed_at, language),
    };
  });

  const approved = banks.filter((bank) => bank.status === "approved").length;
  const allApproved = banks.length > 0 && approved === banks.length;

  const status = overallStatus(
    request.state,
    feedback.map((entry) => entry.state),
  );

  return {
    reference: request.reference,
    externalRef: request.external_ref || "",
    status,
    createdAt: `${formatDateTime(request.created, language)} - ${formatTime(request.created, language)}`,
    bankCount: new Set(accounts.map((a) => a.bank_id)).size,
    accountCount: accounts.length,
    requestType: t.updateType,
    supportPhone,
    // Personal fields live in SudaPass, not on the request, so this stays empty
    // until the backend exposes which fields a request actually changed.
    updatedFields: [],
    stepper: [
      {
        key: "created",
        label: t.created,
        date: formatDateTime(request.created, language),
        state: "done",
      },
      {
        key: "review",
        label: t.bankReview,
        state: banks.length > 0 && !allApproved ? "current" : "done",
      },
      {
        key: "partial",
        label: t.partial,
        state: approved > 0 ? (allApproved ? "done" : "current") : "pending",
      },
      { key: "complete", label: t.complete, state: allApproved ? "done" : "pending" },
    ],
    banks,
  };
}
