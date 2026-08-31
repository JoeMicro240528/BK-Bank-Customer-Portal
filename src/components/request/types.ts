export type Language = "en" | "ar";

/** Status of a single bank's review of the update request. */
export type BankStatus = "approved" | "under_review" | "action_required";

/** State of one node in a progress timeline. */
export type StepState = "done" | "current" | "pending" | "blocked";

export type TimelineStep = {
  key: string;
  label: string;
  date?: string;
  state: StepState;
};

export type BankReview = {
  id: string;
  bankName: string;
  bankNote?: string;
  /** Hex colour used for the placeholder logo chip. */
  bankColor: string;
  branch: string;
  accountNumber: string;
  status: BankStatus;
  lastUpdate: string;
  lastUpdateTime: string;
  timeline: TimelineStep[];
};

export type RequestDetailsData = {
  reference: string;
  status: BankStatus;
  createdAt: string;
  bankCount: number;
  accountCount: number;
  requestType: string;
  updatedFields: string[];
  stepper: TimelineStep[];
  banks: BankReview[];
  supportPhone: string;
};

export type RequestCopy = {
  pageTitle: string;
  pageSubtitle: string;
  downloadPdf: string;
  print: string;
  referenceLabel: string;
  createdLabel: string;
  copyReference: string;
  submittedNotice: string;
  bankReviewTitle: string;
  colBank: string;
  colBranch: string;
  colAccount: string;
  colStatus: string;
  colLastUpdate: string;
  colAction: string;
  viewDetails: string;
  actionNotice: string;
  summaryTitle: string;
  bankCountLabel: string;
  accountCountLabel: string;
  requestTypeLabel: string;
  overallStatusLabel: string;
  banksUnit: string;
  accountsUnit: string;
  updatedFieldsTitle: string;
  helpTitle: string;
  helpBody: string;
  liveChat: string;
  status: Record<BankStatus, string>;
};
