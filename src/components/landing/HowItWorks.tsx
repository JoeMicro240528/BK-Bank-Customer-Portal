import { Landmark, Pencil, Send, UserRound } from "lucide-react";
import styles from "./HowItWorks.module.css";
import type { LandingCopy } from "./types";

export default function HowItWorks({ t }: { t: LandingCopy }) {
  const steps = [
    { icon: UserRound, title: t.step1Title, desc: t.step1Desc },
    { icon: Pencil, title: t.step2Title, desc: t.step2Desc },
    { icon: Landmark, title: t.step3Title, desc: t.step3Desc },
    { icon: Send, title: t.step4Title, desc: t.step4Desc },
  ];

  return (
    <section className={styles.section}>
      <h2>{t.howItWorks}</h2>
      <div className={styles.grid}>
        {steps.map((step, index) => (
          <div className={styles.step} key={step.title}>
            <span className={styles.stepIndex}>{index + 1}</span>
            <span className={styles.stepIcon}>
              <step.icon aria-hidden="true" size={20} />
            </span>
            <strong>{step.title}</strong>
            <span className={styles.stepDesc}>{step.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
