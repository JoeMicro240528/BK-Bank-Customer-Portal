"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import { previewRequests } from "@/components/home/fixtures";
import RequestsList from "@/components/requests/RequestsList";

const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/requests",
  myData: "/preview/profile",
};

export default function RequestsPreview() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={[{ label: t.nav.home }, { label: t.nav.myRequests }]}
      active="myRequests"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <RequestsList
        language={language}
        requests={previewRequests}
        onNewRequest={() => router.push("/preview/new-request")}
        onViewRequest={() => router.push("/preview/request-details")}
      />
    </DashboardLayout>
  );
}
