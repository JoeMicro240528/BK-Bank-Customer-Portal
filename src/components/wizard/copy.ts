import type { Language, WizardCopy } from "./types";

export const wizardCopy: Record<Language, WizardCopy> = {
  ar: {
    platformName: "منصة بنك أم درمان الوطني",
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
      details: "أضف حساباتك وفروعك",
      review: "مراجعة بياناتك قبل الإرسال",
      submit: "سيتم مراجعته من البنوك",
    },

    verifiedTitle: "تم التحقق بنجاح",
    verifiedVia: "عبر تطبيق سوداباس",
    updateStepsTitle: "خطوات التحديث",

    helpTitle: "تحتاج مساعدة؟",
    helpBody: "للمساعدة يمكنك التواصل مع مركز الدعم",

    pageTitle: "بيانات الطلب",
    pageSubtitle: "أضف حساباتك في الفروع المطلوب تحديث بياناتك لديها",
    singleRequestNotice: "سيتم إنشاء طلب تحديث واحد شامل لجميع حساباتك المضافة.",

    addAccountsTitle: "إضافة الحسابات",
    selectBranch: "اختر الفرع",
    accountNumber: "رقم الحساب",
    accountNumberPlaceholder: "أدخل رقم الحساب",
    addAnotherAccount: "إضافة حسابٌ آخر",
    addedAccountsTitle: "الحسابات المضافة",

    colBank: "البنك",
    colBranch: "الفرع",
    colAccount: "رقم الحساب",
    colKind: "نوع الحساب",
    accountKind: "نوع الحساب",
    accountKindPersonal: "شخصي",
    accountKindCommercial: "تجاري",
    accountKindHint: "الحساب التجاري يتطلب إرفاق شهادة دخل لاحقاً في الاستمارة.",
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
    bankCountLabel: "عدد الفروع",
    accountCountLabel: "عدد الحسابات",
    requestDateLabel: "تاريخ الطلب",
    banksUnit: "فروع",
    accountsUnit: "حسابات",

    notesTitle: "ملاحظات هامة",
    notes: [
      "تأكد من صحة البيانات قبل إرسال الطلب.",
      "قد يستغرق اعتماد الطلب من البنوك من 1 إلى 5 أيام عمل.",
      "سيتم إشعارك برسائل نصية بحالة الطلب.",
    ],

    secureTitle: "بياناتك آمنة ومحمية",
    secureBody: "جميع بياناتك مشفرة وآمنة وفق أعلى معايير الحماية.",

    footerRights: "جميع الحقوق محفوظة © 2026 منصة بنك أم درمان الوطني لتحديث بيانات العملاء",
    footerTerms: "الشروط والأحكام",
    footerPrivacy: "سياسة الخصوصية",
    footerFaq: "الأسئلة الشائعة",
  },

  en: {
    platformName: "Omdurman National Bank Platform",
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
      details: "Add your accounts and branches",
      review: "Review your data before sending",
      submit: "Will be reviewed by the banks",
    },

    verifiedTitle: "Verified successfully",
    verifiedVia: "via the SudaPass app",
    updateStepsTitle: "Update steps",

    helpTitle: "Need help?",
    helpBody: "Contact our support centre for assistance",

    pageTitle: "Request details",
    pageSubtitle: "Add your accounts at the branches where your data should be updated",
    singleRequestNotice: "A single update request will be created covering all added accounts.",

    addAccountsTitle: "Add accounts",
    selectBranch: "Select branch",
    accountNumber: "Account number",
    accountNumberPlaceholder: "Enter the account number",
    addAnotherAccount: "Add another account",
    addedAccountsTitle: "Added accounts",

    colBank: "Bank",
    colBranch: "Branch",
    colAccount: "Account no.",
    colKind: "Account type",
    accountKind: "Account type",
    accountKindPersonal: "Personal",
    accountKindCommercial: "Commercial",
    accountKindHint: "A commercial account requires an income certificate later in the form.",
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
    bankCountLabel: "Branches",
    accountCountLabel: "Accounts",
    requestDateLabel: "Request date",
    banksUnit: "branches",
    accountsUnit: "accounts",

    notesTitle: "Important notes",
    notes: [
      "Make sure your data is correct before submitting.",
      "Bank approval may take between 1 and 5 working days.",
      "You will be notified of the request status by SMS.",
    ],

    secureTitle: "Your data is safe and protected",
    secureBody: "All your data is encrypted and secured to the highest protection standards.",

    footerRights: "© 2026 Omdurman National Bank Platform for updating customer data. All rights reserved.",
    footerTerms: "Terms & Conditions",
    footerPrivacy: "Privacy Policy",
    footerFaq: "FAQ",
  },
};
