import { AlertCircle, CheckCircle2, Clock, FileEdit } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import styles from "./StatusPill.module.css";
import type { BankStatus } from "./types";

const icons: Record<BankStatus, LucideIcon> = {
  draft: FileEdit,
  approved: CheckCircle2,
  under_review: Clock,
  rejected: AlertCircle,
};

export default function StatusPill({ status, label }: { status: BankStatus; label: string }) {
  const Icon = icons[status];

  return (
    <span className={`${styles.pill} ${styles[status]}`}>
      <Icon aria-hidden="true" size={13} />
      {label}
    </span>
  );
}
