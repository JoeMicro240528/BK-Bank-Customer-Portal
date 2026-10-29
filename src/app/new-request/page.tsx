"use client";

import { useLanguage } from "@/lib/language";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Banner from "@/components/ui/Banner";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import NewRequestScreen from "@/components/wizard/NewRequestScreen";
import type { AddedAccount } from "@/components/wizard/types";
import AufForm from "@/components/form/AufForm";
import { initialForm, buildUpdatePayload, type FormState } from "@/lib/auf/form";
import { useDraft } from "@/lib/auf/useDraft";
import { useCountries } from "@/lib/useCountries";
import { resolveNationalityId } from "@/lib/format";
import { useRequests } from "@/lib/useRequests";
import { useBanks } from "@/lib/useBanks";
import { frontendApi } from "@/lib/api";

function NewRequestFlow() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useLanguage();
  const [error, setError] = useState("");
  const [successMessage] = useState("");

  // Supports both ?external_ref=... and ?ref=...
  const resumeRef =
    searchParams.get("external_ref") || searchParams.get("ref") || undefined;
  const isEditMode = Boolean(resumeRef);

  /** Controls whether user is on the Request Data screen ("accounts") or detailed form ("form") */
  const [screen, setScreen] = useState<"accounts" | "form">("accounts");
  const [formState, setFormState] = useState<FormState | null>(null);

  // Hooks must run unconditionally before any early returns
  const { banks, error: banksError } = useBanks(language);
  const {
    draft,
    rawRequest,
    loading: draftLoading,
    error: draftError,
    canEdit,
  } = useDraft(session?.user?.national_id, language, resumeRef);

  const { countries, codeToId, idToCode } = useCountries(language);
  const { requests, loading: requestsLoading } = useRequests(
    session?.user?.national_id,
    language,
  );

  // Pre-load saved branch and account number
  const initialBranchId = String(rawRequest?.branch_id ?? draft?.state.branch_id ?? "");
  const initialBranchName =
    banks[0]?.branches.find((b) => String(b.id) === initialBranchId)?.name ||
    rawRequest?.branch_name ||
    "";
  const initialAccountNumber =
    rawRequest?.selected_accounts?.[0]?.account_number ||
    draft?.state.selected_accounts?.[0]?.account_number ||
    (rawRequest as unknown as { account_number?: string })?.account_number ||
    "";

  const initialAccounts: AddedAccount[] = useMemo(() => {
    if (!rawRequest && !draft) return [];
    const selectedBank = banks[0];
    const bId = initialBranchId;
    const bName = initialBranchName;

    const accountsSource = rawRequest?.selected_accounts?.length
      ? rawRequest.selected_accounts
      : draft?.state.selected_accounts?.length
      ? draft.state.selected_accounts
      : [];

    if (accountsSource.length > 0) {
      return accountsSource.map((acc, index) => ({
        id: `account-${index}`,
        bankId: String(acc.bank_id || selectedBank?.id || "1"),
        bankName: selectedBank?.name || "بنك أمدرمان الوطني",
        bankColor: selectedBank?.color || "#283f76",
        branchId: bId,
        branch: bName,
        accountNumber: acc.account_number || "",
      }));
    }

    if (initialAccountNumber || bId) {
      return [
        {
          id: "account-0",
          bankId: selectedBank?.id || "1",
          bankName: selectedBank?.name || "بنك أمدرمان الوطني",
          bankColor: selectedBank?.color || "#283f76",
          branchId: bId,
          branch: bName,
          accountNumber: initialAccountNumber,
        },
      ];
    }

    return [];
  }, [rawRequest, draft, banks, initialBranchId, initialBranchName, initialAccountNumber]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Guard: if user has existing requests and is NOT editing/resuming, block new creation
  useEffect(() => {
    if (!requestsLoading && !resumeRef && requests.length > 0) {
      router.push("/requests");
    }
  }, [requestsLoading, resumeRef, requests.length, router]);

  // Loading state
  if (
    status === "loading" ||
    status === "unauthenticated" ||
    draftLoading ||
    requestsLoading
  ) {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  // Prevent UI flash when redirecting to /requests
  if (!resumeRef && requests.length > 0) {
    return null;
  }

  const t = dashboardCopy[language];
  const user = session?.user;
  const ownerId = user?.national_id;

  // Error loading draft / details (Scenario 8)
  if (isEditMode && draftError) {
    return (
      <DashboardLayout
        language={language}
        onLanguageChange={setLanguage}
        user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
        crumbs={[
          { label: t.nav.home, href: "/dashboard" },
          { label: t.nav.myRequests, href: "/requests" },
          { label: language === "ar" ? "تعديل الطلب" : "Edit Request" },
        ]}
        active="myRequests"
        onLogout={() => signOut({ callbackUrl: "/" })}
      >
        <div style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
          <Banner
            tone="danger"
            icon={AlertCircle}
            text={
              draftError ||
              (language === "ar"
                ? "تعذر تحميل بيانات الطلب. يرجى المحاولة مرة أخرى."
                : "Failed to load request details. Please try again.")
            }
          />
          <button
            type="button"
            style={{
              marginTop: 20,
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid var(--line, #d8dee8)",
              background: "var(--surface, #fff)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => router.push("/requests")}
          >
            {language === "ar" ? "العودة إلى طلباتي" : "Back to my requests"}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Edit protection: request is neither draft nor rejected (Scenario 7)
  if (isEditMode && rawRequest && !canEdit) {
    return (
      <DashboardLayout
        language={language}
        onLanguageChange={setLanguage}
        user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
        crumbs={[
          { label: t.nav.home, href: "/dashboard" },
          { label: t.nav.myRequests, href: "/requests" },
          { label: language === "ar" ? "تعديل الطلب" : "Edit Request" },
        ]}
        active="myRequests"
        onLogout={() => signOut({ callbackUrl: "/" })}
      >
        <div style={{ maxWidth: 640, margin: "40px auto", textAlign: "center" }}>
          <Banner
            tone="danger"
            icon={AlertCircle}
            text={
              language === "ar"
                ? "لا يمكن تعديل هذا الطلب لأن حالته الحالية لا تسمح بالتعديل (يُسمح بتعديل المسودات والطلبات المرفوضة فقط)."
                : "This request cannot be edited because its current status does not allow modifications (only drafts and rejected requests can be edited)."
            }
          />
          <button
            type="button"
            style={{
              marginTop: 20,
              padding: "10px 24px",
              borderRadius: 10,
              border: "1px solid var(--line, #d8dee8)",
              background: "var(--surface, #fff)",
              cursor: "pointer",
              fontWeight: 600,
            }}
            onClick={() => router.push("/requests")}
          >
            {language === "ar" ? "العودة إلى طلباتي" : "Back to my requests"}
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const withIdentity = (incoming: FormState): FormState => {
    const state = {
      ...incoming,
      ...(user?.name ? { name_arabic: user.name } : {}),
      ...(user?.birthDate ? { date_of_birth: user.birthDate } : {}),
    };

    return state.identity_lines.some((line) => line.is_primary && line.id_number.trim())
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
  };

  /** Continues from Request Data screen to the multi-step form and saves updated branch/account on existing request */
  const handleContinue = async (accounts: AddedAccount[]) => {
    if (!ownerId) {
      setError("Missing national ID on the session.");
      return;
    }

    const currentState = draft?.state ?? initialForm();
    const branchId = accounts[0]?.branchId ?? currentState.branch_id ?? "";
    const bankId = accounts[0]?.bankId ?? currentState.selected_bank_id ?? "";

    const nextState: FormState = {
      ...currentState,
      name_arabic: user?.name || currentState.name_arabic || "",
      name_english: currentState.name_english || "",
      nationality_id:
        currentState.nationality_id ||
        resolveNationalityId(user?.nationality, codeToId) ||
        "195",
      email: user?.email || currentState.email || "",
      gender: user?.gender || currentState.gender || "",
      date_of_birth: user?.birthDate || currentState.date_of_birth || "",
      mobile_personal: user?.phone_number || currentState.mobile_personal || "",
      branch_id: branchId,
      selected_bank_id: bankId,
      selected_accounts: accounts.map((account) => ({
        bank_id: Number(account.bankId),
        account_number: account.accountNumber,
      })),
    };

    // If editing existing request, update branch and account number via PATCH
    if (resumeRef) {
      try {
        const payload = buildUpdatePayload(nextState, resumeRef);
        await frontendApi.updateRequest(resumeRef, payload, { language, ownerId });
      } catch (caught) {
        console.warn("Could not save updated branch immediately:", caught);
      }
    }

    setFormState(nextState);
    setScreen("form");
  };

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user?.name || "", role: t.platformTagline, picture: user?.picture }}
      crumbs={[
        { label: t.nav.home, href: "/dashboard" },
        { label: t.nav.myRequests, href: "/requests" },
        {
          label: isEditMode
            ? language === "ar"
              ? "تعديل الطلب"
              : "Edit Request"
            : t.nav.newRequest,
        },
      ]}
      active="myRequests"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      {(error || banksError) && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error || banksError} />
        </div>
      )}

      {successMessage && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="success" icon={CheckCircle2} text={successMessage} />
        </div>
      )}

      {screen === "form" && (formState || draft) && ownerId ? (
        <AufForm
          language={language}
          ownerId={ownerId}
          externalRef={resumeRef}
          initialState={withIdentity(formState ?? draft!.state)}
          bankNames={Object.fromEntries(banks.map((b) => [b.id, b.name]))}
          existingUploads={draft?.uploads}
          countryOptions={countries}
          countryCodeById={idToCode}
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
          onBackToDetails={() => setScreen("accounts")}
        />
      ) : (
        <NewRequestScreen
          language={language}
          banks={banks}
          nationalId={ownerId}
          initialAccounts={initialAccounts}
          isEdit={isEditMode}
          initialBranchId={initialBranchId}
          initialBranchName={initialBranchName}
          initialAccountNumber={initialAccountNumber}
          onBack={() => router.push("/requests")}
          onContinue={handleContinue}
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
