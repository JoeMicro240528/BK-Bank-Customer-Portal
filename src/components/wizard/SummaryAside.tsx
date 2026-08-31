import {
  CalendarDays,
  CreditCard,
  FileText,
  Info,
  Landmark,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import styles from "./SummaryAside.module.css";
import type { WizardCopy } from "./types";

export default function SummaryAside({
  t,
  bankCount,
  accountCount,
  requestDate,
}: {
  t: WizardCopy;
  bankCount: number;
  accountCount: number;
  requestDate: string;
}) {
  const rows = [
    { icon: UserRound, label: t.requestTypeLabel, value: t.requestTypeValue },
    { icon: Landmark, label: t.bankCountLabel, value: `${bankCount} ${t.banksUnit}` },
    { icon: CreditCard, label: t.accountCountLabel, value: `${accountCount} ${t.accountsUnit}` },
    { icon: CalendarDays, label: t.requestDateLabel, value: requestDate },
  ];

  return (
    <aside className={styles.aside}>
      <section className={styles.card}>
        <div className={styles.cardHead}>
          <h2>{t.summaryTitle}</h2>
          <FileText aria-hidden="true" size={17} />
        </div>
        <dl className={styles.list}>
          {rows.map((row) => (
            <div className={styles.row} key={row.label}>
              <span className={styles.rowIcon}>
                <row.icon aria-hidden="true" size={18} />
              </span>
              <span className={styles.rowText}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </span>
            </div>
          ))}
        </dl>
      </section>

      <section className={styles.notes}>
        <span className={styles.notesHead}>
          <strong>{t.notesTitle}</strong>
          <Info aria-hidden="true" size={17} />
        </span>
        <ul className={styles.notesList}>
          {t.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className={styles.secure}>
        <span className={styles.secureIcon}>
          <ShieldCheck aria-hidden="true" size={19} />
        </span>
        <span>
          <strong>{t.secureTitle}</strong>
          <p>{t.secureBody}</p>
        </span>
      </section>
    </aside>
  );
}
