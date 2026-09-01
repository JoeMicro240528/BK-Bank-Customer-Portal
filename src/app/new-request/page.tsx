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
import AufForm from "@/components/form/AufForm";
import { initialForm, type FormState } from "@/lib/auf/form";
import { useBanks } from "@/lib/useBanks";

export default function NewRequestPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const [error, setError] = useState("");

  /** Once banks are chosen the flow moves on to the detail form. */
  const [formState, setFormState] = useState<FormState | null>(null);

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

  /** Seeds the form from the session and the chosen accounts, then hands over. */
  const startForm = (accounts: AddedAccount[]) => {
    if (!ownerId) {
      setError("Missing national ID on the session.");
      return;
    }

    setFormState({
      ...initialForm(),
      name_arabic: user?.name || "",
      name_english: user?.name || "",
      email: user?.email || "",
      gender: user?.gender || "",
      date_of_birth: user?.birthDate || "",
      mobile_personal: user?.phone_number || "",
      identity_lines: [
        {
          id_type: "national_id",
          id_number: ownerId,
          id_type_other: "",
          issuance_date: "",
          expiry_date: "",
          nationality_id: "",
          is_primary: true,
        },
      ],
      selected_accounts: accounts.map((account) => ({
        bank_id: Number(account.bankId),
        account_number: account.accountNumber,
      })),
    } as FormState);
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

      {formState && ownerId ? (
        <AufForm
          language={language}
          ownerId={ownerId}
          initialState={formState}
          onSubmitted={(ref) => router.push(`/requests/${encodeURIComponent(ref)}`)}
        />
      ) : (
        <NewRequestScreen
          language={language}
          banks={banks}
          onBack={() => router.push("/profile")}
          onContinue={startForm}
        />
      )}
    </DashboardLayout>
  );
}
