"use client";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Flag,
  IdCard,
  Info,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import { formatBirthDate, formatGender, formatNationality } from "@/lib/format";
import styles from "./ProfileCard.module.css";

type Language = "en" | "ar";

export type ProfileUser = {
  name?: string;
  picture?: string;
  national_id?: string;
  email?: string;
  phone_number?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
};

const copy = {
  ar: {
    verified: "موثق عبر سوداباس",
    detailsTitle: "بياناتك الشخصية",
    nationalId: "الرقم الوطني",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    birthDate: "تاريخ الميلاد",
    gender: "الجنس",
    nationality: "الجنسية",
    notice: "هذه البيانات مسترجعة من سوداباس ولا يمكن تعديلها من هنا.",
    continue: "متابعة",
    notProvided: "غير متوفر",
  },
  en: {
    verified: "Verified via SudaPass",
    detailsTitle: "Your personal data",
    nationalId: "National ID",
    email: "Email address",
    phone: "Phone number",
    birthDate: "Date of birth",
    gender: "Gender",
    nationality: "Nationality",
    notice: "This data is retrieved from SudaPass and cannot be edited here.",
    continue: "Continue",
    notProvided: "Not provided",
  },
} as const;

export default function ProfileCard({
  user,
  language,
  onContinue,
}: {
  user: ProfileUser;
  language: Language;
  onContinue?: () => void;
}) {
  const t = copy[language];
  const Arrow = language === "ar" ? ArrowLeft : ArrowRight;

  const items: { key: string; icon: LucideIcon; label: string; value: string; ltr?: boolean }[] = [
    {
      key: "nationalId",
      icon: IdCard,
      label: t.nationalId,
      value: user.national_id || t.notProvided,
      ltr: true,
    },
    { key: "email", icon: Mail, label: t.email, value: user.email || t.notProvided, ltr: true },
    {
      key: "phone",
      icon: Phone,
      label: t.phone,
      value: user.phone_number || t.notProvided,
      ltr: true,
    },
    {
      key: "birthDate",
      icon: CalendarDays,
      label: t.birthDate,
      value: formatBirthDate(user.birthDate, language) || t.notProvided,
    },
    {
      key: "gender",
      icon: UserRound,
      label: t.gender,
      value: formatGender(user.gender, language) || t.notProvided,
    },
    {
      key: "nationality",
      icon: Flag,
      label: t.nationality,
      value: formatNationality(user.nationality, language) || t.notProvided,
    },
  ];

  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <Avatar
          src={user.picture}
          alt={user.name || "Profile"}
          size={76}
          className={styles.avatar}
          fallbackClassName={styles.avatarFallback}
        />
        <div className={styles.headerText}>
          <h1>{user.name}</h1>
          <span className={styles.verified}>
            <ShieldCheck aria-hidden="true" size={14} />
            {t.verified}
          </span>
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.cardHead}>
          <UserRound aria-hidden="true" size={17} />
          <h2>{t.detailsTitle}</h2>
        </div>

        <dl className={styles.grid}>
          {items.map((item) => (
            <div className={styles.item} key={item.key}>
              <span className={styles.itemIcon}>
                <item.icon aria-hidden="true" size={18} />
              </span>
              <div className={styles.itemText}>
                <dt>{item.label}</dt>
                <dd dir={item.ltr ? "ltr" : undefined}>{item.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <p className={styles.notice}>
          <Info aria-hidden="true" size={15} />
          {t.notice}
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.continueButton} onClick={onContinue}>
            {t.continue}
            <Arrow aria-hidden="true" size={17} />
          </button>
        </div>
      </section>
    </div>
  );
}
