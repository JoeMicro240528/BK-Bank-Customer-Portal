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

/** One selected account, as the API stores it. */
export type SelectedAccountLine = {
  bank_id: number;
  account_number: string;
};

export type FormState = {
  external_ref: string;
  info_type: InfoType;
  name_arabic: string;
  name_english: string;
  /**
   * The guide asks for the English name in four parts; the API stores one
   * string, so these are joined into name_english on save.
   */
  name_en_first: string;
  name_en_second: string;
  name_en_third: string;
  name_en_fourth: string;
  /**
   * The guide asks for the mother's name in four parts; the API stores one
   * string, so these are joined into mother_maiden_name on save.
   */
  mother_name_first: string;
  mother_name_second: string;
  mother_name_third: string;
  mother_name_fourth: string;
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
  res_country_id: string;
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
  /**
   * The branch chosen on the accounts screen. The API requires it when the
   * request is created, so it travels with the form rather than staying in
   * the wizard.
   */
  branch_id: string;
  bank_account_id: string;
  /** Bank/account pairs chosen before the form; sent with every save. */
  selected_accounts: SelectedAccountLine[];
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
  expected_txn_salary: boolean;
  expected_txn_savings: boolean;
  expected_txn_investment: boolean;
  expected_txn_international_transfers: boolean;
  expected_txn_domestic_transfers: boolean;
  expected_txn_other: boolean;
  expected_txn_deposits: boolean;
  expected_txn_cheques: boolean;
  expected_txn_inward: boolean;
  expected_txn_outward: boolean;
  /**
   * The single combined PEP question, and who it applies to. The API keeps two
   * flags (pep_is_pep, pep_relative_pep); these are set from the holder so a
   * "yes" with no holder chosen yet has somewhere to live.
   */
  pep_any: boolean;
  pep_holder: "" | "self" | "relative" | "both";
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

  /**
   * Fields the guide requires that the API has nowhere to store yet. They are
   * collected but not sent -- see buildCreatePayload -- and because a draft is
   * rebuilt from the API, they are not restored when a draft is resumed.
   */
  /** State of birth, a master-data state id. Country goes to birth_country_id. */
  birth_state_id: string;
  is_beneficial_owner: boolean;
  /** The beneficial owner, asked only when the customer is not one. */
  bo_full_name: string;
  bo_relationship: string;
  bo_id_number: string;
  bo_nationality_id: string;
  bo_address: string;
  account_purpose: string;
  expected_txn_monthly_value: string;
  expected_txn_monthly_count: string;
  /** Monthly figure from the guide; sent as annual_income_amount x 12. */
  monthly_income_amount: string;

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

/**
 * SudaPass gives one full name; the guide asks for it in four parts. Anything
 * past the fourth word joins the last part rather than being dropped.
 */
export function splitName(full: string | undefined): [string, string, string, string] {
  const parts = (full || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ["", "", "", ""];

  const [first = "", second = "", third = "", ...rest] = parts;
  return [first, second, third, rest.join(" ")];
}

/** Words that open a compound name and belong with the word after them. */
const ARABIC_NAME_PREFIXES = new Set(["عبد", "ابو", "أبو", "أبي", "ابي"]);
/** Words that close a compound name and belong with the word before them. */
const ARABIC_NAME_SUFFIXES = new Set(["الدين", "الله"]);

/**
 * An Arabic name in four parts, keeping compound names whole ("عبد الرحمن",
 * "نور الدين", "أبو بكر") rather than cutting at every space. Used to put a
 * stored name back into its boxes: the API keeps only the joined string, so a
 * plain split would scatter a compound name across two boxes on resume.
 */
export function splitArabicName(full: string | undefined): [string, string, string, string] {
  const words = (full || "").trim().split(/\s+/).filter(Boolean);
  const parts: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const next = words[i + 1];

    if (ARABIC_NAME_PREFIXES.has(word) && next !== undefined) {
      parts.push(`${word} ${next}`);
      i++;
    } else if (ARABIC_NAME_SUFFIXES.has(word) && parts.length > 0) {
      parts[parts.length - 1] = `${parts[parts.length - 1]} ${word}`;
    } else {
      parts.push(word);
    }
  }

  const [first = "", second = "", third = "", ...rest] = parts;
  return [first, second, third, rest.join(" ")];
}

export function initialForm(): FormState {
  return {
    external_ref: "",
    info_type: "update",
    name_arabic: "",
    name_english: "",
    name_en_first: "",
    name_en_second: "",
    name_en_third: "",
    name_en_fourth: "",
    mother_name_first: "",
    mother_name_second: "",
    mother_name_third: "",
    mother_name_fourth: "",
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
    res_country_id: "",
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
    branch_id: "",
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
    expected_txn_salary: false,
    expected_txn_savings: false,
    expected_txn_investment: false,
    expected_txn_international_transfers: false,
    expected_txn_domestic_transfers: false,
    expected_txn_other: false,
    expected_txn_deposits: false,
    expected_txn_cheques: false,
    expected_txn_inward: false,
    expected_txn_outward: false,
    pep_any: false,
    pep_holder: "",
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
    birth_state_id: "",
    is_beneficial_owner: true,
    bo_full_name: "",
    bo_relationship: "",
    bo_id_number: "",
    bo_nationality_id: "",
    bo_address: "",
    account_purpose: "",
    expected_txn_monthly_value: "",
    expected_txn_monthly_count: "",
    monthly_income_amount: "",
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

/** The mother's name as typed into its four fields. */
export function motherName(form: FormState): string {
  return [form.mother_name_first, form.mother_name_second, form.mother_name_third, form.mother_name_fourth]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

/**
 * The English name as typed into its four fields. No fallback to a stored
 * value: that could be the Arabic SudaPass name sent under the English label.
 */
export function englishName(form: FormState): string {
  return [form.name_en_first, form.name_en_second, form.name_en_third, form.name_en_fourth]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ");
}

function annualIncome(form: FormState): number | undefined {
  const monthly = parseOptionalFloat(form.monthly_income_amount);
  if (typeof monthly === "number") return monthly * 12;

  const annual = parseOptionalFloat(form.annual_income_amount);
  return typeof annual === "number" ? annual : undefined;
}

/**
 * The beneficial owner is collected as five separate answers because the guide
 * asks for them that way; the API keeps one free-text field, so they are
 * labelled and joined rather than lost.
 */
function beneficialOwnerDetails(form: FormState): string {
  if (form.is_beneficial_owner) return "";

  return [
    ["Name", form.bo_full_name],
    ["Relationship", form.bo_relationship],
    ["ID number", form.bo_id_number],
    ["Nationality", form.bo_nationality_id],
    ["Address", form.bo_address],
  ]
    .filter(([, value]) => value.trim())
    .map(([label, value]) => `${label}: ${value.trim()}`)
    .join(" | ");
}

export function buildCreatePayload(form: FormState, externalRef: string): AUFRequestCreate {
  return {
    external_ref: optionalText(externalRef),
    info_type: form.info_type,
    name_arabic: form.name_arabic.trim(),
    // Four parts each, as the API now stores them -- it no longer has the
    // single name_english and mother_maiden_name fields these were joined into.
    english_first_name: optionalText(form.name_en_first),
    english_second_name: optionalText(form.name_en_second),
    english_third_name: optionalText(form.name_en_third),
    english_fourth_name: optionalText(form.name_en_fourth),
    mother_first_name: optionalText(form.mother_name_first),
    mother_second_name: optionalText(form.mother_name_second),
    mother_third_name: optionalText(form.mother_name_third),
    mother_fourth_name: optionalText(form.mother_name_fourth),
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
    birth_state_id: parseOptionalInt(form.birth_state_id),
    res_country_id: parseOptionalInt(form.res_country_id),
    res_country_state_id: parseOptionalInt(form.res_country_state_id),
    city_id: parseOptionalInt(form.city_id),
    nearest_landmark: optionalText(form.area),
    area: optionalText(form.area),
    district: optionalText(form.district),
    street: optionalText(form.street),
    block: optionalText(form.block),
    house_no: optionalText(form.house_no),
    bank_account_id: parseOptionalInt(form.bank_account_id),
    // Required by the API on create; parseOptionalInt gives undefined for an
    // empty draft, which surfaces as a clear "Field required" rather than a 0.
    branch_id: parseOptionalInt(form.branch_id) as number,
    selected_accounts: form.selected_accounts,
    cif_number: optionalText(form.cif_number),
    business_sector: optionalText(form.business_sector),
    business_sector_other: optionalText(form.business_sector_other),
    employment_status: optionalText(form.employment_status),
    employment_type_specify: optionalText(form.employment_type_specify),
    employer_name: optionalText(form.employer_name),
    employer_activity: optionalText(form.employer_activity),
    employer_address: optionalText(form.employer_address),
    job_title: parseOptionalInt(form.job_title),
    employment_date: optionalText(form.employment_date),
    primary_income_source: parseOptionalInt(form.primary_income_source),
    primary_income_other: optionalText(form.primary_income_other),
    income_other_sources: parseOptionalInt(form.income_other_sources),
    monthly_income_amount: parseOptionalFloat(form.monthly_income_amount),
    monthly_income_range: optionalText(form.monthly_income_range),
    account_purpose: optionalText(form.account_purpose),
    expected_monthly_transaction_amount: parseOptionalFloat(form.expected_txn_monthly_value),
    expected_monthly_transaction_count: parseOptionalInt(form.expected_txn_monthly_count),
    is_beneficial_owner: form.is_beneficial_owner,
    beneficial_owner_details: optionalText(beneficialOwnerDetails(form)),
    annual_income_range: optionalText(form.annual_income_range),
    // The guide collects a monthly figure and the API stores an annual one.
    annual_income_amount: annualIncome(form),
    source_funds_open_account: optionalText(form.source_funds_open_account),
    source_funds_fund_account: optionalText(form.source_funds_fund_account),
    expected_txn_salary: form.expected_txn_salary,
    expected_txn_savings: form.expected_txn_savings,
    expected_txn_investment: form.expected_txn_investment,
    expected_txn_international_transfers: form.expected_txn_international_transfers,
    expected_txn_domestic_transfers: form.expected_txn_domestic_transfers,
    expected_txn_other: form.expected_txn_other,
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
