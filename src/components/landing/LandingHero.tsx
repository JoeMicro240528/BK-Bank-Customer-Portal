import { Clock, Landmark, ShieldCheck } from "lucide-react";
import Image from "next/image";
import styles from "./LandingHero.module.css";
import type { LandingCopy } from "./types";

/**
 * The banks the portal covers, orbiting the Central Bank mark. Listed here
 * rather than fetched: the landing page is public and master-data needs a
 * session. Each logo is cropped to its emblem so it reads at badge size --
 * the full lock-ups carry a wordmark that would be illegible at 44px.
 */
const banks: {
  bic: string;
  name: string;
  logo: string;
  bleed?: boolean;
  tall?: boolean;
}[] = [
  { bic: "BOK", name: "بنك الخرطوم", logo: "/banks/bok.png", bleed: true },
  { bic: "ONB", name: "بنك أم درمان الوطني", logo: "/banks/onb.png" },
  { bic: "FIB", name: "بنك فيصل الإسلامي", logo: "/banks/fib.png" },
  { bic: "SAL", name: "مصرف السلام", logo: "/banks/salam.png", tall: true },
  { bic: "NIL", name: "بنك النيل", logo: "/banks/nile.png" },
  { bic: "NBS", name: "البنك الأهلي السوداني", logo: "/banks/nbs.png" },
];

export default function LandingHero({ t }: { t: LandingCopy }) {
  return (
    <div className={styles.hero}>
      <div className={styles.illustration}>
        <span className={styles.orbitRing} aria-hidden="true" />

        <Image
          src="/cbos-logo.png"
          alt={t.heroLogoAlt}
          width={300}
          height={213}
          className={styles.core}
          priority
        />

        {banks.map((bank, index) => (
          <span
            key={bank.bic}
            className={`${styles.orbit} ${styles[`orbit${index + 1}`]}`}
            title={bank.name}
          >
            <Image
              src={bank.logo}
              alt={bank.name}
              width={44}
              height={44}
              className={[
                styles.orbitLogo,
                bank.bleed ? styles.orbitLogoBleed : "",
                bank.tall ? styles.orbitLogoTall : "",
              ]
                .filter(Boolean)
                .join(" ")}
            />
          </span>
        ))}
      </div>

      <div className={styles.text}>
        <h2>{t.heroTitle}</h2>
        <p>{t.heroSubtitle}</p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <Landmark aria-hidden="true" size={22} />
            </span>
            <strong>{t.featureBankTitle}</strong>
            <span className={styles.featureDesc}>{t.featureBankDesc}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <Clock aria-hidden="true" size={22} />
            </span>
            <strong>{t.featureTimeTitle}</strong>
            <span className={styles.featureDesc}>{t.featureTimeDesc}</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <ShieldCheck aria-hidden="true" size={22} />
            </span>
            <strong>{t.featureSecureTitle}</strong>
            <span className={styles.featureDesc}>{t.featureSecureDesc}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
