import { Check, Search } from "lucide-react";
import styles from "./RequestStepper.module.css";
import type { StepState, TimelineStep } from "./types";

const stateClass: Record<StepState, string> = {
  done: styles.stepDone,
  current: styles.stepCurrent,
  pending: styles.stepPending,
  blocked: styles.stepPending,
};

export default function RequestStepper({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className={styles.stepper}>
      {steps.map((step, index) => (
        <li key={step.key} className={`${styles.step} ${stateClass[step.state]}`}>
          <span className={styles.node}>
            {step.state === "done" ? (
              <Check aria-hidden="true" size={17} />
            ) : step.state === "current" ? (
              <Search aria-hidden="true" size={15} />
            ) : (
              index + 1
            )}
          </span>
          <span className={styles.label}>{step.label}</span>
          {step.date && <span className={styles.date}>{step.date}</span>}
        </li>
      ))}
    </ol>
  );
}
