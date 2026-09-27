import { AlertCircle, Check, Download, Lock, ShieldUser } from "lucide-react";
import Image from "next/image";
import Banner from "@/components/ui/Banner";
import styles from "./LoginCard.module.css";
import type { LandingCopy, Language } from "./types";

export default function LoginCard({
  t,
  language,
  loginError,
  onLogin,
}: {
  t: LandingCopy;
  language: Language;
  loginError: string;
  onLogin: () => void;
}) {
  // SudaPass publishes its own sign-in button in each language; using it keeps
  // their mark, wording and colours exactly as specified, as Kafaa does.
  const buttonImage = `/sudapass/signin-light-${language === "ar" ? "ar" : "en"}.svg`;

  return (
    <div className={styles.card}>
      <span className={styles.avatarWrap}>
        <ShieldUser aria-hidden="true" size={42} />
        <span className={styles.avatarBadge}>
          <Check aria-hidden="true" size={14} />
        </span>
      </span>

      <h2>{t.welcomeGreeting}</h2>
      <p>{t.welcomeIntro}</p>

      <div className={styles.divider} />
      <p className={styles.trustBadges}>{t.trustBadges}</p>

      {loginError && <Banner tone="danger" icon={AlertCircle} text={loginError} />}

      <button type="button" className={styles.loginButton} aria-label={t.sudapassLogin} onClick={onLogin}>
        <Image src={buttonImage} alt={t.sudapassLogin} width={300} height={66} priority />
      </button>

      {/* Signing in needs the national identity app on the customer's phone;
          Kafaa says the same before its SudaPass button. */}
      <p className={styles.installNote}>
        <Download aria-hidden="true" size={14} />
        <span>
          {t.installAppMessage}{" "}
          <a
            href="https://play.google.com/store/apps/details?id=sd.gov.sudapass"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.downloadAppLink}
          </a>
        </span>
      </p>

      <p className={styles.privacyNote}>
        <Lock aria-hidden="true" size={14} />
        {t.privacyNote}
      </p>

    </div>
  );
}
