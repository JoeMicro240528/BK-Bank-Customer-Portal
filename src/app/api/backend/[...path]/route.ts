import { NextRequest } from "next/server";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

const DEFAULT_BACKEND_BASE = "http://localhost:8099/api/frontend/v1";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;

  // The upstream API decides whose records to return purely from the national
  // number it is given, so that value comes from the server-side session and
  // never from the request -- otherwise a caller could read another person's
  // data just by changing it.
  const session = await auth();
  const ownerId = session?.user?.national_id;

  if (!ownerId) {
    return Response.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const backendUrl = buildBackendUrl(path, buildIdentityQuery(request, ownerId));
  const headers = buildForwardHeaders(request, ownerId);

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      // Read as bytes, not text: a multipart upload carries binary file data
      // that decoding to a string would corrupt.
      body: canHaveBody(request.method) ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") ?? "application/json");

    return new Response(await response.arrayBuffer(), {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown backend error";
    return Response.json(
      {
        detail: `Could not reach backend at ${backendUrl}: ${message}`,
      },
      { status: 502 },
    );
  }
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;

function backendBase(): string {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    DEFAULT_BACKEND_BASE
  ).replace(/\/+$/, "");
}

function buildBackendUrl(path: string[], search: string): string {
  const normalizedPath = path.map((segment) => encodeURIComponent(segment)).join("/");
  return `${backendBase()}/${normalizedPath}${search}`;
}

/**
 * Rebuilds the query string with the caller's identity forced to the session's
 * national ID. The API takes it as `national_number` on the request endpoints
 * and `national_id` on customer-bank-accounts; both are overwritten here so a
 * client-supplied value can never be used.
 */
function buildIdentityQuery(request: NextRequest, ownerId: string): string {
  const params = new URLSearchParams(request.nextUrl.search);

  params.set("national_number", ownerId);
  params.set("national_id", ownerId);

  return `?${params.toString()}`;
}

function buildForwardHeaders(request: NextRequest, ownerId: string): Headers {
  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  const language = request.headers.get("Accept-Language");

  headers.set("Accept", "application/json");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (language) {
    headers.set("Accept-Language", language);
  }

  headers.set("X-Owner-Id", ownerId);

  // Attached here, server-side, so the Odoo key is never sent to the browser.
  // The client calls this proxy and never sees the credential.
  const apiKey = process.env.ODOO_API_KEY;
  if (apiKey) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }

  return headers;
}

function canHaveBody(method: string): boolean {
  return method !== "GET" && method !== "HEAD";
}
