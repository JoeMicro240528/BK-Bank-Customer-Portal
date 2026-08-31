import type { BankStatus } from "@/components/request/types";

export type Language = "en" | "ar";

export type RequestSummary = {
  id: string;
  reference: string;
  date: string;
  bankCount: number;
  status: BankStatus;
};

export type DashboardStats = {
  total: number;
  underReview: number;
  approved: number;
  actionRequired: number;
};

export type HomeCopy = {
  greeting: string;
  welcomeSubtitle: string;
  newRequest: string;

  statTotal: string;
  statUnderReview: string;
  statApproved: string;
  statActionRequired: string;

  recentTitle: string;
  viewAll: string;
  colReference: string;
  colDate: string;
  colBanks: string;
  colStatus: string;
  colAction: string;
  viewDetails: string;
  banksUnit: string;
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
