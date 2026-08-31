import { AlertCircle, Check, ChevronLeft, Lock, ShieldUser } from "lucide-react";
import Banner from "@/components/ui/Banner";
import styles from "./LoginCard.module.css";
import type { LandingCopy } from "./types";

export default function LoginCard({
  t,
  loginError,
  onLogin,
}: {
  t: LandingCopy;
  loginError: string;
  onLogin: () => void;
}) {
  return (
    <div className={styles.card}>
      <span className={styles.avatarWrap}>
        <ShieldUser aria-hidden="true" size={42} />
        <span className={styles.avatarBadge}>
          <Check aria-hidden="true" size={14} />
        </span>
      </span>

      <h2>{t.welcomeGreeting} 👋</h2>
      <p>{t.welcomeIntro}</p>

      <div className={styles.divider} />
      <p className={styles.trustBadges}>{t.trustBadges}</p>

      {loginError && <Banner tone="danger" icon={AlertCircle} text={loginError} />}

      <button type="button" className={styles.loginButton} aria-label={t.sudapassLogin} onClick={onLogin}>
        <span className={styles.loginBadge}>S</span>
        <span className={styles.loginText}>
          <strong>{t.sudapassTitle}</strong>
          <span>SudaPass</span>
        </span>
      </button>

      <p className={styles.privacyNote}>
        <Lock aria-hidden="true" size={14} />
        {t.privacyNote}
      </p>

      <div className={styles.noAccount}>
        <span>{t.noAccount}</span>
        <a href="https://sudapass.sd" target="_blank" rel="noreferrer">
          <ChevronLeft aria-hidden="true" size={14} />
          {t.createAccount}
        </a>
      </div>
    </div>
  );
}
