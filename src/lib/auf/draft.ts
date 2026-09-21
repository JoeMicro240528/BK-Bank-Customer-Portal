import type { AUFRequestRead } from "@/lib/swagger-types";
import {
  FILE_ID_DOCUMENT,
  FILE_INCOME_PROOF,
  FILE_PERSONAL_PHOTO,
  FILE_SIGNATURE,
} from "./files";
import {
  initialForm,
  parseBeneficialOwnerDetails,
  splitArabicName,
  splitName,
  type FormState,
} from "./form";

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

  const lines = (value: unknown): Record<string, unknown>[] =>
    Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

  const str = (value: unknown) => (typeof value === "string" ? value : "");
  const num = (value: unknown) => (typeof value === "number" ? String(value) : "");

  return {
    ...base,
    external_ref: request.external_ref || "",
    info_type: (request.info_type as FormState["info_type"]) || base.info_type,

    name_arabic: request.name_arabic || "",
    name_english: request.name_english || "",
    // The API keeps the four parts of each name. Drafts saved before it did
    // only have the joined string, so that is split as a fallback -- except
    // an Arabic one, which older drafts stored in name_english by mistake.
    ...(() => {
      const parts = [
        text("english_first_name"),
        text("english_second_name"),
        text("english_third_name"),
        text("english_fourth_name"),
      ];
      const stored = request.name_english || "";
      const [first, second, third, fourth] = parts.some(Boolean)
        ? parts
        : /[\u0600-\u06FF]/.test(stored)
          ? ["", "", "", ""]
          : splitName(stored);
      return {
        name_en_first: first,
        name_en_second: second,
        name_en_third: third,
        name_en_fourth: fourth,
      };
    })(),
    mother_maiden_name: text("mother_maiden_name"),
    ...(() => {
      const parts = [
        text("mother_first_name"),
        text("mother_second_name"),
        text("mother_third_name"),
        text("mother_fourth_name"),
      ];
      const [first, second, third, fourth] = parts.some(Boolean)
        ? parts
        : splitArabicName(text("mother_maiden_name"));
      return {
        mother_name_first: first,
        mother_name_second: second,
        mother_name_third: third,
        mother_name_fourth: fourth,
      };
    })(),
    gender: text("gender"),
    date_of_birth: text("date_of_birth"),
    birth_country_id: number("birth_country_id"),
    birth_state_id: number("birth_state_id"),
    nationality_id: number("nationality_id"),
    marital_status: text("marital_status"),
    spouse_name: text("spouse_name"),
    mobile_personal: text("mobile_personal"),
    mobile_additional: text("mobile_additional"),
    education_level: text("education_level"),
    education_other: text("education_other"),
    email: text("email"),

    res_country_id: number("res_country_id"),
    res_country_state_id: number("res_country_state_id"),
    city_id: number("city_id"),
    // The form's landmark box writes both; either brings it back.
    area: text("area") || text("nearest_landmark"),
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
    branch_id: number("branch_id"),
    selected_bank_id: number("bank_id"),
    business_sector: text("business_sector"),
    business_sector_other: text("business_sector_other"),
    employment_status: text("employment_status"),
    employment_type_specify: text("employment_type_specify"),
    employer_name: text("employer_name"),
    employer_activity: text("employer_activity"),
    employer_address: text("employer_address"),
    job_title: number("job_title"),
    employment_date: text("employment_date"),

    primary_income_source: number("primary_income_source"),
    primary_income_other: text("primary_income_other"),
    income_other_sources: number("income_other_sources"),
    monthly_income_range: text("monthly_income_range"),
    annual_income_range: text("annual_income_range"),
    annual_income_amount: number("annual_income_amount"),
    monthly_income_amount: number("monthly_income_amount"),
    account_purpose: text("account_purpose"),
    expected_txn_monthly_value: number("expected_monthly_transaction_amount"),
    expected_txn_monthly_count: number("expected_monthly_transaction_count"),
    source_funds_open_account: text("source_funds_open_account"),
    source_funds_fund_account: text("source_funds_fund_account"),
    expected_txn_salary: flag("expected_txn_salary"),
    expected_txn_savings: flag("expected_txn_savings"),
    expected_txn_investment: flag("expected_txn_investment"),
    expected_txn_international_transfers: flag("expected_txn_international_transfers"),
    expected_txn_domestic_transfers: flag("expected_txn_domestic_transfers"),
    expected_txn_other: flag("expected_txn_other"),
    expected_txn_deposits: flag("expected_txn_deposits"),
    expected_txn_cheques: flag("expected_txn_cheques"),
    expected_txn_inward: flag("expected_txn_inward"),
    expected_txn_outward: flag("expected_txn_outward"),

    // Only an explicit "no" counts: the default is that the customer is the
    // beneficial owner. Restoring these matters for more than display -- the
    // next save sends them, so a reset here would overwrite the saved answer.
    is_beneficial_owner: source.is_beneficial_owner !== false,
    ...(source.is_beneficial_owner === false
      ? parseBeneficialOwnerDetails(text("beneficial_owner_details"))
      : {}),

    // Rebuild the combined question from the two flags the API stores.
    pep_any: flag("pep_is_pep") || flag("pep_relative_pep"),
    pep_holder:
      flag("pep_is_pep") && flag("pep_relative_pep")
        ? "both"
        : flag("pep_is_pep")
          ? "self"
          : flag("pep_relative_pep")
            ? "relative"
            : "",
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

    // Restored from the saved request. Without these the primary national ID
    // is lost on resume and the API rejects the next save.
    identity_lines: lines(source.identity_lines).map((line) => ({
      id_type: str(line.id_type) || "national_id",
      id_number: str(line.id_number),
      id_type_other: str(line.id_type_other),
      issuance_date: str(line.issuance_date),
      expiry_date: str(line.expiry_date),
      nationality_id: num(line.nationality_id),
      is_primary: line.is_primary === true,
    })),

    income_source_lines: lines(source.income_source_lines).map((line) => ({
      source_type: str(line.source_type),
      source_type_other: str(line.source_type_other),
      description: str(line.description),
      amount: num(line.amount),
    })),

    minor_lines: lines(source.minor_lines).map((line) => ({
      minor_name: str(line.minor_name),
      minor_dob: str(line.minor_dob),
      minor_id_type: str(line.minor_id_type),
      minor_id_number: str(line.minor_id_number),
      guardian_cif: str(line.guardian_cif),
      guardian_account_no: str(line.guardian_account_no),
      annual_income_amount: num(line.annual_income_amount),
    })),
    selected_accounts: (request.selected_accounts || []).map((account) => ({
      bank_id: account.bank_id,
      account_number: account.account_number,
    })),
  };
}

/** An attachment already stored on the request, as the form shows it. */
export type ExistingUpload = { name: string; size: number };

/**
 * Attachments the saved request already holds, keyed like the form's file
 * inputs. A File cannot be restored into an input, so without this a resumed
 * draft asked for every upload again even though the server had them.
 */
export function existingUploads(request: AUFRequestRead): Record<string, ExistingUpload> {
  const source = request as unknown as Record<string, unknown>;
  const first = (value: unknown): ExistingUpload | null => {
    const list = Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
    const item = list[0];
    if (!item) return null;
    return {
      name: typeof item.name === "string" ? item.name : "",
      size: typeof item.size === "number" ? item.size : 0,
    };
  };

  const uploads: Record<string, ExistingUpload> = {};

  const photo = first(source.personal_photo_attachments);
  if (photo) uploads[FILE_PERSONAL_PHOTO] = photo;

  const signature = first(source.signature_attachments);
  if (signature) uploads[FILE_SIGNATURE] = signature;

  const identityLines = (request.identity_lines ?? []) as unknown as Record<string, unknown>[];
  const identity =
    identityLines.find((line) => line.is_primary === true) ?? identityLines[0];
  const identityImage = identity ? first(identity.attachments) : null;
  if (identityImage) uploads[FILE_ID_DOCUMENT] = identityImage;

  // Income proof goes up as a supporting document. An unrecognised type is
  // retried as "other" carrying the intended one, so either spelling counts.
  const documents = Array.isArray(source.supporting_documents)
    ? (source.supporting_documents as Record<string, unknown>[])
    : [];
  const proof = documents.find(
    (document) =>
      document.document_type === FILE_INCOME_PROOF ||
      document.document_type_other === FILE_INCOME_PROOF,
  );
  const proofFile = proof ? first(proof.attachments) : null;
  if (proofFile) uploads[FILE_INCOME_PROOF] = proofFile;

  return uploads;
}
