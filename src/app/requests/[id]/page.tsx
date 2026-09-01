"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import Banner from "@/components/ui/Banner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import type { Language } from "@/components/dashboard/types";
import RequestDetails from "@/components/request/RequestDetails";
import type { RequestDetailsData } from "@/components/request/types";
import { frontendApi, errorMessage } from "@/lib/api";
import { toRequestDetails } from "@/lib/requestDetails";

const SUPPORT_PHONE = "+249 123 456 789";

export default function RequestDetailsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [language, setLanguage] = useState<Language>("ar");
  const [request, setRequest] = useState<RequestDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const externalRef = params?.id;
  const ownerId = session?.user?.national_id;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (!ownerId || !externalRef) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    frontendApi
      .getRequest(externalRef, { language, ownerId })
      .then((row) => {
        if (!cancelled) setRequest(toRequestDetails(row, language, SUPPORT_PHONE));
      })
      .catch((caught) => {
        if (!cancelled) {
          setError(errorMessage(caught));
          setRequest(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ownerId, externalRef, language]);

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
      crumbs={[
        { label: t.nav.home },
        { label: t.nav.myRequests, href: "/requests" },
        { label: request?.reference || (language === "ar" ? "تفاصيل الطلب" : "Request details") },
      ]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      {error && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error} />
        </div>
      )}

      {loading ? (
        <div className="page-loading" style={{ height: 240 }}>
          <Loader2 className="page-loading-spinner" aria-hidden="true" />
        </div>
      ) : request ? (
        <RequestDetails
          request={request}
          language={language}
          onContinue={() =>
            router.push(`/new-request?ref=${encodeURIComponent(request.externalRef)}`)
          }
        />
      ) : (
        !error && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            {language === "ar" ? "تعذر العثور على هذا الطلب." : "This request could not be found."}
          </p>
        )
      )}
    </DashboardLayout>
  );
}
