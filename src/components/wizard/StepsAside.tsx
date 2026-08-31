import { Check, Headphones, Phone } from "lucide-react";
import styles from "./StepsAside.module.css";
import type { WizardCopy, WizardStep } from "./types";

export default function StepsAside({
  t,
  steps,
  verifiedAt,
  supportPhone,
}: {
  t: WizardCopy;
  steps: WizardStep[];
  verifiedAt: string;
  supportPhone: string;
}) {
  return (
    <aside className={styles.aside}>
      <div className={styles.verified}>
        <span className={styles.verifiedIcon}>
          <Check aria-hidden="true" size={22} />
        </span>
        <span className={styles.verifiedText}>
          <strong>{t.verifiedTitle}</strong>
          <span>{t.verifiedVia}</span>
          <time>{verifiedAt}</time>
        </span>
      </div>

      <h2 className={styles.stepsTitle}>{t.updateStepsTitle}</h2>

      <ol className={styles.steps}>
        {steps.map((step, index) => {
          const stateClass =
            step.state === "done"
              ? styles.stepDone
              : step.state === "current"
                ? styles.stepCurrent
                : styles.stepPending;

          return (
            <li key={step.key} className={`${styles.step} ${stateClass}`}>
              <span className={styles.node}>
                {step.state === "done" ? <Check aria-hidden="true" size={14} /> : index + 1}
              </span>
              <span className={styles.stepText}>
                <strong>{step.label}</strong>
                <span>{step.hint}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <div className={styles.help}>
        <span className={styles.helpHead}>
          <strong>{t.helpTitle}</strong>
          <Headphones aria-hidden="true" size={18} />
        </span>
        <p className={styles.helpBody}>{t.helpBody}</p>
        <a className={styles.phone} href={`tel:${supportPhone.replace(/\s/g, "")}`} dir="ltr">
          <Phone aria-hidden="true" size={14} />
          {supportPhone}
        </a>
      </div>
    </aside>
  );
}
