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
      const created = await frontendApi.createRequest(
        {
          info_type: "update",
          name_arabic: user?.name || "",
          name_english: user?.name || "",
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
