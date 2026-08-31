"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import { previewUser } from "@/components/dashboard/fixtures";
import type { Language, NavKey } from "@/components/dashboard/types";
import ProfileCard from "@/components/profile/ProfileCard";

const previewRoutes: Partial<Record<NavKey, string>> = {
  home: "/preview/dashboard",
  newRequest: "/preview/new-request",
  myRequests: "/preview/request-details",
  myData: "/preview/profile",
};

export default function ProfilePreview() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("ar");
  const t = dashboardCopy[language];

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={previewUser}
      crumbs={[{ label: t.nav.home }, { label: t.nav.myData }]}
      active="myData"
      badges={{ notifications: 3 }}
      notificationCount={3}
      onNavigate={(key) => {
        const target = previewRoutes[key];
        if (target) router.push(target);
      }}
    >
      <ProfileCard
        language={language}
        user={{
          name: "محمد عثمان أحمد",
          national_id: "12026993674",
          email: "mohammed@example.com",
          phone_number: "+249912345678",
          birthDate: "1997-11-15",
          gender: "male",
          nationality: "SDN",
        }}
        onContinue={() => router.push("/preview/new-request")}
      />
    </DashboardLayout>
  );
}
