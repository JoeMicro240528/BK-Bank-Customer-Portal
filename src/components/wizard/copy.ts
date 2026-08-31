import type { Language, WizardCopy } from "./types";

export const wizardCopy: Record<Language, WizardCopy> = {
  ar: {
    platformName: "منصة التحقق المركزي",
    platformTagline: "لتحديث بيانات العملاء",
    logout: "تسجيل خروج",
    language: "اللغة",
    arabic: "العربية",
    english: "English",
    notifications: "الإشعارات",

    steps: {
      identity: "التحقق من الهوية",
      details: "بيانات الطلب",
      review: "مراجعة وتأكيد",
      submit: "إرسال الطلب",
    },
    stepHints: {
      identity: "تم بنجاح",
      details: "اختر البنوك وأضف الحسابات",
      review: "مراجعة بياناتك قبل الإرسال",
      submit: "سيتم مراجعته من البنوك",
    },

    verifiedTitle: "تم التحقق بنجاح",
    verifiedVia: "عبر تطبيق سوداباس",
    updateStepsTitle: "خطوات التحديث",

    helpTitle: "تحتاج مساعدة؟",
    helpBody: "للمساعدة يمكنك التواصل مع مركز الدعم",

    pageTitle: "بيانات الطلب",
    pageSubtitle: "أضف حساباتك في البنوك والفروع المطلوب تحديث بياناتك لديها",
    singleRequestNotice: "سيتم إنشاء طلب تحديث واحد شامل لجميع البنوك المحددة.",

    addAccountsTitle: "إضافة الحسابات",
    selectBank: "اختر البنك",
    selectBranch: "اختر الفرع",
    accountNumber: "رقم الحساب",
    accountNumberPlaceholder: "أدخل رقم الحساب",
    addAnotherAccount: "إضافة حسابٌ آخر",
    addedAccountsTitle: "الحسابات المضافة",

    colBank: "البنك",
    colBranch: "الفرع",
    colAccount: "رقم الحساب",
    colStatus: "الحالة",
    colActions: "الإجراءات",
    statusAdded: "تمت الإضافة",
    removeAccount: "حذف الحساب",
    emptyAccounts: "لم تتم إضافة أي حساب بعد.",

    back: "الرجوع",
    continue: "متابعة",

    summaryTitle: "ملخص طلب التحديث",
    requestTypeLabel: "نوع الطلب",
    requestTypeValue: "تحديث بيانات شخصية ومالية",
    bankCountLabel: "عدد البنوك",
    accountCountLabel: "عدد الحسابات",
    requestDateLabel: "تاريخ الطلب",
    banksUnit: "بنوك",
    accountsUnit: "حسابات",

    notesTitle: "ملاحظات هامة",
    notes: [
      "تأكد من صحة البيانات قبل إرسال الطلب.",
      "قد يستغرق اعتماد الطلب من البنوك من 1 إلى 5 أيام عمل.",
      "سيتم إشعارك برسائل نصية بحالة الطلب.",
    ],

    secureTitle: "بياناتك آمنة ومحمية",
    secureBody: "جميع بياناتك مشفرة وآمنة وفق أعلى معايير الحماية.",

    footerRights: "جميع الحقوق محفوظة © 2026 منصة التحقق المركزي لتحديث بيانات العملاء",
    footerTerms: "الشروط والأحكام",
    footerPrivacy: "سياسة الخصوصية",
    footerFaq: "الأسئلة الشائعة",
  },

  en: {
    platformName: "Central Verification Platform",
    platformTagline: "For updating customer data",
    logout: "Sign out",
    language: "Language",
    arabic: "Arabic",
    english: "English",
    notifications: "Notifications",

    steps: {
      identity: "Identity verification",
      details: "Request details",
      review: "Review & confirm",
      submit: "Submit request",
    },
    stepHints: {
      identity: "Completed",
      details: "Choose banks and add accounts",
      review: "Review your data before sending",
      submit: "Will be reviewed by the banks",
    },

    verifiedTitle: "Verified successfully",
    verifiedVia: "via the SudaPass app",
    updateStepsTitle: "Update steps",

    helpTitle: "Need help?",
    helpBody: "Contact our support centre for assistance",

    pageTitle: "Request details",
    pageSubtitle: "Add your accounts at the banks and branches where your data should be updated",
    singleRequestNotice: "A single update request will be created covering all selected banks.",

    addAccountsTitle: "Add accounts",
    selectBank: "Select bank",
    selectBranch: "Select branch",
    accountNumber: "Account number",
    accountNumberPlaceholder: "Enter the account number",
    addAnotherAccount: "Add another account",
    addedAccountsTitle: "Added accounts",

    colBank: "Bank",
    colBranch: "Branch",
    colAccount: "Account no.",
    colStatus: "Status",
    colActions: "Actions",
    statusAdded: "Added",
    removeAccount: "Remove account",
    emptyAccounts: "No accounts added yet.",

    back: "Back",
    continue: "Continue",

    summaryTitle: "Update request summary",
    requestTypeLabel: "Request type",
    requestTypeValue: "Personal and financial data update",
    bankCountLabel: "Banks",
    accountCountLabel: "Accounts",
    requestDateLabel: "Request date",
    banksUnit: "banks",
    accountsUnit: "accounts",

    notesTitle: "Important notes",
    notes: [
      "Make sure your data is correct before submitting.",
      "Bank approval may take between 1 and 5 working days.",
      "You will be notified of the request status by SMS.",
    ],

    secureTitle: "Your data is safe and protected",
    secureBody: "All your data is encrypted and secured to the highest protection standards.",

    footerRights: "© 2026 Central Verification Platform for updating customer data. All rights reserved.",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerFaq: "FAQ",
  },
};
