import type { DashboardCopy, Language } from "./types";

export const dashboardCopy: Record<Language, DashboardCopy> = {
  ar: {
    platformName: "منصة التحقق المركزي",
    platformTagline: "لتحديث بيانات العملاء",
    nav: {
      home: "الرئيسية",
      newRequest: "طلب جديد",
      myRequests: "طلباتي",
      myData: "بياناتي الشخصية",
      notifications: "الإشعارات",
      faq: "الأسئلة الشائعة",
      contact: "تواصل معنا",
    },
    logout: "تسجيل خروج",
    language: "اللغة",
    english: "English",
    arabic: "العربية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    notifications: "الإشعارات",
  },
  en: {
    platformName: "Central Verification Platform",
    platformTagline: "For updating customer data",
    nav: {
      home: "Home",
      newRequest: "New request",
      myRequests: "My requests",
      myData: "My personal data",
      notifications: "Notifications",
      faq: "FAQ",
      contact: "Contact us",
    },
    logout: "Sign out",
    language: "Language",
    english: "English",
    arabic: "Arabic",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    notifications: "Notifications",
  },
};
