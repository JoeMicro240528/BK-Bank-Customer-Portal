"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";
import { landingCopy } from "@/components/landing/copy";
import type { Language } from "@/components/landing/types";

export default function Home() {
  const [language, setLanguage] = useState<Language>("ar");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/profile");
    }
  }, [status, session, router]);

  const loginWithSudaPass = () => {
    signIn("sudapass");
  };

  if (status === "loading") {
    return (
      <div className="page-loading">
        <Loader2 className="page-loading-spinner" aria-hidden="true" />
      </div>
    );
  }

  const dir = language === "ar" ? "rtl" : "ltr";
  const t = landingCopy[language];

  return (
    <LandingPage
      t={t}
      dir={dir}
      language={language}
      onLanguageChange={setLanguage}
      loginError=""
      onLogin={loginWithSudaPass}
    />
  );
}
