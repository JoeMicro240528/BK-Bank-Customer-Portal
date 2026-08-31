import { Check } from "lucide-react";
import { Fragment } from "react";
import styles from "./WizardStepBar.module.css";
import type { WizardStep } from "./types";

export default function WizardStepBar({ steps }: { steps: WizardStep[] }) {
  return (
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
                {step.state === "done" ? <Check aria-hidden="true" size={14} /> : index + 1}
              </span>
              {step.label}
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
