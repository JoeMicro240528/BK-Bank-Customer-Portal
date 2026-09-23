"use client";

import { Check, FileText, IdCard, PenLine, ReceiptText, UserRound, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { copy as aufCopy } from "@/lib/auf/copy";
import styles from "./DocumentsModal.module.css";
import type { Language } from "./types";

const modalCopy = {
  ar: {
    title: "المستندات المطلوبة",
    intro: "جهّز هذه الملفات قبل البدء حتى تكمل طلبك دون توقف.",
    required: "مطلوب",
    optional: "حسب الحالة",
    incomeNote: "غير مطلوب للمتقاعدين والطلاب.",
    close: "إغلاق",
    start: "ابدأ الطلب",
  },
  en: {
    title: "Documents you will need",
    intro: "Have these files ready before you start, so you can finish without stopping.",
    required: "Required",
    optional: "Depends",
    incomeNote: "Not needed for retired customers or students.",
    close: "Close",
    start: "Start the request",
  },
} as const;

/**
 * Shown when a new request begins. The form asks for its attachments across
 * four separate steps, so a customer could reach the last one only to find a
 * file they do not have to hand.
 */
export default function DocumentsModal({
  language,
  onClose,
}: {
  language: Language;
  onClose: () => void;
}) {
  const t = modalCopy[language];
  const labels = aufCopy[language];
  const startRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    startRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // The same four attachments the form validates, in the order they are asked.
  const documents = [
    { icon: IdCard, name: labels.idDocument, required: true },
    { icon: UserRound, name: labels.personalPhoto, required: true },
    { icon: ReceiptText, name: labels.incomeProof, required: true, note: t.incomeNote },
    { icon: PenLine, name: labels.signature, required: true },
  ];

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="documents-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
          <X aria-hidden="true" size={18} />
        </button>

        <span className={styles.badge}>
          <FileText aria-hidden="true" size={22} />
        </span>

        <h2 id="documents-modal-title">{t.title}</h2>
        <p className={styles.intro}>{t.intro}</p>

        <ul className={styles.list}>
          {documents.map((document) => {
            const Icon = document.icon;

            return (
              <li key={document.name}>
                <span className={styles.itemIcon}>
                  <Icon aria-hidden="true" size={18} />
                </span>
                <span className={styles.itemText}>
                  <strong>{document.name}</strong>
                  {document.note && <span className={styles.note}>{document.note}</span>}
                </span>
                <span className={document.note ? styles.tagSoft : styles.tag}>
                  {document.note ? t.optional : t.required}
                </span>
              </li>
            );
          })}
        </ul>

        {/* The size and formats the file fields accept, from the form's own copy. */}
        <p className={styles.hint}>{labels.fileSizeHint}</p>

        <button type="button" ref={startRef} className={styles.start} onClick={onClose}>
          <Check aria-hidden="true" size={17} />
          {t.start}
        </button>
      </div>
    </div>
  );
}
