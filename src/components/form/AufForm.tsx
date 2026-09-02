"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Cloud,
  Loader2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Banner from "@/components/ui/Banner";
import { CheckboxInput } from "./Fields";
import {
  StepContent,
  missingFields,
  stepOrder,
  type LockedValues,
  type StepId,
} from "./steps";
import FormStepper from "./FormStepper";
import styles from "./AufForm.module.css";
import { copy } from "@/lib/auf/copy";
import {
  buildCreatePayload,
  buildUpdatePayload,
  initialForm,
  isCompleteIdentity,
  type FormState,
} from "@/lib/auf/form";
import { frontendApi, errorMessage } from "@/lib/api";
import type { Option } from "./Fields";

type Language = "en" | "ar";
type SaveState = "idle" | "saving" | "saved" | "error";

const STEP_KEY = "auf_step_";

function readStep(externalRef?: string): number {
  if (!externalRef || typeof window === "undefined") return 0;

  try {
    const stored = window.localStorage.getItem(`${STEP_KEY}${externalRef}`);
    const parsed = stored ? Number.parseInt(stored, 10) : 0;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

const stepLabelKey: Record<StepId, string> = {
  personal: "stepPersonal",
  contact: "stepContact",
  work: "stepWork",
  financial: "stepFinancial",
};

/**
 * document_type is a free string in the API with no documented values. These
 * are the ones we send; confirm them with the bank before relying on them.
 */
function documentTypeFor(key: string): string {
  if (key.startsWith("certificate:")) return "income_certificate";
  return key;
}

/**
 * The AUF request form, split into steps that each save to the backend when
 * the user moves on, so partially completed work survives a closed tab.
 */
export default function AufForm({
  language,
  ownerId,
  externalRef,
  initialState,
  countryOptions = [],
  locked = {},
  bankNames = {},
  onSubmitted,
}: {
  language: Language;
  ownerId: string;
  /** Identity values owned by SudaPass, rendered read-only. */
  locked?: LockedValues;
  /** Existing draft to continue, if any. */
  externalRef?: string;
  initialState?: FormState;
  countryOptions?: Option[];
  /** Bank id -> display name, for the review step. */
  bankNames?: Record<string, string>;
  onSubmitted?: (externalRef: string) => void;
}) {
  const t = copy[language];
  const [form, setForm] = useState<FormState>(initialState ?? initialForm());
  // Which step the user reached. The API has no field for it, so it is kept
  // per draft in the browser -- the answers themselves live on the server.
  const [stepIndex, setStepIndex] = useState(() => readStep(externalRef));
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  /** Attachments, held outside the draft: a File cannot be serialised. */
  const [files, setFiles] = useState<Record<string, File | null>>({});

  // Held in a ref so the first save can create the request and later saves
  // update it, without re-rendering on every change.
  const refRef = useRef<string>(externalRef || "");
  const filesRef = useRef(files);
  filesRef.current = files;
  /** Keys already sent, so a later step does not upload the same file twice. */
  const uploadedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (externalRef) refRef.current = externalRef;
  }, [externalRef]);

  // Remember progress so returning to a draft reopens the step it stopped on.
  useEffect(() => {
    const ref = refRef.current;
    if (!ref || ref === "preview") return;

    try {
      window.localStorage.setItem(`${STEP_KEY}${ref}`, String(stepIndex));
    } catch {
      // Storage can be unavailable (private mode); progress is not critical.
    }
  }, [stepIndex]);

  const isReview = stepIndex === stepOrder.length;
  const step = stepOrder[stepIndex];
  const totalSteps = stepOrder.length + 1;

  const setField = useCallback(
    <K extends keyof FormState>(key: K, value: FormState[K]) =>
      setForm((previous) => ({ ...previous, [key]: value })),
    [],
  );

  /** Creates the request on first call, updates it thereafter. */
  const setFile = useCallback((key: string, file: File | null) => {
    setFiles((previous) => ({ ...previous, [key]: file }));
  }, []);

  const save = useCallback(async (): Promise<string | null> => {
    // Without an owner there is nobody to save against -- the design-preview
    // route renders the form this way, so navigation still works there.
    if (!ownerId) return "preview";

    setSaveState("saving");
    setError("");

    try {
      const options = { language, ownerId };
      let ref = refRef.current;

      if (!ref) {
        ref = `auf-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
        await frontendApi.createRequest(buildCreatePayload(form, ref), options);
        refRef.current = ref;
      } else {
        await frontendApi.updateRequest(ref, buildUpdatePayload(form, ref), options);
      }

      // Attachments need a request to hang off, so they go up after the save.
      // A failed upload must not lose the step's typed answers, so it only
      // reports and leaves the file selected for another try.
      const pending = Object.entries(filesRef.current).filter(
        ([key, file]) => file && !uploadedRef.current.has(key),
      );

      for (const [key, file] of pending) {
        if (!file) continue;
        try {
          await frontendApi.uploadDocument(
            ref,
            { documentType: documentTypeFor(key), file, description: key },
            options,
          );
          uploadedRef.current.add(key);
        } catch (caught) {
          setError(errorMessage(caught));
        }
      }

      setSaveState("saved");
      return ref;
    } catch (caught) {
      setSaveState("error");
      setError(errorMessage(caught));
      return null;
    }
  }, [form, language, ownerId]);

  const goNext = async () => {
    // Check before saving: a half-filled step should not reach the backend,
    // and the customer should be told what is missing rather than moving on.
    const missing = isReview ? [] : missingFields(step as StepId, form, files, t);

    if (missing.length > 0) {
      setError(`${t.missingRequired}: ${missing.join("، ")}`);
      setSaveState("idle");
      return;
    }

    const saved = await save();
    // Only advance once the step is safely stored.
    if (saved) setStepIndex((index) => Math.min(index + 1, stepOrder.length));
  };

  const goBack = async () => {
    if (stepIndex === 0) return;
    await save();
    setStepIndex((index) => Math.max(index - 1, 0));
  };

  const submit = async () => {
    if (!form.declaration_accepted) {
      setError(t.declarationRequired);
      return;
    }

    if (!form.identity_lines.some(isCompleteIdentity)) {
      setError(t.identityRequired);
      return;
    }

    setSubmitting(true);
    const ref = await save();

    if (!ref) {
      setSubmitting(false);
      return;
    }

    try {
      await frontendApi.submitRequest(ref, { language, ownerId });

      try {
        window.localStorage.removeItem(`${STEP_KEY}${ref}`);
      } catch {
        // Nothing to clean up if storage is unavailable.
      }

      onSubmitted?.(ref);
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setSubmitting(false);
    }
  };

  const Next = language === "ar" ? ArrowLeft : ArrowRight;
  const Back = language === "ar" ? ArrowRight : ArrowLeft;
  const busy = saveState === "saving" || submitting;

  const title = isReview
    ? t.reviewTitle
    : (t as unknown as Record<string, string>)[stepLabelKey[step]];

  const stepLabels = [
    ...stepOrder.map((id) => (t as unknown as Record<string, string>)[stepLabelKey[id]]),
    t.step_review,
  ];

  return (
    <section className={styles.card}>
      <FormStepper
        labels={stepLabels}
        current={stepIndex}
        onSelect={(index) => !busy && setStepIndex(index)}
      />

      <div className={styles.head}>
        <h1>{title}</h1>
        <span className={styles.stepCount}>
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <span
        className={`${styles.saveState} ${
          saveState === "saved" ? styles.saved : saveState === "saving" ? styles.saving : ""
        }`}
      >
        {saveState === "saving" ? (
          <>
            <Loader2 aria-hidden="true" size={13} className={styles.spin} />
            {language === "ar" ? "جارٍ الحفظ..." : "Saving..."}
          </>
        ) : saveState === "saved" ? (
          <>
            <CheckCircle2 aria-hidden="true" size={13} />
            {language === "ar" ? "تم حفظ بياناتك" : "Your data is saved"}
          </>
        ) : (
          <>
            <Cloud aria-hidden="true" size={13} />
            {language === "ar"
              ? "يتم الحفظ تلقائياً عند الانتقال بين الخطوات"
              : "Saved automatically as you move between steps"}
          </>
        )}
      </span>

      {error && (
        <div style={{ marginBottom: 14 }}>
          <Banner tone="danger" icon={AlertCircle} text={error} />
        </div>
      )}

      <div className={styles.body}>
        {isReview ? (
          <>
            <dl className={styles.reviewGrid}>
              <div className={styles.reviewItem}>
                <dt>{t.name_arabic}</dt>
                <dd>{form.name_arabic || "-"}</dd>
              </div>
              <div className={styles.reviewItem}>
                <dt>{t.name_english}</dt>
                <dd>{form.name_english || "-"}</dd>
              </div>
              <div className={styles.reviewItem}>
                <dt>{t.mobile_personal}</dt>
                <dd dir="ltr">{form.mobile_personal || "-"}</dd>
              </div>
              <div className={styles.reviewItem}>
                <dt>{t.email}</dt>
                <dd dir="ltr">{form.email || "-"}</dd>
              </div>
              <div className={styles.reviewItem}>
                <dt>{t.id_type}</dt>
                <dd>{form.identity_lines.filter(isCompleteIdentity).length}</dd>
              </div>
              <div className={styles.reviewItem}>
                <dt>{t.employer_name}</dt>
                <dd>{form.employer_name || "-"}</dd>
              </div>
            </dl>

            {/* The accounts were chosen before the form began, so show them here
                -- this is the last chance to check them before submitting. */}
            <h3 className={styles.accountsTitle}>
              {language === "ar" ? "الحسابات المختارة" : "Selected accounts"} (
              {form.selected_accounts.length})
            </h3>

            {form.selected_accounts.length === 0 ? (
              <p className={styles.accountsEmpty}>
                {language === "ar"
                  ? "لم يتم اختيار أي حساب."
                  : "No accounts were selected."}
              </p>
            ) : (
              <ul className={styles.accountsList}>
                {form.selected_accounts.map((account, index) => (
                  <li className={styles.accountRow} key={`${account.bank_id}-${index}`}>
                    <span className={styles.accountBank}>
                      {bankNames[String(account.bank_id)] ||
                        `${language === "ar" ? "بنك" : "Bank"} #${account.bank_id}`}
                    </span>
                    <span className={styles.accountNumber} dir="ltr">
                      {account.account_number}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className={styles.declaration}>
              <CheckboxInput
                label={t.declaration_accepted}
                checked={form.declaration_accepted}
                onChange={(value) => setField("declaration_accepted", value)}
              />
            </div>
          </>
        ) : (
          <StepContent
            step={step}
            t={t}
            language={language}
            locked={locked}
            form={form}
            setField={setField}
            setForm={setForm}
            countryOptions={countryOptions}
            files={files}
            setFile={setFile}
          />
        )}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backButton}
          disabled={stepIndex === 0 || busy}
          onClick={goBack}
        >
          <Back aria-hidden="true" size={16} />
          {t.previous}
        </button>

        <span className={styles.spacer} />

        {isReview ? (
          <button
            type="button"
            className={styles.submitButton}
            disabled={busy || !form.declaration_accepted}
            onClick={submit}
          >
            {submitting ? (
              <Loader2 aria-hidden="true" size={16} className={styles.spin} />
            ) : (
              <Check aria-hidden="true" size={16} />
            )}
            {t.submitRequest}
          </button>
        ) : (
          <button type="button" className={styles.nextButton} disabled={busy} onClick={goNext}>
            {saveState === "saving" ? (
              <Loader2 aria-hidden="true" size={16} className={styles.spin} />
            ) : (
              <Next aria-hidden="true" size={16} />
            )}
            {t.next}
          </button>
        )}
      </div>
    </section>
  );
}
