import {
  Briefcase,
  CircleDollarSign,
  Download,
  FileText,
  Headphones,
  Home,
  ListChecks,
  MessageSquare,
  Phone,
  Printer,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import StatusPill from "./StatusPill";
import styles from "./RequestAside.module.css";
import type { RequestCopy, RequestDetailsData } from "./types";

/** Icons shown next to each updated field, by position. */
const fieldIcons: LucideIcon[] = [UserRound, Phone, Home, Briefcase, CircleDollarSign];

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

      <section className={styles.card}>
        <h2 className={styles.cardTitle}>
          <ListChecks aria-hidden="true" size={17} />
          {t.updatedFieldsTitle}
        </h2>
        <ul className={styles.fieldList}>
          {request.updatedFields.map((field, index) => {
            const Icon = fieldIcons[index % fieldIcons.length];

            return (
              <li key={field} className={styles.fieldItem}>
                <Icon aria-hidden="true" size={16} />
                {field}
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.helpCard}>
        <h2 className={styles.cardTitle}>
          <Headphones aria-hidden="true" size={17} />
          {t.helpTitle}
        </h2>
        <p className={styles.helpBody}>{t.helpBody}</p>
        <a className={styles.phone} href={`tel:${request.supportPhone.replace(/\s/g, "")}`} dir="ltr">
          <Phone aria-hidden="true" size={15} />
          {request.supportPhone}
        </a>
        <button type="button" className={styles.chatButton}>
          <MessageSquare aria-hidden="true" size={16} />
          {t.liveChat}
        </button>
      </section>
    </aside>
  );
}
