"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import DirectionSync from "@/components/DirectionSync";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import { dashboardCopy } from "./copy";
import styles from "./DashboardLayout.module.css";
import { navRoutes, type Crumb, type DashboardUser, type Language, type NavKey } from "./types";

export default function DashboardLayout({
  language,
  user,
  crumbs,
  active,
  badges,
  notificationCount,
  onLanguageChange,
  onNavigate,
  onLogout,
  children,
}: {
  language: Language;
  user: DashboardUser;
  crumbs: Crumb[];
  active?: NavKey;
  badges?: Partial<Record<NavKey, number>>;
  notificationCount?: number;
  onLanguageChange?: (language: Language) => void;
  onNavigate?: (key: NavKey) => void;
  onLogout?: () => void;
  children: ReactNode;
}) {
  const router = useRouter();
  const t = dashboardCopy[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  // Fall back to route-based navigation when the page doesn't handle it itself.
  const handleNavigate = onNavigate ?? ((key: NavKey) => router.push(navRoutes[key]));

  return (
    <div className={styles.shell} dir={dir}>
      <DirectionSync language={language} />
      <Sidebar
        t={t}
        active={active}
        badges={badges}
        onNavigate={handleNavigate}
        onLogout={onLogout}
      />

      <div className={styles.main}>
        <TopBar
          t={t}
          user={user}
          crumbs={crumbs}
          language={language}
          notificationCount={notificationCount}
          onLanguageChange={onLanguageChange}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
