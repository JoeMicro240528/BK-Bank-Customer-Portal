"use client";

import { AlertCircle, Bell, CheckCheck, Loader2, MessageSquare } from "lucide-react";
import Banner from "@/components/ui/Banner";
import { useNotifications } from "@/lib/useNotifications";
import styles from "./NotificationsList.module.css";

type Language = "en" | "ar";

const copy = {
  ar: {
    title: "الإشعارات",
    subtitle: (n: number) => (n > 0 ? `لديك ${n} إشعارات غير مقروءة` : "لا توجد إشعارات غير مقروءة"),
    markAll: "تعليم الكل كمقروء",
    emptyTitle: "لا توجد إشعارات",
    emptyBody: "ستظهر هنا رسائل البنوك المتعلقة بطلباتك.",
    onRequest: (reference: string) => `بخصوص الطلب ${reference}`,
  },
  en: {
    title: "Notifications",
    subtitle: (n: number) =>
      n > 0 ? `You have ${n} unread notifications` : "No unread notifications",
    markAll: "Mark all as read",
    emptyTitle: "No notifications",
    emptyBody: "Messages from the banks about your requests will appear here.",
    onRequest: (reference: string) => `About request ${reference}`,
  },
} as const;

/** Odoo chatter bodies are HTML fragments; render them as plain text. */
function toPlainText(body: string): string {
  return body
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function formatDate(value: string, language: Language): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString(language === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsList({
  language,
  ownerId,
  onOpenRequest,
}: {
  language: Language;
  ownerId?: string;
  onOpenRequest?: (requestId: string) => void;
}) {
  const { items, loading, error, markRead, markAllRead } = useNotifications(ownerId, language);
  const t = copy[language];
  const unread = items.filter((item) => !item.read).length;

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <div>
          <h1>{t.title}</h1>
          <p>{t.subtitle(unread)}</p>
        </div>
        <button
          type="button"
          className={styles.markAll}
          disabled={unread === 0}
          onClick={markAllRead}
        >
          <CheckCheck aria-hidden="true" size={16} />
          {t.markAll}
        </button>
      </div>

      {error && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error} />
        </div>
      )}

      <section className={styles.card}>
        {loading ? (
          <div className="page-loading" style={{ height: 200 }}>
            <Loader2 className="page-loading-spinner" aria-hidden="true" />
          </div>
        ) : items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Bell aria-hidden="true" size={26} />
            </span>
            <strong>{t.emptyTitle}</strong>
            <p>{t.emptyBody}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={`${styles.item} ${item.read ? "" : styles.unread}`}
                  onClick={() => {
                    markRead(item.id);
                    onOpenRequest?.(item.requestId);
                  }}
                >
                  <span className={`${styles.icon} ${styles.iconInfo}`}>
                    <MessageSquare aria-hidden="true" size={19} />
                  </span>
                  <span className={styles.body}>
                    <span className={styles.titleRow}>
                      {!item.read && <span className={styles.dot} aria-hidden="true" />}
                      <strong>{t.onRequest(item.requestReference)}</strong>
                    </span>
                    <p>{toPlainText(item.body)}</p>
                    <span className={styles.time}>
                      {item.author ? `${item.author} · ` : ""}
                      {formatDate(item.date, language)}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
