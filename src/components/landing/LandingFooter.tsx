import { Globe, Mail, Phone } from "lucide-react";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_WEBSITE,
  SUPPORT_WEBSITE_URL,
} from "@/lib/contact";
import styles from "./LandingFooter.module.css";
import type { LandingCopy } from "./types";

export default function LandingFooter({ t }: { t: LandingCopy }) {
  return (
    <footer className={styles.footer}>
      {/* The bank asked for its contact details on the last line of the home
          page as well as on the contact page. Each one is an icon and a link,
          so the number dials and the address opens a mail app on a phone. */}
      <span className={styles.contact}>
        <a href={`tel:${SUPPORT_PHONE}`}>
          <Phone aria-hidden="true" size={15} />
          <span dir="ltr">{SUPPORT_PHONE}</span>
        </a>
        <a href={`mailto:${SUPPORT_EMAIL}`}>
          <Mail aria-hidden="true" size={15} />
          <span dir="ltr">{SUPPORT_EMAIL}</span>
        </a>
        <a href={SUPPORT_WEBSITE_URL} target="_blank" rel="noopener noreferrer">
          <Globe aria-hidden="true" size={15} />
          <span dir="ltr">{SUPPORT_WEBSITE}</span>
        </a>
      </span>

      <span className={styles.rights}>{t.footerRights}</span>
    </footer>
  );
}
