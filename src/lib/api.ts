import { StrapiResponse } from '../types/strapi';

const STRAPI_BASE_URL = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:1377';

export async function fetchFromStrapi<T>(path: string, queryString: string): Promise<StrapiResponse<T>> {
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
