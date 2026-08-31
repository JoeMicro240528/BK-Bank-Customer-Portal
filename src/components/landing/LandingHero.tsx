import { BadgeCheck, Building2, Clock, Landmark, ShieldCheck } from "lucide-react";
import Image from "next/image";
import styles from "./LandingHero.module.css";
import type { LandingCopy } from "./types";

export default function LandingHero({ t }: { t: LandingCopy }) {
  return (
    <div className={styles.hero}>
      <div className={styles.illustration} aria-hidden="true">
        <span className={styles.orbitRing} />
        <Image
          src="/shield-illustration.png"
          alt=""
          width={220}
          height={220}
          className={styles.core}
          priority
        />
        <span className={`${styles.orbit} ${styles.orbit1}`}>
          <Landmark size={18} />
        </span>
        <span className={`${styles.orbit} ${styles.orbit2}`}>
          <Building2 size={18} />
        </span>
        <span className={`${styles.orbit} ${styles.orbit3}`}>
          <BadgeCheck size={18} />
        </span>
        <span className={`${styles.orbit} ${styles.orbit4}`}>
          <Building2 size={18} />
        </span>
        <span className={`${styles.orbit} ${styles.orbit5}`}>
          <Landmark size={18} />
        </span>
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
