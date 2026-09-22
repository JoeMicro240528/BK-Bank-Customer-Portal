import type {
  AUFRequestCreate,
  AUFRequestRead,
  AUFRequestUpdate,
  AUFRequestSummary,
  AttachmentRead,
  MasterDataBank,
  MasterDataBranch,
  MasterDataLookup,
  MessageRead,
  MasterDataCity,
  MasterDataCountry,
  MasterDataState,
} from "./swagger-types";

const API_PROXY_BASE = "/api/backend";

type RequestOptions = {
  language: "en" | "ar";
  /**
   * Used only to decide whether the caller is ready to fetch -- it is not sent.
   * The proxy derives X-Owner-Id from the server-side session, since a
   * browser-supplied value would let anyone read another person's records.
   */
  ownerId?: string;
};

export class ApiClientError extends Error {
  status: number;
  detail: unknown;

  constructor(status: number, detail: unknown) {
    super(formatApiError(detail));
    this.name = "ApiClientError";
    this.status = status;
    this.detail = detail;
  }
}

async function requestJson<T>(
  path: string,
  init: RequestInit,
  options: RequestOptions,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Accept-Language", options.language);

  // FormData sets its own multipart boundary; overriding it breaks the upload.
  if (init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // X-Owner-Id is deliberately not set here; the proxy adds it from the session.

  const response = await fetch(`${API_PROXY_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  const text = await response.text();
  const parsed = text ? parseJson(text) : null;

  if (!response.ok) {
    throw new ApiClientError(response.status, parsed);
  }

  return parsed as T;
}

/**
 * How long an upload may take. Files are allowed up to 20 MB, and on a slow
 * mobile link that needs minutes -- 90 seconds failed any 20 MB file below
 * about 1.8 Mbps. Five minutes still ends a stalled upload.
 */
const UPLOAD_TIMEOUT_MS = 5 * 60_000;

/** The three dedicated attachment endpoints take just the file, under "files". */
function uploadFiles(path: string, file: File, options: RequestOptions) {
  const body = new FormData();
  body.append("files", file);

  // Without a deadline a stalled upload leaves the form saying "saving"
  // forever, with no way for the customer to tell what happened.
  return requestJson<AttachmentRead[]>(
    path,
    { method: "POST", body, signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS) },
    options,
  );
}

export const frontendApi = {
  getCountries: (options: RequestOptions) =>
    requestJson<MasterDataCountry[]>("/master-data/countries", { method: "GET" }, options),

  getStates: (countryCode: string, options: RequestOptions) =>
    requestJson<MasterDataState[]>(
      `/master-data/states?country_code=${encodeURIComponent(countryCode)}`,
      { method: "GET" },
      options,
    ),

  getCities: (stateId: number | undefined, options: RequestOptions) => {
    const query = stateId ? `?state_id=${encodeURIComponent(String(stateId))}` : "";
    return requestJson<MasterDataCity[]>(`/master-data/cities${query}`, { method: "GET" }, options);
  },

  getBanks: (options: RequestOptions) =>
    requestJson<MasterDataBank[]>("/master-data/banks", { method: "GET" }, options),

  getBankBranches: (bankId: number | undefined, options: RequestOptions) => {
    const query = bankId ? `?bank_id=${encodeURIComponent(String(bankId))}` : "";
    return requestJson<MasterDataBranch[]>(
      `/master-data/bank-branches${query}`,
      { method: "GET" },
      options,
    );
  },

  /**
   * Profession and income-source lists. The API used to take these as free
   * text and now takes master-data ids, so the form has to offer its options
   * from here rather than from a hard-coded list.
   */
  getJobTitles: (options: RequestOptions) =>
    requestJson<MasterDataLookup[]>("/master-data/job-titles", { method: "GET" }, options),

  getPrimaryIncomeSources: (options: RequestOptions) =>
    requestJson<MasterDataLookup[]>(
      "/master-data/primary-income-sources",
      { method: "GET" },
      options,
    ),

  getOtherIncomeSources: (options: RequestOptions) =>
    requestJson<MasterDataLookup[]>(
      "/master-data/other-income-sources",
      { method: "GET" },
      options,
    ),

  listRequests: (options: RequestOptions) =>
    requestJson<AUFRequestSummary[]>("/auf-requests", { method: "GET" }, options),

  createRequest: (payload: AUFRequestCreate, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      "/auf-requests",
      { method: "POST", body: JSON.stringify(payload) },
      options,
    ),

  /**
   * Attaches a file to a request. document_type is a free string in the API
   * with no documented values -- see DOCUMENT_TYPES for the ones we send.
   */
  uploadDocument: (
    externalRef: string,
    input: {
      documentType: string;
      file: File;
      description?: string;
      documentTypeOther?: string;
    },
    options: RequestOptions,
  ) => {
    const body = new FormData();
    body.append("document_type", input.documentType);
    body.append("files", input.file);
    if (input.description) body.append("description", input.description);
    if (input.documentTypeOther) body.append("document_type_other", input.documentTypeOther);

    // Without a deadline a stalled upload leaves the form saying "saving"
    // forever, with no way for the customer to tell what happened.
    return requestJson<unknown>(
      `/auf-requests/${encodeURIComponent(externalRef)}/documents`,
      { method: "POST", body, signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS) },
      options,
    );
  },

  /**
   * The personal photo, the signature and the identity images each have their
   * own endpoint. They used to go up through /documents with a document_type,
   * which the bank no longer reads them from -- that path is now only for
   * supporting documents such as proof of income.
   *
   * The identity images land in identity_lines[].attachments, which the
   * backend checks on submit.
   */
  uploadPersonalPhoto: (externalRef: string, file: File, options: RequestOptions) =>
    uploadFiles(`/auf-requests/${encodeURIComponent(externalRef)}/personal-photo/attachments`, file, options),

  uploadSignature: (externalRef: string, file: File, options: RequestOptions) =>
    uploadFiles(`/auf-requests/${encodeURIComponent(externalRef)}/signature/attachments`, file, options),

  uploadIdentityDocument: (
    externalRef: string,
    identityId: number,
    file: File,
    options: RequestOptions,
  ) =>
    uploadFiles(
      `/auf-requests/${encodeURIComponent(externalRef)}/identity-documents/${encodeURIComponent(
        String(identityId),
      )}/attachments`,
      file,
      options,
    ),

  /** Chatter on a request. Keyed on the human reference, not external_ref. */
  listMessages: (reference: string, options: RequestOptions) =>
    requestJson<MessageRead[]>(
      `/auf-requests/${encodeURIComponent(reference)}/messages`,
      { method: "GET" },
      options,
    ),

  getRequest: (externalRef: string, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      `/auf-requests/${encodeURIComponent(externalRef)}`,
      { method: "GET" },
      options,
    ),

  updateRequest: (externalRef: string, payload: AUFRequestUpdate, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      `/auf-requests/${encodeURIComponent(externalRef)}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      options,
    ),

  verifyAccount: (externalRef: string, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      `/auf-requests/${encodeURIComponent(externalRef)}/verify-account`,
      { method: "POST" },
      options,
    ),

  submitRequest: (externalRef: string, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      `/auf-requests/${encodeURIComponent(externalRef)}/submit`,
      { method: "POST" },
      options,
    ),
};

export function formatApiError(detail: unknown): string {
  if (!detail) {
    return "The request failed. Please try again.";
  }

  if (typeof detail === "string") {
    return detail;
  }

  if (typeof detail === "object" && "detail" in detail) {
    const inner = (detail as { detail: unknown }).detail;
    if (typeof inner === "string") {
      return inner;
    }

    if (Array.isArray(inner)) {
      return inner
        .map((item) => {
          if (item && typeof item === "object" && "msg" in item) {
            return String((item as { msg: unknown }).msg);
          }
          return String(item);
        })
        .join("; ");
    }
  }

  return "The request failed. Please review the form and try again.";
}

/**
 * Message for a caught error. ApiClientError has already formatted the API's
 * own detail into `message`; passing the error object back through
 * formatApiError loses it, since that expects the raw detail payload.
 */
export function errorMessage(caught: unknown): string {
  if (caught instanceof ApiClientError) {
    return caught.message;
  }

  if (caught instanceof Error) {
    return caught.message;
  }

  return formatApiError(caught);
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
