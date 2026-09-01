"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import Banner from "@/components/ui/Banner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import type { Language } from "@/components/dashboard/types";
import NewRequestScreen from "@/components/wizard/NewRequestScreen";
import type { AddedAccount } from "@/components/wizard/types";
import { frontendApi, formatApiError } from "@/lib/api";
import { useBanks } from "@/lib/useBanks";

export default function NewRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Hooks must run unconditionally, before the early return below.
  const { banks, error: banksError } = useBanks(language);

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
  const ownerId = user?.national_id;

  const handleContinue = async (accounts: AddedAccount[]) => {
    if (!ownerId || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      // The API keys its detail endpoint on external_ref but never assigns one,
      // so the request would be unreachable unless we supply it here.
      const externalRef = `auf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

      const created = await frontendApi.createRequest(
        {
          external_ref: externalRef,
          info_type: "update",
          name_arabic: user?.name || "",
          name_english: user?.name || "",
          // The API rejects a request without a primary national ID, even
          // though the same value is already sent as X-Owner-Id.
          identity_lines: [
            { id_type: "national_id", id_number: ownerId, is_primary: true },
          ],
          selected_accounts: accounts.map((account) => ({
            bank_id: Number(account.bankId),
            account_number: account.accountNumber,
          })),
        },
        { language, ownerId },
      );

      router.push(`/requests/${encodeURIComponent(created.external_ref || created.reference)}`);
    } catch (caught) {
      setError(formatApiError(caught));
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home }, { label: t.nav.newRequest }]}
      active="newRequest"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      {(error || banksError) && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error || banksError} />
        </div>
      )}

      <NewRequestScreen
        language={language}
        banks={banks}
        onBack={() => router.push("/profile")}
        onContinue={handleContinue}
      />
    </DashboardLayout>
  );
}
