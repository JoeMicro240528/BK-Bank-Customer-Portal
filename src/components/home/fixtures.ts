import type { DashboardStats, RequestSummary } from "./types";

export const previewStats: DashboardStats = {
  total: 3,
  underReview: 1,
  approved: 1,
  actionRequired: 1,
};

export const previewRequests: RequestSummary[] = [
  {
    id: "1",
    reference: "CU-2026-001245",
    date: "30 أغسطس 2026",
    bankCount: 3,
    status: "under_review",
  },
  {
    id: "2",
    reference: "CU-2026-001102",
    date: "12 أغسطس 2026",
    bankCount: 2,
    status: "action_required",
  },
  {
    id: "3",
    reference: "CU-2026-000871",
    date: "28 يوليو 2026",
    bankCount: 1,
    status: "approved",
  },
];
