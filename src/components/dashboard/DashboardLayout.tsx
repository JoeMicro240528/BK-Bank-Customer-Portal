"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useNotifications } from "@/lib/useNotifications";
import DirectionSync from "@/components/DirectionSync";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import sidebarStyles from "./Sidebar.module.css";
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
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  // The bell's own count, so every screen shows unread messages without each
  // page having to fetch them.
  const { items: notifications } = useNotifications(session?.user?.national_id, language);
  const unread = notifications.filter((item) => !item.read).length;
  const t = dashboardCopy[language];
  const dir = language === "ar" ? "rtl" : "ltr";

  // Fall back to route-based navigation when the page doesn't handle it itself.
  const navigate = onNavigate ?? ((key: NavKey) => router.push(navRoutes[key]));

  const handleNavigate = (key: NavKey) => {
    setMenuOpen(false);
    navigate(key);
  };

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    // Stop the page behind the drawer from scrolling while it is open.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <div className={styles.shell} dir={dir}>
      <DirectionSync language={language} />
      <Sidebar
        t={t}
        active={active}
        badges={badges}
        open={menuOpen}
        onNavigate={handleNavigate}
      />

      {menuOpen && (
        <button
          type="button"
          className={sidebarStyles.overlay}
          aria-label={t.closeMenu}
          onClick={() => setMenuOpen(false)}
        />
      )}

      <div className={styles.main}>
        <TopBar
          t={t}
          user={user}
          crumbs={crumbs}
          language={language}
          notificationCount={notificationCount ?? unread}
          onLanguageChange={onLanguageChange}
          onMenuClick={() => setMenuOpen((open) => !open)}
          onNotificationsClick={() => handleNavigate("notifications")}
          onProfileClick={() => handleNavigate("myData")}
          onLogout={onLogout}
        />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
