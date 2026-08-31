"use client";

import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import styles from "./FaqList.module.css";

type Language = "en" | "ar";

const copy = {
  ar: { title: "الأسئلة الشائعة", subtitle: "إجابات على أكثر الأسئلة تكراراً حول المنصة" },
  en: { title: "Frequently asked questions", subtitle: "Answers to the most common questions about the platform" },
} as const;

/** Static FAQ content. */
const faqs: { id: string; q: { ar: string; en: string }; a: { ar: string; en: string } }[] = [
  {
    id: "what",
    q: { ar: "ما هي منصة التحقق المركزي؟", en: "What is the Central Verification Platform?" },
    a: {
      ar: "منصة مركزية تتيح لك تحديث بياناتك الشخصية والمالية مرة واحدة لدى جميع البنوك المشاركة، بدلاً من زيارة كل بنك على حدة.",
      en: "A central platform that lets you update your personal and financial data once across all participating banks, instead of visiting each bank separately.",
    },
  },
  {
    id: "who",
    q: { ar: "من يمكنه استخدام المنصة؟", en: "Who can use the platform?" },
    a: {
      ar: "كل من يملك حساباً في أحد البنوك المشاركة وحساباً موثقاً في منصة سوداباس.",
      en: "Anyone who holds an account at one of the participating banks and has a verified SudaPass account.",
    },
  },
  {
    id: "sudapass",
    q: { ar: "لماذا يتم تسجيل الدخول عبر سوداباس؟", en: "Why do I sign in with SudaPass?" },
    a: {
      ar: "سوداباس هي منصة الهوية الرقمية الوطنية، وتُستخدم للتحقق من هويتك فقط. لا تتم مشاركة بياناتك مع أي جهة دون موافقتك.",
      en: "SudaPass is the national digital identity platform, used only to verify your identity. Your data is never shared with anyone without your consent.",
    },
  },
  {
    id: "duration",
    q: { ar: "كم يستغرق اعتماد الطلب؟", en: "How long does approval take?" },
    a: {
      ar: "عادة من 1 إلى 5 أيام عمل، وتختلف المدة من بنك لآخر. يمكنك متابعة حالة الطلب لدى كل بنك من صفحة طلباتي.",
      en: "Usually 1 to 5 working days, and it varies by bank. You can track the status at each bank from the My Requests page.",
    },
  },
  {
    id: "multiple",
    q: { ar: "هل يمكنني إضافة أكثر من بنك في الطلب؟", en: "Can I add more than one bank to a request?" },
    a: {
      ar: "نعم. يمكنك إضافة عدة حسابات في بنوك وفروع مختلفة، وسيتم إنشاء طلب تحديث واحد شامل لجميع البنوك المحددة.",
      en: "Yes. You can add several accounts across different banks and branches, and a single update request will be created covering all of them.",
    },
  },
  {
    id: "rejected",
    q: { ar: "ماذا أفعل إذا طلب البنك إجراءً إضافياً؟", en: "What if a bank requests further action?" },
    a: {
      ar: "ستصلك رسالة نصية وإشعار داخل المنصة يوضح الإجراء المطلوب. في الغالب يتطلب الأمر زيارة الفرع لاستكمال التحقق.",
      en: "You will receive an SMS and an in-platform notification explaining what is required. In most cases it means visiting the branch to complete verification.",
    },
  },
  {
    id: "edit",
    q: { ar: "هل يمكنني تعديل بياناتي الشخصية من المنصة؟", en: "Can I edit my personal data on the platform?" },
    a: {
      ar: "البيانات الشخصية مسترجعة من سوداباس ولا يمكن تعديلها هنا. لتعديلها يرجى تحديثها في سوداباس أولاً.",
      en: "Personal data is retrieved from SudaPass and cannot be edited here. To change it, update it in SudaPass first.",
    },
  },
  {
    id: "cost",
    q: { ar: "هل هناك رسوم على استخدام المنصة؟", en: "Is there any fee for using the platform?" },
    a: {
      ar: "لا، استخدام المنصة مجاني بالكامل.",
      en: "No, using the platform is completely free.",
    },
  },
];

export default function FaqList({ language }: { language: Language }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);
  const t = copy[language];

  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </div>

      <section className={styles.card}>
        <ul className={styles.list}>
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <li key={faq.id}>
                <button
                  type="button"
                  className={styles.question}
                  aria-expanded={isOpen}
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                >
                  <span className={styles.qIcon}>
                    <HelpCircle aria-hidden="true" size={17} />
                  </span>
                  <span className={styles.qText}>{faq.q[language]}</span>
                  <span className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}>
                    <ChevronDown aria-hidden="true" size={17} />
                  </span>
                </button>
                {isOpen && <p className={styles.answer}>{faq.a[language]}</p>}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
