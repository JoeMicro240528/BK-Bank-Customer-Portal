"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import NewRequestScreen from "@/components/wizard/NewRequestScreen";
import type { AddedAccount, BankOption } from "@/components/wizard/types";

/** Mirrors what /master-data/banks returns (filtered to ONB), so the preview needs no backend. */
const previewBanks: BankOption[] = [
  { id: "2", name: "بنك أم درمان الوطني", color: "#009341", branches: [{ id: "1", name: "سوق امدرمان" }] },
];

/** Fixture accounts so the added-accounts table is populated in the preview. */
const previewAccounts: AddedAccount[] = [
  {
    id: "1",
    bankId: "2",
    bankName: "بنك أم درمان الوطني",
    bankColor: "#009341",
    branchId: "1",
    branch: "فرع السوق العربي",
    accountNumber: "1234567890123",
  },
  {
    id: "2",
    bankId: "2",
    bankName: "بنك أم درمان الوطني",
    bankColor: "#009341",
    branchId: "1",
    branch: "فرع أم درمان الرئيسي",
    accountNumber: "9876543210987",
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
      active="myRequests"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <NewRequestScreen
        language={language}
        banks={previewBanks}
        nationalId="12345678901"
        initialAccounts={previewAccounts}
        onBack={() => router.push("/preview/profile")}
        onContinue={() => router.push("/preview/requests")}
      />
    </DashboardLayout>
  );
}
