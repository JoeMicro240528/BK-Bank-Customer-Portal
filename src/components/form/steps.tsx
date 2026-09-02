"use client";

import {
  CheckboxGrid,
  CheckboxInput,
  FieldGrid,
  FileInput,
  ReadOnlyField,
  SelectInput,
  TextInput,
  YesNo,
  type Option,
} from "./Fields";
import { optionSets, type FormState } from "@/lib/auf/form";
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
export const certificateKey = (accountNumber: string) => `certificate:${accountNumber}`;

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
function PersonalStep({ t, language, form, setField, countryOptions, files, setFile }: Props) {
  const note = language === "ar" ? "من سوداباس" : "From SudaPass";
  const empty = language === "ar" ? "غير متوفر" : "Not provided";
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
  };

  return (
    <>
      <FieldGrid>
        <TextInput
          label={t.nameEnFirst}
          value={form.name_en_first}
          required
          onChange={(value) => setField("name_en_first", value)}
        />
        <TextInput
          label={t.nameEnSecond}
          value={form.name_en_second}
          required
          onChange={(value) => setField("name_en_second", value)}
        />
        <TextInput
          label={t.nameEnThird}
          value={form.name_en_third}
          required
          onChange={(value) => setField("name_en_third", value)}
        />
        <TextInput
          label={t.nameEnFourth}
          value={form.name_en_fourth}
          required
          onChange={(value) => setField("name_en_fourth", value)}
        />

        <SelectInput
          label={t.nationality_id}
          value={form.nationality_id}
          options={countryOptions}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) => setField("nationality_id", value)}
        />
        <ReadOnlyField
          label={t.date_of_birth}
          value={form.date_of_birth}
          emptyText={empty}
          sourceNote={note}
        />

        <TextInput
          label={t.mother_maiden_name}
          value={form.mother_maiden_name}
          required
          onChange={(value) => setField("mother_maiden_name", value)}
        />
        <TextInput
          label={t.placeOfBirth}
          value={form.place_of_birth}
          required
          onChange={(value) => setField("place_of_birth", value)}
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
        inputMode="tel"
        onChange={(value) => setField("mobile_personal", value)}
      />
      <TextInput
        label={t.mobile_additional}
        value={form.mobile_additional}
        digitsOnly
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

/** Step 4 of the guide: work and income, plus any commercial certificates. */
function WorkStep({ t, language, form, setField, files, setFile }: Props) {
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
  };

  const commercial = form.selected_accounts.filter(
    (account) => account.account_kind === "commercial",
  );

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
          ]}
          placeholder={t.selectPlaceholder}
          required
          onChange={(value) => setField("employment_status", value)}
        />
        <TextInput
          label={t.employer_name}
          value={form.employer_name}
          required
          onChange={(value) => setField("employer_name", value)}
        />
        <TextInput
          label={t.monthlyIncomeAmount}
          value={form.monthly_income_amount}
          required
          digitsOnly
          inputMode="numeric"
          onChange={(value) => setField("monthly_income_amount", value)}
        />
      </FieldGrid>

      <FieldGrid>
        <FileInput
          label={t.incomeProof}
          required
          file={files[FILE_INCOME_PROOF] ?? null}
          onChange={(file) => setFile(FILE_INCOME_PROOF, file)}
          {...fileLabels}
        />
      </FieldGrid>

      {/* One certificate per commercial account, named so it is clear which
          account each belongs to. */}
      {commercial.length > 0 && (
        <FieldGrid>
          {commercial.map((account) => {
            const key = certificateKey(account.account_number);

            return (
              <FileInput
                key={key}
                label={`${t.commercialCertificate} — ${account.account_number}`}
                hint={t.commercialCertificateHint}
                required
                file={files[key] ?? null}
                onChange={(file) => setFile(key, file)}
                {...fileLabels}
              />
            );
          })}
        </FieldGrid>
      )}
    </>
  );
}

/** Step 5 of the guide: account purpose, activity and the declaration. */
function FinancialStep({ t, form, setField, files, setFile }: Props) {
  const fileLabels = {
    chooseLabel: t.chooseFile,
    emptyLabel: t.noFileChosen,
    clearLabel: t.clearFile,
  };

  return (
    <>
      <FieldGrid>
        <YesNo
          label={t.beneficialOwner}
          value={form.is_beneficial_owner}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("is_beneficial_owner", value)}
        />
        <YesNo
          label={t.pep_is_pep}
          value={form.pep_is_pep}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("pep_is_pep", value)}
        />
        <YesNo
          label={t.pep_relative_pep}
          value={form.pep_relative_pep}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("pep_relative_pep", value)}
        />
        <YesNo
          label={t.usCitizen}
          value={form.fatca_us_citizen}
          yesLabel={t.yes}
          noLabel={t.no}
          required
          onChange={(value) => setField("fatca_us_citizen", value)}
        />
      </FieldGrid>

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
          inputMode="numeric"
          onChange={(value) => setField("expected_txn_monthly_value", value)}
        />
        <TextInput
          label={t.expectedTxnCount}
          value={form.expected_txn_monthly_count}
          required
          digitsOnly
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
