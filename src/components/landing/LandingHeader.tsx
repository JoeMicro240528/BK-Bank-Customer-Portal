import { Globe2, HelpCircle, Info, ShieldCheck } from "lucide-react";
import styles from "./LandingHeader.module.css";
import type { Language, LandingCopy } from "./types";

export default function LandingHeader({
  t,
  language,
  onLanguageChange,
}: {
  t: LandingCopy;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>
          <ShieldCheck aria-hidden="true" size={24} />
        </span>
        <div>
          <h1>{t.platformName}</h1>
          <p>{t.platformTagline}</p>
        </div>
      </div>

      <nav className={styles.nav}>
        <a className={styles.navLink} href="#about">
          <Info aria-hidden="true" size={16} />
          {t.navAbout}
        </a>
        <a className={styles.navLink} href="#help">
          <HelpCircle aria-hidden="true" size={16} />
          {t.navHelp}
        </a>
        <label className={styles.langControl}>
          <Globe2 aria-hidden="true" size={16} />
          <select
            value={language}
            onChange={(event) => onLanguageChange(event.target.value as Language)}
          >
            <option value="en">{t.english}</option>
            <option value="ar">{t.arabic}</option>
          </select>
        </label>
      </nav>
    </header>
  );
}
