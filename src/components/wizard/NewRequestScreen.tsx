"use client";

import { useState } from "react";
import StepsAside from "./StepsAside";
import AccountsCard from "./AccountsCard";
import SummaryAside from "./SummaryAside";
import WizardStepBar from "./WizardStepBar";
import { wizardCopy } from "./copy";
import styles from "./NewRequestScreen.module.css";
import type { AddedAccount, Language, WizardStep } from "./types";

const SUPPORT_PHONE = "+249 123 456 789";

/**
 * The "new update request" wizard step. Renders content only -- the page
 * supplies the surrounding chrome -- so the real page and the design-preview
 * route can share it.
 */
export default function NewRequestScreen({
  language,
  initialAccounts = [],
  onBack,
  onContinue,
}: {
  language: Language;
  initialAccounts?: AddedAccount[];
  onBack?: () => void;
  onContinue?: () => void;
}) {
  const [accounts, setAccounts] = useState<AddedAccount[]>(initialAccounts);

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

  const bankCount = new Set(accounts.map((account) => account.bankId)).size;

  const handleAdd = (account: Omit<AddedAccount, "id">) => {
    setAccounts((previous) => [
      ...previous,
      { ...account, id: `${Date.now()}-${previous.length}` },
    ]);
  };

  const handleRemove = (id: string) => {
    setAccounts((previous) => previous.filter((account) => account.id !== id));
  };

  return (
    <>
      <WizardStepBar steps={steps} />

      <div className={styles.grid}>
        <StepsAside t={t} steps={steps} verifiedAt={today} supportPhone={SUPPORT_PHONE} />

        <AccountsCard
          t={t}
          language={language}
          accounts={accounts}
          onAdd={handleAdd}
          onRemove={handleRemove}
          onBack={() => onBack?.()}
          onContinue={() => onContinue?.()}
        />

        <SummaryAside
          t={t}
          bankCount={bankCount}
          accountCount={accounts.length}
          requestDate={today}
        />
      </div>
    </>
  );
}
