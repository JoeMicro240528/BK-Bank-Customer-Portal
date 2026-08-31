"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle, Mail, ShieldCheck, LogOut, ArrowRight, ArrowLeft } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { formatBirthDate, formatGender, formatNationality } from "@/lib/format";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "ar">("ar");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    if (status === "authenticated" && session?.user) {
      console.log("🟢 Data received from SudaPass session:", session.user);
    }
  }, [status, router, session]);

  if (status === "loading" || !session?.user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const user = session.user;
  const dir = language === "ar" ? "rtl" : "ltr";

  const t = {
    title: language === "ar" ? "الملف الشخصي" : "Profile",
    subtitle: language === "ar" ? "المعلومات المسترجعة من منصة سوداباس" : "Information retrieved from SudaPass",
    name: language === "ar" ? "الاسم الكامل" : "Full Name",
    email: language === "ar" ? "البريد الإلكتروني" : "Email Address",
    nationalId: language === "ar" ? "الرقم الوطني" : "National ID",
    phone: language === "ar" ? "رقم الهاتف" : "Phone Number",
    birthDate: language === "ar" ? "تاريخ الميلاد" : "Date of Birth",
    gender: language === "ar" ? "الجنس" : "Gender",
    nationality: language === "ar" ? "الجنسية" : "Nationality",
    continue: language === "ar" ? "متابعة" : "Continue",
    logout: language === "ar" ? "تسجيل خروج" : "Sign out",
  };

  return (
    <main className="portal-main" dir={dir}>
      <header className="portal-header-modern">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <UserCircle aria-hidden="true" size={28} className="brand-icon" />
          </div>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => signOut()} className="btn-secondary">
            <LogOut size={18} />
            {t.logout}
          </button>
        </div>
      </header>

      <section className="profile-container">
        <div className="profile-card glass-panel">
          <div className="profile-header">
            <Avatar
              src={user.picture}
              alt={user.name || "Profile"}
              size={80}
              className="profile-avatar"
              fallbackClassName="profile-avatar-fallback"
            />
            <div className="profile-title">
              <h2>{user.name}</h2>
              <span className="verified-badge">
                <ShieldCheck size={16} />
                {language === "ar" ? "موثق عبر سوداباس" : "Verified by SudaPass"}
              </span>
            </div>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <span className="detail-label">{t.nationalId}</span>
              <span className="detail-value" dir="ltr">{user.national_id || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t.email}</span>
              <span className="detail-value flex-align">
                <Mail size={16} className="text-muted" />
                {user.email || "N/A"}
              </span>
            </div>
            {user.phone_number && (
              <div className="detail-item">
                <span className="detail-label">{t.phone}</span>
                <span className="detail-value" dir="ltr">{user.phone_number}</span>
              </div>
            )}
            {user.birthDate && (
              <div className="detail-item">
                <span className="detail-label">{t.birthDate}</span>
                <span className="detail-value">{formatBirthDate(user.birthDate, language)}</span>
              </div>
            )}
            {user.gender && (
              <div className="detail-item">
                <span className="detail-label">{t.gender}</span>
                <span className="detail-value">{formatGender(user.gender, language)}</span>
              </div>
            )}
            {user.nationality && (
              <div className="detail-item">
                <span className="detail-label">{t.nationality}</span>
                <span className="detail-value">{formatNationality(user.nationality, language)}</span>
              </div>
            )}
            {/* You can add more fields from SudaPass if needed here */}
          </div>

          <div className="profile-actions">
            <button 
              className="btn-primary-large" 
              onClick={() => router.push("/new-request")}
            >
              {t.continue}
              {language === "ar" ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
