"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Headphones,
  MessageSquare,
  Plus,
  UserRound,
} from "lucide-react";
import StatusPill from "@/components/request/StatusPill";
import { homeCopy } from "./copy";
import styles from "./DashboardHome.module.css";
import type { DashboardStats, Language, RequestSummary } from "./types";

export default function DashboardHome({
  language,
  userName,
  stats,
  requests,
  onNewRequest,
  onViewRequest,
  onViewAll,
  onMyData,
  onContactSupport,
}: {
  language: Language;
  userName: string;
  stats: DashboardStats;
  requests: RequestSummary[];
  onNewRequest?: () => void;
  onViewRequest?: (id: string) => void;
  onViewAll?: () => void;
  onMyData?: () => void;
  onContactSupport?: () => void;
}) {
  const t = homeCopy[language];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;
  const Chevron = language === "ar" ? ChevronLeft : ChevronRight;

  const tiles = [
    { key: "total", icon: FileText, value: stats.total, label: t.statTotal, cls: styles.tileTotal },
    { key: "review", icon: Clock, value: stats.underReview, label: t.statUnderReview, cls: styles.tileReview },
    { key: "approved", icon: CheckCircle2, value: stats.approved, label: t.statApproved, cls: styles.tileApproved },
    { key: "action", icon: AlertCircle, value: stats.actionRequired, label: t.statActionRequired, cls: styles.tileAction },
  ];

  const quickActions = [
    { key: "new", icon: Plus, label: t.actionUpdateData, onClick: onNewRequest },
    { key: "track", icon: ClipboardList, label: t.actionTrackRequests, onClick: onViewAll },
    { key: "data", icon: UserRound, label: t.actionMyData, onClick: onMyData },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div>
          <h1>
            {t.greeting}، {userName} 👋
          </h1>
          <p>{t.welcomeSubtitle}</p>
        </div>
        <button type="button" className={styles.newRequestButton} onClick={onNewRequest}>
          <Plus aria-hidden="true" size={17} />
          {t.newRequest}
        </button>
      </section>

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
                        {/* The list endpoint omits selected_accounts, so a count of 0
                            means unknown rather than none. */}
                        {request.bankCount > 0 ? `${request.bankCount} ${t.banksUnit}` : "—"}
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

        <aside className={styles.aside}>
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <h2>{t.quickActionsTitle}</h2>
            </div>
            <div className={styles.actionList}>
              {quickActions.map((action) => (
                <button
                  type="button"
                  className={styles.actionItem}
                  key={action.key}
                  onClick={action.onClick}
                >
                  <action.icon aria-hidden="true" size={18} />
                  {action.label}
                  <Chevron aria-hidden="true" size={15} className={styles.actionArrow} />
                </button>
              ))}
            </div>
          </section>

          <section className={styles.help}>
            <span className={styles.helpHead}>
              <Headphones aria-hidden="true" size={18} />
              {t.helpTitle}
            </span>
            <p>{t.helpBody}</p>
            <button type="button" className={styles.helpButton} onClick={onContactSupport}>
              <MessageSquare aria-hidden="true" size={16} />
              {t.contactSupport}
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
