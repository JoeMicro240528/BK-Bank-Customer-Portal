import type { DashboardStats, RequestSummary } from "./types";

export const previewStats: DashboardStats = {
  total: 4,
  drafts: 1,
  underReview: 1,
  approved: 1,
  rejected: 1,
};

export const previewRequests: RequestSummary[] = [
  {
    id: "1",
    reference: "CU-2026-001245",
    date: "30 أغسطس 2026",
    bankCount: 3,
    bankNames: ["بنك الخرطوم", "بنك النيلين", "البنك السوداني الفرنسي"],
    status: "under_review",
  },
  {
    id: "2",
    reference: "CU-2026-001102",
    date: "12 أغسطس 2026",
    bankCount: 2,
    bankNames: ["بنك أم درمان الوطني", "بنك فيصل الإسلامي"],
    status: "rejected",
  },
  {
    id: "3",
    reference: "CU-2026-000871",
    date: "28 يوليو 2026",
    bankCount: 1,
    bankNames: ["بنك الخرطوم"],
    status: "approved",
  },
  {
    id: "4",
    reference: "CU-2026-000804",
    date: "19 يوليو 2026",
    bankCount: 1,
    bankNames: ["بنك النيلين"],
    status: "draft",
  },
];
