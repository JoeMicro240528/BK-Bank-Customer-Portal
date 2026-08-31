"use client";

import { AlertCircle, Bell, CheckCheck, CheckCircle2, Clock, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { notifications as seed, type NotificationTone } from "./data";
import styles from "./NotificationsList.module.css";

type Language = "en" | "ar";

const toneIcon: Record<NotificationTone, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: Clock,
  danger: AlertCircle,
};

const toneClass: Record<NotificationTone, string> = {
  info: styles.iconInfo,
  success: styles.iconSuccess,
  warning: styles.iconWarning,
  danger: styles.iconDanger,
};

const copy = {
  ar: {
    title: "الإشعارات",
    subtitle: (n: number) => (n > 0 ? `لديك ${n} إشعارات غير مقروءة` : "لا توجد إشعارات غير مقروءة"),
    markAll: "تعليم الكل كمقروء",
    emptyTitle: "لا توجد إشعارات",
    emptyBody: "ستظهر هنا التحديثات المتعلقة بطلباتك.",
  },
  en: {
    title: "Notifications",
    subtitle: (n: number) => (n > 0 ? `You have ${n} unread notifications` : "No unread notifications"),
    markAll: "Mark all as read",
    emptyTitle: "No notifications",
    emptyBody: "Updates about your requests will appear here.",
  },
} as const;

export default function NotificationsList({
  language,
  onOpenRequest,
}: {
  language: Language;
  onOpenRequest?: (requestId: string) => void;
}) {
  const [items, setItems] = useState(seed);
  const t = copy[language];
  const unread = items.filter((item) => !item.read).length;

  const markRead = (id: string) =>
    setItems((previous) =>
      previous.map((item) => (item.id === id ? { ...item, read: true } : item)),
    );

  const markAllRead = () =>
    setItems((previous) => previous.map((item) => ({ ...item, read: true })));

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

      <section className={styles.card}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>
              <Bell aria-hidden="true" size={26} />
            </span>
            <strong>{t.emptyTitle}</strong>
            <p>{t.emptyBody}</p>
          </div>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => {
              const Icon = toneIcon[item.tone];

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`${styles.item} ${item.read ? "" : styles.unread}`}
                    onClick={() => {
                      markRead(item.id);
                      if (item.requestId) onOpenRequest?.(item.requestId);
                    }}
                  >
                    <span className={`${styles.icon} ${toneClass[item.tone]}`}>
                      <Icon aria-hidden="true" size={19} />
                    </span>
                    <span className={styles.body}>
                      <span className={styles.titleRow}>
                        {!item.read && <span className={styles.dot} aria-hidden="true" />}
                        <strong>{item.title[language]}</strong>
                      </span>
                      <p>{item.body[language]}</p>
                      <span className={styles.time}>{item.time[language]}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
