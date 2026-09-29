import type { BankStatus } from "@/components/request/types";

export type Language = "en" | "ar";

export type RequestSummary = {
  id: string;
  reference: string;
  date: string;
  branchName: string | null;
  status: BankStatus;
};

export type DashboardStats = {
  total: number;
  drafts: number;
  underReview: number;
  approved: number;
  rejected: number;
};

export type HomeCopy = {
  greeting: string;
  welcomeSubtitle: string;
  newRequest: string;

  statTotal: string;
  statDrafts: string;
  statUnderReview: string;
  statApproved: string;
  statRejected: string;

  recentTitle: string;
  viewAll: string;
  colReference: string;
  colDate: string;
  colBranch: string;
  colStatus: string;
  colAction: string;
  viewDetails: string;
  continueRequest: string;
  branchUndefined: string;
  emptyTitle: string;
  emptyBody: string;

  quickActionsTitle: string;
  actionUpdateData: string;
  actionTrackRequests: string;
  actionMyData: string;

  helpTitle: string;
  helpBody: string;
  contactSupport: string;

  status: Record<BankStatus, string>;
};
