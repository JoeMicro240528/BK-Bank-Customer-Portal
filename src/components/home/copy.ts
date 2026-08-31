import type { HomeCopy, Language } from "./types";

export const homeCopy: Record<Language, HomeCopy> = {
  ar: {
    greeting: "مرحباً",
    welcomeSubtitle: "تابع حالة طلباتك أو ابدأ طلب تحديث جديد لبياناتك لدى البنوك",
    newRequest: "طلب تحديث جديد",

    statTotal: "إجمالي الطلبات",
    statUnderReview: "قيد المراجعة",
    statApproved: "معتمدة",
    statActionRequired: "تحتاج إجراء",

    recentTitle: "أحدث الطلبات",
    viewAll: "عرض الكل",
    colReference: "رقم الطلب",
    colDate: "التاريخ",
    colBanks: "البنوك",
    colStatus: "الحالة",
    colAction: "الإجراء",
    viewDetails: "عرض التفاصيل",
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
      approved: "معتمد",
      under_review: "قيد المراجعة",
      action_required: "يحتاج إجراء",
    },
  },

  en: {
    greeting: "Welcome",
    welcomeSubtitle: "Track your requests or start a new data update with your banks",
    newRequest: "New update request",

    statTotal: "Total requests",
    statUnderReview: "Under review",
    statApproved: "Approved",
    statActionRequired: "Action required",

    recentTitle: "Recent requests",
    viewAll: "View all",
    colReference: "Request no.",
    colDate: "Date",
    colBanks: "Banks",
    colStatus: "Status",
    colAction: "Action",
    viewDetails: "View details",
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
      approved: "Approved",
      under_review: "Under review",
      action_required: "Action required",
    },
  },
};
