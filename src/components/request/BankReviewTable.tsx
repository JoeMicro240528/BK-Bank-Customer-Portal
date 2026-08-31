"use client";

import { AlertCircle, Check, ChevronDown, Clock } from "lucide-react";
import { Fragment, useState } from "react";
import StatusPill from "./StatusPill";
import styles from "./BankReviewTable.module.css";
import type { BankReview, RequestCopy, StepState } from "./types";

const tStateClass: Record<StepState, string> = {
  done: styles.tDone,
  current: styles.tCurrent,
  pending: styles.tPending,
  blocked: styles.tBlocked,
};

function TimelineNode({ state }: { state: StepState }) {
  if (state === "done") return <Check aria-hidden="true" size={11} />;
  if (state === "current") return <Clock aria-hidden="true" size={11} />;
  if (state === "blocked") return <AlertCircle aria-hidden="true" size={11} />;
  return null;
}

export default function BankReviewTable({
  banks,
  t,
}: {
  banks: BankReview[];
  t: RequestCopy;
}) {
  const [openRows, setOpenRows] = useState<string[]>(banks.map((bank) => bank.id));

  const toggleRow = (id: string) => {
    setOpenRows((previous) =>
      previous.includes(id) ? previous.filter((rowId) => rowId !== id) : [...previous, id],
    );
  };

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>{t.colBank}</th>
            <th>{t.colBranch}</th>
            <th>{t.colAccount}</th>
            <th>{t.colStatus}</th>
            <th>{t.colLastUpdate}</th>
            <th>{t.colAction}</th>
          </tr>
        </thead>
        <tbody>
          {banks.map((bank) => {
            const isOpen = openRows.includes(bank.id);

            return (
              <Fragment key={bank.id}>
                <tr className={styles.rowMain}>
                  <td>
                    <span className={styles.bankCell}>
                      <span className={styles.logo} style={{ background: bank.bankColor }}>
                        {bank.bankName.charAt(0)}
                      </span>
                      <span>
                        <span className={styles.bankName}>{bank.bankName}</span>
                        {bank.bankNote && <span className={styles.bankNote}>{bank.bankNote}</span>}
                      </span>
                    </span>
                  </td>
                  <td className={styles.branch}>{bank.branch}</td>
                  <td className={styles.account} dir="ltr">
                    {bank.accountNumber}
                  </td>
                  <td>
                    <StatusPill status={bank.status} label={t.status[bank.status]} />
                  </td>
                  <td>
                    <span className={styles.dateStack}>
                      <strong>{bank.lastUpdate}</strong>
                      <span>{bank.lastUpdateTime}</span>
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.detailsButton}
                      aria-expanded={isOpen}
                      onClick={() => toggleRow(bank.id)}
                    >
                      {t.viewDetails}
                      <ChevronDown
                        aria-hidden="true"
                        size={14}
                        className={isOpen ? styles.chevronOpen : undefined}
                      />
                    </button>
                  </td>
                </tr>

                {isOpen && (
                  <tr>
                    <td className={styles.timelineCell} colSpan={6}>
                      <ol className={styles.timeline}>
                        {bank.timeline.map((step) => (
                          <li key={step.key} className={`${styles.tStep} ${tStateClass[step.state]}`}>
                            <span className={styles.tNode}>
                              <TimelineNode state={step.state} />
                            </span>
                            <span className={styles.tLabel}>{step.label}</span>
                            <span className={styles.tDate}>{step.date || "-"}</span>
                          </li>
                        ))}
                      </ol>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
