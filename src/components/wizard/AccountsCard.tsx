"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  AlertCircle,
  CreditCard,
  IdCard,
  Info,
  Lock,
  ShieldCheck,
  Landmark,
  Plus,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { cleanDigits } from "@/components/form/Fields";
import styles from "./AccountsCard.module.css";
import type { AddedAccount, BankOption, Language, WizardCopy } from "./types";

export default function AccountsCard({
  t,
  language,
  banks,
  nationalId,
  accounts,
  onAdd,
  onRemove,
  onBack,
  onContinue,
}: {
  t: WizardCopy;
  language: Language;
  banks: BankOption[];
  /** From SudaPass; shown locked, never typed by the customer. */
  nationalId?: string;
  accounts: AddedAccount[];
  onAdd: (account: Omit<AddedAccount, "id">) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  // The portal only ever offers one bank (Omdurman National Bank), so there's
  // nothing to pick -- just use whatever master-data returned for it.
  const selectedBank = banks[0];

  const [branchId, setBranchId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const canAdd = Boolean(selectedBank && branchId && accountNumber.trim());

  // The bank's form requires an 11-digit national ID. It comes from SudaPass
  // and can't be edited here, so a malformed one blocks the request rather
  // than being silently sent.
  const nationalIdValid = /^\d{11}$/.test(nationalId ?? "");

  const handleAdd = () => {
    if (!canAdd || !selectedBank) return;

    const branch = selectedBank.branches.find((item) => item.id === branchId);

    onAdd({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      bankColor: selectedBank.color,
      branchId,
      branch: branch?.name ?? "",
      accountNumber: accountNumber.trim(),
    });

    setBranchId("");
    setAccountNumber("");
  };

  const ContinueArrow = language === "ar" ? ArrowLeft : ArrowRight;
  const BackArrow = language === "ar" ? ArrowRight : ArrowLeft;

  return (
    <section className={styles.card}>
      <div className={styles.head}>
        <div>
          <h1>{t.pageTitle}</h1>
          <p>{t.pageSubtitle}</p>
        </div>
        <span className={styles.headIcon}>
          <ClipboardList aria-hidden="true" size={20} />
        </span>
      </div>

      <p className={styles.notice}>
        <Info aria-hidden="true" size={15} />
        {t.singleRequestNotice}
      </p>

      <div className={styles.section}>
        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="nationalId">{t.nationalId}</label>
            <div className={styles.control}>
              <span className={styles.controlIcon}>
                <IdCard aria-hidden="true" size={17} />
              </span>
              <input
                id="nationalId"
                className={styles.lockedInput}
                value={nationalId ?? ""}
                readOnly
                aria-readonly="true"
                dir="ltr"
              />
              <span className={styles.lockIcon}>
                <Lock aria-hidden="true" size={15} />
              </span>
            </div>
            {nationalIdValid ? (
              <span className={styles.sourceNote}>
                <ShieldCheck aria-hidden="true" size={13} />
                {t.fromSudapass}
              </span>
            ) : (
              <span className={styles.fieldError}>
                <AlertCircle aria-hidden="true" size={13} />
                {t.nationalIdInvalid}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>{t.addAccountsTitle}</h2>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="branch">
              {t.selectBranch} <span className={styles.required}>*</span>
            </label>
            <div className={styles.control}>
              <span className={styles.controlIcon}>
                <Landmark aria-hidden="true" size={17} />
              </span>
              <select
                id="branch"
                value={branchId}
                disabled={!selectedBank}
                onChange={(event) => setBranchId(event.target.value)}
              >
                <option value="">{t.selectBranch}</option>
                {selectedBank?.branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
              <span className={styles.caret}>
                <ChevronDown aria-hidden="true" size={16} />
              </span>
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="account">
              {t.accountNumber} <span className={styles.required}>*</span>
            </label>
            <div className={styles.control}>
              <span className={styles.controlIcon}>
                <CreditCard aria-hidden="true" size={17} />
              </span>
              <input
                id="account"
                value={accountNumber}
                inputMode="numeric"
                placeholder={t.accountNumberPlaceholder}
                onChange={(event) => setAccountNumber(cleanDigits(event.target.value, false))}
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          className={styles.addButton}
          disabled={!canAdd}
          onClick={handleAdd}
        >
          <Plus aria-hidden="true" size={17} />
          {t.addAnotherAccount}
        </button>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          {t.addedAccountsTitle} ({accounts.length})
        </h2>

        {accounts.length === 0 ? (
          <p className={styles.empty}>{t.emptyAccounts}</p>
        ) : (
          <div className={`${styles.tableWrap} stack-table-wrap`}>
            <table className={`${styles.table} stack-table`}>
              <thead>
                <tr>
                  <th>{t.colBank}</th>
                  <th>{t.colBranch}</th>
                  <th>{t.colAccount}</th>
                  <th>{t.colStatus}</th>
                  <th>{t.colActions}</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => {
                  // Stored when the account was added; read the current one so
                  // a language switch afterwards renames it too.
                  const bankName =
                    banks.find((bank) => bank.id === account.bankId)?.name ?? account.bankName;

                  return (
                  <tr key={account.id}>
                    <td data-label={t.colBank}>
                      <span className={styles.bankCell}>
                        <span className={styles.logo} style={{ background: account.bankColor }}>
                          {bankName.charAt(0)}
                        </span>
                        {bankName}
                      </span>
                    </td>
                    <td data-label={t.colBranch}>{account.branch}</td>
                    <td data-label={t.colAccount}>
                      <span dir="ltr">{account.accountNumber}</span>
                    </td>
                    <td data-label={t.colStatus}>
                      <span className={styles.addedPill}>{t.statusAdded}</span>
                    </td>
                    <td data-label={t.colActions}>
                      <button
                        type="button"
                        className={styles.removeButton}
                        aria-label={t.removeAccount}
                        onClick={() => onRemove(account.id)}
                      >
                        <Trash2 aria-hidden="true" size={17} />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.backButton} onClick={onBack}>
          <BackArrow aria-hidden="true" size={17} />
          {t.back}
        </button>
        <button
          type="button"
          className={styles.continueButton}
          disabled={accounts.length === 0 || !nationalIdValid}
          onClick={onContinue}
        >
          <ContinueArrow aria-hidden="true" size={17} />
          {t.continue}
        </button>
      </div>
    </section>
  );
}
