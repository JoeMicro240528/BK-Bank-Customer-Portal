"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language } from "@/components/dashboard/types";
import RequestDetails from "@/components/request/RequestDetails";
import { previewRequest } from "@/components/request/fixtures";

export default function RequestDetailsPreview() {
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  const crumbs = [
    { label: t.nav.home, href: "#" },
    { label: t.nav.myRequests, href: "#" },
    { label: language === "ar" ? "تفاصيل طلب التحديث" : "Update request details" },
  ];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={crumbs}
      active="myRequests"
      badges={{ notifications: 3 }}
      notificationCount={3}
    >
      <RequestDetails request={previewRequest} language={language} />
    </DashboardLayout>
  );
}
