"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Building2, Plus, Trash2, CheckCircle2, ArrowRight, ArrowLeft, LogOut } from "lucide-react";

const AVAILABLE_BANKS = [
  { id: 1, name: "Bank of Khartoum", nameAr: "بنك الخرطوم" },
  { id: 2, name: "Bank of Omdurman", nameAr: "بنك أم درمان الوطني" },
  { id: 3, name: "Faisal Bank", nameAr: "بنك فيصل الإسلامي" },
  { id: 4, name: "Bank Albalad", nameAr: "بنك البلد" },
  { id: 5, name: "Nile Bank", nameAr: "بنك النيل" },
  { id: 6, name: "Albaraka Bank", nameAr: "بنك البركة" }
];

type BankEntry = {
  id: string; // unique local ID for the list
  bankId: string;
  accountNumber: string;
  branch: string;
};

export default function BanksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [language, setLanguage] = useState<"en" | "ar">("ar");
  const [banks, setBanks] = useState<BankEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
    // Initialize with one empty form row
    if (banks.length === 0) {
      handleAddBank();
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
      </div>
    );
  }

  const dir = language === "ar" ? "rtl" : "ltr";

  const t = {
    title: language === "ar" ? "الحسابات البنكية" : "Bank Accounts",
    subtitle: language === "ar" ? "قم بإضافة حساباتك البنكية أدناه" : "Add your bank accounts below",
    addBank: language === "ar" ? "إضافة بنك آخر" : "Add Another Bank",
    save: language === "ar" ? "حفظ الحسابات" : "Save Accounts",
    bankName: language === "ar" ? "اسم البنك" : "Bank Name",
    accountNumber: language === "ar" ? "رقم الحساب" : "Account Number",
    branch: language === "ar" ? "الفرع" : "Branch",
    selectBank: language === "ar" ? "اختر البنك..." : "Select bank...",
    success: language === "ar" ? "تم حفظ البيانات بنجاح!" : "Data saved successfully!",
    logout: language === "ar" ? "تسجيل خروج" : "Sign out",
    back: language === "ar" ? "رجوع" : "Back"
  };

  const handleAddBank = () => {
    setBanks([...banks, { id: Date.now().toString(), bankId: "", accountNumber: "", branch: "" }]);
  };

  const handleRemoveBank = (id: string) => {
    setBanks(banks.filter((b) => b.id !== id));
  };

  const handleChange = (id: string, field: keyof BankEntry, value: string) => {
    setBanks(banks.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API save
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/cbos-form");
      }, 1000); // Redirect after 1 second of showing success message
    }, 1200);
  };

  return (
    <main className="portal-main" dir={dir}>
      <header className="portal-header-modern">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Building2 aria-hidden="true" size={28} className="brand-icon" />
          </div>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={() => router.push("/profile")} className="btn-icon">
            {language === "ar" ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span className="sr-only">{t.back}</span>
          </button>
          <button onClick={() => signOut()} className="btn-secondary">
            <LogOut size={18} />
            {t.logout}
          </button>
        </div>
      </header>

      <section className="form-container">
        {showSuccess && (
          <div className="alert-success slide-down">
            <CheckCircle2 size={20} />
            <span>{t.success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="banks-form">
          <div className="bank-list">
            {banks.map((bank, index) => (
              <div key={bank.id} className="bank-card glass-panel fade-in">
                <div className="bank-card-header">
                  <h3>
                    <span className="bank-index">{index + 1}</span>
                  </h3>
                  {banks.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => handleRemoveBank(bank.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                
                <div className="form-grid">
                  <div className="form-group">
                    <label>{t.bankName}</label>
                    <div className="select-wrapper">
                      <select
                        required
                        value={bank.bankId}
                        onChange={(e) => handleChange(bank.id, "bankId", e.target.value)}
                        className="form-input"
                      >
                        <option value="" disabled>{t.selectBank}</option>
                        {AVAILABLE_BANKS.map((ab) => (
                          <option key={ab.id} value={ab.id.toString()}>
                            {language === "ar" ? ab.nameAr : ab.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>{t.accountNumber}</label>
                    <input
                      type="text"
                      required
                      value={bank.accountNumber}
                      onChange={(e) => handleChange(bank.id, "accountNumber", e.target.value)}
                      className="form-input"
                      placeholder="0000000000"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t.branch}</label>
                    <input
                      type="text"
                      required
                      value={bank.branch}
                      onChange={(e) => handleChange(bank.id, "branch", e.target.value)}
                      className="form-input"
                      placeholder={language === "ar" ? "الفرع الرئيسي" : "Main Branch"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-outline-dashed"
              onClick={handleAddBank}
            >
              <Plus size={18} />
              {t.addBank}
            </button>

            <button
              type="submit"
              className="btn-primary-large"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin h-5 w-5 border-2 border-white rounded-full border-t-transparent"></div>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  {t.save}
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
