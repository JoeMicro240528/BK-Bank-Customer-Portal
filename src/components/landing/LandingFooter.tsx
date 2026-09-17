import styles from "./LandingFooter.module.css";
import type { LandingCopy } from "./types";

export default function LandingFooter({ t }: { t: LandingCopy }) {
  return (
    <footer className={styles.footer}>
      <span>{t.footerRights}</span>
    </footer>
  );
}
