/**
 * Branch options per bank.
 *
 * The banks themselves come from the backend (`/master-data/banks`), but that
 * API has no concept of branches -- `BankAccountSelection` is only bank_id +
 * account_number. So branches are held here, keyed by the bank's BIC, until the
 * backend gains a branch field. Selected branches are collected in the wizard
 * but not yet sent.
 */
const branchesByBic: Record<string, string[]> = {
  // بنك الخرطوم
  BOK: ["فرع الخرطوم الرئيسي", "فرع الرياض", "فرع بحري", "فرع أم درمان"],
  // بنك امدرمان الوطني
  ONB: ["فرع السوق العربي", "فرع أم درمان الرئيسي", "فرع الخرطوم 2"],
  // بنك فيصل الاسلامي
  FBK: ["فرع المقرن", "فرع السوق المحلي", "فرع الخرطوم الرئيسي"],
};

const defaultBranches = ["الفرع الرئيسي"];

export function branchesForBank(bic: string | null | undefined) {
  const names = (bic && branchesByBic[bic.toUpperCase()]) || defaultBranches;

  return names.map((name) => ({ id: name, name }));
}
