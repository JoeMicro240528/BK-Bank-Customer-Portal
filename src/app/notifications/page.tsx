"use client";

import { useLanguage } from "@/lib/language";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import NotificationsList from "@/components/notifications/NotificationsList";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  const t = dashboardCopy[language];
  const user = session?.user;

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home, href: "/dashboard" }, { label: t.nav.notifications }]}
      active="notifications"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      <NotificationsList
        language={language}
        ownerId={session?.user?.national_id}
        onOpenRequest={(id) => router.push(`/requests/${encodeURIComponent(id)}`)}
      />
    </DashboardLayout>
  );
}
