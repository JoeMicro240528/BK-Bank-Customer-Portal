"use client";

import { ChevronDown, FileCheck, Lock, Plus, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Fields.module.css";

export type Option = { value: string; label: string };

/** Anything that can't appear in a name written in English letters. */
export const LATIN_NAME_DISALLOWED = /[^A-Za-z '\-]/g;

/** Anything that isn't an Arabic letter, Arabic diacritic, or space. */
export const ARABIC_NAME_DISALLOWED = /[^\u0621-\u064A\u064B-\u065F\u0670\u0671-\u06D3 ]/g;

/** The most digits any number field on the form accepts. */
export const MAX_DIGITS = 14;

/**
 * Digits only, capped at MAX_DIGITS. Arabic-Indic digits (٠-٩, ۰-۹) are read
 * as their Western equivalents, so a customer on an Arabic keyboard isn't left
 * typing into a field that silently ignores them. A leading "+" is kept only
 * when allowed, for phone numbers -- never for amounts or counts.
 */
export function cleanDigits(raw: string, allowPlus = false): string {
  const western = toWesternDigits(raw);
  const plus = allowPlus && western.trimStart().startsWith("+") ? "+" : "";
  return plus + western.replace(/\D/g, "").slice(0, MAX_DIGITS);
}

/**
 * A whole amount: digits only, no sign, no fraction. Everything from the
 * decimal point on is dropped rather than stripped of its dot -- otherwise
 * "1,500.75" would become 150075, a hundred times what was meant.
 */
export function cleanAmount(raw: string): string {
  const whole = toWesternDigits(raw).split(/[.\u066B]/)[0];
  return whole.replace(/\D/g, "").slice(0, MAX_DIGITS);
}

function toWesternDigits(raw: string): string {
  return raw
    .replace(/[\u0660-\u0669]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[\u06F0-\u06F9]/g, (d) => String(d.charCodeAt(0) - 0x06f0));
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * A value that came from SudaPass. Shown but not editable -- identity data is
 * owned by SudaPass, so it is corrected there rather than here.
 */
export function ReadOnlyField({
  label,
  value,
  emptyText,
  sourceNote,
}: {
  label: string;
  value: string;
  emptyText: string;
  sourceNote?: string;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <div className={styles.readOnly}>
        <span className={`${styles.readOnlyValue} ${value ? "" : styles.readOnlyEmpty}`}>
          {value || emptyText}
        </span>
        <span className={styles.lock} title={sourceNote}>
          <Lock aria-hidden="true" size={14} />
        </span>
      </div>
      {sourceNote && (
        <span className={styles.sourceNote}>
          <ShieldCheck aria-hidden="true" size={12} />
          {sourceNote}
        </span>
      )}
    </div>
  );
}

/** A labelled break inside a long step, e.g. PEP or FATCA. */
export function FormSection({ title, note }: { title: string; note?: string }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {note && <p className={styles.sectionNote}>{note}</p>}
    </div>
  );
}

export function FieldGrid({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return <div className={`${styles.grid} ${wide ? styles.gridWide : ""}`}>{children}</div>;
}

export function TextInput({
  label,
  value,
  onChange,
  required = false,
  type = "text",
  hint,
  digitsOnly = false,
  latinOnly = false,
  arabicOnly = false,
  allowPlus = false,
  wholeAmount = false,
  ...rest
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  hint?: string;
  /** Keep only digits (and a leading +), for phone and account numbers. */
  digitsOnly?: boolean;
  /**
   * Keep only English letters, spaces, hyphens and apostrophes, for names
   * that must be in Latin script. Arabic and digits are dropped as typed.
   */
  latinOnly?: boolean;
  /** Keep only Arabic letters and spaces, for names written in Arabic. */
  arabicOnly?: boolean;
  /** With digitsOnly: permit a leading "+", for phone numbers. */
  allowPlus?: boolean;
  /** With digitsOnly: a whole amount, cut at the decimal point. */
  wholeAmount?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  const id = useId();

  // Held as text rather than a number input: leading zeros matter, and the API
  // takes these as strings.
  const clean = (raw: string) => {
    if (digitsOnly) return wholeAmount ? cleanAmount(raw) : cleanDigits(raw, allowPlus);
    if (latinOnly) return raw.replace(LATIN_NAME_DISALLOWED, "");
    if (arabicOnly) return raw.replace(ARABIC_NAME_DISALLOWED, "");
    return raw;
  };

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.control}>
        <input
          id={id}
          className={styles.input}
          value={value}
          type={type}
          onChange={(event) => onChange(clean(event.target.value))}
          {...rest}
        />
      </div>
      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/**
 * A file attachment. The file is held in form state until the step is saved,
 * then uploaded against the request's external_ref -- a request has to exist
 * before anything can be attached to it.
 */
export function FileInput({
  label,
  file,
  onChange,
  required = false,
  hint,
  chooseLabel,
  emptyLabel,
  clearLabel,
  disabled = false,
  uploaded,
  uploadedLabel,
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  hint?: string;
  chooseLabel: string;
  emptyLabel: string;
  clearLabel: string;
  /** Shown but not usable, for an attachment that doesn't apply to this customer. */
  disabled?: boolean;
  /**
   * A file the saved request already holds. A browser cannot put it back into
   * the input, so it is shown here instead; picking a new file replaces it.
   */
  uploaded?: { name: string; size: number };
  uploadedLabel?: string;
}) {
  const saved = !file && uploaded ? uploaded : null;

  const id = useId();

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.fileWrap}>
        {/* The whole box is the label, so clicking anywhere opens the picker. */}
        <label
          className={[
            styles.fileBox,
            (file || saved) && !disabled ? styles.fileBoxFilled : "",
            disabled ? styles.fileBoxDisabled : "",
          ]
            .filter(Boolean)
            .join(" ")}
          htmlFor={id}
          aria-disabled={disabled || undefined}
        >
          <span className={styles.fileIcon}>
            {file || saved ? (
              <FileCheck aria-hidden="true" size={18} />
            ) : (
              <Upload aria-hidden="true" size={18} />
            )}
          </span>
          <span className={styles.fileText}>
            <strong>{file ? file.name : saved ? saved.name : chooseLabel}</strong>
            <span>
              {file
                ? formatSize(file.size)
                : saved
                  ? [uploadedLabel, formatSize(saved.size)].filter(Boolean).join(" · ")
                  : emptyLabel}
            </span>
          </span>
          <input
            id={id}
            className={styles.fileInput}
            type="file"
            accept="image/*,application/pdf"
            disabled={disabled}
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
        </label>

        {/* Outside the label: a button inside it would reopen the picker. */}
        {file && !disabled && (
          <button
            type="button"
            className={styles.fileClear}
            aria-label={clearLabel}
            title={clearLabel}
            onClick={() => onChange(null)}
          >
            <X aria-hidden="true" size={16} />
          </button>
        )}
      </div>

      {hint && <span className={styles.hint}>{hint}</span>}
    </div>
  );
}

/** A yes/no question, as the guide presents them: two buttons, not a dropdown. */
export function YesNo({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
  required = false,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
  required?: boolean;
}) {
  return (
    <div className={styles.field}>
      <span className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </span>
      <div className={styles.yesNo} role="group">
        <button
          type="button"
          className={`${styles.yesNoOption} ${value ? styles.yesNoActive : ""}`}
          aria-pressed={value}
          onClick={() => onChange(true)}
        >
          {yesLabel}
        </button>
        <button
          type="button"
          className={`${styles.yesNoOption} ${!value ? styles.yesNoActive : ""}`}
          aria-pressed={!value}
          onClick={() => onChange(false)}
        >
          {noLabel}
        </button>
      </div>
    </div>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}) {
  const id = useId();

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      <div className={styles.control}>
        <select
          id={id}
          className={styles.select}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.caret}>
          <ChevronDown aria-hidden="true" size={16} />
        </span>
      </div>
    </div>
  );
}

export function CheckboxInput({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className={styles.checkbox}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
}

export function CheckboxGrid({ children }: { children: ReactNode }) {
  return <div className={styles.checkboxGrid}>{children}</div>;
}

export function RepeatedGroup({
  title,
  removeLabel,
  onRemove,
  canRemove,
  children,
}: {
  title: string;
  removeLabel: string;
  onRemove: () => void;
  canRemove: boolean;
  children: ReactNode;
}) {
  return (
    <section className={styles.group}>
      <div className={styles.groupHead}>
        <h4>{title}</h4>
        {canRemove && (
          <button type="button" className={styles.removeButton} onClick={onRemove}>
            <Trash2 aria-hidden="true" size={14} />
            {removeLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className={styles.addButton} onClick={onClick}>
      <Plus aria-hidden="true" size={16} />
      {label}
    </button>
  );
}
