"use client";

import {
  AddButton,
  CheckboxGrid,
  CheckboxInput,
  FieldGrid,
  RepeatedGroup,
  ReadOnlyField,
  SelectInput,
  TextInput,
  type Option,
} from "./Fields";
import {
  emptyIdentityLine,
  emptyIncomeSourceLine,
  emptyMinorLine,
  optionSets,
  type FormState,
} from "@/lib/auf/form";
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

export type StepId =
  | "applicant"
  | "identity"
  | "residence"
  | "work"
  | "income"
  | "compliance"
  | "minors";

export const stepOrder: StepId[] = [
  "applicant",
  "identity",
  "residence",
  "work",
  "income",
  "compliance",
  "minors",
];

type Props = {
  t: AufCopy;
  language: "en" | "ar";
  /** Values SudaPass owns, shown read-only. */
  locked: LockedValues;
  form: FormState;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  setForm: (updater: (previous: FormState) => FormState) => void;
  countryOptions: Option[];
};

/**
 * Option lists carry English labels from the API contract. Arabic wording lives
 * here because the shared copy file only covers field labels, not option values.
 */
const optionLabelsAr: Record<string, string> = {
  male: "ذكر", female: "أنثى",
  single: "أعزب", married: "متزوج", divorced: "مطلق", widowed: "أرمل", other: "أخرى",
  elementary: "ابتدائي", secondary: "ثانوي", diploma: "دبلوم", graduate: "جامعي",
  post_graduate: "دراسات عليا",
  national_id: "الرقم الوطني", passport: "جواز سفر", birth_cert: "شهادة ميلاد",
  government: "حكومي", private: "خاص",
  self_employed: "أعمال حرة", salaried: "موظف", student: "طالب", retired: "متقاعد",
  housewife: "ربة منزل",
  salary: "راتب", business: "أعمال", pension: "معاش", rental: "إيجارات",
  investment: "استثمارات",
  athlete: "رياضي", teacher: "معلم", diplomat: "دبلوماسي",
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
    case "applicant":
      return <ApplicantStep {...props} />;
    case "identity":
      return <IdentityStep {...props} />;
    case "residence":
      return <ResidenceStep {...props} />;
    case "work":
      return <WorkStep {...props} />;
    case "income":
      return <IncomeStep {...props} />;
    case "compliance":
      return <ComplianceStep {...props} />;
    case "minors":
      return <MinorsStep {...props} />;
  }
}

function ApplicantStep({ t, language, locked, form, setField, countryOptions }: Props) {
  const note = language === "ar" ? "من سوداباس" : "From SudaPass";
  const empty = language === "ar" ? "غير متوفر" : "Not provided";

  return (
    <FieldGrid>
      <ReadOnlyField label={t.name_arabic} value={form.name_arabic} emptyText={empty} sourceNote={note} />
      <ReadOnlyField label={t.name_english} value={form.name_english} emptyText={empty} sourceNote={note} />
      <ReadOnlyField
        label={t.date_of_birth}
        value={locked.birthDate || form.date_of_birth}
        emptyText={empty}
        sourceNote={note}
      />
      <ReadOnlyField
        label={t.gender}
        value={
          form.gender
            ? localise(optionSets.gender, language).find((o) => o.value === form.gender)?.label ||
              form.gender
            : ""
        }
        emptyText={empty}
        sourceNote={note}
      />

      <TextInput label={t.mother_maiden_name} value={form.mother_maiden_name} onChange={(v) => setField("mother_maiden_name", v)} />
      <SelectInput label={t.birth_country_id} value={form.birth_country_id} onChange={(v) => setField("birth_country_id", v)} options={countryOptions} placeholder={t.selectPlaceholder} />
      <SelectInput label={t.nationality_id} value={form.nationality_id} onChange={(v) => setField("nationality_id", v)} options={countryOptions} placeholder={t.selectPlaceholder} />
      <SelectInput label={t.marital_status} value={form.marital_status} onChange={(v) => setField("marital_status", v)} options={localise(optionSets.maritalStatus, language)} placeholder={t.selectPlaceholder} />
      <TextInput label={t.spouse_name} value={form.spouse_name} onChange={(v) => setField("spouse_name", v)} />
      <TextInput label={t.mobile_personal} value={form.mobile_personal} onChange={(v) => setField("mobile_personal", v)} inputMode="tel" />
      <TextInput label={t.mobile_additional} value={form.mobile_additional} onChange={(v) => setField("mobile_additional", v)} inputMode="tel" />
      <TextInput label={t.email} type="email" value={form.email} onChange={(v) => setField("email", v)} />
      <SelectInput label={t.education_level} value={form.education_level} onChange={(v) => setField("education_level", v)} options={localise(optionSets.educationLevel, language)} placeholder={t.selectPlaceholder} />
      <TextInput label={t.education_other} value={form.education_other} onChange={(v) => setField("education_other", v)} />
    </FieldGrid>
  );
}

function IdentityStep({ t, language, locked, form, setForm, countryOptions }: Props) {
  const update = (index: number, patch: Partial<FormState["identity_lines"][number]>) =>
    setForm((previous) => ({
      ...previous,
      identity_lines: previous.identity_lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    }));

  return (
    <>
      {form.identity_lines.map((line, index) => (
        <RepeatedGroup
          key={index}
          title={`${t.id_type} ${index + 1}`}
          removeLabel={t.remove}
          canRemove={form.identity_lines.length > 1}
          onRemove={() =>
            setForm((p) => ({ ...p, identity_lines: p.identity_lines.filter((_, i) => i !== index) }))
          }
        >
          <FieldGrid>
            {line.is_primary && locked.nationalId ? (
              <>
                <ReadOnlyField
                  label={t.id_type}
                  value={localise(optionSets.identityType, language).find((o) => o.value === line.id_type)?.label || line.id_type}
                  emptyText={language === "ar" ? "غير متوفر" : "Not provided"}
                  sourceNote={language === "ar" ? "من سوداباس" : "From SudaPass"}
                />
                <ReadOnlyField
                  label={t.id_number}
                  value={line.id_number}
                  emptyText={language === "ar" ? "غير متوفر" : "Not provided"}
                  sourceNote={language === "ar" ? "من سوداباس" : "From SudaPass"}
                />
              </>
            ) : (
              <>
                <SelectInput label={t.id_type} value={line.id_type} onChange={(v) => update(index, { id_type: v })} options={localise(optionSets.identityType, language)} placeholder={t.selectPlaceholder} required />
                <TextInput label={t.id_number} value={line.id_number} onChange={(v) => update(index, { id_number: v })} required />
              </>
            )}
            <TextInput label={t.id_type_other} value={line.id_type_other} onChange={(v) => update(index, { id_type_other: v })} />
            <TextInput label={t.issuance_date} type="date" value={line.issuance_date} onChange={(v) => update(index, { issuance_date: v })} />
            <TextInput label={t.expiry_date} type="date" value={line.expiry_date} onChange={(v) => update(index, { expiry_date: v })} />
            <SelectInput label={t.nationality_id} value={line.nationality_id} onChange={(v) => update(index, { nationality_id: v })} options={countryOptions} placeholder={t.selectPlaceholder} />
          </FieldGrid>
          <div style={{ marginTop: 12 }}>
            <CheckboxInput label={t.is_primary} checked={line.is_primary} onChange={(v) => update(index, { is_primary: v })} />
          </div>
        </RepeatedGroup>
      ))}
      <AddButton
        label={t.addIdentity}
        onClick={() => setForm((p) => ({ ...p, identity_lines: [...p.identity_lines, emptyIdentityLine()] }))}
      />
    </>
  );
}

function ResidenceStep({ t, form, setField }: Props) {
  return (
    <FieldGrid>
      <TextInput label={t.area} value={form.area} onChange={(v) => setField("area", v)} />
      <TextInput label={t.district} value={form.district} onChange={(v) => setField("district", v)} />
      <TextInput label={t.street} value={form.street} onChange={(v) => setField("street", v)} />
      <TextInput label={t.block} value={form.block} onChange={(v) => setField("block", v)} />
      <TextInput label={t.house_no} value={form.house_no} onChange={(v) => setField("house_no", v)} />
      <TextInput label={t.sponsor_name} value={form.sponsor_name} onChange={(v) => setField("sponsor_name", v)} />
      <TextInput label={t.sponsor_business_sector} value={form.sponsor_business_sector} onChange={(v) => setField("sponsor_business_sector", v)} />
    </FieldGrid>
  );
}

function WorkStep({ t, language, form, setField }: Props) {
  return (
    <FieldGrid>
      <SelectInput label={t.business_sector} value={form.business_sector} onChange={(v) => setField("business_sector", v)} options={localise(optionSets.businessSector, language)} placeholder={t.selectPlaceholder} />
      <TextInput label={t.business_sector_other} value={form.business_sector_other} onChange={(v) => setField("business_sector_other", v)} />
      <SelectInput label={t.employment_status} value={form.employment_status} onChange={(v) => setField("employment_status", v)} options={localise(optionSets.employmentStatus, language)} placeholder={t.selectPlaceholder} />
      <TextInput label={t.employment_type_specify} value={form.employment_type_specify} onChange={(v) => setField("employment_type_specify", v)} />
      <TextInput label={t.employer_name} value={form.employer_name} onChange={(v) => setField("employer_name", v)} />
      <TextInput label={t.employer_activity} value={form.employer_activity} onChange={(v) => setField("employer_activity", v)} />
      <TextInput label={t.employer_address} value={form.employer_address} onChange={(v) => setField("employer_address", v)} />
      <TextInput label={t.job_title} value={form.job_title} onChange={(v) => setField("job_title", v)} />
      <TextInput label={t.employment_date} type="date" value={form.employment_date} onChange={(v) => setField("employment_date", v)} />
    </FieldGrid>
  );
}

function IncomeStep({ t, language, form, setField, setForm }: Props) {
  const update = (index: number, patch: Partial<FormState["income_source_lines"][number]>) =>
    setForm((previous) => ({
      ...previous,
      income_source_lines: previous.income_source_lines.map((line, i) =>
        i === index ? { ...line, ...patch } : line,
      ),
    }));

  return (
    <>
      <FieldGrid>
        <SelectInput label={t.primary_income_source} value={form.primary_income_source} onChange={(v) => setField("primary_income_source", v)} options={localise(optionSets.primaryIncomeSource, language)} placeholder={t.selectPlaceholder} />
        <TextInput label={t.primary_income_other} value={form.primary_income_other} onChange={(v) => setField("primary_income_other", v)} />
        <TextInput label={t.income_other_sources} value={form.income_other_sources} onChange={(v) => setField("income_other_sources", v)} />
        <SelectInput label={t.monthly_income_range} value={form.monthly_income_range} onChange={(v) => setField("monthly_income_range", v)} options={optionSets.monthlyIncomeRange} placeholder={t.selectPlaceholder} />
        <SelectInput label={t.annual_income_range} value={form.annual_income_range} onChange={(v) => setField("annual_income_range", v)} options={optionSets.annualIncomeRange} placeholder={t.selectPlaceholder} />
        <TextInput label={t.annual_income_amount} value={form.annual_income_amount} onChange={(v) => setField("annual_income_amount", v)} inputMode="decimal" />
        <TextInput label={t.source_funds_open_account} value={form.source_funds_open_account} onChange={(v) => setField("source_funds_open_account", v)} />
        <TextInput label={t.source_funds_fund_account} value={form.source_funds_fund_account} onChange={(v) => setField("source_funds_fund_account", v)} />
      </FieldGrid>

      <h4 style={{ margin: "18px 0 10px", fontSize: 14 }}>{t.expectedTransactions}</h4>
      <CheckboxGrid>
        <CheckboxInput label={t.expected_txn_deposits} checked={form.expected_txn_deposits} onChange={(v) => setField("expected_txn_deposits", v)} />
        <CheckboxInput label={t.expected_txn_cheques} checked={form.expected_txn_cheques} onChange={(v) => setField("expected_txn_cheques", v)} />
        <CheckboxInput label={t.expected_txn_inward} checked={form.expected_txn_inward} onChange={(v) => setField("expected_txn_inward", v)} />
        <CheckboxInput label={t.expected_txn_outward} checked={form.expected_txn_outward} onChange={(v) => setField("expected_txn_outward", v)} />
      </CheckboxGrid>

      <h4 style={{ margin: "18px 0 10px", fontSize: 14 }}>{t.income_other_sources}</h4>
      {form.income_source_lines.map((line, index) => (
        <RepeatedGroup
          key={index}
          title={`${t.source_type} ${index + 1}`}
          removeLabel={t.remove}
          canRemove
          onRemove={() => setForm((p) => ({ ...p, income_source_lines: p.income_source_lines.filter((_, i) => i !== index) }))}
        >
          <FieldGrid>
            <SelectInput label={t.source_type} value={line.source_type} onChange={(v) => update(index, { source_type: v })} options={localise(optionSets.incomeSourceType, language)} placeholder={t.selectPlaceholder} required />
            <TextInput label={t.source_type_other} value={line.source_type_other} onChange={(v) => update(index, { source_type_other: v })} />
            <TextInput label={t.description} value={line.description} onChange={(v) => update(index, { description: v })} />
            <TextInput label={t.amount} value={line.amount} onChange={(v) => update(index, { amount: v })} inputMode="decimal" />
          </FieldGrid>
        </RepeatedGroup>
      ))}
      <AddButton label={t.addIncome} onClick={() => setForm((p) => ({ ...p, income_source_lines: [...p.income_source_lines, emptyIncomeSourceLine()] }))} />
    </>
  );
}

function ComplianceStep({ t, language, form, setField }: Props) {
  return (
    <>
      <h4 style={{ margin: "0 0 10px", fontSize: 14 }}>PEP</h4>
      <CheckboxGrid>
        <CheckboxInput label={t.pep_is_pep} checked={form.pep_is_pep} onChange={(v) => setField("pep_is_pep", v)} />
        <CheckboxInput label={t.pep_relative_pep} checked={form.pep_relative_pep} onChange={(v) => setField("pep_relative_pep", v)} />
      </CheckboxGrid>
      <div style={{ marginTop: 12 }}>
        <FieldGrid>
          <TextInput label={t.pep_position} value={form.pep_position} onChange={(v) => setField("pep_position", v)} />
          <TextInput label={t.pep_relative_details} value={form.pep_relative_details} onChange={(v) => setField("pep_relative_details", v)} />
        </FieldGrid>
      </div>

      <h4 style={{ margin: "20px 0 10px", fontSize: 14 }}>FATCA</h4>
      <CheckboxGrid>
        <CheckboxInput label={t.fatca_us_citizen} checked={form.fatca_us_citizen} onChange={(v) => setField("fatca_us_citizen", v)} />
        <CheckboxInput label={t.fatca_born_usa} checked={form.fatca_born_usa} onChange={(v) => setField("fatca_born_usa", v)} />
        <CheckboxInput label={t.fatca_dual_citizenship} checked={form.fatca_dual_citizenship} onChange={(v) => setField("fatca_dual_citizenship", v)} />
        <CheckboxInput label={t.fatca_other_citizenship} checked={form.fatca_other_citizenship} onChange={(v) => setField("fatca_other_citizenship", v)} />
        <CheckboxInput label={t.fatca_us_green_card} checked={form.fatca_us_green_card} onChange={(v) => setField("fatca_us_green_card", v)} />
        <CheckboxInput label={t.fatca_us_passport} checked={form.fatca_us_passport} onChange={(v) => setField("fatca_us_passport", v)} />
        <CheckboxInput label={t.fatca_us_mailing_address} checked={form.fatca_us_mailing_address} onChange={(v) => setField("fatca_us_mailing_address", v)} />
        <CheckboxInput label={t.fatca_us_proxy_authorized} checked={form.fatca_us_proxy_authorized} onChange={(v) => setField("fatca_us_proxy_authorized", v)} />
        <CheckboxInput label={t.fatca_us_standing_order_out} checked={form.fatca_us_standing_order_out} onChange={(v) => setField("fatca_us_standing_order_out", v)} />
        <CheckboxInput label={t.fatca_us_standing_order_in} checked={form.fatca_us_standing_order_in} onChange={(v) => setField("fatca_us_standing_order_in", v)} />
        <CheckboxInput label={t.fatca_us_stay_183days} checked={form.fatca_us_stay_183days} onChange={(v) => setField("fatca_us_stay_183days", v)} />
      </CheckboxGrid>
      <div style={{ marginTop: 12 }}>
        <FieldGrid>
          <TextInput label={t.fatca_other_citizenship_specify} value={form.fatca_other_citizenship_specify} onChange={(v) => setField("fatca_other_citizenship_specify", v)} />
          <SelectInput label={t.fatca_stay_reason} value={form.fatca_stay_reason} onChange={(v) => setField("fatca_stay_reason", v)} options={localise(optionSets.fatcaStayReason, language)} placeholder={t.selectPlaceholder} />
          <TextInput label={t.fatca_stay_reason_specify} value={form.fatca_stay_reason_specify} onChange={(v) => setField("fatca_stay_reason_specify", v)} />
        </FieldGrid>
      </div>
    </>
  );
}

function MinorsStep({ t, language, form, setForm }: Props) {
  const update = (index: number, patch: Partial<FormState["minor_lines"][number]>) =>
    setForm((previous) => ({
      ...previous,
      minor_lines: previous.minor_lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    }));

  return (
    <>
      {form.minor_lines.map((line, index) => (
        <RepeatedGroup
          key={index}
          title={`${t.minor_name} ${index + 1}`}
          removeLabel={t.remove}
          canRemove
          onRemove={() => setForm((p) => ({ ...p, minor_lines: p.minor_lines.filter((_, i) => i !== index) }))}
        >
          <FieldGrid>
            <TextInput label={t.minor_name} value={line.minor_name} onChange={(v) => update(index, { minor_name: v })} required />
            <TextInput label={t.minor_dob} type="date" value={line.minor_dob} onChange={(v) => update(index, { minor_dob: v })} />
            <SelectInput label={t.minor_id_type} value={line.minor_id_type} onChange={(v) => update(index, { minor_id_type: v })} options={localise(optionSets.minorIdType, language)} placeholder={t.selectPlaceholder} />
            <TextInput label={t.minor_id_number} value={line.minor_id_number} onChange={(v) => update(index, { minor_id_number: v })} />
            <TextInput label={t.guardian_cif} value={line.guardian_cif} onChange={(v) => update(index, { guardian_cif: v })} />
            <TextInput label={t.guardian_account_no} value={line.guardian_account_no} onChange={(v) => update(index, { guardian_account_no: v })} />
            <TextInput label={t.annual_income_amount} value={line.annual_income_amount} onChange={(v) => update(index, { annual_income_amount: v })} inputMode="decimal" />
          </FieldGrid>
        </RepeatedGroup>
      ))}
      <AddButton label={t.addMinor} onClick={() => setForm((p) => ({ ...p, minor_lines: [...p.minor_lines, emptyMinorLine()] }))} />
    </>
  );
}
