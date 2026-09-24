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
import type { ExistingUpload } from "@/lib/auf/draft";
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

import {
  FILE_ID_DOCUMENT,
  FILE_INCOME_PROOF,
  FILE_PERSONAL_PHOTO,
  FILE_SIGNATURE,
} from "@/lib/auf/files";

export { FILE_ID_DOCUMENT, FILE_INCOME_PROOF, FILE_PERSONAL_PHOTO, FILE_SIGNATURE };

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
  /**
   * Profession and income-source options from master-data. The API takes
   * these as ids now, so they cannot be listed in the portal.
   */
  jobTitles: Option[];
  primaryIncomeSources: Option[];
  otherIncomeSources: Option[];
  /** Option id -> master-data code, which decides which detail box is shown. */
  jobTitleCodes: Record<string, string>;
  primaryIncomeCodes: Record<string, string>;
  otherIncomeCodes: Record<string, string>;
  /** Address cascade: states of the country of residence, then its cities. */
  residenceStates: Option[];
  residenceStatesLoading: boolean;
  residenceCities: Option[];
  residenceCitiesLoading: boolean;
  /** Attachments the saved request already holds, keyed like `files`. */
  uploads: Record<string, ExistingUpload>;
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
/**
 * Spouse questions follow the bank's rule: a married man is asked how many
 * wives and then that many names; a married woman is asked her husband's name;
 * anyone else is asked nothing and has the answers cleared.
 */
export function spouseFields(form: { gender: string; marital_status: string; wives_count: string }) {
  const married = form.marital_status === "married";
  const male = form.gender === "male";
  const count = Number.parseInt(form.wives_count || "0", 10) || 0;

  return {
    married,
    showWivesCount: married && male,
    // A woman gives one name -- her husband's -- under the same field.
    showSpouseName: married,
    wivesShown: married && male ? Math.min(Math.max(count, 0), 4) : 0,
  };
}

/** Income sources that leave the bank asking what the work actually is. */
const NEEDS_PRIMARY_INCOME_DETAILS = new Set(["self_employed", "other"]);

/** Job titles that do the same: business owner, freelance, other. */
const NEEDS_JOB_TITLE_DETAILS = new Set(["BIZ", "FREE", "OTH"]);

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
  residence: { stateCount: number; cityCount: number },
  uploads: Record<string, ExistingUpload> = {},
  /** Master-data codes, so a required detail box is judged by code, not label. */
  codes: {
    jobTitle?: Record<string, string>;
    primaryIncome?: Record<string, string>;
    otherIncome?: Record<string, string>;
  } = {},
): string[] {
  const missing: string[] = [];
  const spouseRules = spouseFields(form);
  const text = (value: string, label: string) => {
    if (!value.trim()) missing.push(label);
  };
  /**
   * A field the API takes as a master-data id. A draft saved while these were
   * free text still holds a word like "engineer", which would pass the plain
   * text check and then be dropped on save -- so only an id counts as answered.
   */
  const lookup = (value: string, label: string) => {
    if (!/^\d+$/.test(value.trim())) missing.push(label);
  };
  /**
   * An amount or count the backend only accepts above zero. "0" passes the
   * digits check, so without this it would clear the step and then be
   * rejected at submit, far from the field.
   */
  const positive = (value: string, label: string) => {
    if (value.trim() && !(Number(value) > 0) && !missing.includes(label)) missing.push(label);
  };
  const number = (value: string, label: string, allowPlus = false) => {
    const pattern = `^${allowPlus ? "\\+?" : ""}\\d{1,${MAX_DIGITS}}$`;
    if (value && !new RegExp(pattern).test(value)) {
      missing.push(`${label} (${t.digitsOnlyMax})`);
    }
  };
  // A resumed draft cannot refill its file inputs, so an attachment the
  // server already holds satisfies the check as well as a newly picked one.
  const file = (key: string, label: string) => {
    if (!files[key] && !uploads[key]) missing.push(label);
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
      text(form.marital_status, t.marital_status);
      if (spouseRules.showSpouseName) {
        text(form.spouse_name, spouseRules.showWivesCount ? t.wife1Name : t.husbandName);
      }
      if (spouseRules.showWivesCount) text(form.wives_count, t.wivesCount);
      if (spouseRules.wivesShown >= 2) text(form.wife_2_name, t.wife2Name);
      if (spouseRules.wivesShown >= 3) text(form.wife_3_name, t.wife3Name);
      if (spouseRules.wivesShown >= 4) text(form.wife_4_name, t.wife4Name);
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
      lookup(form.res_country_id, t.res_country_id);
      // A country with no states in master-data cannot have one chosen, so it
      // is only required where there is something to choose.
      if (residence.stateCount > 0) lookup(form.res_country_state_id, t.res_country_state_id);
      if (residence.cityCount > 0) lookup(form.city_id, t.city_id);
      text(form.district, t.district);
      text(form.street, t.street);
      text(form.house_no, t.house_no);
      break;

    case "work":
      lookup(form.primary_income_source, t.primary_income_source);
      lookup(form.job_title, t.job_title);
      // Shown only for the catch-all options, and required wherever shown.
      if (
        NEEDS_PRIMARY_INCOME_DETAILS.has(
          codes.primaryIncome?.[form.primary_income_source] ?? "",
        )
      ) {
        text(form.primary_income_details, t.primary_income_details);
      }
      if (NEEDS_JOB_TITLE_DETAILS.has(codes.jobTitle?.[form.job_title] ?? "")) {
        text(form.job_title_details, t.job_title_details);
      }
      if ((codes.otherIncome?.[form.income_other_sources] ?? "") === "other") {
        text(form.other_income_details, t.other_income_details);
      }
      text(form.employment_status, t.workType);
      if (form.employment_status === "self_employed") {
        text(form.employment_type_specify, t.workTypeSpecify);
      }
      if (!isIncomeExempt(form.employment_status)) text(form.employer_name, t.employer_name);
      text(form.monthly_income_amount, t.monthlyIncomeAmount);
      number(form.monthly_income_amount, t.monthlyIncomeAmount);
      positive(form.monthly_income_amount, t.monthlyIncomeAmount);
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
          text(form.pep_work_period, t.pepWorkPeriod);
        }
        if (form.pep_holder === "relative" || form.pep_holder === "both") {
          text(form.pep_relative_details, t.pepRelativeName);
          text(form.pep_relative_degree, t.pepRelativeDegree);
          text(form.pep_relative_position, t.pepRelativePosition);
          text(form.pep_relative_work_period, t.pepRelativeWorkPeriod);
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
      positive(form.expected_txn_monthly_value, t.expectedTxnValue);
      positive(form.expected_txn_monthly_count, t.expectedTxnCount);
      file(FILE_SIGNATURE, t.signature);
      // The transaction types are optional: the backend disabled its
      // "at least one" rule on submit (bank_customer_info.py), so requiring
      // one here would block requests the bank accepts.
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
  uploads,
}: Props) {
  const spouse = spouseFields(form);

  const note = language === "ar" ? "من سوداباس" : "From SudaPass";
  const empty = language === "ar" ? "غير متوفر" : "Not provided";
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
    uploadedLabel: t.alreadyUploaded,
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
        <SelectInput
          label={t.marital_status}
          value={form.marital_status}
          options={[
            { value: "single", label: t.maritalSingle },
            { value: "married", label: t.maritalMarried },
            { value: "divorced", label: t.maritalDivorced },
            { value: "widowed", label: t.maritalWidowed },
          ]}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              marital_status: value,
              // Anything asked of a married customer goes when they are not.
              ...(value === "married"
                ? {}
                : { wives_count: "", spouse_name: "", wife_2_name: "", wife_3_name: "", wife_4_name: "" }),
            }))
          }
        />

        {spouse.showWivesCount && (
          <SelectInput
            label={t.wivesCount}
            value={form.wives_count}
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
            ]}
            placeholder={t.selectPlaceholder}
            required
            onChange={(value) =>
              setForm((previous) => {
                const count = Number.parseInt(value || "0", 10) || 0;

                // Fewer wives than before: the names beyond the new count were
                // answered about marriages the form no longer asks about.
                return {
                  ...previous,
                  wives_count: value,
                  wife_2_name: count >= 2 ? previous.wife_2_name : "",
                  wife_3_name: count >= 3 ? previous.wife_3_name : "",
                  wife_4_name: count >= 4 ? previous.wife_4_name : "",
                };
              })
            }
          />
        )}

        {spouse.showSpouseName && (
          <TextInput
            label={spouse.showWivesCount ? t.wife1Name : t.husbandName}
            value={form.spouse_name}
            required
            arabicOnly
            hint={t.arabicLettersOnly}
            onChange={(value) => setField("spouse_name", value)}
          />
        )}

        {spouse.wivesShown >= 2 && (
          <TextInput
            label={t.wife2Name}
            value={form.wife_2_name}
            required
            arabicOnly
            hint={t.arabicLettersOnly}
            onChange={(value) => setField("wife_2_name", value)}
          />
        )}
        {spouse.wivesShown >= 3 && (
          <TextInput
            label={t.wife3Name}
            value={form.wife_3_name}
            required
            arabicOnly
            hint={t.arabicLettersOnly}
            onChange={(value) => setField("wife_3_name", value)}
          />
        )}
        {spouse.wivesShown >= 4 && (
          <TextInput
            label={t.wife4Name}
            value={form.wife_4_name}
            required
            arabicOnly
            hint={t.arabicLettersOnly}
            onChange={(value) => setField("wife_4_name", value)}
          />
        )}
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
          uploaded={uploads[FILE_ID_DOCUMENT]}
          onChange={(file) => setFile(FILE_ID_DOCUMENT, file)}
          {...fileLabels}
        />
        <FileInput
          label={t.personalPhoto}
          required
          file={files[FILE_PERSONAL_PHOTO] ?? null}
          uploaded={uploads[FILE_PERSONAL_PHOTO]}
          onChange={(file) => setFile(FILE_PERSONAL_PHOTO, file)}
          {...fileLabels}
        />
      </FieldGrid>
    </>
  );
}

/** Step 3 of the guide: contact details and current address. */
function ContactStep({
  t,
  form,
  setField,
  setForm,
  countryOptions,
  residenceStates,
  residenceStatesLoading,
  residenceCities,
  residenceCitiesLoading,
}: Props) {
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

      <SelectInput
        label={t.res_country_id}
        value={form.res_country_id}
        options={countryOptions}
        placeholder={t.selectPlaceholder}
        required
        // A new country invalidates the state and the city under it, so they
        // are cleared rather than left pointing at the previous country.
        onChange={(value) =>
          setForm((previous) => ({
            ...previous,
            res_country_id: value,
            res_country_state_id: "",
            city_id: "",
          }))
        }
      />
      <SelectInput
        label={t.res_country_state_id}
        value={form.res_country_state_id}
        options={residenceStates}
        placeholder={residenceStatesLoading ? t.loading : t.selectPlaceholder}
        disabled={!form.res_country_id || residenceStatesLoading}
        required={residenceStates.length > 0}
        onChange={(value) =>
          setForm((previous) => ({ ...previous, res_country_state_id: value, city_id: "" }))
        }
      />
      <SelectInput
        label={t.city_id}
        value={form.city_id}
        options={residenceCities}
        placeholder={residenceCitiesLoading ? t.loading : t.selectPlaceholder}
        disabled={!form.res_country_state_id || residenceCitiesLoading}
        required={residenceCities.length > 0}
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
function WorkStep({
  t,
  form,
  setField,
  setForm,
  files,
  setFile,
  jobTitles,
  primaryIncomeSources,
  otherIncomeSources,
  jobTitleCodes,
  primaryIncomeCodes,
  otherIncomeCodes,
  uploads,
}: Props) {
  const exempt = isIncomeExempt(form.employment_status);

  // The bank asks what the work or the income actually is whenever the chosen
  // option is a catch-all. Which options those are is decided by the
  // master-data code, so a renamed or translated label cannot break it.
  const needsPrimaryIncomeDetails = NEEDS_PRIMARY_INCOME_DETAILS.has(
    primaryIncomeCodes[form.primary_income_source] ?? "",
  );
  const needsOtherIncomeDetails =
    (otherIncomeCodes[form.income_other_sources] ?? "") === "other";
  const needsJobTitleDetails = NEEDS_JOB_TITLE_DETAILS.has(
    jobTitleCodes[form.job_title] ?? "",
  );

  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
    uploadedLabel: t.alreadyUploaded,
  };


  return (
    <>
      <FieldGrid>
        <SelectInput
          label={t.primary_income_source}
          value={form.primary_income_source}
          options={primaryIncomeSources}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              primary_income_source: value,
              // Answered about the old source, so it must not survive a change.
              primary_income_details: NEEDS_PRIMARY_INCOME_DETAILS.has(
                primaryIncomeCodes[value] ?? "",
              )
                ? previous.primary_income_details
                : "",
            }))
          }
        />
        {needsPrimaryIncomeDetails && (
          <TextInput
            label={t.primary_income_details}
            value={form.primary_income_details}
            hint={t.primary_income_detailsHint}
            required
            onChange={(value) => setField("primary_income_details", value)}
          />
        )}
        <SelectInput
          label={t.job_title}
          value={form.job_title}
          options={jobTitles}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              job_title: value,
              job_title_details: NEEDS_JOB_TITLE_DETAILS.has(jobTitleCodes[value] ?? "")
                ? previous.job_title_details
                : "",
            }))
          }
        />
        {needsJobTitleDetails && (
          <TextInput
            label={t.job_title_details}
            value={form.job_title_details}
            hint={t.job_title_detailsHint}
            required
            onChange={(value) => setField("job_title_details", value)}
          />
        )}
        <SelectInput
          label={t.income_other_sources}
          value={form.income_other_sources}
          options={otherIncomeSources}
          placeholder={t.selectPlaceholder}
          onChange={(value) =>
            setForm((previous) => ({
              ...previous,
              income_other_sources: value,
              other_income_details:
                (otherIncomeCodes[value] ?? "") === "other" ? previous.other_income_details : "",
            }))
          }
        />
        {needsOtherIncomeDetails && (
          <TextInput
            label={t.other_income_details}
            value={form.other_income_details}
            hint={t.other_income_detailsHint}
            required
            onChange={(value) => setField("other_income_details", value)}
          />
        )}

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
          uploaded={uploads[FILE_INCOME_PROOF]}
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
  uploads,
}: Props) {
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
    hint: t.fileSizeHint,
    uploadedLabel: t.alreadyUploaded,
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
                    bo_nationality_name: "",
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
            onChange={(value) =>
              setForm((previous) => ({
                ...previous,
                bo_nationality_id: value,
                bo_nationality_name:
                  countryOptions.find((option) => option.value === value)?.label ?? "",
              }))
            }
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
                    pep_work_period: "",
                    pep_relative_details: "",
                    pep_relative_degree: "",
                    pep_relative_position: "",
                    pep_relative_work_period: "",
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
                pep_work_period: self ? previous.pep_work_period : "",
                pep_relative_details: relative ? previous.pep_relative_details : "",
                pep_relative_degree: relative ? previous.pep_relative_degree : "",
                pep_relative_position: relative ? previous.pep_relative_position : "",
                pep_relative_work_period: relative ? previous.pep_relative_work_period : "",
              }));
            }}
          />
          {(form.pep_holder === "self" || form.pep_holder === "both") && (
            <>
              <TextInput
                label={t.pepPosition}
                value={form.pep_position}
                required
                onChange={(value) => setField("pep_position", value)}
              />
              <TextInput
                label={t.pepWorkPeriod}
                value={form.pep_work_period}
                hint={t.pepPeriodHint}
                required
                onChange={(value) => setField("pep_work_period", value)}
              />
            </>
          )}
          {(form.pep_holder === "relative" || form.pep_holder === "both") && (
            <>
              <TextInput
                label={t.pepRelativeName}
                value={form.pep_relative_details}
                required
                onChange={(value) => setField("pep_relative_details", value)}
              />
              <TextInput
                label={t.pepRelativeDegree}
                value={form.pep_relative_degree}
                hint={t.pepRelativeDegreeHint}
                required
                onChange={(value) => setField("pep_relative_degree", value)}
              />
              <TextInput
                label={t.pepRelativePosition}
                value={form.pep_relative_position}
                required
                onChange={(value) => setField("pep_relative_position", value)}
              />
              <TextInput
                label={t.pepRelativeWorkPeriod}
                value={form.pep_relative_work_period}
                hint={t.pepPeriodHint}
                required
                onChange={(value) => setField("pep_relative_work_period", value)}
              />
            </>
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
          checked={form.expected_txn_salary}
          onChange={(value) => setField("expected_txn_salary", value)}
        />
        <CheckboxInput
          label={t.txnSaving}
          checked={form.expected_txn_savings}
          onChange={(value) => setField("expected_txn_savings", value)}
        />
        <CheckboxInput
          label={t.txnInvestment}
          checked={form.expected_txn_investment}
          onChange={(value) => setField("expected_txn_investment", value)}
        />
        <CheckboxInput
          label={t.txnInternationalTransfers}
          checked={form.expected_txn_international_transfers}
          onChange={(value) => setField("expected_txn_international_transfers", value)}
        />
        <CheckboxInput
          label={t.txnDomesticTransfers}
          checked={form.expected_txn_domestic_transfers}
          onChange={(value) => setField("expected_txn_domestic_transfers", value)}
        />
        <CheckboxInput
          label={t.txnOther}
          checked={form.expected_txn_other}
          onChange={(value) => setField("expected_txn_other", value)}
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
          uploaded={uploads[FILE_SIGNATURE]}
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
