"use client";

import { Bell, Globe2, LogOut, Menu, UserRound } from "lucide-react";
import { Fragment, useEffect, useRef, useState } from "react";
import Avatar from "@/components/ui/Avatar";
import styles from "./TopBar.module.css";
import type { Crumb, DashboardCopy, DashboardUser, Language } from "./types";

export default function TopBar({
  t,
  user,
  crumbs,
  language,
  notificationCount = 0,
  onLanguageChange,
  onMenuClick,
  onNotificationsClick,
  onProfileClick,
  onLogout,
}: {
  t: DashboardCopy;
  user: DashboardUser;
  crumbs: Crumb[];
  language: Language;
  notificationCount?: number;
  onLanguageChange?: (language: Language) => void;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onLogout?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  // Close on an outside click or Escape, the two ways a user expects to
  // dismiss a menu they opened by accident.
  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!userRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const runAndClose = (action?: () => void) => () => {
    setMenuOpen(false);
    action?.();
  };

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button
          type="button"
          className={styles.menuButton}
          aria-label={t.openMenu}
          onClick={onMenuClick}
        >
          <Menu aria-hidden="true" size={19} />
        </button>

        <nav className={styles.breadcrumb} aria-label="breadcrumb">
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;

            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && (
                  <span className={styles.crumbSep} aria-hidden="true">
                    ›
                  </span>
                )}
                {isLast || !crumb.href ? (
                  <span className={isLast ? styles.crumbCurrent : undefined}>{crumb.label}</span>
                ) : (
                  <a className={styles.crumbLink} href={crumb.href}>
                    {crumb.label}
                  </a>
                )}
              </Fragment>
            );
          })}
        </nav>
      </div>

      <div className={styles.right}>
        <label className={styles.langControl}>
          <Globe2 aria-hidden="true" size={17} />
          <select
            value={language}
            aria-label={t.language}
            onChange={(event) => onLanguageChange?.(event.target.value as Language)}
          >
            <option value="ar">{t.arabic}</option>
            <option value="en">{t.english}</option>
          </select>
        </label>

        <button
          type="button"
          className={styles.bellButton}
          aria-label={t.notifications}
          onClick={onNotificationsClick}
        >
          <Bell aria-hidden="true" size={19} />
          {notificationCount > 0 && <span className={styles.bellBadge}>{notificationCount}</span>}
        </button>

        <div className={styles.user} ref={userRef}>
          <button
            type="button"
            className={styles.userButton}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.userText}>
              <strong>{user.name}</strong>
              <span>{user.role}</span>
            </span>
            <Avatar
              src={user.picture}
              alt={user.name}
              size={40}
              className={styles.avatar}
              fallbackClassName={styles.avatarFallback}
            />
          </button>

          {menuOpen && (
            <div className={styles.userMenu} role="menu">
              <button
                type="button"
                role="menuitem"
                className={styles.userMenuItem}
                onClick={runAndClose(onProfileClick)}
              >
                <UserRound aria-hidden="true" size={17} />
                {t.nav.myData}
              </button>
              <button
                type="button"
                role="menuitem"
                className={`${styles.userMenuItem} ${styles.userMenuDanger}`}
                onClick={runAndClose(onLogout)}
              >
                <LogOut aria-hidden="true" size={17} />
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
