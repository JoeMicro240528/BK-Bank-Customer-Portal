"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import DashboardHome from "@/components/home/DashboardHome";
import { previewRequests, previewStats } from "@/components/home/fixtures";

/** Nav targets stay inside /preview so the guarded real routes don't bounce us to login. */
const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/request-details",
};

export default function DashboardPreview() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={[{ label: t.nav.home }]}
      active="home"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <DashboardHome
        language={language}
        stats={previewStats}
        requests={previewRequests}
        onViewRequest={() => router.push("/preview/request-details")}
        onContinueRequest={() => router.push("/preview/form")}
        onViewAll={() => router.push("/preview/request-details")}
      />
    </DashboardLayout>
  );
}
