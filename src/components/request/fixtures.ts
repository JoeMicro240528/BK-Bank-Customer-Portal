import type { RequestDetailsData } from "./types";

/** Fixture request used by the design-preview route. */
export const previewRequest: RequestDetailsData = {
  reference: "CU-2026-001245",
  status: "under_review",
  createdAt: "30 أغسطس 2026 - 10:30 ص",
  externalRef: "auf-preview-001",
  accountCount: 2,
  requestType: "تحديث بيانات شخصية",
  supportPhone: "5656",
  updatedFields: ["الاسم الكامل", "رقم الهاتف", "عنوان السكن", "المهنة", "الدخل الشهري"],
  stepper: [
    { key: "created", label: "تم إنشاء الطلب", date: "30 أغسطس 2026", state: "done" },
    { key: "review", label: "قيد المراجعة لدى البنك", state: "current" },
    { key: "complete", label: "اكتمل التحديث", state: "pending" },
  ],
  banks: [
    {
      id: "omdurman-1",
      bankName: "بنك أمدرمان الوطني",
      bankColor: "#009341",
      branch: "فرع السوق العربي",
      accountNumber: "**** 9012",
      status: "under_review",
      lastUpdate: "30 أغسطس 2026",
      lastUpdateTime: "11:20 ص",
      timeline: [
        { key: "received", label: "تم الاستلام", date: "30 أغسطس - 10:35 ص", state: "done" },
        { key: "review", label: "قيد المراجعة", date: "30 أغسطس - 11:20 ص", state: "current" },
        { key: "approved", label: "تم الاعتماد", state: "pending" },
      ],
    },
    {
      id: "omdurman-2",
      bankName: "بنك أمدرمان الوطني",
      bankColor: "#009341",
      branch: "فرع أمدرمان الرئيسي",
      accountNumber: "**** 3445",
      status: "rejected",
      lastUpdate: "30 أغسطس 2026",
      lastUpdateTime: "09:15 ص",
      timeline: [
        { key: "received", label: "تم الاستلام", date: "30 أغسطس - 09:20 ص", state: "done" },
        { key: "action", label: "يحتاج إجراء من العميل", date: "30 أغسطس - 09:15 ص", state: "blocked" },
        { key: "review", label: "قيد المراجعة", state: "pending" },
      ],
    },
  ],
};
