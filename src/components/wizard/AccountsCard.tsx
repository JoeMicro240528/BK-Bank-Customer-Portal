"use client";

import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ClipboardList,
  AlertCircle,
  Check,
  CreditCard,
  IdCard,
  Info,
  Loader2,
  Lock,
  ShieldCheck,
  Landmark,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cleanDigits } from "@/components/form/Fields";
import styles from "./AccountsCard.module.css";
import type { AddedAccount, BankOption, Language, WizardCopy } from "./types";

export default function AccountsCard({
  t,
  language,
  banks,
  nationalId,
  accounts,
  isEdit = false,
  initialBranchId = "",
  initialBranchName = "",
  initialAccountNumber = "",
  onAdd,
  onUpdateAccount,
  onRemove,
  onSave,
  saving = false,
  onBack,
  onContinue,
}: {
  t: WizardCopy;
  language: Language;
  banks: BankOption[];
  /** From SudaPass; shown locked, never typed by the customer. */
  nationalId?: string;
  accounts: AddedAccount[];
  isEdit?: boolean;
  initialBranchId?: string;
  initialBranchName?: string;
  initialAccountNumber?: string;
  onAdd: (account: Omit<AddedAccount, "id">) => void;
  onUpdateAccount?: (index: number, account: AddedAccount) => void;
  onRemove: (id: string) => void;
  onSave?: (data: { branchId: string; accountNumber: string; accounts: AddedAccount[] }) => Promise<void>;
  saving?: boolean;
  onBack: () => void;
  onContinue: (effectiveAccounts: AddedAccount[]) => void;
}) {
  // The portal only ever offers one bank (Omdurman National Bank), so there's
  // nothing to pick -- just use whatever master-data returned for it.
  const selectedBank = banks[0];

  const [branchId, setBranchId] = useState(
    initialBranchId || accounts[0]?.branchId || ""
  );
  const [accountNumber, setAccountNumber] = useState(
    initialAccountNumber || accounts[0]?.accountNumber || ""
  );

  // Sync with initial values when they load from API
  useEffect(() => {
    if (initialBranchId) {
      setBranchId((cur) => cur || initialBranchId);
    }
  }, [initialBranchId]);

  useEffect(() => {
    if (initialAccountNumber) {
      setAccountNumber((cur) => cur || initialAccountNumber);
    }
  }, [initialAccountNumber]);

  const canAdd = Boolean(selectedBank && branchId && accountNumber.trim());

  // The bank's form requires an 11-digit national ID. It comes from SudaPass
  // and can't be edited here, so a malformed one blocks the request rather
  // than being silently sent.
  const nationalIdValid = /^\d{11}$/.test(nationalId ?? "");

  const handleBranchSelect = (newBranchId: string) => {
    setBranchId(newBranchId);
    if (accounts.length > 0 && onUpdateAccount) {
      const branchObj = selectedBank?.branches.find(
        (item) => String(item.id) === String(newBranchId)
      );
      onUpdateAccount(0, {
        ...accounts[0],
        branchId: newBranchId,
        branch: branchObj?.name || initialBranchName || "",
      });
    }
  };

  const handleAccountChange = (val: string) => {
    const clean = cleanDigits(val, false);
    setAccountNumber(clean);
    if (accounts.length > 0 && onUpdateAccount) {
      onUpdateAccount(0, {
        ...accounts[0],
        accountNumber: clean,
      });
    }
  };

  const handleAdd = () => {
    if (!canAdd || !selectedBank) return;

    const branch = selectedBank.branches.find((item) => String(item.id) === String(branchId));

    onAdd({
      bankId: selectedBank.id,
      bankName: selectedBank.name,
      bankColor: selectedBank.color,
      branchId,
      branch: branch?.name || initialBranchName || "",
      accountNumber: accountNumber.trim(),
    });

    if (!isEdit) {
      setBranchId("");
      setAccountNumber("");
    }
  };

  const getEffectiveAccounts = (): AddedAccount[] => {
    const branchObj = selectedBank?.branches.find(
      (item) => String(item.id) === String(branchId)
    );
    const branchName = branchObj?.name || initialBranchName || "";

    if (accounts.length === 0) {
      if (branchId && accountNumber.trim()) {
        return [
          {
            id: "account-0",
            bankId: selectedBank?.id || "1",
            bankName: selectedBank?.name || "بنك أمدرمان الوطني",
            bankColor: selectedBank?.color || "#283f76",
            branchId,
            branch: branchName,
            accountNumber: accountNumber.trim(),
          },
        ];
      }
      return [];
    }

    const next = [...accounts];
    if (branchId || accountNumber.trim()) {
      next[0] = {
        ...next[0],
        branchId: branchId || next[0].branchId,
        branch: branchName || next[0].branch,
        accountNumber: accountNumber.trim() || next[0].accountNumber,
      };
    }
    return next;
  };

  const handleContinueClick = () => {
    const effective = getEffectiveAccounts();
    onContinue(effective);
  };

  const handleSaveClick = async () => {
    if (!branchId || !accountNumber.trim()) return;
    const effective = getEffectiveAccounts();
    if (onSave) {
      await onSave({
        branchId,
        accountNumber: accountNumber.trim(),
        accounts: effective,
      });
    }
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
                disabled={!selectedBank && !branchId}
                onChange={(event) => handleBranchSelect(event.target.value)}
              >
                <option value="">{t.selectBranch}</option>
                {branchId &&
                  !selectedBank?.branches.some(
                    (branch) => String(branch.id) === String(branchId)
                  ) && (
                    <option value={branchId}>
                      {initialBranchName || branchId}
                    </option>
                  )}
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
                onChange={(event) => handleAccountChange(event.target.value)}
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

        {isEdit && onSave && (
          <button
            type="button"
            className={styles.saveButton}
            disabled={saving || !branchId || !accountNumber.trim()}
            onClick={handleSaveClick}
          >
            {saving ? (
              <Loader2 className="spinner" size={17} aria-hidden="true" />
            ) : (
              <Check aria-hidden="true" size={17} />
            )}
            {t.saveChanges}
          </button>
        )}

        <button
          type="button"
          className={styles.continueButton}
          disabled={
            (accounts.length === 0 && (!branchId || !accountNumber.trim())) ||
            !nationalIdValid
          }
          onClick={handleContinueClick}
        >
          <ContinueArrow aria-hidden="true" size={17} />
          {isEdit ? t.continueRequest : t.continue}
        </button>
      </div>
    </section>
  );
}
