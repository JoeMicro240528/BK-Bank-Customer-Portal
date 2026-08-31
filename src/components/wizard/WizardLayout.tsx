"use client";

import { Bell, Check, Globe2, LogOut, ShieldCheck } from "lucide-react";
import { Fragment, type ReactNode } from "react";
import DirectionSync from "@/components/DirectionSync";
import styles from "./WizardLayout.module.css";
import type { Language, WizardCopy, WizardStep } from "./types";

export default function WizardLayout({
  t,
  language,
  steps,
  notificationCount = 0,
  onLanguageChange,
  onLogout,
  children,
}: {
  t: WizardCopy;
  language: Language;
  steps: WizardStep[];
  notificationCount?: number;
  onLanguageChange?: (language: Language) => void;
  onLogout?: () => void;
  children: ReactNode;
}) {
  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <div className={styles.shell} dir={dir}>
      <DirectionSync language={language} />

      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>
            <ShieldCheck aria-hidden="true" size={23} />
          </span>
          <span className={styles.brandText}>
            <strong>{t.platformName}</strong>
            <span>{t.platformTagline}</span>
          </span>
        </div>

        <div className={styles.headerActions}>
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

          <button type="button" className={styles.bellButton} aria-label={t.notifications}>
            <Bell aria-hidden="true" size={19} />
            {notificationCount > 0 && (
              <span className={styles.bellBadge}>{notificationCount}</span>
            )}
          </button>

          <button type="button" className={styles.logoutButton} onClick={onLogout}>
            <LogOut aria-hidden="true" size={16} />
            {t.logout}
          </button>
        </div>
      </header>

      <ol className={styles.stepBar}>
        {steps.map((step, index) => {
          const stateClass =
            step.state === "done"
              ? styles.stepBarDone
              : step.state === "current"
                ? styles.stepBarCurrent
                : "";

          return (
            <Fragment key={step.key}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className={`${styles.stepBarLine} ${
                    steps[index - 1].state === "done" ? styles.stepBarLineDone : ""
                  }`}
                />
              )}
              <li className={`${styles.stepBarItem} ${stateClass}`}>
                <span className={styles.stepBarNode}>
                  {step.state === "done" ? (
                    <Check aria-hidden="true" size={14} />
                  ) : (
                    index + 1
                  )}
                </span>
                {step.label}
              </li>
            </Fragment>
          );
        })}
      </ol>

      <div className={styles.body}>{children}</div>

      <footer className={styles.footer}>
        <span>{t.footerRights}</span>
        <div className={styles.footerLinks}>
          <a href="#faq">{t.footerFaq}</a>
          <a href="#terms">{t.footerTerms}</a>
          <a href="#privacy">{t.footerPrivacy}</a>
        </div>
      </footer>
    </div>
  );
}
