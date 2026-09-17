"use client";

import { useLanguage } from "@/lib/language";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import RequestsList from "@/components/requests/RequestsList";
import { useRequests } from "@/lib/useRequests";

export default function RequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useLanguage();

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


  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home, href: "/dashboard" }, { label: t.nav.myRequests }]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      <RequestsList
        language={language}
        requests={requests}
        onNewRequest={() => router.push("/new-request")}
        onViewRequest={(id) => router.push(`/requests/${encodeURIComponent(id)}`)}
        onContinueRequest={(id) => router.push(`/new-request?ref=${encodeURIComponent(id)}`)}
      />
    </DashboardLayout>
  );
}
