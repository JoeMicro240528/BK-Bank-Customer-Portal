"use client";

import { ChevronDown, FileCheck, Lock, Plus, ShieldCheck, Trash2, Upload, X } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Fields.module.css";

export type Option = { value: string; label: string };

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
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type">) {
  const id = useId();

  // Held as text rather than a number input: leading zeros matter, and the API
  // takes these as strings.
  const clean = (raw: string) =>
    digitsOnly ? raw.replace(/(?!^\+)\D/g, "").replace(/^\+?/, raw.startsWith("+") ? "+" : "") : raw;

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
}: {
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
  hint?: string;
  chooseLabel: string;
  emptyLabel: string;
  clearLabel: string;
}) {
  const id = useId();

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.fileWrap}>
        {/* The whole box is the label, so clicking anywhere opens the picker. */}
        <label className={`${styles.fileBox} ${file ? styles.fileBoxFilled : ""}`} htmlFor={id}>
          <span className={styles.fileIcon}>
            {file ? <FileCheck aria-hidden="true" size={18} /> : <Upload aria-hidden="true" size={18} />}
          </span>
          <span className={styles.fileText}>
            <strong>{file ? file.name : chooseLabel}</strong>
            <span>{file ? formatSize(file.size) : emptyLabel}</span>
          </span>
          <input
            id={id}
            className={styles.fileInput}
            type="file"
            accept="image/*,application/pdf"
            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
          />
        </label>

        {/* Outside the label: a button inside it would reopen the picker. */}
        {file && (
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
