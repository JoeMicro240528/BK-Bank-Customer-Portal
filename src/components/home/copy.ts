import type { HomeCopy, Language } from "./types";

export const homeCopy: Record<Language, HomeCopy> = {
  ar: {
    greeting: "مرحباً",
    welcomeSubtitle: "تابع حالة طلباتك أو ابدأ طلب تحديث جديد لبياناتك لدى البنوك",
    newRequest: "طلب تحديث جديد",

    statTotal: "إجمالي الطلبات",
    statDrafts: "مسودات",
    statUnderReview: "قيد المراجعة",
    statApproved: "معتمدة",
    statRejected: "مرفوضة",

    recentTitle: "أحدث الطلبات",
    viewAll: "عرض الكل",
    colReference: "رقم الطلب",
    colDate: "التاريخ",
    colBanks: "البنوك",
    colStatus: "الحالة",
    colAction: "الإجراء",
    viewDetails: "عرض التفاصيل",
    continueRequest: "متابعة استكمال الطلب",
    banksUnit: "بنوك",
    emptyTitle: "لا توجد طلبات بعد",
    emptyBody: "ابدأ بإنشاء طلب تحديث لبياناتك لدى البنوك.",

    quickActionsTitle: "إجراءات سريعة",
    actionUpdateData: "تحديث بياناتي",
    actionTrackRequests: "متابعة الطلبات",
    actionMyData: "بياناتي الشخصية",

    helpTitle: "تحتاج مساعدة؟",
    helpBody: "فريق الدعم متاح لمساعدتك في أي وقت",
    contactSupport: "تواصل مع الدعم",

    status: {
      draft: "مسودة",
      approved: "معتمد",
      under_review: "قيد المراجعة",
      rejected: "مرفوض",
    },
  },

  en: {
    greeting: "Welcome",
    welcomeSubtitle: "Track your requests or start a new data update with your banks",
    newRequest: "New update request",

    statTotal: "Total requests",
    statDrafts: "Drafts",
    statUnderReview: "Under review",
    statApproved: "Approved",
    statRejected: "Rejected",

    recentTitle: "Recent requests",
    viewAll: "View all",
    colReference: "Request no.",
    colDate: "Date",
    colBanks: "Banks",
    colStatus: "Status",
    colAction: "Action",
    viewDetails: "View details",
    continueRequest: "Continue this request",
    banksUnit: "banks",
    emptyTitle: "No requests yet",
    emptyBody: "Start by creating a request to update your data with the banks.",

    quickActionsTitle: "Quick actions",
    actionUpdateData: "Update my data",
    actionTrackRequests: "Track requests",
    actionMyData: "My personal data",

    helpTitle: "Need help?",
    helpBody: "Our support team is available to help you anytime",
    contactSupport: "Contact support",

    status: {
      draft: "Draft",
      approved: "Approved",
      under_review: "Under review",
      rejected: "Rejected",
    },
  },
};
