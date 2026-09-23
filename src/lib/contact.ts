/**
 * How customers reach the bank. Kept in one place because the same details
 * appear on the landing page, the contact page and the request screens.
 */
export const SUPPORT_PHONE = "5656";
export const SUPPORT_EMAIL = "info@onb.com.sd";
export const SUPPORT_WEBSITE = "www.onb-sd.com";
export const SUPPORT_WEBSITE_URL = "https://www.onb-sd.com";

/**
 * The bank's social accounts, as listed on onb-sd.com. `icon` names the icon
 * the contact page draws; WhatsApp and Telegram have no brand icon in the set,
 * so they borrow the closest one.
 */
export const SOCIAL_LINKS = [
  { id: "facebook", label: "Facebook", icon: "facebook", href: "https://www.facebook.com/ONBsudan/" },
  { id: "twitter", label: "X (Twitter)", icon: "twitter", href: "https://twitter.com/onbsudan" },
  { id: "youtube", label: "YouTube", icon: "youtube", href: "https://www.youtube.com/channel/UCwVDDlMmtH_FHk7CnlMxt-w" },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/in/oumdurman-national-bank-957379192",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: "whatsapp",
    href: "https://whatsapp.com/channel/0029Va8XVSJ3gvWhvyYfu52F",
  },
  { id: "telegram", label: "Telegram", icon: "telegram", href: "https://t.me/ONBsudan_bot" },
] as const;
