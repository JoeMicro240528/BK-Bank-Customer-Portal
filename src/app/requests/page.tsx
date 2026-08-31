"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import type { Language } from "@/components/dashboard/types";
import type { RequestSummary } from "@/components/home/types";
import RequestsList from "@/components/requests/RequestsList";

export default function RequestsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");

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

  // TODO: load from the backend once a requests endpoint exists.
  const requests: RequestSummary[] = [];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home }, { label: t.nav.myRequests }]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      <RequestsList
        language={language}
        requests={requests}
        onNewRequest={() => router.push("/new-request")}
        onViewRequest={(id) => router.push(`/requests/${id}`)}
      />
    </DashboardLayout>
  );
}
