"use client";

import { useLanguage } from "@/lib/language";
import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { dashboardCopy } from "@/components/dashboard/copy";
import ProfileCard from "@/components/profile/ProfileCard";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useLanguage();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated" || !session?.user) {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  const t = dashboardCopy[language];
  const user = session.user;

  return (
    <DashboardLayout
      language={language}
      onLanguageChange={setLanguage}
      user={{ name: user.name || "", role: t.platformTagline, picture: user.picture }}
      crumbs={[{ label: t.nav.home, href: "/dashboard" }, { label: t.nav.myData }]}
      active="myData"
      onLogout={() => signOut({ callbackUrl: "/" })}
    >
      <ProfileCard
        user={user}
        language={language}
      />
    </DashboardLayout>
  );
}
