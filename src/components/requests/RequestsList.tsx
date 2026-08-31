"use client";

import { ArrowLeft, ArrowRight, FileText, Plus } from "lucide-react";
import { useState } from "react";
import StatusPill from "@/components/request/StatusPill";
import type { BankStatus } from "@/components/request/types";
import type { RequestSummary } from "@/components/home/types";
import styles from "./RequestsList.module.css";

type Language = "en" | "ar";
type Filter = "all" | BankStatus;

const copy = {
  ar: {
    title: "طلباتي",
    subtitle: "جميع طلبات تحديث البيانات التي أنشأتها",
    newRequest: "طلب جديد",
    filters: {
      all: "الكل",
      under_review: "قيد المراجعة",
      approved: "معتمدة",
      action_required: "تحتاج إجراء",
    },
    colReference: "رقم الطلب",
    colDate: "التاريخ",
    colBanks: "البنوك",
    colStatus: "الحالة",
    colAction: "الإجراء",
    viewDetails: "عرض التفاصيل",
    banksUnit: "بنوك",
    emptyTitle: "لا توجد طلبات",
    emptyBody: "لم تقم بإنشاء أي طلب تحديث بعد.",
    emptyFilteredTitle: "لا توجد طلبات بهذه الحالة",
    emptyFilteredBody: "جرّب اختيار حالة أخرى.",
    status: {
      approved: "معتمد",
      under_review: "قيد المراجعة",
      action_required: "يحتاج إجراء",
    },
  },
  en: {
    title: "My requests",
    subtitle: "All the data update requests you have created",
    newRequest: "New request",
    filters: {
      all: "All",
      under_review: "Under review",
      approved: "Approved",
      action_required: "Action required",
    },
    colReference: "Request no.",
    colDate: "Date",
    colBanks: "Banks",
    colStatus: "Status",
    colAction: "Action",
    viewDetails: "View details",
    banksUnit: "banks",
    emptyTitle: "No requests",
    emptyBody: "You have not created any update request yet.",
    emptyFilteredTitle: "No requests with this status",
    emptyFilteredBody: "Try selecting a different status.",
    status: {
      approved: "Approved",
      under_review: "Under review",
      action_required: "Action required",
    },
  },
} as const;

const filterOrder: Filter[] = ["all", "under_review", "approved", "action_required"];

export default function RequestsList({
  language,
  requests,
  onNewRequest,
  onViewRequest,
}: {
  language: Language;
  requests: RequestSummary[];
  onNewRequest?: () => void;
  onViewRequest?: (id: string) => void;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const t = copy[language];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  const visible =
    filter === "all" ? requests : requests.filter((request) => request.status === filter);

  const countFor = (value: Filter) =>
    value === "all" ? requests.length : requests.filter((r) => r.status === value).length;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>
        <button type="button" className={styles.newButton} onClick={onNewRequest}>
          <Plus aria-hidden="true" size={17} />
          {t.newRequest}
        </button>
      </div>

      {requests.length > 0 && (
        <div className={styles.filters}>
          {filterOrder.map((value) => (
            <button
              type="button"
              key={value}
              className={`${styles.filter} ${filter === value ? styles.filterActive : ""}`}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {t.filters[value]}
              <span className={styles.count}>({countFor(value)})</span>
            </button>
          ))}
        </div>
      )}

      <section className={styles.card}>
        {visible.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <FileText aria-hidden="true" size={26} />
            </span>
            <strong>{requests.length === 0 ? t.emptyTitle : t.emptyFilteredTitle}</strong>
            <p>{requests.length === 0 ? t.emptyBody : t.emptyFilteredBody}</p>
            {requests.length === 0 && (
              <button type="button" className={styles.newButton} onClick={onNewRequest}>
                <Plus aria-hidden="true" size={17} />
                {t.newRequest}
              </button>
            )}
          </div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.colReference}</th>
                  <th>{t.colDate}</th>
                  <th>{t.colBanks}</th>
                  <th>{t.colStatus}</th>
                  <th>{t.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((request) => (
                  <tr key={request.id}>
                    <td className={styles.reference} dir="ltr">
                      {request.reference}
                    </td>
                    <td>{request.date}</td>
                    <td>
                      {request.bankCount} {t.banksUnit}
                    </td>
                    <td>
                      <StatusPill status={request.status} label={t.status[request.status]} />
                    </td>
                    <td>
                      <button
                        type="button"
                        className={styles.detailsButton}
                        onClick={() => onViewRequest?.(request.id)}
                      >
                        {t.viewDetails}
                        <Arrow aria-hidden="true" size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
