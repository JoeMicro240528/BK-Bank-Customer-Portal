"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import DashboardHome from "@/components/home/DashboardHome";
import type { DashboardStats } from "@/components/home/types";
import type { Language } from "@/components/dashboard/types";
import { useRequests } from "@/lib/useRequests";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");

  // Called before the early return below -- hooks cannot run conditionally.
  const { requests } = useRequests(session?.user?.national_id, language);

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

  const stats: DashboardStats = {
    total: requests.length,
    underReview: requests.filter((item) => item.status === "under_review").length,
    approved: requests.filter((item) => item.status === "approved").length,
    actionRequired: requests.filter((item) => item.status === "action_required").length,
  };

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home }]}
      active="home"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      <DashboardHome
        language={language}
        userName={user?.name?.split(" ")[0] || ""}
        stats={stats}
        requests={requests}
        onNewRequest={() => router.push("/new-request")}
        onMyData={() => router.push("/profile")}
      />
    </DashboardLayout>
  );
}
