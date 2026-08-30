"use client";

import { Building2, ShieldCheck, Globe2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [language, setLanguage] = useState<"en" | "ar">("ar");
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
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const dir = language === "ar" ? "rtl" : "ltr";
  const t = {
    appName: language === "ar" ? "تحديث بيانات العملاء - بنك السودان المركزي" : "CBOS Customer Information Update",
    appSubtitle: language === "ar" ? "بوابة عامة لنموذج AUF" : "Public AUF portal",
    sudapassTitle: language === "ar" ? "تسجيل الدخول" : "Sign in",
    sudapassSubtitle: language === "ar" ? "تسجيل الدخول الآمن عبر منصة سوداباس للوصول إلى الخدمات المصرفية." : "Secure login via SudaPass to access banking services.",
    sudapassProvider: language === "ar" ? "سوداباس" : "SudaPass",
  };

  return (
    <main className="portal-login-main" dir={dir}>
      <header className="portal-header-modern">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Building2 aria-hidden="true" size={28} className="brand-icon" />
          </div>
          <div>
            <h1>{t.appName}</h1>
            <p>{t.appSubtitle}</p>
          </div>
        </div>

        <div className="header-actions">
          <label className="language-switch">
            <Globe2 aria-hidden="true" size={18} />
            <select value={language} onChange={(e) => setLanguage(e.target.value as "en" | "ar")}>
              <option value="ar">العربية</option>
              <option value="en">English</option>
            </select>
          </label>
        </div>
      </header>

      <section className="login-container-modern">
        <div className="login-card-modern">
          <div className="login-card-header">
            <span className="badge-modern">
              <ShieldCheck aria-hidden="true" size={20} />
              {t.sudapassProvider}
            </span>
            <h2>{t.sudapassTitle}</h2>
            <p>{t.sudapassSubtitle}</p>
          </div>

          <div className="login-card-body">
            <button
              type="button"
              className="btn-sudapass-large"
              aria-label="Login with SudaPass"
              onClick={loginWithSudaPass}
            >
              <Image 
                src="/signin-light-ar.svg" 
                alt="SudaPass" 
                width={360} 
                height={80} 
                priority 
                className="sudapass-img"
              />
            </button>
            <p className="login-secure-text">
              <ShieldCheck size={16} /> 
              {language === "ar" ? "نظام أمن ومشفر بالكامل" : "Fully secure and encrypted system"}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
