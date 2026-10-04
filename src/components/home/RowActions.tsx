"use client";

import { Eye, Pencil } from "lucide-react";
import { canEditRequest } from "@/lib/requests";
import type { RequestSummary } from "./types";
import styles from "./RowActions.module.css";

/**
 * The action cell of a request row.
 * - The Eye (view) button is always present.
 * - The Pencil (edit) button appears only when the raw API state permits
 *   editing (draft or rejected). All other states — submitted, reviewed,
 *   verified, approved — are view-only.
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
  const editable = canEditRequest(request.rawState);

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

      {editable && (
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
