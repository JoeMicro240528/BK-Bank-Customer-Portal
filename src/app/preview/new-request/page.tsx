"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import NewRequestScreen from "@/components/wizard/NewRequestScreen";
import type { AddedAccount } from "@/components/wizard/types";

/** Fixture accounts so the added-accounts table is populated in the preview. */
const previewAccounts: AddedAccount[] = [
  {
    id: "1",
    bankId: "khartoum",
    bankName: "بنك الخرطوم",
    bankColor: "#f59e0b",
    branch: "فرع الخرطوم الرئيسي",
    accountNumber: "1234567890123",
  },
  {
    id: "2",
    bankId: "faisal",
    bankName: "بنك فيصل الإسلامي",
    bankColor: "#15803d",
    branch: "فرع المقرن",
    accountNumber: "9876543210987",
  },
  {
    id: "3",
    bankId: "omdurman",
    bankName: "بنك أم درمان الوطني",
    bankColor: "#1d4ed8",
    branch: "فرع السوق العربي",
    accountNumber: "1112223334445",
  },
];

const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/requests",
  myData: "/preview/profile",
};

export default function NewRequestPreview() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={[{ label: t.nav.home }, { label: t.nav.newRequest }]}
      active="newRequest"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <NewRequestScreen
        language={language}
        initialAccounts={previewAccounts}
        onBack={() => router.push("/preview/profile")}
        onContinue={() => router.push("/preview/requests")}
      />
    </DashboardLayout>
  );
}
