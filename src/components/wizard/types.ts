export type Language = "en" | "ar";

export type WizardStepState = "done" | "current" | "pending";

export type WizardStep = {
  key: string;
  label: string;
  hint: string;
  state: WizardStepState;
};

export type BankOption = {
  id: string;
  name: string;
  color: string;
  branches: { id: string; name: string }[];
};

export type AccountKind = "personal" | "commercial";

export type AddedAccount = {
  id: string;
  bankId: string;
  bankName: string;
  bankColor: string;
  branch: string;
  accountNumber: string;
  /**
   * Self-declared. The API's CustomerBankAccount carries no account type, so
   * the customer tells us -- a commercial account requires an income
   * certificate later in the form.
   */
  kind: AccountKind;
};

export type WizardCopy = {
  platformName: string;
  platformTagline: string;
  logout: string;
  language: string;
  arabic: string;
  english: string;
  notifications: string;

  steps: { identity: string; details: string; review: string; submit: string };
  stepHints: { identity: string; details: string; review: string; submit: string };

  verifiedTitle: string;
  verifiedVia: string;
  updateStepsTitle: string;

  helpTitle: string;
  helpBody: string;

  pageTitle: string;
  pageSubtitle: string;
  singleRequestNotice: string;

  addAccountsTitle: string;
  selectBank: string;
  selectBranch: string;
  accountNumber: string;
  accountNumberPlaceholder: string;
  addAnotherAccount: string;
  addedAccountsTitle: string;

  colBank: string;
  colBranch: string;
  colAccount: string;
  colKind: string;
  accountKind: string;
  accountKindPersonal: string;
  accountKindCommercial: string;
  accountKindHint: string;
  colStatus: string;
  colActions: string;
  statusAdded: string;
  removeAccount: string;
  emptyAccounts: string;

  back: string;
  continue: string;

  summaryTitle: string;
  requestTypeLabel: string;
  requestTypeValue: string;
  bankCountLabel: string;
  accountCountLabel: string;
  requestDateLabel: string;
  banksUnit: string;
  accountsUnit: string;

  notesTitle: string;
  notes: string[];

  secureTitle: string;
  secureBody: string;

  footerRights: string;
  footerTerms: string;
  footerPrivacy: string;
  footerFaq: string;
};
