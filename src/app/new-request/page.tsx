"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useDraft } from "@/lib/auf/useDraft";
import { useCountries } from "@/lib/useCountries";

function NewRequestFlow() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>("ar");
  const [error, setError] = useState("");

  // Set only when continuing a saved draft from its details page.
  const resumeRef = searchParams.get("ref") || undefined;

  /** Once banks are chosen the flow moves on to the detail form. */
  const [formState, setFormState] = useState<FormState | null>(null);

  // Hooks must run unconditionally, before the early return below.
  const { banks, error: banksError } = useBanks(language);
  const { draft, loading: draftLoading } = useDraft(session?.user?.national_id, language, resumeRef);
  const { countries } = useCountries(language);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // When resuming, wait for the draft so the bank picker never flashes first.
  if (status === "loading" || status === "unauthenticated" || draftLoading) {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  const t = dashboardCopy[language];
  const user = session?.user;
  const ownerId = user?.national_id;

  // The API rejects any save without a primary national ID, so guarantee one
  // even if a restored draft came back without its identity lines.
  const withIdentity = (state: FormState): FormState =>
    state.identity_lines.some((line) => line.is_primary && line.id_number.trim())
      ? state
      : {
          ...state,
          identity_lines: [
            {
              id_type: "national_id",
              id_number: ownerId || "",
              id_type_other: "",
              issuance_date: "",
              expiry_date: "",
              nationality_id: "",
              is_primary: true,
            },
            ...state.identity_lines.filter((line) => line.id_number.trim()),
          ],
        };

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
    });
  };

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[{ label: t.nav.home }, { label: t.nav.newRequest }]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      {(error || banksError) && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error || banksError} />
        </div>
      )}

      {(formState || draft) && ownerId ? (
        <AufForm
          language={language}
          ownerId={ownerId}
          externalRef={formState ? undefined : draft?.externalRef}
          initialState={withIdentity(formState ?? draft!.state)}
          bankNames={Object.fromEntries(banks.map((b) => [b.id, b.name]))}
          countryOptions={countries}
          locked={{
            name: user?.name,
            nationalId: ownerId,
            birthDate: user?.birthDate,
            gender: user?.gender,
            nationality: user?.nationality,
            email: user?.email,
            phone: user?.phone_number,
          }}
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

/**
 * useSearchParams opts the tree into client rendering, so the boundary is
 * required for the build to prerender this route's shell.
 */
export default function NewRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="page-loading">
          <Loader2 className="page-loading-spinner" aria-hidden="true" />
        </div>
      }
    >
      <NewRequestFlow />
    </Suspense>
  );
}
