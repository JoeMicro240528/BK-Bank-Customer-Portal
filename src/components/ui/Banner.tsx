import type { LucideIcon } from "lucide-react";

export default function Banner({
  tone,
  icon: Icon,
  text,
}: {
  tone: "success" | "danger" | "warning";
  icon: LucideIcon;
  text: string;
}) {
  return (
    <div className={`banner ${tone}`}>
      <Icon aria-hidden="true" size={18} />
      <span>{text}</span>
    </div>
  );
}
