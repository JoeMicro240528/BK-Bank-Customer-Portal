"use client";

import { ChevronDown, Lock, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import styles from "./Fields.module.css";

export type Option = { value: string; label: string };

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
