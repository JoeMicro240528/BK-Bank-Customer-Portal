"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import type { Language } from "@/components/dashboard/types";
import RequestDetails from "@/components/request/RequestDetails";
import type { RequestDetailsData } from "@/components/request/types";

export default function RequestDetailsPage() {
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

  // TODO: fetch the request by id once the backend endpoint exists.
  const request: RequestDetailsData | null = null;

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[
        { label: t.nav.home },
        { label: t.nav.myRequests, href: "/requests" },
        { label: language === "ar" ? "تفاصيل الطلب" : "Request details" },
      ]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      {request ? (
        <RequestDetails request={request} language={language} />
      ) : (
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          {language === "ar"
            ? "تعذر العثور على هذا الطلب."
            : "This request could not be found."}
        </p>
      )}
    </DashboardLayout>
  );
}
