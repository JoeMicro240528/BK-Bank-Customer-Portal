export type ISODate = string;
export type ISODateTime = string;

export type InfoType = "new" | "update";

export interface IdentitySchema {
  id_type: string;
  id_number: string;
  id_type_other?: string;
  issuance_date?: ISODate;
  expiry_date?: ISODate;
  nationality_id?: number;
  is_primary?: boolean;
}

export interface IncomeSourceSchema {
  source_type: string;
  source_type_other?: string;
  description?: string;
  amount?: number;
}

export interface MinorSchema {
  minor_name: string;
  minor_dob?: ISODate;
  minor_id_type?: string;
  minor_id_number?: string;
  guardian_cif?: string;
  guardian_account_no?: string;
  annual_income_amount?: number;
}

export interface AUFRequestCreate {
  external_ref?: string;
  info_type?: InfoType;
  name_arabic: string;
  name_english: string;
  mother_maiden_name?: string;
  gender?: string;
  date_of_birth?: ISODate;
  birth_country_id?: number;
  nationality_id?: number;
  marital_status?: string;
  spouse_name?: string;
  mobile_personal?: string;
  mobile_additional?: string;
  education_level?: string;
  email?: string;
  res_country_state_id?: number;
  city_id?: number;
  area?: string;
  district?: string;
  street?: string;
  block?: string;
  house_no?: string;
  bank_account_id?: number;
  cif_number?: string;
  business_sector?: string;
  business_sector_other?: string;
  employment_status?: string;
  employment_type_specify?: string;
  employer_name?: string;
  employer_activity?: string;
  employer_address?: string;
  job_title?: string;
  employment_date?: ISODate;
  primary_income_source?: string;
  primary_income_other?: string;
  income_other_sources?: string;
  monthly_income_range?: string;
  annual_income_range?: string;
  annual_income_amount?: number;
  source_funds_open_account?: string;
  source_funds_fund_account?: string;
  expected_txn_deposits?: boolean;
  expected_txn_cheques?: boolean;
  expected_txn_inward?: boolean;
  expected_txn_outward?: boolean;
  pep_is_pep?: boolean;
  pep_position?: string;
  pep_relative_pep?: boolean;
  pep_relative_details?: string;
  fatca_us_citizen?: boolean;
  fatca_born_usa?: boolean;
  fatca_dual_citizenship?: boolean;
  fatca_other_citizenship?: boolean;
  fatca_other_citizenship_specify?: string;
  fatca_us_green_card?: boolean;
  fatca_us_passport?: boolean;
  fatca_us_mailing_address?: boolean;
  fatca_us_proxy_authorized?: boolean;
  fatca_us_standing_order_out?: boolean;
  fatca_us_standing_order_in?: boolean;
  fatca_us_stay_183days?: boolean;
  fatca_stay_reason?: string;
  fatca_stay_reason_specify?: string;
  declaration_accepted?: boolean;
  identity_lines?: IdentitySchema[];
  income_source_lines?: IncomeSourceSchema[];
  minor_lines?: MinorSchema[];
  selected_accounts?: BankAccountSelection[];
}

export interface AUFRequestUpdate extends Partial<AUFRequestCreate> {
  education_other?: string;
  residency_no?: string;
  residency_issue_date?: ISODate;
  residency_expiry_date?: ISODate;
  sponsor_name?: string;
  sponsor_business_sector?: string;
}

/** One bank account attached to a request. */
export interface BankAccountSelection {
  bank_id: number;
  account_number: string;
}

/** Per-bank progress on a submitted request. */
export interface BankUpdateFeedbackStatus {
  bank_id: number;
  bank_name: string;
  state: string;
  processed_at?: ISODateTime | null;
}

export interface AUFRequestRead {
  reference: string;
  external_ref?: string | null;
  external_owner_id?: string | null;
  info_type: string;
  source: string;
  state: string;
  name_arabic: string;
  name_english: string;
  cif_number?: string | null;
  selected_accounts: BankAccountSelection[];
  feedback: BankUpdateFeedbackStatus[];
  supporting_documents: unknown[];
  verification_state: string;
  verification_message?: string | null;
  verified_on?: ISODateTime | null;
  created: ISODateTime;
}

export interface MasterDataCountry {
  id: number;
  name: string;
  code?: string | null;
}

export interface MasterDataState {
  id: number;
  name: string;
  code?: string | null;
  country_id: number;
}

export interface MasterDataCity {
  id: number;
  name: string;
  state_id?: number | null;
}

export interface MasterDataBank {
  id: number;
  name: string;
  bic?: string | null;
}

export type ApiDetail =
  | string
  | Array<{ loc?: Array<string | number>; msg?: string; type?: string }>
  | Record<string, unknown>;
