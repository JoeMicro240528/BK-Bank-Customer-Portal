"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle, Mail, ShieldCheck, ChevronLeft, LogOut, ArrowRight, ArrowLeft } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "ar">("ar");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

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
            {user.photo ? (
              <img src={user.photo} alt={user.name || "Profile"} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-fallback">
                <UserCircle size={48} />
              </div>
            )}
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
              <span className="detail-value">{user.national_id || "N/A"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">{t.email}</span>
              <span className="detail-value flex-align">
                <Mail size={16} className="text-muted" />
                {user.email || "N/A"}
              </span>
            </div>
            {user.phone && (
              <div className="detail-item">
                <span className="detail-label">{t.phone}</span>
                <span className="detail-value">{user.phone}</span>
              </div>
            )}
            {/* You can add more fields from SudaPass if needed here */}
          </div>

          <div className="profile-actions">
            <button 
              className="btn-primary-large" 
              onClick={() => router.push("/banks")}
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
