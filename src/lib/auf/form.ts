import type {
  AUFRequestCreate,
  AUFRequestUpdate,
  InfoType,
} from "@/lib/swagger-types";

/**
 * Form state and payload builders for the AUF request, lifted out of the
 * original single-page form so the new step-by-step form can reuse them
 * unchanged -- these encode how each field maps onto the API.
 */

export type IdentityFormLine = {
  id_type: string;
  id_number: string;
  id_type_other: string;
  issuance_date: string;
  expiry_date: string;
  nationality_id: string;
  is_primary: boolean;
};

export type IncomeSourceFormLine = {
  source_type: string;
  source_type_other: string;
  description: string;
  amount: string;
};

export type MinorFormLine = {
  minor_name: string;
  minor_dob: string;
  minor_id_type: string;
  minor_id_number: string;
  guardian_cif: string;
  guardian_account_no: string;
  annual_income_amount: string;
};

export type FormState = {
  external_ref: string;
  info_type: InfoType;
  name_arabic: string;
  name_english: string;
  mother_maiden_name: string;
  gender: string;
  date_of_birth: string;
  birth_country_id: string;
  nationality_id: string;
  marital_status: string;
  spouse_name: string;
  mobile_personal: string;
  mobile_additional: string;
  education_level: string;
  education_other: string;
  email: string;
  res_country_state_id: string;
  city_id: string;
  area: string;
  district: string;
  street: string;
  block: string;
  house_no: string;
  residency_no: string;
  residency_issue_date: string;
  residency_expiry_date: string;
  sponsor_name: string;
  sponsor_business_sector: string;
  selected_bank_id: string;
  bank_account_id: string;
  /** Bank/account pairs chosen before the form; sent with every save. */
  selected_accounts: { bank_id: number; account_number: string }[];
  cif_number: string;
  business_sector: string;
  business_sector_other: string;
  employment_status: string;
  employment_type_specify: string;
  employer_name: string;
  employer_activity: string;
  employer_address: string;
  job_title: string;
  employment_date: string;
  primary_income_source: string;
  primary_income_other: string;
  income_other_sources: string;
  monthly_income_range: string;
  annual_income_range: string;
  annual_income_amount: string;
  source_funds_open_account: string;
  source_funds_fund_account: string;
  expected_txn_deposits: boolean;
  expected_txn_cheques: boolean;
  expected_txn_inward: boolean;
  expected_txn_outward: boolean;
  pep_is_pep: boolean;
  pep_position: string;
  pep_relative_pep: boolean;
  pep_relative_details: string;
  fatca_us_citizen: boolean;
  fatca_born_usa: boolean;
  fatca_dual_citizenship: boolean;
  fatca_other_citizenship: boolean;
  fatca_other_citizenship_specify: string;
  fatca_us_green_card: boolean;
  fatca_us_passport: boolean;
  fatca_us_mailing_address: boolean;
  fatca_us_proxy_authorized: boolean;
  fatca_us_standing_order_out: boolean;
  fatca_us_standing_order_in: boolean;
  fatca_us_stay_183days: boolean;
  fatca_stay_reason: string;
  fatca_stay_reason_specify: string;
  declaration_accepted: boolean;
  identity_lines: IdentityFormLine[];
  income_source_lines: IncomeSourceFormLine[];
  minor_lines: MinorFormLine[];
};

export const optionSets = {
  infoType: [
    { value: "new", label: "New" },
    { value: "update", label: "Update" },
  ],
  gender: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
  maritalStatus: [
    { value: "single", label: "Single" },
    { value: "married", label: "Married" },
    { value: "divorced", label: "Divorced" },
    { value: "widowed", label: "Widowed" },
    { value: "other", label: "Other" },
  ],
  educationLevel: [
    { value: "elementary", label: "Elementary" },
    { value: "secondary", label: "Secondary" },
    { value: "diploma", label: "Diploma" },
    { value: "graduate", label: "Graduate" },
    { value: "post_graduate", label: "Post graduate" },
    { value: "other", label: "Other" },
  ],
  identityType: [
    { value: "national_id", label: "National ID" },
    { value: "passport", label: "Passport" },
    { value: "other", label: "Other" },
  ],
  businessSector: [
    { value: "government", label: "Government" },
    { value: "private", label: "Private" },
    { value: "other", label: "Other" },
  ],
  employmentStatus: [
    { value: "self_employed", label: "Self-employed" },
    { value: "salaried", label: "Salaried" },
    { value: "student", label: "Student" },
    { value: "retired", label: "Retired" },
    { value: "housewife", label: "Housewife" },
    { value: "other", label: "Other" },
  ],
  primaryIncomeSource: [
    { value: "salary", label: "Salary" },
    { value: "self_employed", label: "Self-employed / business" },
    { value: "pension", label: "Pension" },
    { value: "other", label: "Other" },
  ],
  incomeSourceType: [
    { value: "salary", label: "Salary" },
    { value: "business", label: "Business" },
    { value: "pension", label: "Pension" },
    { value: "rental", label: "Rental income" },
    { value: "investment", label: "Investment" },
    { value: "other", label: "Other" },
  ],
  monthlyIncomeRange: [
    { value: "lt_2m", label: "Less than SDG 2,000,000" },
    { value: "2m_5m", label: "SDG 2,000,000 - 5,000,000" },
    { value: "5m_10m", label: "SDG 5,000,000 - 10,000,000" },
    { value: "over_10m", label: "Over SDG 10,000,000" },
  ],
  annualIncomeRange: [
    { value: "lt_25m", label: "Less than SDG 25,000,000" },
    { value: "25m_50m", label: "SDG 25,000,000 - 50,000,000" },
    { value: "over_50m", label: "Over SDG 50,000,000" },
  ],
  fatcaStayReason: [
    { value: "athlete", label: "Athlete" },
    { value: "student", label: "Student" },
    { value: "teacher", label: "Teacher" },
    { value: "diplomat", label: "Diplomat" },
    { value: "other", label: "Other" },
  ],
  minorIdType: [
    { value: "national_id", label: "National ID" },
    { value: "birth_cert", label: "Birth certificate" },
  ],
};

export function initialForm(): FormState {
  return {
    external_ref: "",
    info_type: "update",
    name_arabic: "",
    name_english: "",
    mother_maiden_name: "",
    gender: "",
    date_of_birth: "",
    birth_country_id: "",
    nationality_id: "",
    marital_status: "",
    spouse_name: "",
    mobile_personal: "",
    mobile_additional: "",
    education_level: "",
    education_other: "",
    email: "",
    res_country_state_id: "",
    city_id: "",
    area: "",
    district: "",
    street: "",
    block: "",
    house_no: "",
    residency_no: "",
    residency_issue_date: "",
    residency_expiry_date: "",
    sponsor_name: "",
    sponsor_business_sector: "",
    selected_bank_id: "",
    bank_account_id: "",
    selected_accounts: [],
    cif_number: "",
    business_sector: "",
    business_sector_other: "",
    employment_status: "",
    employment_type_specify: "",
    employer_name: "",
    employer_activity: "",
    employer_address: "",
    job_title: "",
    employment_date: "",
    primary_income_source: "",
    primary_income_other: "",
    income_other_sources: "",
    monthly_income_range: "",
    annual_income_range: "",
    annual_income_amount: "",
    source_funds_open_account: "",
    source_funds_fund_account: "",
    expected_txn_deposits: false,
    expected_txn_cheques: false,
    expected_txn_inward: false,
    expected_txn_outward: false,
    pep_is_pep: false,
    pep_position: "",
    pep_relative_pep: false,
    pep_relative_details: "",
    fatca_us_citizen: false,
    fatca_born_usa: false,
    fatca_dual_citizenship: false,
    fatca_other_citizenship: false,
    fatca_other_citizenship_specify: "",
    fatca_us_green_card: false,
    fatca_us_passport: false,
    fatca_us_mailing_address: false,
    fatca_us_proxy_authorized: false,
    fatca_us_standing_order_out: false,
    fatca_us_standing_order_in: false,
    fatca_us_stay_183days: false,
    fatca_stay_reason: "",
    fatca_stay_reason_specify: "",
    declaration_accepted: false,
    identity_lines: [emptyIdentityLine()],
    income_source_lines: [],
    minor_lines: [],
  };
}

export function emptyIdentityLine(): IdentityFormLine {
  return {
    id_type: "national_id",
    id_number: "",
    id_type_other: "",
    issuance_date: "",
    expiry_date: "",
    nationality_id: "",
    is_primary: true,
  };
}

export function emptyIncomeSourceLine(): IncomeSourceFormLine {
  return {
    source_type: "salary",
    source_type_other: "",
    description: "",
    amount: "",
  };
}

export function emptyMinorLine(): MinorFormLine {
  return {
    minor_name: "",
    minor_dob: "",
    minor_id_type: "",
    minor_id_number: "",
    guardian_cif: "",
    guardian_account_no: "",
    annual_income_amount: "",
  };
}

export function buildCreatePayload(form: FormState, externalRef: string): AUFRequestCreate {
  return {
    external_ref: optionalText(externalRef),
    info_type: form.info_type,
    name_arabic: form.name_arabic.trim(),
    name_english: form.name_english.trim(),
    mother_maiden_name: optionalText(form.mother_maiden_name),
    gender: optionalText(form.gender),
    date_of_birth: optionalText(form.date_of_birth),
    birth_country_id: parseOptionalInt(form.birth_country_id),
    nationality_id: parseOptionalInt(form.nationality_id),
    marital_status: optionalText(form.marital_status),
    spouse_name: optionalText(form.spouse_name),
    mobile_personal: optionalText(form.mobile_personal),
    mobile_additional: optionalText(form.mobile_additional),
    education_level: optionalText(form.education_level),
    email: optionalText(form.email),
    res_country_state_id: parseOptionalInt(form.res_country_state_id),
    city_id: parseOptionalInt(form.city_id),
    area: optionalText(form.area),
    district: optionalText(form.district),
    street: optionalText(form.street),
    block: optionalText(form.block),
    house_no: optionalText(form.house_no),
    bank_account_id: parseOptionalInt(form.bank_account_id),
    selected_accounts: form.selected_accounts,
    cif_number: optionalText(form.cif_number),
    business_sector: optionalText(form.business_sector),
    business_sector_other: optionalText(form.business_sector_other),
    employment_status: optionalText(form.employment_status),
    employment_type_specify: optionalText(form.employment_type_specify),
    employer_name: optionalText(form.employer_name),
    employer_activity: optionalText(form.employer_activity),
    employer_address: optionalText(form.employer_address),
    job_title: optionalText(form.job_title),
    employment_date: optionalText(form.employment_date),
    primary_income_source: optionalText(form.primary_income_source),
    primary_income_other: optionalText(form.primary_income_other),
    income_other_sources: optionalText(form.income_other_sources),
    monthly_income_range: optionalText(form.monthly_income_range),
    annual_income_range: optionalText(form.annual_income_range),
    annual_income_amount: parseOptionalFloat(form.annual_income_amount),
    source_funds_open_account: optionalText(form.source_funds_open_account),
    source_funds_fund_account: optionalText(form.source_funds_fund_account),
    expected_txn_deposits: form.expected_txn_deposits,
    expected_txn_cheques: form.expected_txn_cheques,
    expected_txn_inward: form.expected_txn_inward,
    expected_txn_outward: form.expected_txn_outward,
    pep_is_pep: form.pep_is_pep,
    pep_position: optionalText(form.pep_position),
    pep_relative_pep: form.pep_relative_pep,
    pep_relative_details: optionalText(form.pep_relative_details),
    fatca_us_citizen: form.fatca_us_citizen,
    fatca_born_usa: form.fatca_born_usa,
    fatca_dual_citizenship: form.fatca_dual_citizenship,
    fatca_other_citizenship: form.fatca_other_citizenship,
    fatca_other_citizenship_specify: optionalText(form.fatca_other_citizenship_specify),
    fatca_us_green_card: form.fatca_us_green_card,
    fatca_us_passport: form.fatca_us_passport,
    fatca_us_mailing_address: form.fatca_us_mailing_address,
    fatca_us_proxy_authorized: form.fatca_us_proxy_authorized,
    fatca_us_standing_order_out: form.fatca_us_standing_order_out,
    fatca_us_standing_order_in: form.fatca_us_standing_order_in,
    fatca_us_stay_183days: form.fatca_us_stay_183days,
    fatca_stay_reason: optionalText(form.fatca_stay_reason),
    fatca_stay_reason_specify: optionalText(form.fatca_stay_reason_specify),
    declaration_accepted: form.declaration_accepted,
    identity_lines: buildIdentityLines(form),
    income_source_lines: buildIncomeSourceLines(form),
    minor_lines: buildMinorLines(form),
  };
}

export function buildUpdatePayload(form: FormState, externalRef: string): AUFRequestUpdate {
  return {
    ...buildCreatePayload(form, externalRef),
    education_other: optionalText(form.education_other),
    residency_no: optionalText(form.residency_no),
    residency_issue_date: optionalText(form.residency_issue_date),
    residency_expiry_date: optionalText(form.residency_expiry_date),
    sponsor_name: optionalText(form.sponsor_name),
    sponsor_business_sector: optionalText(form.sponsor_business_sector),
  };
}

function buildIdentityLines(form: FormState) {
  return form.identity_lines.filter(isCompleteIdentity).map((line) => ({
    id_type: line.id_type,
    id_number: line.id_number.trim(),
    id_type_other: optionalText(line.id_type_other),
    issuance_date: optionalText(line.issuance_date),
    expiry_date: optionalText(line.expiry_date),
    nationality_id: parseOptionalInt(line.nationality_id),
    is_primary: line.is_primary,
  }));
}

function buildIncomeSourceLines(form: FormState) {
  return form.income_source_lines
    .filter((line) => line.source_type || line.description.trim() || line.amount.trim())
    .map((line) => ({
      source_type: line.source_type || "other",
      source_type_other: optionalText(line.source_type_other),
      description: optionalText(line.description),
      amount: parseOptionalFloat(line.amount),
    }));
}

function buildMinorLines(form: FormState) {
  return form.minor_lines
    .filter((line) => line.minor_name.trim())
    .map((line) => ({
      minor_name: line.minor_name.trim(),
      minor_dob: optionalText(line.minor_dob),
      minor_id_type: optionalText(line.minor_id_type),
      minor_id_number: optionalText(line.minor_id_number),
      guardian_cif: optionalText(line.guardian_cif),
      guardian_account_no: optionalText(line.guardian_account_no),
      annual_income_amount: parseOptionalFloat(line.annual_income_amount),
    }));
}

export function isCompleteIdentity(line: IdentityFormLine): boolean {
  return Boolean(line.id_type && line.id_number.trim());
}

function optionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function parseOptionalInt(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseOptionalFloat(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }
  const parsed = Number.parseFloat(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
}
