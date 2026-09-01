"use client";

import { Eye, Pencil } from "lucide-react";
import type { RequestSummary } from "./types";
import styles from "./RowActions.module.css";

/**
 * The action cell of a request row. Icons rather than words, so the column
 * stays narrow; each carries a label for screen readers and a tooltip.
 * Continuing is offered only on a draft -- a submitted request cannot be edited.
 */
export default function RowActions({
  request,
  viewLabel,
  continueLabel,
  onView,
  onContinue,
}: {
  request: RequestSummary;
  viewLabel: string;
  continueLabel: string;
  onView: (id: string) => void;
  onContinue: (id: string) => void;
}) {
  return (
    <span className={styles.actions}>
      <button
        type="button"
        className={styles.action}
        aria-label={viewLabel}
        title={viewLabel}
        onClick={() => onView(request.id)}
      >
        <Eye aria-hidden="true" size={17} />
      </button>

      {request.status === "draft" && (
        <button
          type="button"
          className={`${styles.action} ${styles.actionPrimary}`}
          aria-label={continueLabel}
          title={continueLabel}
          onClick={() => onContinue(request.id)}
        >
          <Pencil aria-hidden="true" size={16} />
        </button>
      )}
    </span>
  );
}
