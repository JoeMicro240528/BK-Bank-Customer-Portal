/**
 * Branch options per bank. The portal is scoped to Omdurman National Bank
 * only, so this only ever needs the ONB entry.
 *
 * The bank itself comes from the backend (`/master-data/banks`), but that
 * API has no concept of branches -- `BankAccountSelection` is only bank_id +
 * account_number. So branches are held here, keyed by the bank's BIC, until the
 * backend gains a branch field. Selected branches are collected in the wizard
 * but not yet sent.
 */
const branchesByBic: Record<string, string[]> = {
  // بنك امدرمان الوطني
  ONB: ["فرع السوق العربي", "فرع أم درمان الرئيسي", "فرع الخرطوم 2"],
};

const defaultBranches = ["الفرع الرئيسي"];

export function branchesForBank(bic: string | null | undefined) {
  const names = (bic && branchesByBic[bic.toUpperCase()]) || defaultBranches;

  return names.map((name) => ({ id: name, name }));
}
