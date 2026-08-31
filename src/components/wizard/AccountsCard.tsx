"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  CreditCard,
  Info,
  Landmark,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { bankOptions } from "./banks";
import styles from "./AccountsCard.module.css";
import type { AddedAccount, Language, WizardCopy } from "./types";

export default function AccountsCard({
  t,
  language,
  accounts,
  onAdd,
  onRemove,
  onBack,
  onContinue,
}: {
  t: WizardCopy;
  language: Language;
  accounts: AddedAccount[];
  onAdd: (account: Omit<AddedAccount, "id">) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [bankId, setBankId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const selectedBank = useMemo(
    () => bankOptions.find((bank) => bank.id === bankId),
    [bankId],
  );

  const canAdd = Boolean(bankId && branchId && accountNumber.trim());

  const handleAdd = () => {
    if (!canAdd || !selectedBank) return;

    const branch = selectedBank.branches.find((item) => item.id === branchId);

    onAdd({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      bankColor: selectedBank.color,
      branch: branch?.name ?? "",
      accountNumber: accountNumber.trim(),
    });

    setBankId("");
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
        <h2 className={styles.sectionTitle}>{t.addAccountsTitle}</h2>

        <div className={styles.fieldGrid}>
          <div className={styles.field}>
            <label htmlFor="bank">
              {t.selectBank} <span className={styles.required}>*</span>
            </label>
            <div className={styles.control}>
              <span className={styles.controlIcon}>
                {selectedBank ? (
                  <span className={styles.bankChip} style={{ background: selectedBank.color }}>
                    {selectedBank.name.charAt(0)}
                  </span>
                ) : (
                  <Landmark aria-hidden="true" size={17} />
                )}
              </span>
              <select
                id="bank"
                value={bankId}
                onChange={(event) => {
                  setBankId(event.target.value);
                  setBranchId("");
                }}
              >
                <option value="">{t.selectBank}</option>
                {bankOptions.map((bank) => (
                  <option key={bank.id} value={bank.id}>
                    {bank.name}
                  </option>
                ))}
              </select>
              <span className={styles.caret}>
                <ChevronDown aria-hidden="true" size={16} />
              </span>
            </div>
          </div>

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
                onChange={(event) => setAccountNumber(event.target.value)}
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
          <div className={styles.tableWrap}>
            <table className={styles.table}>
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
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <span className={styles.bankCell}>
                        <span className={styles.logo} style={{ background: account.bankColor }}>
                          {account.bankName.charAt(0)}
                        </span>
                        {account.bankName}
                      </span>
                    </td>
                    <td>{account.branch}</td>
                    <td dir="ltr">{account.accountNumber}</td>
                    <td>
                      <span className={styles.addedPill}>{t.statusAdded}</span>
                    </td>
                    <td>
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
                ))}
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
          disabled={accounts.length === 0}
          onClick={onContinue}
        >
          <ContinueArrow aria-hidden="true" size={17} />
          {t.continue}
        </button>
      </div>
    </section>
  );
}
