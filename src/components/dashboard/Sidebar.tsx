import {
  Bell,
  ClipboardList,
  Headphones,
  HelpCircle,
  Home,
  LogOut,
  PlusCircle,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./Sidebar.module.css";
import type { DashboardCopy, NavKey } from "./types";

const navIcons: Record<NavKey, LucideIcon> = {
  home: Home,
  newRequest: PlusCircle,
  myRequests: ClipboardList,
  myData: UserRound,
  notifications: Bell,
  faq: HelpCircle,
  contact: Headphones,
};

const navOrder: NavKey[] = [
  "home",
  "newRequest",
  "myRequests",
  "myData",
  "notifications",
  "faq",
  "contact",
];

export default function Sidebar({
  t,
  active,
  badges = {},
  open = false,
  onNavigate,
  onLogout,
}: {
  t: DashboardCopy;
  active?: NavKey;
  badges?: Partial<Record<NavKey, number>>;
  open?: boolean;
  onNavigate?: (key: NavKey) => void;
  onLogout?: () => void;
}) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ""}`}>
      <div className={styles.brand}>
        <span className={styles.brandIcon}>
          <ShieldCheck aria-hidden="true" size={22} />
        </span>
        <span className={styles.brandText}>
          <strong>{t.platformName}</strong>
          <span>{t.platformTagline}</span>
        </span>
      </div>

      <nav>
        <ul className={styles.navList}>
          {navOrder.map((key) => {
            const Icon = navIcons[key];
            const badge = badges[key];
            const isActive = active === key;

            return (
              <li key={key}>
                <button
                  type="button"
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onNavigate?.(key)}
                >
                  <Icon aria-hidden="true" size={19} />
                  <span className={styles.navLabel}>{t.nav[key]}</span>
                  {badge ? <span className={styles.badge}>{badge}</span> : null}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={styles.spacer} />

      <button type="button" className={styles.logout} onClick={onLogout}>
        <LogOut aria-hidden="true" size={19} />
        <span className={styles.navLabel}>{t.logout}</span>
      </button>
    </aside>
  );
}
