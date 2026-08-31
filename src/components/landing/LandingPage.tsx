import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LoginCard from "./LoginCard";
import HowItWorks from "./HowItWorks";
import LandingFooter from "./LandingFooter";
import styles from "./LandingPage.module.css";
import type { Language, LandingCopy } from "./types";

export default function LandingPage({
  t,
  dir,
  language,
  onLanguageChange,
  loginError,
  onLogin,
}: {
  t: LandingCopy;
  dir: "ltr" | "rtl";
  language: Language;
  onLanguageChange: (language: Language) => void;
  loginError: string;
  onLogin: () => void;
}) {
  return (
    <main className={styles.page} dir={dir}>
      <LandingHeader t={t} language={language} onLanguageChange={onLanguageChange} />

      <section className={styles.heroShell}>
        <div className={styles.heroPanel}>
          <LandingHero t={t} />
        </div>
        <LoginCard t={t} loginError={loginError} onLogin={onLogin} />
      </section>

      <HowItWorks t={t} />

      <LandingFooter t={t} />
    </main>
  );
}
