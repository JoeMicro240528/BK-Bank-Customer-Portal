import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const DEFAULT_BACKEND_BASE = "http://localhost:8099/api/frontend/v1";

type RouteContext = {
  params: Promise<{
    path: string[];
  }>;
};

async function proxy(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const backendUrl = buildBackendUrl(path, request.nextUrl.search);
  const headers = buildForwardHeaders(request);

  try {
    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body: canHaveBody(request.method) ? await request.text() : undefined,
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

function buildForwardHeaders(request: NextRequest): Headers {
  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  const language = request.headers.get("Accept-Language");
  const ownerId = request.headers.get("X-Owner-Id");

  headers.set("Accept", "application/json");

  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  if (language) {
    headers.set("Accept-Language", language);
  }

  if (ownerId) {
    headers.set("X-Owner-Id", ownerId);
  }

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
