import { StrapiResponse } from '../types/strapi';

const STRAPI_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:1377';

export async function fetchFromStrapi<T>(
  path: string,
  queryString: string
): Promise<StrapiResponse<T>> {
  const baseURL = STRAPI_BASE_URL;
  const url = new URL(path, baseURL);
  url.search = queryString;

  const response = await fetch(url.href, {
    cache: 'no-store',
  });

  if (!response.ok) {
    let message = `Failed to fetch ${path}`;

    try {
      const err = await response.json();
      message = err?.error?.message || err?.message || message;
    } catch {
      // ignore
    }

    throw new Error(message);
  }

  return response.json() as Promise<StrapiResponse<T>>;
}

export async function postToApi<TResponse, TBody>(
  path: string,
  body: TBody
): Promise<TResponse> {
  const baseURL = STRAPI_BASE_URL;
  const url = new URL(path, baseURL);

  const response = await fetch(url.href, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let message = `Failed to submit to ${path}`;

    try {
      const error = (await response.json()) as {
        error?: { message?: string };
        message?: string;
      };
      message = error.error?.message || error.message || message;
    } catch {
      // Keep the request-specific fallback when the response is not JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<TResponse>;
}
