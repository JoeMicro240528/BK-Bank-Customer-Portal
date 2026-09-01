import type { AUFRequestRead } from "@/lib/swagger-types";
import { initialForm, type FormState } from "./form";

/**
 * Maps a saved draft back into form state so a returning user continues where
 * they stopped. Only fields the API returns are restored; anything absent
 * falls back to the empty default rather than being invented.
 */
export function toFormState(request: AUFRequestRead): FormState {
  const base = initialForm();
  const source = request as unknown as Record<string, unknown>;

  const text = (key: string) => {
    const value = source[key];
    return typeof value === "string" ? value : "";
  };

  const flag = (key: string) => source[key] === true;

  const number = (key: string) => {
    const value = source[key];
    return typeof value === "number" ? String(value) : "";
  };

  return {
    ...base,
    external_ref: request.external_ref || "",
    info_type: (request.info_type as FormState["info_type"]) || base.info_type,

    name_arabic: request.name_arabic || "",
    name_english: request.name_english || "",
    mother_maiden_name: text("mother_maiden_name"),
    gender: text("gender"),
    date_of_birth: text("date_of_birth"),
    birth_country_id: number("birth_country_id"),
    nationality_id: number("nationality_id"),
    marital_status: text("marital_status"),
    spouse_name: text("spouse_name"),
    mobile_personal: text("mobile_personal"),
    mobile_additional: text("mobile_additional"),
    education_level: text("education_level"),
    education_other: text("education_other"),
    email: text("email"),

    res_country_state_id: number("res_country_state_id"),
    city_id: number("city_id"),
    area: text("area"),
    district: text("district"),
    street: text("street"),
    block: text("block"),
    house_no: text("house_no"),
    residency_no: text("residency_no"),
    residency_issue_date: text("residency_issue_date"),
    residency_expiry_date: text("residency_expiry_date"),
    sponsor_name: text("sponsor_name"),
    sponsor_business_sector: text("sponsor_business_sector"),

    cif_number: request.cif_number || "",
    business_sector: text("business_sector"),
    business_sector_other: text("business_sector_other"),
    employment_status: text("employment_status"),
    employment_type_specify: text("employment_type_specify"),
    employer_name: text("employer_name"),
    employer_activity: text("employer_activity"),
    employer_address: text("employer_address"),
    job_title: text("job_title"),
    employment_date: text("employment_date"),

    primary_income_source: text("primary_income_source"),
    primary_income_other: text("primary_income_other"),
    income_other_sources: text("income_other_sources"),
    monthly_income_range: text("monthly_income_range"),
    annual_income_range: text("annual_income_range"),
    annual_income_amount: number("annual_income_amount"),
    source_funds_open_account: text("source_funds_open_account"),
    source_funds_fund_account: text("source_funds_fund_account"),
    expected_txn_deposits: flag("expected_txn_deposits"),
    expected_txn_cheques: flag("expected_txn_cheques"),
    expected_txn_inward: flag("expected_txn_inward"),
    expected_txn_outward: flag("expected_txn_outward"),

    pep_is_pep: flag("pep_is_pep"),
    pep_position: text("pep_position"),
    pep_relative_pep: flag("pep_relative_pep"),
    pep_relative_details: text("pep_relative_details"),
    fatca_us_citizen: flag("fatca_us_citizen"),
    fatca_born_usa: flag("fatca_born_usa"),
    fatca_dual_citizenship: flag("fatca_dual_citizenship"),
    fatca_other_citizenship: flag("fatca_other_citizenship"),
    fatca_other_citizenship_specify: text("fatca_other_citizenship_specify"),
    fatca_us_green_card: flag("fatca_us_green_card"),
    fatca_us_passport: flag("fatca_us_passport"),
    fatca_us_mailing_address: flag("fatca_us_mailing_address"),
    fatca_us_proxy_authorized: flag("fatca_us_proxy_authorized"),
    fatca_us_standing_order_out: flag("fatca_us_standing_order_out"),
    fatca_us_standing_order_in: flag("fatca_us_standing_order_in"),
    fatca_us_stay_183days: flag("fatca_us_stay_183days"),
    fatca_stay_reason: text("fatca_stay_reason"),
    fatca_stay_reason_specify: text("fatca_stay_reason_specify"),

    declaration_accepted: flag("declaration_accepted"),
    selected_accounts: (request.selected_accounts || []).map((account) => ({
      bank_id: account.bank_id,
      account_number: account.account_number,
    })),
  };
}
