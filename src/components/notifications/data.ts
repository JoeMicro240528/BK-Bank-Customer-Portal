export type NotificationTone = "info" | "success" | "warning" | "danger";

export type AppNotification = {
  id: string;
  tone: NotificationTone;
  title: { ar: string; en: string };
  body: { ar: string; en: string };
  time: { ar: string; en: string };
  read: boolean;
  /** Request reference this notification relates to, if any. */
  requestId?: string;
};

/** Static notifications. Replace with a backend feed when one exists. */
export const notifications: AppNotification[] = [
  {
    id: "1",
    tone: "danger",
    read: false,
    requestId: "1",
    title: {
      ar: "إجراء مطلوب من بنك أم درمان الوطني",
      en: "Action required by Omdurman National Bank",
    },
    body: {
      ar: "يرجى مراجعة الفرع لاستكمال التحقق من بياناتك لطلب التحديث CU-2026-001245.",
      en: "Please visit the branch to complete verification for request CU-2026-001245.",
    },
    time: { ar: "منذ ساعتين", en: "2 hours ago" },
  },
  {
    id: "2",
    tone: "success",
    read: false,
    requestId: "1",
    title: { ar: "تم اعتماد طلبك من بنك الخرطوم", en: "Bank of Khartoum approved your request" },
    body: {
      ar: "تم تحديث بياناتك بنجاح لدى بنك الخرطوم - فرع الخرطوم الرئيسي.",
      en: "Your data was updated successfully at Bank of Khartoum, main branch.",
    },
    time: { ar: "منذ 5 ساعات", en: "5 hours ago" },
  },
  {
    id: "3",
    tone: "info",
    read: false,
    requestId: "1",
    title: { ar: "تم استلام طلب التحديث", en: "Update request received" },
    body: {
      ar: "تم إرسال طلبك CU-2026-001245 إلى 3 بنوك وهو الآن قيد المراجعة.",
      en: "Request CU-2026-001245 was sent to 3 banks and is now under review.",
    },
    time: { ar: "أمس", en: "Yesterday" },
  },
  {
    id: "4",
    tone: "warning",
    read: true,
    title: { ar: "تذكير: أكمل بيانات طلبك", en: "Reminder: complete your request" },
    body: {
      ar: "لديك طلب لم يكتمل. أكمل إضافة الحسابات لإرساله إلى البنوك.",
      en: "You have an incomplete request. Add your accounts to send it to the banks.",
    },
    time: { ar: "منذ 3 أيام", en: "3 days ago" },
  },
  {
    id: "5",
    tone: "success",
    read: true,
    title: { ar: "تم التحقق من هويتك", en: "Your identity has been verified" },
    body: {
      ar: "تم التحقق من هويتك بنجاح عبر منصة سوداباس.",
      en: "Your identity was verified successfully via SudaPass.",
    },
    time: { ar: "منذ أسبوع", en: "A week ago" },
  },
];
