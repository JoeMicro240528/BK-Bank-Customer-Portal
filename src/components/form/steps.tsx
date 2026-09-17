"use client";

import {
  CheckboxGrid,
  CheckboxInput,
  FieldGrid,
  FileInput,
  FormSection,
  ARABIC_NAME_DISALLOWED,
  LATIN_NAME_DISALLOWED,
  MAX_DIGITS,
  ReadOnlyField,
  SelectInput,
  TextInput,
  YesNo,
  type Option,
} from "./Fields";
import { optionSets, type FormState } from "@/lib/auf/form";
import { formatNationality } from "@/lib/format";
import type { AufCopy } from "@/lib/auf/copy";

/** Identity values that come from SudaPass and cannot be edited here. */
export type LockedValues = {
  name?: string;
  nationalId?: string;
  birthDate?: string;
  gender?: string;
  nationality?: string;
  email?: string;
  phone?: string;
};

/**
 * The steps of the 2026 update guide. Step one -- verifying the account -- is
 * the bank/account screen before this form, so the four here are its steps
 * two through five.
 */
export type StepId = "personal" | "contact" | "work" | "financial";

export const stepOrder: StepId[] = ["personal", "contact", "work", "financial"];

/** Keys for the attachments the guide requires. */
export const FILE_ID_DOCUMENT = "id_document";
export const FILE_PERSONAL_PHOTO = "personal_photo";
export const FILE_INCOME_PROOF = "income_proof";
export const FILE_SIGNATURE = "signature";

type Props = {
  t: AufCopy;
  language: "en" | "ar";
  locked: LockedValues;
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  setForm: (updater: (previous: FormState) => FormState) => void;
  countryOptions: Option[];
  files: Record<string, File | null>;
  setFile: (key: string, file: File | null) => void;
  /** States of the chosen country of birth, loaded by the form. */
  birthStates: Option[];
  birthStatesLoading: boolean;
};

/**
 * Option lists carry English labels from the API contract. Arabic wording lives
 * here because the shared copy file only covers field labels, not option values.
 */
const optionLabelsAr: Record<string, string> = {
  salary: "راتب",
  business: "أعمال",
  pension: "معاش",
  rental: "إيجارات",
  investment: "استثمارات",
  other: "أخرى",
  athlete: "رياضي",
  student: "طالب",
  teacher: "معلم",
  diplomat: "دبلوماسي",
};

function localise(
  options: { value: string; label: string }[],
  language: "en" | "ar",
): Option[] {
  return options.map((option) => ({
    value: option.value,
    label: language === "ar" ? optionLabelsAr[option.value] || option.label : option.label,
  }));
}

/**
 * Labels of the required answers a step is still missing. The asterisk beside a
 * field is decoration -- these inputs are not inside a <form>, so nothing was
 * stopping a customer skipping a step.
 */
/** Retirees and students have no employer or income proof to give. */
export function isIncomeExempt(employmentStatus: string): boolean {
  return employmentStatus === "retired" || employmentStatus === "student";
}

/** Today as YYYY-MM-DD in local time, comparable with ISO date strings. */
function todayIso(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function missingFields(
  step: StepId,
  form: FormState,
  files: Record<string, File | null>,
  t: AufCopy,
  birthPlace: { statesLoading: boolean; stateCount: number },
): string[] {
  const missing: string[] = [];
  const text = (value: string, label: string) => {
    if (!value.trim()) missing.push(label);
  };
  const number = (value: string, label: string, allowPlus = false) => {
    const pattern = `^${allowPlus ? "\\+?" : ""}\\d{1,${MAX_DIGITS}}$`;
    if (value && !new RegExp(pattern).test(value)) {
      missing.push(`${label} (${t.digitsOnlyMax})`);
    }
  };
  const file = (key: string, label: string) => {
    if (!files[key]) missing.push(label);
  };

  switch (step) {
    case "personal":
      // Locked from SudaPass, so the customer can't correct it here -- but a
      // future date is never valid and shouldn't reach the bank.
      if (form.date_of_birth && form.date_of_birth > todayIso()) {
        missing.push(`${t.date_of_birth} (${t.dateOfBirthFuture})`);
      }
      text(form.name_en_first, t.nameEnFirst);
      text(form.name_en_second, t.nameEnSecond);
      text(form.name_en_third, t.nameEnThird);
      text(form.name_en_fourth, t.nameEnFourth);
      for (const [value, label] of [
        [form.name_en_first, t.nameEnFirst],
        [form.name_en_second, t.nameEnSecond],
        [form.name_en_third, t.nameEnThird],
        [form.name_en_fourth, t.nameEnFourth],
      ] as const) {
        if (value.trim() && new RegExp(LATIN_NAME_DISALLOWED.source).test(value)) {
          missing.push(`${label} (${t.englishLettersOnly})`);
        }
      }
      for (const [value, label] of [
        [form.mother_name_first, t.motherNameFirst],
        [form.mother_name_second, t.motherNameSecond],
        [form.mother_name_third, t.motherNameThird],
        [form.mother_name_fourth, t.motherNameFourth],
      ] as const) {
        if (value.trim() && new RegExp(ARABIC_NAME_DISALLOWED.source).test(value)) {
          missing.push(`${label} (${t.arabicLettersOnly})`);
        }
      }
      text(form.nationality_id, t.nationality_id);
      text(form.mother_name_first, t.motherNameFirst);
      text(form.mother_name_second, t.motherNameSecond);
      text(form.mother_name_third, t.motherNameThird);
      text(form.mother_name_fourth, t.motherNameFourth);
      text(form.birth_country_id, t.birthCountry);
      // Only asked where the chosen country has states in master-data; still
      // counted as missing while that list is loading.
      if (form.birth_country_id && (birthPlace.statesLoading || birthPlace.stateCount > 0)) {
        text(form.birth_state_id, t.birthState);
      }
      file(FILE_ID_DOCUMENT, t.idDocument);
      file(FILE_PERSONAL_PHOTO, t.personalPhoto);
      break;

    case "contact":
      text(form.mobile_personal, t.mobile_personal);
      number(form.mobile_personal, t.mobile_personal, true);
      number(form.mobile_additional, t.mobile_additional, true);
      text(form.city_id, t.city_id);
      text(form.district, t.district);
      text(form.street, t.street);
      text(form.house_no, t.house_no);
      break;

    case "work":
      text(form.primary_income_source, t.primary_income_source);
      text(form.job_title, t.job_title);
      text(form.employment_status, t.workType);
      if (form.employment_status === "self_employed") {
        text(form.employment_type_specify, t.workTypeSpecify);
      }
      if (!isIncomeExempt(form.employment_status)) text(form.employer_name, t.employer_name);
      text(form.monthly_income_amount, t.monthlyIncomeAmount);
      number(form.monthly_income_amount, t.monthlyIncomeAmount);
      if (!isIncomeExempt(form.employment_status)) file(FILE_INCOME_PROOF, t.incomeProof);
      break;

    case "financial":
      if (!form.is_beneficial_owner) {
        text(form.bo_full_name, t.boFullName);
        text(form.bo_relationship, t.boRelationship);
        text(form.bo_id_number, t.boIdNumber);
        text(form.bo_nationality_id, t.boNationality);
        text(form.bo_address, t.boAddress);
      }
      if (form.pep_any) {
        text(form.pep_holder, t.pepHolder);
        if (form.pep_holder === "self" || form.pep_holder === "both") {
          text(form.pep_position, t.pepPosition);
        }
        if (form.pep_holder === "relative" || form.pep_holder === "both") {
          text(form.pep_relative_details, t.pepRelativeDetails);
        }
      }
      if (form.fatca_other_citizenship) {
        text(form.fatca_other_citizenship_specify, t.fatca_other_citizenship_specify);
      }
      if (form.fatca_us_stay_183days) {
        text(form.fatca_stay_reason, t.fatca_stay_reason);
        if (form.fatca_stay_reason === "other") {
          text(form.fatca_stay_reason_specify, t.fatca_stay_reason_specify);
        }
      }
      text(form.account_purpose, t.accountPurpose);
      text(form.expected_txn_monthly_value, t.expectedTxnValue);
      text(form.expected_txn_monthly_count, t.expectedTxnCount);
      number(form.expected_txn_monthly_value, t.expectedTxnValue);
      number(form.expected_txn_monthly_count, t.expectedTxnCount);
      file(FILE_SIGNATURE, t.signature);
      if (!form.declaration_accepted) missing.push(t.declaration_accepted);
      break;
  }

  return missing;
}

export function StepContent({ step, ...props }: Props & { step: StepId }) {
  switch (step) {
    case "personal":
      return <PersonalStep {...props} />;
    case "contact":
      return <ContactStep {...props} />;
    case "work":
      return <WorkStep {...props} />;
    case "financial":
      return <FinancialStep {...props} />;
  }
}

/** Step 2 of the guide: basic customer data. */
function PersonalStep({
  t,
  language,
  locked,
  form,
  setField,
  setForm,
  countryOptions,
  files,
  setFile,
  birthStates,
  birthStatesLoading,
}: Props) {
  const note = language === "ar" ? "من سوداباس" : "From SudaPass";
  const empty = language === "ar" ? "غير متوفر" : "Not provided";
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
  };

  return (
    <>
      <FieldGrid>
        <TextInput
          label={t.nameEnFirst}
          value={form.name_en_first}
          required
          latinOnly
          dir="ltr"
          hint={t.englishLettersOnly}
          onChange={(value) => setField("name_en_first", value)}
        />
        <TextInput
          label={t.nameEnSecond}
          value={form.name_en_second}
          required
          latinOnly
          dir="ltr"
          hint={t.englishLettersOnly}
          onChange={(value) => setField("name_en_second", value)}
        />
        <TextInput
          label={t.nameEnThird}
          value={form.name_en_third}
          required
          latinOnly
          dir="ltr"
          hint={t.englishLettersOnly}
          onChange={(value) => setField("name_en_third", value)}
        />
        <TextInput
          label={t.nameEnFourth}
          value={form.name_en_fourth}
          required
          latinOnly
          dir="ltr"
          hint={t.englishLettersOnly}
          onChange={(value) => setField("name_en_fourth", value)}
        />
      </FieldGrid>

      <FieldGrid>
        <TextInput
          label={t.motherNameFirst}
          value={form.mother_name_first}
          required
          arabicOnly
          hint={t.arabicLettersOnly}
          onChange={(value) => setField("mother_name_first", value)}
        />
        <TextInput
          label={t.motherNameSecond}
          value={form.mother_name_second}
          required
          arabicOnly
          hint={t.arabicLettersOnly}
          onChange={(value) => setField("mother_name_second", value)}
        />
        <TextInput
          label={t.motherNameThird}
          value={form.mother_name_third}
          required
          arabicOnly
          hint={t.arabicLettersOnly}
          onChange={(value) => setField("mother_name_third", value)}
        />
        <TextInput
          label={t.motherNameFourth}
          value={form.mother_name_fourth}
          required
          arabicOnly
          hint={t.arabicLettersOnly}
          onChange={(value) => setField("mother_name_fourth", value)}
        />
      </FieldGrid>

      <FieldGrid>

        {/* Resolved from the SudaPass nationality code; only asked for when
            that code could not be matched to a country. */}
        {locked.nationality && form.nationality_id ? (
          <ReadOnlyField
            label={t.nationality_id}
            value={formatNationality(locked.nationality, language)}
            emptyText={empty}
            sourceNote={note}
          />
        ) : (
          <SelectInput
            label={t.nationality_id}
            value={form.nationality_id}
            options={countryOptions}
            placeholder={t.selectPlaceholder}
            required
            onChange={(value) => setField("nationality_id", value)}
          />
        )}
        <ReadOnlyField
          label={t.date_of_birth}
          value={form.date_of_birth}
          emptyText={empty}
          sourceNote={note}
        />

        <SelectInput
          label={t.birthCountry}
          value={form.birth_country_id}
          options={countryOptions}
          placeholder={t.selectPlaceholder}
          required
          // A new country makes the previous state meaningless.
          onChange={(value) =>
            setForm((previous) => ({ ...previous, birth_country_id: value, birth_state_id: "" }))
          }
        />
        <SelectInput
          label={t.birthState}
          value={form.birth_state_id}
          options={birthStates}
          placeholder={
            !form.birth_country_id
              ? t.birthStateChooseCountry
              : birthStatesLoading
                ? t.loading
                : birthStates.length === 0
                  ? t.birthStateNone
                  : t.selectPlaceholder
          }
          required={birthStatesLoading || birthStates.length > 0}
          disabled={!form.birth_country_id || birthStatesLoading || birthStates.length === 0}
          onChange={(value) => setField("birth_state_id", value)}
        />
      </FieldGrid>

      <FieldGrid>
        <FileInput
          label={t.idDocument}
          required
          file={files[FILE_ID_DOCUMENT] ?? null}
          onChange={(file) => setFile(FILE_ID_DOCUMENT, file)}
          {...fileLabels}
        />
        <FileInput
          label={t.personalPhoto}
          required
          file={files[FILE_PERSONAL_PHOTO] ?? null}
          onChange={(file) => setFile(FILE_PERSONAL_PHOTO, file)}
          {...fileLabels}
        />
      </FieldGrid>
    </>
  );
}

/** Step 3 of the guide: contact details and current address. */
function ContactStep({ t, form, setField }: Props) {
  return (
    <FieldGrid>
      <TextInput
        label={t.mobile_personal}
        value={form.mobile_personal}
        required
        digitsOnly
        allowPlus
        inputMode="tel"
        onChange={(value) => setField("mobile_personal", value)}
      />
      <TextInput
        label={t.mobile_additional}
        value={form.mobile_additional}
        digitsOnly
        allowPlus
        inputMode="tel"
        onChange={(value) => setField("mobile_additional", value)}
      />
      <TextInput
        label={t.email}
        value={form.email}
        type="email"
        onChange={(value) => setField("email", value)}
      />

      <TextInput
        label={t.city_id}
        value={form.city_id}
        required
        onChange={(value) => setField("city_id", value)}
      />
      <TextInput
        label={t.district}
        value={form.district}
        required
        onChange={(value) => setField("district", value)}
      />
      <TextInput
        label={t.street}
        value={form.street}
        required
        onChange={(value) => setField("street", value)}
      />
      <TextInput
        label={t.house_no}
        value={form.house_no}
        required
        onChange={(value) => setField("house_no", value)}
      />
      <TextInput
        label={t.landmark}
        value={form.area}
        onChange={(value) => setField("area", value)}
      />
    </FieldGrid>
  );
}

/** Step 4 of the guide: work and income. */
function WorkStep({ t, language, form, setField, setForm, files, setFile }: Props) {
  const exempt = isIncomeExempt(form.employment_status);

  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
  };


  return (
    <>
      <FieldGrid>
        <SelectInput
          label={t.primary_income_source}
          value={form.primary_income_source}
          options={localise(optionSets.incomeSourceType, language)}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) => setField("primary_income_source", value)}
        />
        <TextInput
          label={t.job_title}
          value={form.job_title}
          required
          onChange={(value) => setField("job_title", value)}
        />
        <TextInput
          label={t.income_other_sources}
          value={form.income_other_sources}
          onChange={(value) => setField("income_other_sources", value)}
        />

        <SelectInput
          label={t.workType}
          value={form.employment_status}
          options={[
            { value: "salaried", label: t.workTypeEmployee },
            { value: "self_employed", label: t.workTypeSelfEmployed },
            { value: "retired", label: t.workTypeRetired },
            { value: "student", label: t.workTypeStudent },
          ]}
          placeholder={t.selectPlaceholder}
          required
          // Leaving self-employment drops its description, so a stale one
          // isn't sent under a different work type.
          onChange={(value) => {
            setForm((previous) => ({
              ...previous,
              employment_status: value,
              employment_type_specify:
                value === "self_employed" ? previous.employment_type_specify : "",
              // No employer to name, so nothing stale is sent for one.
              employer_name: isIncomeExempt(value) ? "" : previous.employer_name,
            }));
            // An income proof picked earlier would otherwise still upload.
            if (isIncomeExempt(value)) setFile(FILE_INCOME_PROOF, null);
          }}
        />
        {form.employment_status === "self_employed" && (
          <TextInput
            label={t.workTypeSpecify}
            value={form.employment_type_specify}
            required
            onChange={(value) => setField("employment_type_specify", value)}
          />
        )}
        {!exempt && (
          <TextInput
            label={t.employer_name}
            value={form.employer_name}
            required
            onChange={(value) => setField("employer_name", value)}
          />
        )}
        <TextInput
          label={t.monthlyIncomeAmount}
          value={form.monthly_income_amount}
          required
          digitsOnly
          wholeAmount
          hint={t.wholeAmountHint}
          inputMode="numeric"
          onChange={(value) => setField("monthly_income_amount", value)}
        />
      </FieldGrid>

      <FieldGrid>
        <FileInput
          {...fileLabels}
          label={t.incomeProof}
          required={!exempt}
          disabled={exempt}
          hint={exempt ? t.incomeProofExempt : fileLabels.hint}
          file={files[FILE_INCOME_PROOF] ?? null}
          onChange={(file) => setFile(FILE_INCOME_PROOF, file)}
        />
      </FieldGrid>

    </>
  );
}

/** Step 5 of the guide: account purpose, activity and the declaration. */
function FinancialStep({
  t,
  language,
  form,
  setField,
  setForm,
  countryOptions,
  files,
  setFile,
}: Props) {
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
  };

  return (
    <>
      {/* --- Beneficial owner --- */}
      <FormSection title={t.boSection} />
      <FieldGrid wide>
        <YesNo
          label={t.beneficialOwner}
          value={form.is_beneficial_owner}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          // Back to "yes" means there's no separate owner to describe.
          onChange={(value) =>
            setForm((previous) =>
              value
                ? {
                    ...previous,
                    is_beneficial_owner: true,
                    bo_full_name: "",
                    bo_relationship: "",
                    bo_id_number: "",
                    bo_nationality_id: "",
                    bo_address: "",
                  }
                : { ...previous, is_beneficial_owner: false },
            )
          }
        />
      </FieldGrid>

      {!form.is_beneficial_owner && (
        <FieldGrid>
          <TextInput
            label={t.boFullName}
            value={form.bo_full_name}
            required
            onChange={(value) => setField("bo_full_name", value)}
          />
          <TextInput
            label={t.boRelationship}
            value={form.bo_relationship}
            required
            onChange={(value) => setField("bo_relationship", value)}
          />
          <TextInput
            label={t.boIdNumber}
            value={form.bo_id_number}
            required
            dir="ltr"
            onChange={(value) => setField("bo_id_number", value)}
          />
          <SelectInput
            label={t.boNationality}
            value={form.bo_nationality_id}
            options={countryOptions}
            placeholder={t.selectPlaceholder}
            required
            onChange={(value) => setField("bo_nationality_id", value)}
          />
          <TextInput
            label={t.boAddress}
            value={form.bo_address}
            required
            onChange={(value) => setField("bo_address", value)}
          />
        </FieldGrid>
      )}

      {/* --- PEP: one question, then who it applies to --- */}
      <FormSection title={t.pepSection} />
      <FieldGrid wide>
        <YesNo
          label={t.pepCombined}
          value={form.pep_any}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) =>
            setForm((previous) =>
              value
                ? { ...previous, pep_any: true }
                : {
                    ...previous,
                    pep_any: false,
                    pep_holder: "",
                    pep_is_pep: false,
                    pep_relative_pep: false,
                    pep_position: "",
                    pep_relative_details: "",
                  },
            )
          }
        />
      </FieldGrid>

      {form.pep_any && (
        <FieldGrid>
          <SelectInput
            label={t.pepHolder}
            value={form.pep_holder}
            options={[
              { value: "self", label: t.pepHolderSelf },
              { value: "relative", label: t.pepHolderRelative },
              { value: "both", label: t.pepHolderBoth },
            ]}
            placeholder={t.selectPlaceholder}
            required
            // The API's two flags follow the holder; details for whoever no
            // longer applies are dropped so they aren't sent.
            onChange={(value) => {
              const holder = value as FormState["pep_holder"];
              const self = holder === "self" || holder === "both";
              const relative = holder === "relative" || holder === "both";
              setForm((previous) => ({
                ...previous,
                pep_holder: holder,
                pep_is_pep: self,
                pep_relative_pep: relative,
                pep_position: self ? previous.pep_position : "",
                pep_relative_details: relative ? previous.pep_relative_details : "",
              }));
            }}
          />
          {(form.pep_holder === "self" || form.pep_holder === "both") && (
            <TextInput
              label={t.pepPosition}
              value={form.pep_position}
              required
              onChange={(value) => setField("pep_position", value)}
            />
          )}
          {(form.pep_holder === "relative" || form.pep_holder === "both") && (
            <TextInput
              label={t.pepRelativeDetails}
              value={form.pep_relative_details}
              required
              onChange={(value) => setField("pep_relative_details", value)}
            />
          )}
        </FieldGrid>
      )}

      {/* --- FATCA --- */}
      <FormSection title={t.fatcaSection} note={t.fatcaSectionNote} />
      <FieldGrid>
        <YesNo
          label={t.usCitizen}
          value={form.fatca_us_citizen}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_citizen", value)}
        />
        <YesNo
          label={t.fatca_born_usa}
          value={form.fatca_born_usa}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_born_usa", value)}
        />
        <YesNo
          label={t.fatca_dual_citizenship}
          value={form.fatca_dual_citizenship}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_dual_citizenship", value)}
        />
        <YesNo
          label={t.fatca_other_citizenship}
          value={form.fatca_other_citizenship}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              fatca_other_citizenship: value,
              fatca_other_citizenship_specify: value ? previous.fatca_other_citizenship_specify : "",
            }))
          }
        />
        {form.fatca_other_citizenship && (
          <TextInput
            label={t.fatca_other_citizenship_specify}
            value={form.fatca_other_citizenship_specify}
            required
            onChange={(value) => setField("fatca_other_citizenship_specify", value)}
          />
        )}
        <YesNo
          label={t.fatca_us_green_card}
          value={form.fatca_us_green_card}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_green_card", value)}
        />
        <YesNo
          label={t.fatca_us_passport}
          value={form.fatca_us_passport}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_passport", value)}
        />
        <YesNo
          label={t.fatca_us_mailing_address}
          value={form.fatca_us_mailing_address}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_mailing_address", value)}
        />
        <YesNo
          label={t.fatca_us_proxy_authorized}
          value={form.fatca_us_proxy_authorized}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_proxy_authorized", value)}
        />
        <YesNo
          label={t.fatca_us_standing_order_out}
          value={form.fatca_us_standing_order_out}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_standing_order_out", value)}
        />
        <YesNo
          label={t.fatca_us_standing_order_in}
          value={form.fatca_us_standing_order_in}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_standing_order_in", value)}
        />
        <YesNo
          label={t.fatca_us_stay_183days}
          value={form.fatca_us_stay_183days}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              fatca_us_stay_183days: value,
              fatca_stay_reason: value ? previous.fatca_stay_reason : "",
              fatca_stay_reason_specify: value ? previous.fatca_stay_reason_specify : "",
            }))
          }
        />
        {form.fatca_us_stay_183days && (
          <SelectInput
            label={t.fatca_stay_reason}
            value={form.fatca_stay_reason}
            options={localise(optionSets.fatcaStayReason, language)}
            placeholder={t.selectPlaceholder}
            required
            onChange={(value) =>
              setForm((previous) => ({
                ...previous,
                fatca_stay_reason: value,
                fatca_stay_reason_specify: value === "other" ? previous.fatca_stay_reason_specify : "",
              }))
            }
          />
        )}
        {form.fatca_us_stay_183days && form.fatca_stay_reason === "other" && (
          <TextInput
            label={t.fatca_stay_reason_specify}
            value={form.fatca_stay_reason_specify}
            required
            onChange={(value) => setField("fatca_stay_reason_specify", value)}
          />
        )}
      </FieldGrid>

      <FormSection title={t.accountActivitySection} />

      <FieldGrid wide>
        <TextInput
          label={t.accountPurpose}
          value={form.account_purpose}
          required
          onChange={(value) => setField("account_purpose", value)}
        />
      </FieldGrid>

      <CheckboxGrid>
        <CheckboxInput
          label={t.txnSalary}
          checked={form.expected_txn_deposits}
          onChange={(value) => setField("expected_txn_deposits", value)}
        />
        <CheckboxInput
          label={t.txnInward}
          checked={form.expected_txn_inward}
          onChange={(value) => setField("expected_txn_inward", value)}
        />
        <CheckboxInput
          label={t.txnOutward}
          checked={form.expected_txn_outward}
          onChange={(value) => setField("expected_txn_outward", value)}
        />
        <CheckboxInput
          label={t.txnOther}
          checked={form.expected_txn_cheques}
          onChange={(value) => setField("expected_txn_cheques", value)}
        />
      </CheckboxGrid>

      <FieldGrid>
        <TextInput
          label={t.expectedTxnValue}
          value={form.expected_txn_monthly_value}
          required
          digitsOnly
          wholeAmount
          hint={t.wholeAmountHint}
          inputMode="numeric"
          onChange={(value) => setField("expected_txn_monthly_value", value)}
        />
        <TextInput
          label={t.expectedTxnCount}
          value={form.expected_txn_monthly_count}
          required
          digitsOnly
          wholeAmount
          inputMode="numeric"
          onChange={(value) => setField("expected_txn_monthly_count", value)}
        />
      </FieldGrid>

      <FieldGrid>
        <FileInput
          label={t.signature}
          required
          file={files[FILE_SIGNATURE] ?? null}
          onChange={(file) => setFile(FILE_SIGNATURE, file)}
          {...fileLabels}
        />
      </FieldGrid>

      <CheckboxGrid>
        <CheckboxInput
          label={t.declaration_accepted}
          checked={form.declaration_accepted}
          onChange={(value) => setField("declaration_accepted", value)}
        />
      </CheckboxGrid>
    </>
  );
}
