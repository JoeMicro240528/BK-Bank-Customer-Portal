import { notFound } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Design-preview routes. These render the real page components with fixture
 * data so the UI can be worked on without signing in through SudaPass.
 * They are unreachable in production.
 */
export default function PreviewLayout({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <>{children}</>;
}
