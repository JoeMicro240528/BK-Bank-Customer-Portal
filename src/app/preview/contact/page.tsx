"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import ContactPanel from "@/components/contact/ContactPanel";

const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/requests",
  myData: "/preview/profile",
  notifications: "/preview/notifications",
  faq: "/preview/faq",
  contact: "/preview/contact",
};

export default function Page() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={[{ label: t.nav.home }, { label: t.nav.contact }]}
      active="contact"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <ContactPanel language={language} />
    </DashboardLayout>
  );
}
