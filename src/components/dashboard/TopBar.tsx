/* eslint-disable @next/next/no-img-element */
import { Bell, Globe2, Menu, UserCircle } from "lucide-react";
import { Fragment } from "react";
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
}: {
  t: DashboardCopy;
  user: DashboardUser;
  crumbs: Crumb[];
  language: Language;
  notificationCount?: number;
  onLanguageChange?: (language: Language) => void;
  onMenuClick?: () => void;
  onNotificationsClick?: () => void;
}) {
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

        <div className={styles.user}>
          <span className={styles.userText}>
            <strong>{user.name}</strong>
            <span>{user.role}</span>
          </span>
          {user.picture ? (
            <img className={styles.avatar} src={user.picture} alt={user.name} />
          ) : (
            <span className={styles.avatarFallback}>
              <UserCircle aria-hidden="true" size={26} />
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
