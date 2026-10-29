"use client";

import { useEffect, useState } from "react";
import DocumentsModal from "./DocumentsModal";
import StepsAside from "./StepsAside";
import AccountsCard from "./AccountsCard";
import SummaryAside from "./SummaryAside";
import WizardStepBar from "./WizardStepBar";
import { wizardCopy } from "./copy";
import styles from "./NewRequestScreen.module.css";
import type { AddedAccount, BankOption, Language, WizardStep } from "./types";
import { SUPPORT_PHONE } from "@/lib/contact";

/**
 * The "new update request" wizard step. Renders content only -- the page
 * supplies the surrounding chrome -- so the real page and the design-preview
 * route can share it.
 */
export default function NewRequestScreen({
  language,
  banks,
  nationalId,
  initialAccounts = [],
  isEdit = false,
  initialBranchId = "",
  initialBranchName = "",
  initialAccountNumber = "",
  onSave,
  saving = false,
  onBack,
  onContinue,
}: {
  language: Language;
  banks: BankOption[];
  nationalId?: string;
  initialAccounts?: AddedAccount[];
  isEdit?: boolean;
  initialBranchId?: string;
  initialBranchName?: string;
  initialAccountNumber?: string;
  onSave?: (data: { branchId: string; accountNumber: string; accounts: AddedAccount[] }) => Promise<void>;
  saving?: boolean;
  onBack?: () => void;
  onContinue?: (accounts: AddedAccount[]) => void;
}) {
  const [accounts, setAccounts] = useState<AddedAccount[]>(initialAccounts);
  // In create mode, list attachments upfront; in edit mode, don't show the popup.
  const [showDocuments, setShowDocuments] = useState(!isEdit);

  useEffect(() => {
    if (initialAccounts && initialAccounts.length > 0 && accounts.length === 0) {
      setAccounts(initialAccounts);
    }
  }, [initialAccounts, accounts.length]);

  const t = wizardCopy[language];
  const locale = language === "ar" ? "ar-EG" : "en-GB";
  const today = new Date().toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const steps: WizardStep[] = [
    { key: "identity", label: t.steps.identity, hint: t.stepHints.identity, state: "done" },
    { key: "details", label: t.steps.details, hint: t.stepHints.details, state: "current" },
    { key: "review", label: t.steps.review, hint: t.stepHints.review, state: "pending" },
    { key: "submit", label: t.steps.submit, hint: t.stepHints.submit, state: "pending" },
  ];

  const branchCount = new Set(accounts.map((account) => account.branch)).size;

  const handleAdd = (account: Omit<AddedAccount, "id">) => {
    setAccounts((previous) => [
      ...previous,
      { ...account, id: `${Date.now()}-${previous.length}` },
    ]);
  };

  const handleUpdateAccount = (index: number, updated: AddedAccount) => {
    setAccounts((previous) => {
      const next = [...previous];
      if (next[index]) {
        next[index] = updated;
      } else {
        next.push(updated);
      }
      return next;
    });
  };

  const handleRemove = (id: string) => {
    setAccounts((previous) => previous.filter((account) => account.id !== id));
  };

  return (
    <>
      {showDocuments && (
        <DocumentsModal language={language} onClose={() => setShowDocuments(false)} />
      )}

      <WizardStepBar steps={steps} />

      <div className={styles.grid}>
        <StepsAside t={t} steps={steps} verifiedAt={today} supportPhone={SUPPORT_PHONE} />

        <AccountsCard
          t={t}
          language={language}
          banks={banks}
          nationalId={nationalId}
          accounts={accounts}
          isEdit={isEdit}
          initialBranchId={initialBranchId}
          initialBranchName={initialBranchName}
          initialAccountNumber={initialAccountNumber}
          onAdd={handleAdd}
          onUpdateAccount={handleUpdateAccount}
          onRemove={handleRemove}
          onSave={onSave}
          saving={saving}
          onBack={() => onBack?.()}
          onContinue={(effectiveAccounts) => onContinue?.(effectiveAccounts)}
        />

        <SummaryAside
          t={t}
          branchCount={branchCount}
          accountCount={accounts.length}
          requestDate={today}
        />
      </div>
    </>
  );
}
