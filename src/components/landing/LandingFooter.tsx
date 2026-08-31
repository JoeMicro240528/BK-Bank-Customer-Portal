import styles from "./LandingFooter.module.css";
import type { LandingCopy } from "./types";

export default function LandingFooter({ t }: { t: LandingCopy }) {
  return (
    <footer className={styles.footer}>
      <span>{t.footerRights}</span>
      <div className={styles.links}>
        <a href="#terms">{t.footerTerms}</a>
        <a href="#privacy">{t.footerPrivacy}</a>
      </div>
    </footer>
  );
}
