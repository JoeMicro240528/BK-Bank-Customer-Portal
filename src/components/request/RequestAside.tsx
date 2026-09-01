import { Download, FileText, Printer } from "lucide-react";
import StatusPill from "./StatusPill";
import styles from "./RequestAside.module.css";
import type { RequestCopy, RequestDetailsData } from "./types";

export default function RequestAside({
  request,
  t,
}: {
  request: RequestDetailsData;
  t: RequestCopy;
}) {
  return (
    <aside className={styles.aside}>
      <div className={styles.actions}>
        <button type="button" className={styles.actionButton}>
          <Download aria-hidden="true" size={16} />
          {t.downloadPdf}
        </button>
        <button type="button" className={styles.actionButton}>
          <Printer aria-hidden="true" size={16} />
          {t.print}
        </button>
      </div>

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <FileText aria-hidden="true" size={17} />
          {t.summaryTitle}
        </h2>
        <dl className={styles.summaryList}>
          <div className={styles.summaryRow}>
            <dt>{t.bankCountLabel}</dt>
            <dd>
              {request.bankCount} {t.banksUnit}
            </dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>{t.accountCountLabel}</dt>
            <dd>
              {request.accountCount} {t.accountsUnit}
            </dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>{t.requestTypeLabel}</dt>
            <dd>{request.requestType}</dd>
          </div>
          <div className={styles.summaryRow}>
            <dt>{t.overallStatusLabel}</dt>
            <dd>
              <StatusPill status={request.status} label={t.status[request.status]} />
            </dd>
          </div>
        </dl>
      </section>


    </aside>
  );
}
