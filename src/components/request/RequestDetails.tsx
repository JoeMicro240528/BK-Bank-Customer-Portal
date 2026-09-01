"use client";

import { AlertCircle, ArrowLeft, CalendarDays, Copy, Info } from "lucide-react";
import BankReviewTable from "./BankReviewTable";
import RequestAside from "./RequestAside";
import RequestStepper from "./RequestStepper";
import StatusPill from "./StatusPill";
import { requestCopy } from "./copy";
import styles from "./RequestDetails.module.css";
import type { Language, RequestDetailsData } from "./types";

export default function RequestDetails({
  request,
  language,
  onContinue,
}: {
  request: RequestDetailsData;
  language: Language;
  onContinue?: () => void;
}) {
  const t = requestCopy[language];
  const needsAction = request.banks.some((bank) => bank.status === "rejected");
  const isDraft = request.status === "draft";

  const copyReference = () => {
    void navigator.clipboard?.writeText(request.reference);
  };

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <div className={styles.pageHead}>
          <h1>{t.pageTitle}</h1>
          <p>{t.pageSubtitle}</p>
        </div>

        <section className={styles.card}>
          <div className={styles.refRow}>
            <div>
              <span className={styles.refLabel}>{t.referenceLabel}</span>
              <span className={styles.refValue} dir="ltr">
                {request.reference}
                <button
                  type="button"
                  className={styles.copyButton}
                  aria-label={t.copyReference}
                  onClick={copyReference}
                >
                  <Copy aria-hidden="true" size={15} />
                </button>
              </span>
              <div className={styles.refStatus}>
                <StatusPill status={request.status} label={t.status[request.status]} />
              </div>
            </div>

            <div className={styles.createdBlock}>
              <span className={styles.refLabel}>{t.createdLabel}</span>
              <span className={styles.createdValue}>
                <CalendarDays aria-hidden="true" size={15} />
                {request.createdAt}
              </span>
            </div>
          </div>

          <RequestStepper steps={request.stepper} />

          {isDraft ? (
            <>
              <p className={styles.noticeInfo}>
                <Info aria-hidden="true" size={15} />
                {t.draftNotice}
              </p>
              {onContinue && request.externalRef && (
                <button type="button" className={styles.continueButton} onClick={onContinue}>
                  <ArrowLeft aria-hidden="true" size={16} />
                  {t.continueRequest}
                </button>
              )}
            </>
          ) : (
            // Suppressed when a bank has sent the request back -- promising the
            // user it is on its way to approval would contradict the notice below.
            !needsAction && (
              <p className={styles.noticeInfo}>
                <Info aria-hidden="true" size={15} />
                {t.submittedNotice}
              </p>
            )
          )}
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.bankReviewTitle}</h2>
          <BankReviewTable banks={request.banks} t={t} />

          {needsAction && (
            <p className={styles.noticeWarning}>
              <AlertCircle aria-hidden="true" size={15} />
              {t.actionNotice}
            </p>
          )}
        </section>
      </div>

      <RequestAside request={request} t={t} />
    </div>
  );
}
