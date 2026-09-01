"use client";

import {
  AlertCircle,
  FileEdit,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import StatusPill from "@/components/request/StatusPill";
import { homeCopy } from "./copy";
import BankNames from "./BankNames";
import styles from "./DashboardHome.module.css";
import type { DashboardStats, Language, RequestSummary } from "./types";

export default function DashboardHome({
  language,
  stats,
  requests,
  onNewRequest,
  onViewRequest,
  onViewAll,
}: {
  language: Language;
  stats: DashboardStats;
  requests: RequestSummary[];
  onNewRequest: () => void;
  onViewRequest: (id: string) => void;
  onViewAll: () => void;
}) {
  const t = homeCopy[language];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;

  const tiles = [
    { key: "total", icon: FileText, value: stats.total, label: t.statTotal, cls: styles.tileTotal },
    { key: "drafts", icon: FileEdit, value: stats.drafts, label: t.statDrafts, cls: styles.tileDraft },
    { key: "review", icon: Clock, value: stats.underReview, label: t.statUnderReview, cls: styles.tileReview },
    { key: "approved", icon: CheckCircle2, value: stats.approved, label: t.statApproved, cls: styles.tileApproved },
    { key: "action", icon: AlertCircle, value: stats.actionRequired, label: t.statActionRequired, cls: styles.tileAction },
  ];


  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button type="button" className={styles.newRequestButton} onClick={onNewRequest}>
          <Plus aria-hidden="true" size={17} />
          {t.newRequest}
        </button>
      </div>

      <section className={styles.stats}>
        {tiles.map((tile) => (
          <div className={styles.tile} key={tile.key}>
            <span className={`${styles.tileIcon} ${tile.cls}`}>
              <tile.icon aria-hidden="true" size={21} />
            </span>
            <span className={styles.tileText}>
              <strong>{tile.value}</strong>
              <span>{tile.label}</span>
            </span>
          </div>
        ))}
      </section>

      <div className={styles.lower}>
        <section className={styles.card}>
          <div className={styles.cardHead}>
            <h2>{t.recentTitle}</h2>
            {requests.length > 0 && (
              <button type="button" className={styles.viewAll} onClick={onViewAll}>
                {t.viewAll}
                <Chevron aria-hidden="true" size={15} />
              </button>
            )}
          </div>

          {requests.length === 0 ? (
            <div className={styles.empty}>
              <span className={styles.emptyIcon}>
                <FileText aria-hidden="true" size={24} />
              </span>
              <strong>{t.emptyTitle}</strong>
              <p>{t.emptyBody}</p>
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
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td className={styles.reference} dir="ltr">
                        {request.reference}
                      </td>
                      <td>{request.date}</td>
                      <td>
                        <BankNames request={request} banksUnit={t.banksUnit} />
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
    </div>
  );
}
