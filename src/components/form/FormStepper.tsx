"use client";

import { Check } from "lucide-react";
import styles from "./FormStepper.module.css";

/**
 * Progress across the form's steps, drawn like the request status tracker so
 * both places read the same way.
 */
export default function FormStepper({
  labels,
  current,
  onSelect,
}: {
  labels: string[];
  current: number;
  /** Only completed steps can be revisited. */
  onSelect?: (index: number) => void;
}) {
  return (
    <ol className={styles.stepper}>
      {labels.map((label, index) => {
        const state = index < current ? "done" : index === current ? "current" : "pending";
        const canSelect = state === "done" && Boolean(onSelect);

        return (
          <li key={label} style={{ display: "contents" }}>
            <button
              type="button"
              className={`${styles.step} ${styles[state]} ${canSelect ? styles.clickable : ""}`}
              aria-current={state === "current" ? "step" : undefined}
              disabled={!canSelect}
              onClick={() => canSelect && onSelect?.(index)}
            >
              <span className={styles.node}>
                {state === "done" ? <Check aria-hidden="true" size={17} /> : index + 1}
              </span>
              <span className={styles.label}>{label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
