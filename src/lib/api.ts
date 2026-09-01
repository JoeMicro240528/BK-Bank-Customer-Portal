import type {
  AUFRequestCreate,
  AUFRequestRead,
  AUFRequestUpdate,
  AUFRequestSummary,
  MasterDataBank,
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

  if (init.body) {
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

  listRequests: (options: RequestOptions) =>
    requestJson<AUFRequestSummary[]>("/auf-requests", { method: "GET" }, options),

  createRequest: (payload: AUFRequestCreate, options: RequestOptions) =>
    requestJson<AUFRequestRead>(
      "/auf-requests",
      { method: "POST", body: JSON.stringify(payload) },
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
