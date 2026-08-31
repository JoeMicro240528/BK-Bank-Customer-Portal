import type { RequestDetailsData } from "./types";

/** Fixture request used by the design-preview route. */
export const previewRequest: RequestDetailsData = {
  reference: "CU-2026-001245",
  status: "under_review",
  createdAt: "30 أغسطس 2026 - 10:30 ص",
  bankCount: 3,
  accountCount: 2,
  requestType: "تحديث بيانات شخصية",
  supportPhone: "+249 123 456 789",
  updatedFields: ["الاسم الكامل", "رقم الهاتف", "عنوان السكن", "المهنة", "الدخل الشهري"],
  stepper: [
    { key: "created", label: "تم إنشاء الطلب", date: "30 أغسطس 2026", state: "done" },
    { key: "review", label: "قيد المراجعة لدى البنوك", state: "current" },
    { key: "partial", label: "بعض البنوك معتمد", state: "pending" },
    { key: "complete", label: "اكتمل التحديث", state: "pending" },
  ],
  banks: [
    {
      id: "khartoum",
      bankName: "بنك الخرطوم",
      bankNote: "أنت أولاً",
      bankColor: "#f59e0b",
      branch: "فرع الخرطوم الرئيسي",
      accountNumber: "**** 9012",
      status: "approved",
      lastUpdate: "30 أغسطس 2026",
      lastUpdateTime: "02:45 م",
      timeline: [
        { key: "received", label: "تم الاستلام", date: "30 أغسطس - 10:35 ص", state: "done" },
        { key: "review", label: "قيد المراجعة", date: "30 أغسطس - 11:20 ص", state: "done" },
        { key: "approved", label: "تم الاعتماد", date: "30 أغسطس - 02:45 م", state: "done" },
      ],
    },
    {
      id: "faisal",
      bankName: "بنك فيصل الإسلامي",
      bankNote: "الراعي الرسمي",
      bankColor: "#15803d",
      branch: "فرع المقرن",
      accountNumber: "**** 1098",
      status: "under_review",
      lastUpdate: "30 أغسطس 2026",
      lastUpdateTime: "11:20 ص",
      timeline: [
        { key: "received", label: "تم الاستلام", date: "30 أغسطس - 10:40 ص", state: "done" },
        { key: "review", label: "قيد المراجعة", date: "30 أغسطس - 11:20 ص", state: "current" },
        { key: "approved", label: "تم الاعتماد", state: "pending" },
      ],
    },
    {
      id: "omdurman",
      bankName: "بنك أم درمان الوطني",
      bankNote: "خيارك الأمثل",
      bankColor: "#1d4ed8",
      branch: "فرع السوق العربي",
      accountNumber: "**** 3445",
      status: "action_required",
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
