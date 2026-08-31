"use client";

import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import styles from "./ContactPanel.module.css";

type Language = "en" | "ar";

const SUPPORT_PHONE = "+249 123 456 789";
const SUPPORT_EMAIL = "support@cbos.gov.sd";

const copy = {
  ar: {
    title: "تواصل معنا",
    subtitle: "فريق الدعم جاهز للإجابة على استفساراتك",
    formTitle: "أرسل لنا رسالة",
    subject: "الموضوع",
    subjectPlaceholder: "اختر الموضوع",
    subjects: ["استفسار عن طلب", "مشكلة تقنية", "تعديل بيانات", "أخرى"],
    message: "الرسالة",
    messagePlaceholder: "اكتب رسالتك هنا...",
    send: "إرسال الرسالة",
    sent: "تم إرسال رسالتك. سيتواصل معك فريق الدعم قريباً.",
    channelsTitle: "قنوات التواصل",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    address: "العنوان",
    addressValue: "بنك السودان المركزي، شارع الجامعة، الخرطوم",
    hoursTitle: "ساعات العمل",
    weekdays: "الأحد - الخميس",
    weekdaysValue: "8:30 ص - 3:30 م",
    friday: "الجمعة - السبت",
    fridayValue: "مغلق",
  },
  en: {
    title: "Contact us",
    subtitle: "Our support team is ready to answer your questions",
    formTitle: "Send us a message",
    subject: "Subject",
    subjectPlaceholder: "Select a subject",
    subjects: ["Request enquiry", "Technical problem", "Data correction", "Other"],
    message: "Message",
    messagePlaceholder: "Write your message here...",
    send: "Send message",
    sent: "Your message has been sent. Our support team will contact you shortly.",
    channelsTitle: "Contact channels",
    phone: "Phone",
    email: "Email",
    address: "Address",
    addressValue: "Central Bank of Sudan, University Street, Khartoum",
    hoursTitle: "Working hours",
    weekdays: "Sunday - Thursday",
    weekdaysValue: "8:30 AM - 3:30 PM",
    friday: "Friday - Saturday",
    fridayValue: "Closed",
  },
} as const;

export default function ContactPanel({ language }: { language: Language }) {
  const t = copy[language];
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    // No backend yet -- acknowledge locally so the form is not a dead end.
    setSent(true);
    setSubject("");
    setMessage("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <div className={styles.head}>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
        </div>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.formTitle}</h2>

          {sent && (
            <p className={styles.sent}>
              <CheckCircle2 aria-hidden="true" size={16} />
              {t.sent}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label htmlFor="subject">{t.subject}</label>
              <select
                id="subject"
                required
                value={subject}
                onChange={(event) => {
                  setSubject(event.target.value);
                  setSent(false);
                }}
              >
                <option value="">{t.subjectPlaceholder}</option>
                {t.subjects.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="message">{t.message}</label>
              <textarea
                id="message"
                required
                value={message}
                placeholder={t.messagePlaceholder}
                onChange={(event) => {
                  setMessage(event.target.value);
                  setSent(false);
                }}
              />
            </div>

            <button
              type="submit"
              className={styles.submit}
              disabled={!subject || !message.trim()}
            >
              <Send aria-hidden="true" size={16} />
              {t.send}
            </button>
          </form>
        </section>
      </div>

      <aside className={styles.aside}>
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>{t.channelsTitle}</h2>
          <dl className={styles.channels}>
            <a className={styles.channel} href={`tel:${SUPPORT_PHONE.replace(/\s/g, "")}`}>
              <span className={styles.channelIcon}>
                <Phone aria-hidden="true" size={18} />
              </span>
              <span className={styles.channelText}>
                <dt>{t.phone}</dt>
                <dd dir="ltr">{SUPPORT_PHONE}</dd>
              </span>
            </a>

            <a className={styles.channel} href={`mailto:${SUPPORT_EMAIL}`}>
              <span className={styles.channelIcon}>
                <Mail aria-hidden="true" size={18} />
              </span>
              <span className={styles.channelText}>
                <dt>{t.email}</dt>
                <dd dir="ltr">{SUPPORT_EMAIL}</dd>
              </span>
            </a>

            <div className={styles.channel}>
              <span className={styles.channelIcon}>
                <MapPin aria-hidden="true" size={18} />
              </span>
              <span className={styles.channelText}>
                <dt>{t.address}</dt>
                <dd>{t.addressValue}</dd>
              </span>
            </div>
          </dl>
        </section>

        <section className={styles.hours}>
          <span className={styles.hoursHead}>
            <Clock aria-hidden="true" size={17} />
            {t.hoursTitle}
          </span>
          <dl>
            <div className={styles.hoursRow}>
              <dt>{t.weekdays}</dt>
              <dd>{t.weekdaysValue}</dd>
            </div>
            <div className={styles.hoursRow}>
              <dt>{t.friday}</dt>
              <dd>{t.fridayValue}</dd>
            </div>
          </dl>
        </section>
      </aside>
    </div>
  );
}
