"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import AufForm from "@/components/form/AufForm";
import { initialForm } from "@/lib/auf/form";

const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/requests",
  myData: "/preview/profile",
  notifications: "/preview/notifications",
  faq: "/preview/faq",
  contact: "/preview/contact",
};

/** Stand-in for what SudaPass returns, so the locked fields render populated. */
const lockedIdentity = {
  name: "محمد عثمان أحمد",
  nationalId: "12026993674",
  birthDate: "1997-11-15",
  gender: "male",
  nationality: "SDN",
  email: "mohammed@example.com",
  phone: "+249912345678",
};

export default function FormPreview() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  const seeded = {
    ...initialForm(),
    name_arabic: lockedIdentity.name,
    name_english: "Mohammed Osman Ahmed",
    email: lockedIdentity.email,
    gender: lockedIdentity.gender,
    date_of_birth: lockedIdentity.birthDate,
    mobile_personal: lockedIdentity.phone,
    selected_accounts: [
      { bank_id: 3, account_number: "1234567890123" },
      { bank_id: 4, account_number: "9876543210987" },
    ],
    identity_lines: [
      {
        id_type: "national_id",
        id_number: lockedIdentity.nationalId,
        id_type_other: "",
        issuance_date: "",
        expiry_date: "",
        nationality_id: "",
        is_primary: true,
      },
    ],
  };

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
      {/* No ownerId, so saving is not attempted -- this is for reviewing layout only. */}
      <AufForm
        language={language}
        ownerId=""
        initialState={seeded}
        locked={lockedIdentity}
        bankNames={{ "3": "بنك الخرطوم", "4": "بنك فيصل الاسلامي" }}
      />
    </DashboardLayout>
  );
}
